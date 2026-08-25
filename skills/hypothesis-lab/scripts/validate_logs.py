#!/usr/bin/env python3
"""hypothesis-lab CSV 로그 무결성 검사.

사용법: python3 scripts/validate_logs.py data
검사 항목: 헤더가 스키마와 일치하는가, ID 형식, hypothesis_id 참조 무결성,
숫자 컬럼에 숫자가 아닌 값이 없는가, snapshot/format/verdict 값 규약.
문제가 있으면 종료 코드 1과 함께 목록을 출력한다.
"""
import csv
import json
import re
import sys
from pathlib import Path

SCHEMAS = {
    "hypotheses.csv": [
        "hypothesis_id", "created_at", "week", "author", "test_variable",
        "variable_value", "audience", "hook", "format", "statement",
        "target_metric", "success_threshold", "baseline_ref",
        "comparison_design", "rationale", "status", "verdict_id",
    ],
    "posts_metrics.csv": [
        "post_id", "hypothesis_id", "published_at", "week", "format",
        "publisher", "variable_value", "topic", "post_url", "snapshot",
        "collected_at", "source", "impressions", "reach",
        "reach_follower_pct", "reach_nonfollower_pct", "views", "likes",
        "comments", "saves", "shares", "profile_visits", "follows",
        "follower_count_at_snapshot", "save_rate", "share_rate",
        "follow_conv_rate", "notes",
    ],
    "verdicts.csv": [
        "verdict_id", "hypothesis_id", "verified_at", "snapshot_used",
        "experiment_posts", "control_ref", "metric", "experiment_value",
        "control_value", "delta_pct", "threshold", "verdict",
        "funnel_diagnosis", "confounders_noted", "learning", "report_path",
        "baseline_updated",
    ],
}

ID_PATTERNS = {
    "hypothesis_id": re.compile(r"^H-S\d+W\d+-\d{2}$"),
    "post_id": re.compile(r"^P-S\d+W\d+-\d{2}$"),
    "verdict_id": re.compile(r"^V-S\d+W\d+-\d{2}$"),
}

NUMERIC_COLS = {
    "impressions", "reach", "reach_follower_pct", "reach_nonfollower_pct",
    "views", "likes", "comments", "saves", "shares", "profile_visits",
    "follows", "follower_count_at_snapshot", "save_rate", "share_rate",
    "follow_conv_rate", "delta_pct",
}

ENUMS = {
    "snapshot": {"", "24h", "7d"},
    "snapshot_used": {"", "24h", "7d"},
    "format": {"carousel", "reel", "story"},
    "source": {"", "screenshot", "manual", "api"},
    "comparison_design": {"", "baseline", "paired", "prepost"},
    "verdict": {"지지", "지지(1회)", "기각", "판단불가"},
    "status": {"", "대기", "발행됨", "검증완료"},
    "baseline_updated": {"", "Y", "N"},
}


def is_number(v):
    try:
        float(v)
        return True
    except ValueError:
        return False


def load(path):
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def main(data_dir):
    data_dir = Path(data_dir)
    errors = []
    rows_by_file = {}

    for fname, schema in SCHEMAS.items():
        path = data_dir / fname
        if not path.exists():
            errors.append(f"{fname}: 파일 없음")
            continue
        with open(path, newline="", encoding="utf-8") as f:
            header = next(csv.reader(f), [])
        if header != schema:
            errors.append(
                f"{fname}: 헤더 불일치\n  기대: {schema}\n  실제: {header}")
            continue
        rows_by_file[fname] = load(path)

    hyp_ids = {r["hypothesis_id"] for r in rows_by_file.get("hypotheses.csv", [])}

    for fname, rows in rows_by_file.items():
        for i, row in enumerate(rows, start=2):  # 1행 = 헤더
            loc = f"{fname}:{i}"
            for col, pat in ID_PATTERNS.items():
                v = row.get(col, "")
                if col in row and v and not pat.match(v):
                    # hypotheses의 verdict_id, posts의 hypothesis_id 등 공란 허용
                    errors.append(f"{loc}: {col} 형식 오류 → {v!r}")
            for col in NUMERIC_COLS:
                v = row.get(col, "")
                if col in row and v and not is_number(v):
                    errors.append(f"{loc}: {col} 숫자 아님 → {v!r}")
            for col, allowed in ENUMS.items():
                v = row.get(col, "")
                if col in row and v not in allowed:
                    errors.append(f"{loc}: {col} 허용값 아님 → {v!r} (허용: {sorted(allowed)})")
            if fname != "hypotheses.csv":
                ref = row.get("hypothesis_id", "")
                if ref and ref not in hyp_ids:
                    errors.append(f"{loc}: hypothesis_id {ref!r} 가 hypotheses.csv에 없음")

    baseline = data_dir / "baseline.json"
    if baseline.exists():
        try:
            json.loads(baseline.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            errors.append(f"baseline.json: JSON 파싱 실패 — {e}")
    else:
        errors.append("baseline.json: 파일 없음")

    if errors:
        print("❌ 검증 실패:")
        for e in errors:
            print(f"  - {e}")
        return 1
    total = sum(len(r) for r in rows_by_file.values())
    print(f"✅ 검증 통과 — 로그 3종 헤더 일치, 데이터 행 {total}개 무결.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "data"))
