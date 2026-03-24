# Cloudflare Pages 운영 기준

이 저장소는 앱별로 **같은 Cloudflare Pages 프로젝트 안에서** `main`을 Production, `develop`을 Preview로 운영합니다.

## 원칙
- 실제 배포 source of truth는 **Cloudflare Git integration**입니다.
- GitHub Actions는 배포를 하지 않고, `pages:build`가 깨지지 않는지만 검증합니다.
- Cloudflare 빌드에서는 root `.env.prod`, `.env.stag` 파일을 읽지 않습니다.
- Production / Preview 값 차이는 **Cloudflare Pages 환경변수**로만 관리합니다.

## 프로젝트별 빌드 설정

### `daedongyeojido`
- Build command: `pnpm --filter student pages:build`
- Build output directory: `apps/student/.vercel/output/static`

### `daedongyeojido-admin`
- Build command: `pnpm --filter admin pages:build`
- Build output directory: `apps/admin/.vercel/output/static`

### `daedongyeojido-teacher`
- Build command: `pnpm --filter teacher pages:build`
- Build output directory: `apps/teacher/.vercel/output/static`

### `daedongyeojido-web`
- Build command: `pnpm --filter web pages:build`
- Build output directory: `apps/web/.vercel/output/static`

공통 설정:
- Framework preset: `없음`
- Root directory: 비워둠
- Production branch: `main`
- Automatic deployments: `사용`
- Preview 배포 대상: `develop`만 허용

## 환경변수 설정
- Production env: prod 값 입력
- Preview env: stag 값 입력
- 값 변경 후에는 해당 브랜치에서 새 배포를 다시 생성해야 반영됩니다.

최소 관리 대상:
- `NEXT_PUBLIC_WEB_URL`
- `NEXT_PUBLIC_USER_URL`
- `NEXT_PUBLIC_ADMIN_URL`
- `NEXT_PUBLIC_TEACHER_URL`
- `NEXT_PUBLIC_API_BASE_URL`

## 로컬 빌드와 Cloudflare 빌드의 차이
- 로컬 prod 빌드: `pnpm --filter <app> build:prod-local`
- 로컬 stag 빌드: `pnpm --filter <app> build:stag`
- Cloudflare 빌드: `pnpm --filter <app> pages:build`

Cloudflare에서 `pages:build`는 대시보드에 입력된 env만 사용합니다.

## 확인 기준
- `main` 푸시 시 production deployment 생성
- `develop` 푸시 시 `develop.<project>.pages.dev` preview 생성
- `web` preview 로그인 시 `student/admin/teacher` 앱이 Preview env 값으로 이동
- `student-stag.daedongyeojido.site` 같은 커스텀 staging 도메인은 이 운영 기준 범위에 포함하지 않음
