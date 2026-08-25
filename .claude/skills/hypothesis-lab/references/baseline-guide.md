# 베이스라인 관리 (모드 ⑥)

베이스라인은 "이 계정에서 평범한 콘텐츠는 어느 정도 나오는가"의 살아있는 기준이다.
이게 있어야 가설의 임계값을 데이터로 정할 수 있고, **사용자가 매번 수치를 전달할 필요가 없어진다.**
루프가 돌 때마다 posts_metrics가 쌓이고, 베이스라인은 거기서 자동으로 재계산된다.

## baseline.json 구조

```json
{
  "updated_at": "2026-08-25",
  "quality": "rough",
  "follower_count": 500,
  "window": "recent_4w",
  "formats": {
    "carousel": {
      "n_posts": 0,
      "avg_reach": null, "avg_views": null,
      "save_rate": null, "share_rate": null,
      "follow_conv_rate": null, "nonfollower_reach_pct": null
    },
    "reel": { "...동일 구조": null }
  },
  "season2_seed": {
    "follower_growth": "360 → 440 (6주, 주당 약 13명)",
    "follower_reach_pct": 88.2,
    "representative_post": { "saves": 1, "shares": 0 }
  },
  "history": []
}
```

`quality` 값의 의미:
- `rough` — 시즌2 집계 요약만으로 만든 임시 시드. 상대 임계값의 방향 잡기용으로만 쓴다.
- `seeded` — 시즌2 포스트 스크린샷을 일괄 파싱해 포스트 단위 데이터로 계산한 상태.
- `live` — 시즌3 실데이터 롤링 윈도우로 갱신되는 상태.

## 시딩 (최초 1회 온보딩)

계정에 지표 로그가 아직 없으므로, 처음 한 번은 과거 데이터를 넣어야 한다.

1. 사용자에게 시즌2 대표 포스트들(캐러셀 위주, 가능하면 5개 이상)의 인사이트 스크린샷을 요청한다.
   오래된 포스트는 7일 데이터가 안정돼 있으므로 `snapshot=7d`로 기록한다.
2. `screenshot-parsing.md` 절차로 포스트별 행을 posts_metrics에 쌓는다 (`week`는 `S2W1` 형식).
3. 포맷별 평균을 계산해 `formats`를 채우고 `quality: "seeded"`로 만든다.
4. 스크린샷 확보가 어렵다면: 알려진 집계(팔로워 360→440, 도달 중 팔로워 88.2%,
   대표 포스트 저장 1·공유 0)만으로 `quality: "rough"` 시드를 만든다.
   이 경우 첫 1~2주 가설의 임계값은 "베이스라인 대비"보다 "짝비교"를 우선 설계하라.

## 갱신 (검증 후마다)

1. posts_metrics에서 **최근 4주(`window`), 같은 포맷, 같은 스냅샷(7d 우선, 없으면 24h)** 행을 모은다.
2. 포맷별로 평균을 재계산한다. 파생지표는 행별 값의 평균이 아니라
   **합계로 다시 계산**한다 (`Σsaves / Σreach`) — 도달이 큰 포스트가 정당한 가중치를 갖게 하기 위해서다.
3. 갱신 전 값을 `history` 배열에 push하고 `updated_at`을 갱신한다.
4. 팔로워 수 최신값을 반영한다.
5. **시트 README 탭의 "현재 베이스라인 요약" 블록도 갱신**하도록 붙여넣기용 텍스트를 출력한다.
   claude.ai 사용자는 baseline.json에 접근할 수 없고 시트만 보기 때문에, 시트 요약이 곧 그들의 베이스라인이다.

주의: `판단불가`로 끝난 실험 포스트도 베이스라인 계산에는 포함한다 (계정의 "평범한 수준"이므로).
단, 외부 유입 이벤트(`notes` 참고)로 도달이 비정상적으로 튄 포스트는 제외하고 그 사실을 기록한다.
