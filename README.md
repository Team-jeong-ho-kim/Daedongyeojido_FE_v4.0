# Daedongyeojido_FE_v4.0

대덕소프트웨어마이스터고등학교 전공 동아리 관리 서비스를 위한 Next.js 15 모노레포입니다. 웹 랜딩, 학생 포털, 관리자 도구를 한 저장소에서 관리하며 공통 UI/상태/유틸 패키지를 통해 일관된 경험을 제공합니다.

## 개요
- `apps/web`: 서비스 소개와 CTA를 제공하는 랜딩 페이지
- `apps/student`: 동아리 신청, 공지 확인, 마이페이지를 다루는 학생용 포털
- `apps/admin`: 동아리 운영 현황을 살펴보는 관리자용 인터페이스 (초기 구성 단계)
- `packages/*`: 공통 UI 컴포넌트, Zustand 스토어, Axios 인스턴스, Tailwind 설정을 모아 재사용

## 모노레포 구조
```
.
├── apps/
│   ├── web/
│   │   ├── src/app/(landing)        # Hero/feature 섹션, IntersectionObserver 애니메이션
│   │   ├── src/components/{landing,login}
│   │   └── src/types                # 글로벌 타입 선언
│   ├── student/
│   │   ├── src/app/{(auth),announcements,clubs,mypage,onboarding}
│   │   ├── src/api/{auth,user,club,announcement}.ts
│   │   ├── src/components/{announcement,auth,club,common,layout,main,modal,providers}
│   │   ├── src/hooks/{mutations,querys} + stores/useModalStore.ts
│   │   ├── src/constants & types    # 클럽 도메인 모델, mock 데이터
│   │   └── src/lib/token.ts         # 로컬스토리지 토큰 헬퍼
│   └── admin/
│       └── src/app                  # UI 패키지 기반의 관리자 페이지 뼈대
├── packages/
│   ├── ui/                          # tsup 빌드된 UI 컴포넌트 & 토스트 (sonner)
│   ├── shared/                      # 공통 Zustand 스토어 + User 도메인 타입
│   ├── utils/                       # Axios apiClient, env 헬퍼, Login 타입
│   └── config-tailwind/             # Tailwind CSS 4 preset, forms 플러그인
├── turbo.json                       # turborepo 파이프라인 (dev/dev:prod/build/lint)
├── pnpm-workspace.yaml              # apps/*, packages/* 전역 workspace
├── biome.json                       # Biome formatter/linter 설정
└── .env*, .env.example              # Root 환경 변수 파일 (dotenv-cli로 주입)
```

## 기술 스택
- **Framework**: Next.js 15 (App Router) + React 19 전역 사용
- **Language & Build**: TypeScript 5, Turborepo, pnpm 10.17.1, tsup (패키지 번들)
- **Styling**: Tailwind CSS 4 preset (`config-tailwind`), class-variance-authority, tailwind-merge
- **State & Data**: Zustand (`shared`, `student` 모듈), TanStack Query 5, Sonner 토스트
- **Networking**: Axios 기반 `apiClient` + 토큰 재발급 인터셉터, dotenv-cli로 환경 분기
- **Quality**: Biome (lint/format, `biome.json`), Turbo 캐시로 CI/CD 가속

## 앱 & 패키지 소개

### apps/web
- 랜딩 전용 라우트 `(landing)`에서 히어로, 기능 카드, 일정 CTA 섹션을 제공
- `components/login/Carousel.tsx` 로 컬러풀한 로그인 슬라이더를 구현하고 공통 `Footer`를 `ui` 패키지에서 가져와 사용
- Next Image, IntersectionObserver, Link 컴포넌트를 활용하며 Toaster UI는 `packages/ui`에서 재사용

