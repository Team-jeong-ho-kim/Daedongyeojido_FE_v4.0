# Daedongyeojido_FE_v4.0

대덕소프트웨어마이스터고등학교 전공동아리 관리 서비스

## 프로젝트 구조

```
├── apps/
│   ├── web/           # 랜딩 페이지 (port: 3000)
│   ├── student/       # 학생용 앱 (port: 3001)
│   └── admin/         # 관리자용 앱 (port: 3002)
├── packages/
│   ├── ui/            # 공통 UI 컴포넌트
│   └── config-tailwind/  # Tailwind 설정
└── turbo.json
```

## 기술 스택

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Monorepo**: Turborepo + pnpm
- **Linter**: Biome

## 시작하기

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
# 전체 앱 실행
pnpm dev

# 개별 앱 실행
pnpm --filter web dev      # 랜딩 페이지
pnpm --filter student dev  # 학생용
pnpm --filter admin dev    # 관리자용
```

### 빌드

```bash
pnpm build
```

### 린트

```bash
pnpm lint
```

## 환경변수 설정

### 파일 구조

각 앱 폴더에 환경 파일을 생성합니다:

```
apps/
├── web/
│   ├── .env.local        # 로컬 개발
│   └── .env.production   # 프로덕션
├── student/
│   ├── .env.local
│   └── .env.production
└── admin/
    ├── .env.local
    └── .env.production
```

### 환경별 실행

```bash
# 로컬 환경 (.env.local 사용)
pnpm dev

# 프로덕션 환경 테스트 (.env.production 사용)
pnpm dev:prod
```

## UI 패키지

공통 컴포넌트는 `packages/ui`에서 관리합니다.

### 사용 가능한 컴포넌트

- `Header` - 공통 헤더
- `Footer` - 공통 푸터
- `Toaster`, `toast` - 토스트 메시지 (sonner)

### 사용법

```tsx
import { Header, Footer, toast } from "ui";

// 토스트 사용
toast.success("성공!");
toast.error("실패");
```

### UI 패키지 개발

```bash
# watch 모드로 실행 (파일 수정 시 자동 빌드)
cd packages/ui && pnpm dev

# 수동 빌드
pnpm --filter ui build
```

## 포트 정보

| 앱 | 포트 | 설명 |
|------|------|------|
| web | 3000 | 랜딩 페이지 |
| student | 3001 | 학생용 앱 |
| admin | 3002 | 관리자용 앱 |

## 팀

- **PM**: 박태수
- **Frontend**: 지도현, 최민수
- **Backend**: 박태수, 채도훈
- **Design**: 손희찬
