# Daedongyeojido FE v4.0 인수인계 초안

## 빠른 시작

### 기본 요구 사항
- Node.js 20+
- pnpm 10.17.1

### 설치
```bash
pnpm install
```

### 루트에서 자주 쓰는 명령
```bash
pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm test:e2e
```

### 앱별 실행 포트
- `web`: `3000`
- `student`: `3001`
- `admin`: `3002`
- `teacher`: `3003`

## 프로젝트 개요
- 대덕소프트웨어마이스터고등학교 전공 동아리 관리 서비스를 위한 Next.js 15 기반 모노레포다.
- 패키지 매니저는 `pnpm`, 모노레포 오케스트레이션은 `turbo`를 사용한다.
- 주요 앱 역할은 다음과 같다.
- `apps/web`: 랜딩 페이지 및 로그인 진입점
- `apps/student`: 학생용 서비스
- `apps/admin`: 관리자용 서비스
- `apps/teacher`: 지도 교사용 서비스
- 공용 패키지 역할은 다음과 같다.
- `packages/ui`: 공통 UI 컴포넌트
- `packages/shared`: 공통 Zustand 스토어 및 도메인 타입
- `packages/utils`: Axios 기반 API 유틸, 인증/사용자 헬퍼
- `packages/config-tailwind`: Tailwind CSS 4 공통 설정

## 개발 및 실행 정보

### 루트 기준
- 전체 앱 개발 서버: `pnpm dev`
- 전체 빌드: `pnpm build`
- 전체 린트: `pnpm lint`
- 단위 테스트 실행: `pnpm test`
- E2E 테스트 실행: `pnpm test:e2e`

### 앱별 주요 명령

#### web
```bash
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web test
pnpm --filter web test:e2e
```

#### student
```bash
pnpm --filter student dev
pnpm --filter student build
pnpm --filter student test
pnpm --filter student test:e2e
```

#### admin
```bash
pnpm --filter admin dev
pnpm --filter admin build
pnpm --filter admin test
pnpm --filter admin test:e2e
```

#### teacher
```bash
pnpm --filter teacher dev
pnpm --filter teacher build
pnpm --filter teacher test
pnpm --filter teacher test:e2e
```

### 내부 패키지 참고
- `ui`, `shared`, `utils`는 일부 앱에서 `src`를 직접 소비하는 구조다.
- `packages/*/dist`는 fallback 빌드 산출물이며 Git에 커밋하지 않는 정책이다.
- shared package 관련 문제를 볼 때는 앱 코드만 보지 말고 `packages/` 변경도 함께 확인해야 한다.

## 환경 변수
- 루트의 `.env.local`, `.env.stag`, `.env.prod`를 사용한다.
- 앱 폴더 내부에 별도 `.env`를 두는 구조가 아니다.
- 각 앱의 `dev`, `build`, `pages:build` 스크립트는 `dotenv-cli`로 루트 환경 변수를 주입한다.

### 현재 확인된 주요 변수
```bash
NEXT_PUBLIC_WEB_URL=http://localhost:3000
NEXT_PUBLIC_USER_URL=http://localhost:3001
NEXT_PUBLIC_ADMIN_URL=http://localhost:3002
NEXT_PUBLIC_TEACHER_URL=http://localhost:3003
NEXT_PUBLIC_API_BASE_URL=https://server-url.site
```

### 메모
- `NEXT_PUBLIC_*_URL` 값은 절대 URL 형식이어야 한다.
- 실제 운영/스테이징 API 주소는 저장소만으로 확정할 수 없으므로 배포 담당자 확인이 필요하다.

## 배포 및 빌드 흐름
- 모든 앱에 `pages:build` 스크립트가 있으며 `@cloudflare/next-on-pages`를 사용한다.
- 모든 앱에 `preview` 스크립트가 있으며 `wrangler pages dev .vercel/output/static` 형식으로 로컬 프리뷰가 가능하다.
- 모든 앱에 `deploy` 스크립트가 있고 `scripts/deploy-with-discord.mjs`를 호출한다.
- 즉, 저장소 기준으로는 Cloudflare Pages 배포 흐름이 들어가 있고, 배포 완료 알림 또는 후속 처리용 스크립트가 별도로 존재하는 구조다.