### apps/student
- `AuthGuard`로 로그인 여부를 감싸고 `components/providers/{QueryProvider,UserProvider}`에서 TanStack Query + Zustand 스토어를 초기화
- `src/api/*`는 `utils` 패키지의 `apiClient`로 로그인, 공지, 동아리 CRUD를 수행하며 `hooks/mutations`와 `hooks/querys`로 분리된 데이터 접근 레이어를 구성
- `components/main/*`는 배너, 공지, 동아리 카드, CTA 섹션 등 홈 화면을 담당하고 `components/modal`과 `stores/useModalStore`는 가입 모달 상태를 관리
- `constants/club*.ts`와 `types/*`가 프론트 도메인 모델 (클럽, 공지, 전공 정보 등)을 제공

### apps/admin
- Next.js 15 기반 초안으로 공통 `Button` 등 `ui` 패키지를 곧바로 사용할 수 있도록 구성
- 동일한 `.env` 파일을 참조하며 관리자 기능 확장을 위한 기반 (라우팅/권한)은 후속 작업 예정

### packages/ui
- Header/Footer, Button, 공통 폼 컴포넌트(`TextInput`, `FieldSelector`, `ImageUpload`, `TextArea`), sonner 기반 `Toaster`, `toast` API를 제공
- `tsup`으로 ESM/CJS 번들을 만들며 `pnpm --filter ui dev`로 watch 빌드, `pnpm --filter ui build`로 배포용 산출물을 생성
- 사용 예시:

```tsx
import { Header, Footer, Toaster, toast } from "ui";

export function Shell() {
  return (
    <>
      <Header />
      <main className="px-4">
        <button onClick={() => toast.success("성공!" )}>알림</button>
      </main>
      <Footer />
      <Toaster richColors position="bottom-center" />
    </>
  );
}
```

### packages/shared
- `src/stores/useUserStore.ts`가 공통 사용자 상태(Zustand)를 정의하고 `UserInfo`, `UserRole` 타입을 내보냅니다.
- `pnpm --filter shared dev`로 tsup watch, `pnpm --filter shared build`로 번들을 생성합니다.
- 사용 예시:

```ts
import { useUserStore, type UserInfo } from "shared";

const { userInfo, setUserInfo, isStudent } = useUserStore();
setUserInfo({ userName: "홍길동", classNumber: "2110", role: "STUDENT" } satisfies UserInfo);
```

### packages/utils
- `apiClient`는 `packages/utils/src/instance.ts`에서 토큰 재발급(`/auth/reissue`) 로직을 포함한 Axios 인스턴스를 구성합니다.
- `env.ts`는 `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_USER_URL`, `NEXT_PUBLIC_ADMIN_URL`을 중앙에서 노출하고 `user/getUserInfo` 는 로컬 스토리지에서 학번/이름을 꺼내옵니다.
- `LoginRequest`/`LoginResponse` 타입과 `getUserInfo` 헬퍼를 함께 제공하며 `pnpm --filter utils dev|build`로 번들을 관리합니다.

```ts
import { apiClient, getUserInfo, type LoginRequest } from "utils";

export const login = (payload: LoginRequest) => apiClient.post("/auth/login", payload);
const { classNumber, userName } = getUserInfo();
```

### packages/config-tailwind
- Tailwind CSS 4 설정과 forms 플러그인을 중앙화합니다. 각 앱의 `tailwind.config.ts`에서 preset으로 확장하여 색상/타이포 일관성을 유지합니다.

## 개발 워크플로우

### 요구 사항
- Node.js 20 이상 (Next.js 15 지원 범위)
- pnpm `10.17.1` (package.json `packageManager` 지정)
- Turbo CLI/BIOME는 devDependencies로 포함되어 있으므로 `pnpm` 스크립트가 자동 실행합니다.

### 설치
```bash
pnpm install
```

