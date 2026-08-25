#!/usr/bin/env python3
"""hypothesis-lab 검증 분석기 (모드 ⑤, Claude Code 전용).

사용법:
  python3 scripts/analyze.py --data data --hypothesis H-S3W1-01 [--out data/reports]

동작:
  1. hypotheses/posts_metrics/baseline을 읽어 실험군 vs 대조군을 비교한다.
  2. 파생지표·퍼널 표를 stdout에 출력한다.
  3. --out 지정 시 HTML 리포트를 쓰고, matplotlib이 있으면 비교 차트 PNG도 만든다.

판정(지지/기각/판단불가)은 스크립트가 내리지 않는다 — 교란변수와 표본 판단은
analysis-guide.md 기준으로 사람이(Claude가) 한다. 이 스크립트는 수치를 정리할 뿐이다.
"""
import argparse
import csv
import json
import sys
from pathlib import Path

FUNNEL = [
    ("views", "노출/조회"),
    ("reach", "도달"),
    ("saves", "저장"),
    ("shares", "공유"),
    ("profile_visits", "프로필 방문"),
    ("follows", "팔로우"),
]
RATE_METRICS = ["save_rate", "share_rate", "follow_conv_rate"]


def load_csv(path):
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def num(row, col):
    v = (row.get(col) or "").strip()
    try:
        return float(v)
    except ValueError:
        return None


def agg(rows):
    """행 묶음의 지표 요약. 율은 Σ분자/Σ분모로 재계산 (baseline-guide.md 규칙)."""
    out = {}
    for col, _ in FUNNEL:
        vals = [num(r, col) for r in rows]
        vals = [v for v in vals if v is not None]
        out[col] = sum(vals) / len(vals) if vals else None
    reach = [num(r, "reach") for r in rows]
    reach_sum = sum(v for v in reach if v is not None) or None
    for rate, numer in (("save_rate", "saves"), ("share_rate", "shares"),
                        ("follow_conv_rate", "follows")):
        ns = [num(r, numer) for r in rows]
        n_sum = sum(v for v in ns if v is not None)
        out[rate] = (n_sum / reach_sum) if reach_sum else None
    nf = [num(r, "reach_nonfollower_pct") for r in rows]
    nf = [v for v in nf if v is not None]
    out["nonfollower_reach_pct"] = sum(nf) / len(nf) if nf else None
    return out


