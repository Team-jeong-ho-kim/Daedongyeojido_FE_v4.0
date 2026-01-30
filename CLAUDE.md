# Daedongyeojido_FE_v4.0

## 스택 (WHAT)
- Next.js 15 (App Router) + React 19, TypeScript 5
- Tailwind CSS 4 preset `config-tailwind` + cva + tailwind-merge, sonner 토스트
- TanStack Query 5, Zustand 스토어(`packages/shared`), Axios 클라이언트(`packages/utils`)
- Turborepo, pnpm 10.17.1, tsup(패키지 번들), Biome(lint/format)
- dotenv-cli 로 루트 `.env.local` / `.env.production` 주입

## 구조 (WHERE)
- apps/web (랜딩, 포트 3000)
- apps/student (학생 포털, 포트 3001)
- apps/admin (관리자, 포트 3002)
- packages/ui (공통 UI & Toaster)
- packages/shared (공통 Zustand 스토어·타입)
- packages/utils (Axios 인스턴스, env 헬퍼)
- packages/config-tailwind (Tailwind 4 preset)
자세한 경로·도메인 맵은 `README.md` 참고.

## 목적 (WHY)
- 한 모노레포에서 랜딩/학생/관리자 앱을 일관된 UI·상태·네트워킹 레이어로 제공합니다.
- 공유 패키지를 통해 중복 로직 없이 세 앱을 동시에 유지·배포합니다.

## 작업 방법 (HOW)
필수 환경: Node 20+, pnpm(루트 `packageManager` 준수).

### 기본 명령
- `pnpm install`              # 의존성 설치
- `pnpm dev` / `pnpm dev:prod` # 세 앱 동시 개발(.env.local / .env.production)
- `pnpm build`                # 전체 빌드
- `pnpm lint` | `pnpm lint:fix` # Biome 검사/자동수정
- `pnpm format` | `pnpm format:fix` # Biome 포맷

### 선택 실행 (터보 필터)
- `pnpm --filter web dev|build`
- `pnpm --filter student dev|build`
- `pnpm --filter admin dev|build`
- `pnpm --filter ui|shared|utils dev|build`

### 변경 검증 순서
1) `pnpm format:fix`
2) `pnpm lint`
3) `pnpm build` (또는 수정한 앱/패키지에 한해 `--filter`)

### 환경 변수
루트에만 `.env.local` / `.env.production` 배치 (`.env.example` 복사).
주요 키: `NEXT_PUBLIC_WEB_URL`, `NEXT_PUBLIC_USER_URL`, `NEXT_PUBLIC_ADMIN_URL`, `NEXT_PUBLIC_API_BASE_URL`.

## 참고 문서 (Progressive Disclosure)
- 프로젝트 구조·도메인 상세: `README.md`
- 스타일/포매터는 Biome 설정(`biome.json`)을 따른다 — CLAUDE.md에 별도 스타일 가이드 없음.

## 유의
- 패키지 매니저는 pnpm만 사용 (npm/yarn 금지).
- 새 코드 작성 시 관련 파일 경로를 직접 열어 확인하고, 스니펫 복사본 대신 실제 소스를 참조한다.