### 루트 스크립트
| 명령 | 설명 |
| --- | --- |
| `pnpm dev` | web/student/admin 앱을 동시에 dev 모드로 실행 (root `.env.local` 사용) |
| `pnpm dev:prod` | `.env.production` 값을 로드하여 프로덕션 환경을 리허설 |
| `pnpm build` | 모든 앱/패키지를 순차 빌드 (`.next`, `dist` 아티팩트 캐시) |
| `pnpm lint` | Biome lint 확인 |
| `pnpm lint:fix` | lint 에러를 자동 수정 |
| `pnpm format` | Biome 포맷 체크 |
| `pnpm format:fix` | 전역 서식 자동 정렬 |

### 필터링 실행 예시
| 대상 | 개발 | 빌드/배포 | 비고 |
| --- | --- | --- | --- |
| web | `pnpm --filter web dev` | `pnpm --filter web build` | 기본 포트 3000, 랜딩 전용 |
| student | `pnpm --filter student dev` | `pnpm --filter student build` | 포트 3001, React Query + Zustand |
| admin | `pnpm --filter admin dev` | `pnpm --filter admin build` | 포트 3002, UI 패키지 기반 |
| ui | `pnpm --filter ui dev` | `pnpm --filter ui build` | tsup watch/build |
| shared | `pnpm --filter shared dev` | `pnpm --filter shared build` | 타입 & Zustand 번들 |
| utils | `pnpm --filter utils dev` | `pnpm --filter utils build` | Axios/Env 헬퍼 번들 |

### Turbo & tsup
- `turbo.json`은 `dev`, `dev:prod`, `build`, `lint`, `format`, `type-check`, `clean` 태스크를 정의하며 `.env.*local` 파일을 글로벌 의존성으로 감시합니다.
- 라이브러리 패키지(`ui`, `shared`, `utils`)는 `tsup.config.ts`를 통해 esm/cjs/typings을 동시 생성하므로 UI/API 패키지를 다른 앱에서 안전하게 임포트할 수 있습니다.

## 환경 변수
- 모든 앱은 **root** `.env.local`, `.env.production`을 사용합니다. `dotenv -e ../../.env.local -- next dev` 스크립트 때문에 앱 폴더 내에 별도 `.env`를 둘 필요가 없습니다.
- 샘플은 `.env.example`에 있으며 아래처럼 복사해 사용합니다.

```bash
cp .env.example .env.local
cp .env.example .env.production
```

| 변수 | 설명 | 예시 |
| --- | --- | --- |
| `NEXT_PUBLIC_WEB_URL` | 랜딩/메인 진입 도메인 | `https://web.localhost` |
| `NEXT_PUBLIC_USER_URL` | 학생 포털 기본 URL (`packages/ui` Header 링크) | `https://student.localhost` |
| `NEXT_PUBLIC_ADMIN_URL` | 관리자 도구 URL | `https://admin.localhost` |
| `NEXT_PUBLIC_API_BASE_URL` | REST API Origin (`utils/apiClient` baseURL) | `https://api.server-url.site` |

> 로컬에서는 `pnpm dev`가 `.env.local`을, 배포 전 확인은 `pnpm dev:prod`가 `.env.production`을 주입합니다.

## 포트 정보
| 앱 | 포트 | 설명 |
|------|------|------|
| web | 3000 | 랜딩 페이지 |
| student | 3001 | 학생용 앱 |
| admin | 3002 | 관리자용 앱 |

## 참고 자료
- [Nexters/DaeDongYeoMap-Frontend](https://github.com/Nexters/DaeDongYeoMap-Frontend) – 기존 데동여지도 프론트 구조 참고로 레이아웃/README 구성 아이디어 확인
- [oh-when/dedongyeo-map-frontend](https://github.com/oh-when/dedongyeo-map-frontend) – 데이트 코스 관리 앱 README 패턴 참고
- [Next.js App Router Deploy Docs](https://nextjs.org/docs/app/building-your-application/deploying) – Next 15 배포 전략 및 `.env` 가이드라인

## 팀
- **PM**: 박태수
- **Frontend**: 지도현, 최민수
- **Backend**: 박태수, 채도훈
- **Design**: 손희찬
