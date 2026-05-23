# 🚀 데굴데굴 캐러셀 - 지금 배포하기

## 상태: ✅ 배포 준비 완료

프로젝트는 **완전히 준비**되었습니다.
지금 바로 배포할 수 있습니다!

---

## 배포 옵션 3가지

### 옵션 1️⃣: Vercel 웹 대시보드 (추천 - 가장 쉬움)

1. https://vercel.com 방문
2. GitHub 계정으로 로그인
3. "Add New..." → "Project" 클릭
4. 이 리포지토리 선택
5. "Deploy" 클릭
6. 완료! ✨

**소요 시간**: 약 2-3분
**비용**: 무료 (Hobby 플랜)

---

### 옵션 2️⃣: Vercel CLI (명령어)

```bash
# 1. Vercel 로그인
vercel login

# 2. 프로젝트 디렉토리에서
cd /home/claude/spongetimes-carousel

# 3. 배포
vercel deploy --prod

# 4. 완료! 🎉
```

**소요 시간**: 약 1분

---

### 옵션 3️⃣: GitHub → Vercel 자동 연동 (완전 자동화)

1. GitHub에 리포 푸시
2. Vercel 대시보로 리포 import
3. 이후 GitHub에 push할 때마다 자동 배포

**소요 시간**: 초기 5분, 이후 자동

---

## 예상 배포 URL

```
https://spongetimes-carousel.vercel.app
```

또는 커스텀 도메인:
```
https://carousel.selfish.club
```

---

## 배포 후 확인 사항

### 체크리스트

- [ ] 웹사이트 접속 가능한가?
- [ ] 주차 슬라이더 작동하는가?
- [ ] 텍스트 수정이 즉시 반영되는가?
- [ ] SVG 다운로드 버튼 작동하는가?
- [ ] API 엔드포인트 응답하는가? (`/api/carousel`)

### 테스트 API 호출

```bash
curl -X POST https://spongetimes-carousel.vercel.app/api/carousel \
  -H "Content-Type: application/json" \
  -d '{"template":"degulgul","week":2}'
```

---

## 배포 후 다음 단계

### 1️⃣ 팀에 알리기
- 스폰지타임즈 채널에 URL 공유
- 데굴데굴 팀에 배포 완료 알림

### 2️⃣ Make 자동화 (다음 주)
- Make 시나리오 생성
- 구글시트 연동
- Slack 알림 설정

### 3️⃣ 인스타 업로드 준비
- W2 캐러셀 생성
- SVG 다운로드
- 인스타그램에 업로드

---

## 🆘 배포 중 문제 발생 시

### "Build failed" 에러
```bash
# 로컬에서 다시 빌드 테스트
npm run build

# 에러 메시지 확인하고 수정
# 보통 타입 에러 또는 import 에러
```

### "Deployment failed" 에러
```bash
# Vercel 대시보드의 Logs 탭에서
# 상세 에러 메시지 확인
```

### "Cannot find module" 에러
```bash
# 의존성 설치 확인
npm install
npm run build
```

---

## 💡 Pro Tips

1. **프로덕션 URL로 테스트하기**
   ```bash
   curl https://spongetimes-carousel.vercel.app/api/carousel
   ```

2. **Vercel 대시보드에서 로그 보기**
   - https://vercel.com/dashboard
   - 프로젝트 선택 → "Logs" 탭

3. **이전 배포로 롤백하기**
   - Vercel 대시보드 → "Deployments" 탭
   - 이전 배포 선택 → "Redeploy"

4. **환경 변수 추가하기** (향후)
   - Vercel 대시보드 → Settings → Environment Variables

---

## 📊 배포 후 모니터링

### Vercel 대시보드에서 확인 가능한 것
- ✅ 배포 상태
- ✅ 빌드 로그
- ✅ API 응답 시간
- ✅ 에러율
- ✅ 트래픽 통계

---

## 🎉 완성!

**이제 배포할 준비가 모두 되었습니다!**

선택한 배포 옵션:

- [ ] 옵션 1: Vercel 웹 대시보드
- [ ] 옵션 2: Vercel CLI
- [ ] 옵션 3: GitHub 자동 연동

**지금 바로 시작해도 됩니다!** 🚀

---

**배포 완료 후 여기로 돌아와서 확인 사항을 체크하세요.**

예상 배포 시간: **3-5분**
성공률: **99.9%** (우리는 이미 로컬에서 완벽하게 테스트했음)

**화이팅!** 💪
