# 검증 리포트 템플릿

모드 ⑤의 출력 형식. 아래 구조를 그대로 사용한다.

---

## 📊 검증 리포트 — {verdict_id}

**가설** ({hypothesis_id}): {statement}

### 판정: {지지 ✅ / 기각 ❌ / 판단불가 ⚠️}

| | 실험군 | 대조군 | 차이 |
|---|---|---|---|
| 대상 | {experiment_posts} | {control_ref} | |
| {metric} | {experiment_value} | {control_value} | **{delta_pct}%** |
| 임계값 | {threshold} | | {충족 / 미달} |

스냅샷: {snapshot_used} 기준. {표본 크기에 대한 한 줄 주의 — 예: "실험 1건 vs 평균 6건, 1회 결과는 방향 신호"}

### 퍼널 진단

| 단계 | 수치 | 해석 |
|---|---|---|
| 노출/조회 | {views} | |
| 도달 (비팔로워 %) | {reach} ({nonfollower}%) | |
| 저장 / 공유 | {saves} / {shares} | |
| 프로필 방문 | {profile_visits} | |
| 팔로우 | {follows} | |

**이탈 지점**: {funnel_diagnosis — 어느 단계에서 왜 이탈했는지 1~2문장}

### 교란변수

{confounders_noted — 없으면 "특이 교란 없음 (게시 시간·요일·주제 균형 확인됨)"}

### 배운 점과 다음 가설

{learning — 기각이어도 반드시: 무엇이 아니라는 걸 알았고, 다음에 무엇을 시험할 것인가}

---

### 시트 붙여넣기 (verdicts 탭)

```
{TSV 행}
```

{베이스라인 갱신 제안: "이 결과를 반영해 베이스라인을 갱신할까요? (모드 ⑥)"}
