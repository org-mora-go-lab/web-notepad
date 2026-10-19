# Mora Notepad

브라우저에서 메모를 작성하고 여러 작업 공간으로 정리하는 Next.js 기반 노트 애플리케이션입니다.

## 구현 내용

- 탭 기반 메모 작성, 편집, 닫기 및 실행 취소
- 그룹 생성, 이름 변경, 정렬, 고정 및 삭제
- 북마크, 검색, 기록 탐색과 상태 복원
- 화면 분할과 드래그 앤 드롭을 이용한 다중 메모 편집
- 카카오 로그인과 사용자 세션 처리
- Zustand 기반 클라이언트 상태 관리와 브라우저 저장소 연동
- 요구사항별 Playwright E2E 테스트

## 기술 구성

- Next.js 16, React 19, TypeScript
- Zustand, SCSS, Lucide React
- Playwright

## 실행 방법

```bash
npm install
cp .env.example .env.local
npm run dev
```

개발 서버는 `http://localhost:3100`에서 실행됩니다. 전체 요구사항은 `PRD.md`와 `tests-prd/`에서 확인할 수 있습니다.