### 앱별 배포 식별자
- `web`: `daedongyeojido-web`
- `student`: `daedongyeojido`
- `admin`: `daedongyeojido-admin`
- `teacher`: `daedongyeojido-teacher`

### 확인 필요
- 실제 배포 절차가 `deploy` 스크립트 단독 실행인지, CI/CD 파이프라인과 함께 쓰는지 확인 필요
- Cloudflare Pages 프로젝트별 연결 계정 및 권한 보유자 확인 필요
- Discord 알림이 어떤 채널/웹훅으로 가는지 확인 필요

## 테스트 및 품질 체크
- 루트 단위 테스트는 `vitest` 기반이다.
- 앱별 E2E 테스트는 Playwright 기반이다.
- 기본 점검 순서는 아래 정도로 잡는 것이 안전하다.
```bash
pnpm lint
pnpm test
pnpm --filter student test:e2e
pnpm --filter admin test:e2e
```

### 확인 포인트
- 공통 패키지를 수정했으면 영향받는 앱까지 같이 실행해서 확인할 것
- 라우팅/권한/로그인 분기 수정 시 학생, 관리자, 교사 앱을 분리해서 확인할 것
- `next-sitemap`이 빌드 스크립트에 포함돼 있으므로 sitemap/robots 산출물이 기대대로 생성되는지 확인할 것

## 현재 상태 및 주의사항
- 이 문서 작성 시점 기준 워크트리에 이미 기존 변경사항이 있었다.
- 확인된 상태:
- `.github/workflows/monorepo-build.yml` 수정 상태
- `apps/student/src/app/mypage/applications/[submissionId]/edit/page.tsx` 수정 상태
- `apps/student/src/hooks/useInvalidateQueriesAtResultTime.test.tsx` 수정 상태
- `apps/student/tsconfig.json` 수정 상태
- `apps/web/src/app/login/login.utils.test.ts` 삭제 상태
- `apps/web/src/app/login/login.utils.ts` 삭제 상태
- `apps/web/src/app/login/page.test.tsx` 수정 상태
- `apps/web/src/app/login/page.tsx` 수정 상태
- 즉, 인수인계 직전에 브랜치 상태와 미반영 변경사항을 반드시 다시 점검해야 한다.

### 구조상 주의할 점
- `web`, `student`, `admin`은 `ui`, `shared`, `utils`를 직접 소비한다.
- `teacher`도 workspace 패키지를 사용한다.
- 앱별 환경 변수 로딩 경로가 루트 `.env.*` 기준으로 묶여 있으므로, 환경 파일 하나의 실수가 여러 앱에 동시에 영향 줄 수 있다.
- `docs/` 폴더는 이번 인수인계 메모용으로 Git ignore 처리되어 있다.

## 로그인 및 서비스 동작 메모
- `web` 로그인 화면은 학생 로그인과 선생님 로그인 탭으로 분기된다.
- 같은 `POST /auth/login`을 사용하고, 요청 body의 `division` 값으로 학생/선생님을 구분한다.
- 로그인 성공 후 `ADMIN`은 `admin`, `TEACHER`는 `teacher`, 학생 계열 role은 `student` 앱으로 이동한다.

## 인수인계 체크리스트

### 운영 정보
- [ ] 실제 운영 API 주소
- [ ] 스테이징 API 주소
- [ ] Cloudflare Pages 프로젝트 목록과 각 프로젝트 소유 계정
- [ ] 배포 권한 보유자 및 비상 연락 수단
- [ ] Discord 알림 웹훅 관리 위치

### 개발 운영
- [ ] 필수 `.env` 값 최신본
- [ ] 배포 전 최소 검증 절차 문서화
- [ ] 장애 발생 시 확인해야 하는 로그 위치
- [ ] 관리자/학생/교사 계정 테스트용 샘플 정보

### 코드베이스 관리
- [ ] 브랜치 전략 (`develop`, `main`, release 브랜치 사용 여부) 최종 확인
- [ ] 실제 CI/CD 사용 여부와 실패 시 대응 절차 정리
- [ ] 공통 패키지 수정 시 영향 범위 확인 규칙 정리