def fmt(v, pct=False):
    if v is None:
        return "—"
    if pct:
        return f"{v * 100:.2f}%" if v <= 1 else f"{v:.1f}%"
    return f"{v:,.0f}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", default="data")
    ap.add_argument("--hypothesis", required=True)
    ap.add_argument("--snapshot", default=None, help="24h/7d (기본: 있는 것 중 24h 우선)")
    ap.add_argument("--out", default=None, help="리포트 출력 디렉토리")
    args = ap.parse_args()

    data = Path(args.data)
    hyps = load_csv(data / "hypotheses.csv")
    posts = load_csv(data / "posts_metrics.csv")

    hyp = next((h for h in hyps if h["hypothesis_id"] == args.hypothesis), None)
    if not hyp:
        sys.exit(f"가설 {args.hypothesis} 을 hypotheses.csv에서 찾지 못함")

    exp_all = [p for p in posts if p["hypothesis_id"] == args.hypothesis]
    if not exp_all:
        sys.exit(f"{args.hypothesis} 에 연결된 포스트가 posts_metrics.csv에 없음")

    snapshot = args.snapshot or ("24h" if any(p["snapshot"] == "24h" for p in exp_all) else "7d")
    exp = [p for p in exp_all if p["snapshot"] == snapshot]
    if not exp:
        sys.exit(f"{args.hypothesis} 의 {snapshot} 스냅샷 행이 없음")

    design = hyp.get("comparison_design") or "baseline"
    fmt_type = hyp["format"]

    if design == "paired":
        ctrl = [p for p in posts
                if p["snapshot"] == snapshot and p["format"] == fmt_type
                and p["week"] == exp[0]["week"]
                and p["post_id"] not in {e["post_id"] for e in exp}]
        ctrl_label = f"짝비교: {', '.join(sorted({c['post_id'] for c in ctrl})) or '(없음)'}"
    else:
        ctrl = [p for p in posts
                if p["snapshot"] == snapshot and p["format"] == fmt_type
                and p["hypothesis_id"] != args.hypothesis]
        ctrl_label = f"{design}: 같은 포맷 {snapshot} 로그 {len(ctrl)}행"

    exp_agg, ctrl_agg = agg(exp), agg(ctrl) if ctrl else None

    # baseline.json 폴백 (로그에 대조 행이 없을 때)
    used_baseline_json = False
    if ctrl_agg is None or all(v is None for v in ctrl_agg.values()):
        bl_path = data / "baseline.json"
        if bl_path.exists():
            bl = json.loads(bl_path.read_text(encoding="utf-8"))
            blf = bl.get("formats", {}).get(fmt_type, {})
            ctrl_agg = {
                "views": blf.get("avg_views"), "reach": blf.get("avg_reach"),
                "saves": None, "shares": None, "profile_visits": None, "follows": None,
                "save_rate": blf.get("save_rate"), "share_rate": blf.get("share_rate"),
                "follow_conv_rate": blf.get("follow_conv_rate"),
                "nonfollower_reach_pct": blf.get("nonfollower_reach_pct"),
            }
            ctrl_label = f"baseline.json ({bl.get('quality')}, {bl.get('updated_at')})"
            used_baseline_json = True

    lines = []
    lines.append(f"# 검증 분석 — {args.hypothesis} ({snapshot})")
    lines.append(f"가설: {hyp['statement']}")
    lines.append(f"실험군: {', '.join(sorted({e['post_id'] for e in exp}))} ({len(exp)}행)")
    lines.append(f"대조군: {ctrl_label}")
    lines.append(f"예측 지표: {hyp['target_metric']} / 성공 기준: {hyp['success_threshold']}")
    lines.append("")
    lines.append("## 지표 비교 (율은 Σ분자/Σ도달)")
    lines.append(f"{'지표':<24}{'실험군':>12}{'대조군':>12}{'차이':>10}")
    metrics = [c for c, _ in FUNNEL] + RATE_METRICS + ["nonfollower_reach_pct"]
    labels = dict(FUNNEL)
    labels.update({"save_rate": "저장률", "share_rate": "공유율",
                   "follow_conv_rate": "팔로우 전환율",
                   "nonfollower_reach_pct": "비팔로워 도달%"})
    for m in metrics:
        e, c = exp_agg.get(m), (ctrl_agg or {}).get(m)
        pct = m in RATE_METRICS or m.endswith("_pct")
        delta = f"{(e - c) / c * 100:+.1f}%" if (e is not None and c) else "—"
        lines.append(f"{labels[m]:<24}{fmt(e, pct):>12}{fmt(c, pct):>12}{delta:>10}")
    lines.append("")
    lines.append("## 퍼널 (실험군)")
    views_v, reach_v = exp_agg.get("views"), exp_agg.get("reach")
    for col, label in FUNNEL:
        v = exp_agg.get(col)
        conv = ""
        if v is not None:
            if col == "reach" and views_v:
                conv = f"  (조회 대비 {v / views_v * 100:.1f}%)"
            elif col not in ("views", "reach") and reach_v:
                conv = f"  (도달 대비 {v / reach_v * 100:.2f}%)"
        lines.append(f"  {label:<12}{fmt(v):>12}{conv}")
    lines.append("")
    n_note = []
    if len(exp) < 2:
        n_note.append("실험군 1행 — 1회 결과는 방향 신호일 뿐, 재현 확인 전 확정 금지")
    if used_baseline_json:
        n_note.append("대조군을 baseline.json에서 가져옴 — quality 확인 필요")
    if n_note:
        lines.append("⚠️  " + " / ".join(n_note))
    lines.append("판정(지지/기각/판단불가)은 analysis-guide.md 기준으로 교란변수와 함께 판단할 것.")

    report = "\n".join(lines)
    print(report)

    if args.out:
        out = Path(args.out)
        out.mkdir(parents=True, exist_ok=True)
        stem = f"{args.hypothesis}_{snapshot}"
        html = out / f"{stem}.html"
        html.write_text(
            "<meta charset='utf-8'><body style='background:#fff;color:#1A1F36;"
            "font-family:Pretendard,sans-serif;max-width:720px;margin:2rem auto'>"
            f"<pre style='white-space:pre-wrap'>{report}</pre></body>",
            encoding="utf-8")
        print(f"\n리포트 저장: {html}")
        try:
            import matplotlib
            matplotlib.use("Agg")
            import matplotlib.pyplot as plt
            ms = [m for m in RATE_METRICS if exp_agg.get(m) is not None]
            if ms and ctrl_agg:
                x = range(len(ms))
                fig, ax = plt.subplots(figsize=(6, 3.5))
                ax.bar([i - 0.18 for i in x], [exp_agg[m] for m in ms], 0.36, label="실험군")
                cv = [(ctrl_agg.get(m) or 0) for m in ms]
                ax.bar([i + 0.18 for i in x], cv, 0.36, label="대조군")
                ax.set_xticks(list(x))
                ax.set_xticklabels([labels[m] for m in ms])
                ax.legend()
                ax.set_title(f"{args.hypothesis} ({snapshot})")
                fig.tight_layout()
                png = out / f"{stem}.png"
                fig.savefig(png, dpi=150)
                print(f"차트 저장: {png}")
        except ImportError:
            print("(matplotlib 없음 — 차트 생략, 표만 생성)")


if __name__ == "__main__":
    main()
