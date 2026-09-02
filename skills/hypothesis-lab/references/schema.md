# 데이터 스키마 — 시트 탭 = CSV = API 공통 계약

네 개의 로그가 있고, Google Sheets의 탭과 `data/*.csv`는 **컬럼이 1:1로 동일**하다.
미래에 Instagram Graph API 수집기를 붙여도 같은 컬럼으로 행만 append하면 된다(`source=api`).
이 계약을 깨는 변경(컬럼 삭제·이름 변경)은 하지 마라. 컬럼 추가는 맨 끝에만 한다.

공통 규약:
- 행은 **append-only**. 수정이 필요하면 새 행을 쓰고 `notes`에 사유를 남긴다.
- CSV의 컬럼명은 스네이크케이스 영문 — 스크립트가 이걸 읽으므로 바꾸지 않는다.
  **시트 헤더는 한국어여도 된다**(실제로 `references` 탭 일부가 한국어다).
  시트와 CSV를 잇는 계약은 이름이 아니라 **컬럼 순서**다 → `sheet-setup.md` 매핑표 참고.
- 날짜/시각은 `YYYY-MM-DD HH:MM` (KST, Asia/Seoul).
- 빈 값은 **공란**으로 둔다. 0을 채우면 "측정했더니 0"과 "안 쟀음"을 구분할 수 없다.
- 비율(%) 컬럼은 숫자만 기입 (예: 88.2).

## ID 규칙

| 종류 | 형식 | 예시 |
|---|---|---|
| 가설 | `H-{시즌}{주차}-{일련2자리}` | `H-S3W1-01` |
| 포스트 | `P-{시즌}{주차}-{일련2자리}` | `P-S3W1-02` |
| 판정 | `V-{시즌}{주차}-{일련2자리}` | `V-S3W1-01` |
| 레퍼런스 | `R-{YYYYMMDD}-{일련2자리}` | `R-20260826-01` |

일련번호는 주차(레퍼런스는 날짜) 안에서 1부터. 기존 로그를 읽어 다음 번호를 발급한다.
레퍼런스만 날짜 기반인 이유: 주간 루프와 무관하게 상시로 쌓이기 때문이다.

## hypotheses (가설 로그)

| 컬럼 | 한국어 | 설명 |
|---|---|---|
| `hypothesis_id` | 가설 ID | `H-S3W1-01` |
| `created_at` | 작성일 | |
| `week` | 주차 | `W1`~`W6` |
| `author` | 작성자 | 인턴/운영진 이름 |
| `test_variable` | 실험 변수 | 이번 주의 변수 (예: 배경 재질) |
| `variable_value` | 변수 값 | 이 가설이 미는 값 (예: 실사 스크린샷) |
| `audience` | 누구에게 | 타겟 |
| `hook` | 어떤 훅 | 후킹 요소 |
| `format` | 포맷 | `carousel` / `reel` / `story` |
| `statement` | 가설 문장 | 한 문장 전문 |
| `target_metric` | 예측 지표 | `saves` `shares` `views` `profile_visits` `comments` `nonfollower_reach` 중 하나 |
| `success_threshold` | 성공 기준 | 베이스라인 상대식 (예: `save_rate ≥ baseline×1.3`) |
| `baseline_ref` | 기준 출처 | 예: `baseline.json carousel.save_rate @2026-08-20` |
| `comparison_design` | 비교 설계 | `baseline` / `paired` / `prepost` |
| `rationale` | 근거 | 레퍼런스 계정·과거 데이터 등 |
| `status` | 상태 | `대기` / `발행됨` / `검증완료` |
| `verdict_id` | 판정 연결 | 검증 후 기입 |

CSV 헤더 (시트 1행에도 그대로):

```
hypothesis_id,created_at,week,author,test_variable,variable_value,audience,hook,format,statement,target_metric,success_threshold,baseline_ref,comparison_design,rationale,status,verdict_id
```

## posts_metrics (발행 + 지표 로그)

**포스트 × 스냅샷당 1행.** 같은 포스트라도 24h 행과 7d 행은 별도 행이다.
발행 직후에는 지표 공란인 메타 행(snapshot 공란)을 먼저 만들어도 된다.

| 컬럼 | 한국어 | 설명 |
|---|---|---|
| `post_id` | 포스트 ID | `P-S3W1-01` |
| `hypothesis_id` | 연결 가설 | 공란이면 대조군 후보 |
| `published_at` | 발행 일시 | |
| `week` | 주차 | |
| `format` | 포맷 | `carousel` / `reel` / `story` |
| `publisher` | 발행자 | |
| `variable_value` | 변수 실제 값 | 실험 변수의 이 포스트 값 |
| `topic` | 주제 한 줄 | 주제 강도 교란 확인용 |
| `post_url` | 링크 | |
| `snapshot` | 스냅샷 | `24h` / `7d` |
| `collected_at` | 수집 일시 | |
| `source` | 출처 | `screenshot` / `manual` / `api` |
| `impressions` | 노출 | 표시된 총 횟수 |
| `reach` | 도달 | 도달한 계정 수 |
| `reach_follower_pct` | 도달 중 팔로워 % | |
| `reach_nonfollower_pct` | 도달 중 비팔로워 % | |
| `views` | 조회수 | 포맷 공통 지표 |
| `likes` | 좋아요 | |
| `comments` | 댓글 | |
| `saves` | 저장 | |
| `shares` | 공유 | |
| `profile_visits` | 프로필 방문 | |
| `follows` | 팔로우 | 이 콘텐츠발 팔로우 |
| `follower_count_at_snapshot` | 당시 팔로워 수 | 드리프트 교란 기록 |
| `save_rate` | 저장률 | `saves / reach` (스킬이 계산) |
| `share_rate` | 공유율 | `shares / reach` |
| `follow_conv_rate` | 팔로우 전환율 | `follows / reach` |
| `notes` | 비고 | 스토리 리셰어, 협찬 등 특이사항 |

