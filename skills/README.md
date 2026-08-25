# 스폰지타임즈 스킬 모음

캐러셀 앱(레포 루트의 Next.js)과 **별도로 관리되는** Claude 스킬들이 사는 곳.

| 스킬 | 설명 |
|---|---|
| [`hypothesis-lab/`](hypothesis-lab/) | 가설 검증 OS — 가설 수립 → 실험 설계 → 발행 기록 → 인사이트 스크린샷 수치 수집 → 검증·판정 → 베이스라인 관리 |

## 설치 방법

### Claude Code (터미널 / claude.ai/code)

이 레포를 열면 끝. `skills/hypothesis-lab/SKILL.md`를 Claude가 읽도록
"가설 세우자" 같은 트리거 문구를 말하거나 스킬 경로를 직접 언급하면 된다.
개인 전역 설치를 원하면 폴더를 `~/.claude/skills/`로 복사한다:

```sh
cp -r skills/hypothesis-lab ~/.claude/skills/
```

### claude.ai (앱 / 웹 프로젝트)

zip으로 묶어 업로드한다 (Settings → Capabilities → Skills):

```sh
cd skills && zip -r hypothesis-lab.zip hypothesis-lab -x "hypothesis-lab/data/reports/*"
```

- zip 루트가 `hypothesis-lab/` 폴더이고 그 바로 안에 `SKILL.md`가 있어야 한다 (위 명령이 그렇게 만든다).
- claude.ai에서는 스킬 안의 파일이 **읽기 전용**이다 → 데이터 정본은 Google Sheets
  (`hypothesis-lab/references/sheet-setup.md` 참고). 시트를 만들고 유닛 멤버에게 공유할 것.
- zip은 레포에 커밋하지 않는다 (`.gitignore` 처리됨).

## 스킬 디벨롭 규칙

- 유닛 활동을 통해 계속 발전시키는 것이 전제다. 개선 후에는 zip을 다시 만들어 재업로드한다.
- 데이터 컬럼 계약(`hypothesis-lab/references/schema.md`)은 깨지 않는다 — 시트·CSV·미래 API 수집기가 공유하는 약속이다.
- CSV를 수정했으면 커밋 전에 무결성 검사를 돌린다:

```sh
python3 skills/hypothesis-lab/scripts/validate_logs.py skills/hypothesis-lab/data
```
