This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 요구사항 문서

전체 요구사항 색인은 `PRD.md`에서 확인합니다. 상세 요구사항은 `tests-prd/` 아래에서 앱 기반, 노트 편집, 그룹과 기록, 패널과 검색, 화면과 설정, 데이터 복원으로 나누어 관리합니다.

각 `tests-prd/<기능군>.md`의 `## <번호>. <제목>`은 `tests/<기능군>/<번호>. <제목>/`과 일대일로 대응합니다. 번호가 붙은 요구사항 하나는 독립적으로 검증할 수 있는 동작 하나만 다루며, 서로 다른 동작·예외·저장·시각 규칙이 함께 길어지면 요구사항과 E2E 파일을 나눕니다. 상세 타이틀은 한 가지 관심사를 다루며, 타이틀마다 요구사항과 E2E 테스트를 최대 10개까지 둡니다.

## E2E 테스트

```bash
npm run test:e2e
# worker 수 지정
npm run test:e2e -- --workers=8
# 특정 요구사항 실행
npm run test:e2e -- "tests/02. 노트 편집/12. 분할 패널 - 기본 동작"
```

개발 서버(3000)를 대상으로 현재 코드를 테스트합니다. 로컬 worker 수는 논리 CPU의 100%, CI는 50%입니다.
작업 완료 검증은 전체 E2E를 실행합니다.

### 공통 테스트 준비

저장 상태는 `tests/__util__` 배럴의 공통 함수로 준비합니다.
`writeStoredState`/`seedStoredStateOnce`는 최초 문서 로드 전에 상태를 한 번 주입하며,
새로고침 이후의 편집 내용은 유지합니다. `seedStoredStateOnLoad`는 매 로드마다 같은 상태를 주입합니다.
상태 준비의 문서 로드는 1회이며, 브라우저 컨텍스트는 테스트마다 격리합니다.

공통 유틸리티는 `tests/__util__/state`, `note`, `workspace`, `assertion`으로 구분합니다.
분할 패널 전용 유틸리티는 `tests/02. 노트 편집/__util__/split-panel/state`, `drag`로 구분합니다.
각 그룹은 배럴을 제공하며, E2E 파일은 기존 `__util__` 배럴을 통해 가져옵니다.
