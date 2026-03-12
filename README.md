# Daedongyeojido_FE_v4.0

대덕소프트웨어마이스터고등학교 전공 동아리 관리 서비스를 위한 Next.js 15 모노레포입니다.

## 구성
- `apps/web`: 랜딩 페이지
- `apps/student`: 학생용 서비스
- `apps/admin`: 관리자용 서비스
- `packages/ui`: 공통 UI 컴포넌트
- `packages/shared`: 공통 Zustand 스토어, 사용자 타입
- `packages/utils`: Axios 기반 API 유틸, 인증/사용자 헬퍼
- `packages/config-tailwind`: Tailwind 공통 설정

## 구조
```text
.
├── apps/
│   ├── web
│   ├── student
│   └── admin
├── packages/
│   ├── ui
│   ├── shared
│   ├── utils
│   └── config-tailwind
├── turbo.json
├── pnpm-workspace.yaml
└── .env.*
```

## 개발

### 요구 사항
- Node.js 20+
- pnpm 10.17.1

### 설치
```bash
pnpm install
```

### 자주 쓰는 명령
```bash
pnpm dev
pnpm build
pnpm lint
```

### 앱별 실행
```bash
pnpm --filter web dev
pnpm --filter student dev
pnpm --filter admin dev
```

## 내부 패키지 사용 방식
- `web`, `student`, `admin`은 `ui`, `shared`, `utils`를 `src`에서 직접 소비합니다.
- 앱은 `tsconfig paths`와 Next.js `transpilePackages`를 사용합니다.
- `pnpm --filter ui|shared|utils build`는 fallback용 `dist`를 만들지만, `packages/*/dist`는 Git에 커밋하지 않습니다.

## 환경 변수
- 모든 앱은 root `.env.local`, `.env.stag`, `.env.prod`를 사용합니다.
- 앱 폴더 안에 별도 `.env`를 둘 필요는 없습니다.

```bash
cp .env.example .env.local
cp .env.example .env.stag
cp .env.example .env.prod
```

주요 변수:
- `NEXT_PUBLIC_WEB_URL`
- `NEXT_PUBLIC_USER_URL`
- `NEXT_PUBLIC_ADMIN_URL`
- `NEXT_PUBLIC_API_BASE_URL`

## 포트
- `web`: `3000`
- `student`: `3001`
- `admin`: `3002`