CSV 헤더:

```
post_id,hypothesis_id,published_at,week,format,publisher,variable_value,topic,post_url,snapshot,collected_at,source,impressions,reach,reach_follower_pct,reach_nonfollower_pct,views,likes,comments,saves,shares,profile_visits,follows,follower_count_at_snapshot,save_rate,share_rate,follow_conv_rate,notes
```

## verdicts (판정 로그)

| 컬럼 | 한국어 | 설명 |
|---|---|---|
| `verdict_id` | 판정 ID | `V-S3W1-01` |
| `hypothesis_id` | 대상 가설 | |
| `verified_at` | 판정 시점 | |
| `snapshot_used` | 사용 스냅샷 | `24h` / `7d` |
| `experiment_posts` | 실험군 | post_id 목록 (`;` 구분) |
| `control_ref` | 대조 기준 | 짝 post_id 또는 "최근 4주 캐러셀 평균 (n=6)" 등 |
| `metric` | 비교 지표 | |
| `experiment_value` | 실험값 | |
| `control_value` | 대조값 | |
| `delta_pct` | 차이 % | `(실험-대조)/대조×100` |
| `threshold` | 임계값 | 가설의 성공 기준 |
| `verdict` | 판정 | `지지` / `기각` / `판단불가` |
| `funnel_diagnosis` | 퍼널 진단 | 드롭오프 위치 (예: 표지 후킹 실패) |
| `confounders_noted` | 교란변수 | 인정된 교란 요인 |
| `learning` | 배운 점 | + 다음 액션 제안 (기각이어도 반드시 기입) |
| `report_path` | 리포트 경로 | `data/reports/…` (Claude Code) |
| `baseline_updated` | 베이스라인 갱신 | `Y` / `N` |

CSV 헤더:

```
verdict_id,hypothesis_id,verified_at,snapshot_used,experiment_posts,control_ref,metric,experiment_value,control_value,delta_pct,threshold,verdict,funnel_diagnosis,confounders_noted,learning,report_path,baseline_updated
```

## references (레퍼런스 로그)

모드 ⓪이 쌓는 로그. 지금 가설에 쓰지 않는 것도 보관하며, 모드 ①이 매주 읽는다.

| 컬럼 | 한국어 | 설명 |
|---|---|---|
| `ref_id` | 레퍼런스 ID | `R-20260826-01` |
| `collected_at` | 수집 일시 | |
| `source_type` | 전달 형태 | `image` / `video` / `link` |
| `account` | 계정 | 예: @dot_pd_ |
| `post_url` | 링크 | 있으면 기록 |
| `format` | 포맷 | `carousel` / `reel` / `story` |
| `summary` | 한 줄 설명 | 무슨 콘텐츠인가 |
| `fixed_elements` | 고정 요소 | 매 편 똑같은 것 |
| `variable_elements` | 변수 요소 | 편마다 바뀌는 것 |
| `hook_elements` | 후킹 요소 | 손이 멈춘 이유 (첫 3초 / 표지 문구) |
| `visible_metrics` | 공개 지표 | 좋아요·댓글 등 보이는 값 (+계정 팔로워 수) |
| `apply_point` | 적용 포인트 | "스폰지타임즈에 적용한다면?" 의 답 — 필수 |
| `hypothesis_candidate` | 가설 후보 | 한 문장(지표 포함) 초안 |
| `status` | 상태 | `보관` / `가설화됨` / `폐기` |
| `linked_hypothesis_id` | 연결 가설 | 가설화 시 기입 |

CSV 헤더:

```
ref_id,collected_at,source_type,account,post_url,format,summary,fixed_elements,variable_elements,hook_elements,visible_metrics,apply_point,hypothesis_candidate,status,linked_hypothesis_id
```

## baseline.json

CSV가 아닌 JSON 하나. 구조와 갱신 규칙은 `baseline-guide.md` 참고. 요약:

```json
{
  "updated_at": "2026-08-25",
  "quality": "rough | seeded | live",
  "follower_count": 500,
  "window": "recent_4w",
  "formats": {
    "carousel": { "n_posts": 0, "avg_reach": null, "avg_views": null,
                  "save_rate": null, "share_rate": null,
                  "follow_conv_rate": null, "nonfollower_reach_pct": null },
    "reel": { "...": "동일 구조" }
  },
  "season2_seed": { "메모": "시즌2 집계 원본" },
  "history": [ { "updated_at": "...", "formats": { } } ]
}
```
