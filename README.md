# Mora Notepad

탭과 그룹으로 메모를 정리하는 브라우저 노트 앱. Next.js 16, React 19, TypeScript, Zustand, SCSS와 Lucide React를 사용합니다.

## 실행

```bash
npm ci
npm run dev
```

http://localhost:3100 에서 실행합니다. 기본 메모 기능은 환경 변수 없이 사용할 수 있습니다.

카카오 로그인을 사용하려면 `.env.example`을 `.env.local`로 복사하고 값을 설정합니다.

| 환경 변수 | 용도 |
| --- | --- |
| `KAKAO_REST_API_KEY` | 카카오 애플리케이션의 REST API 키 |
| `KAKAO_REDIRECT_URI` | 카카오에 등록한 콜백 주소. 로컬 기본값은 `http://localhost:3100/api/auth/oauth/kakao/callback` |
| `AUTH_SECRET` | 세션 서명에 사용할 긴 임의 문자열 |
| `KAKAO_CLIENT_SECRET` | 카카오 Client Secret을 활성화한 경우 설정 |

## 구조

`app/`은 페이지 라우팅과 인증 API, `src/1-page/`는 페이지 구성, `2-widget/`은 헤더·푸터·패널, `3-feature/`는 편집·그룹·검색·대시보드 기능, `4-entity/`는 노트 도메인과 상태 관리, `5-shared/`는 공통 UI·스타일·다국어 문구입니다.

요구사항은 [PRD.md](PRD.md), 상세 요구사항은 [tests-prd/](tests-prd/), 대응 Playwright E2E는 [tests/](tests/)에 관리합니다. 공통 fixture와 테스트 도우미 사용법은 [tests/README.md](tests/README.md)를 참고하세요.

## 기능

탭마다 메모를 작성하고 색상·고정·북마크·줄 선택을 관리합니다. 실행 취소와 다시 실행, 탭 정렬, 드래그 앤 드롭과 다중 화면 분할을 지원합니다. 그룹을 생성·수정·삭제·고정·정렬하고, `All Group`에서 여러 그룹의 노트를 함께 확인할 수 있습니다.

대시보드는 `Note`, `To Do`, `Doing`, `Done`, `Closed` 상태로 노트를 정리합니다. 카드를 드래그하거나 우클릭 메뉴로 다른 상태로 이동할 수 있으며 그룹별 상태 이름을 변경할 수 있습니다. 새 탭의 기본 상태는 `To Do`이고 `Note` 컬럼은 기본으로 숨깁니다. 상태 변경과 편집 탭 닫기는 별개의 동작입니다.

그룹별 북마크와 그룹·북마크 통합 검색, 검색 결과 미리보기, 닫은 탭 복원을 제공합니다. 그룹·탭·분할 화면과 패널 탐색은 브라우저 뒤로가기·앞으로가기를 지원합니다. 모바일에서는 뒤로가기로 그룹 사이드바를 닫을 수 있습니다.

다크·라이트 테마, 글자 크기, 탭 색상 순서, 영어·한국어, 패널 위치와 슬라이드 효과를 설정할 수 있습니다. 사용 가이드와 PC 단축키 패널을 제공하며 macOS의 `Cmd+B`로 그룹 패널을 열고 닫습니다. 모바일 가이드에서는 단축키 안내와 진입점을 표시하지 않습니다.

메모·그룹·북마크와 설정은 Zustand를 통해 브라우저 localStorage에 저장하며 새로고침 후 복원합니다. 카카오 로그인은 사용자 프로필과 세션을 제공하고, 메모의 계정별 서버 저장이나 기기 간 동기화는 포함하지 않습니다.

## 검증

```bash
npm run lint
npm run test:e2e:structure
npm run build
npx playwright install chromium
npm run test:e2e
```

현재 E2E는 505개이며 각 번호 파일은 상세 요구사항 하나와 대응합니다. 구조 검사는 요구사항 번호·파일 대응·파일당 단일 테스트와 공통 리소스 배럴을 확인합니다. 테스트 서버는 3100 포트에서 실행하며, 인증 테스트용 환경 변수는 Playwright 설정에서 제공합니다.

## 버전 및 배포

운영 반영은 `1.8.14`와 같은 버전 브랜치에서 작업하고 PR을 통해 `main`으로 병합하는 흐름을 사용합니다. 병합 후 최신 `main`을 기준으로 다음 버전 브랜치를 생성하고 `package.json`과 `package-lock.json`의 버전을 함께 갱신합니다. 변경 이력은 [versions/](versions/)에서 확인할 수 있습니다.

Vercel 배포 시 Production Branch는 `main`으로 설정합니다. 카카오 로그인을 사용한다면 배포 환경에도 인증 환경 변수를 설정하고, `KAKAO_REDIRECT_URI`를 실제 배포 도메인의 `/api/auth/oauth/kakao/callback` 주소로 카카오에 등록합니다.
