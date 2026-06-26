# JobRoute — 프론트엔드

AI 기반 채용 매칭 플랫폼 **JobRoute**의 웹 프론트엔드입니다. (Next.js 14 · TypeScript · Tailwind CSS)

백엔드(NestJS)는 `http://localhost:3000`에서 동작한다고 가정합니다.

## 시작하기

```bash
npm install
npm run dev      # http://localhost:3001 (백엔드 3000과 포트 충돌 방지)
```

프로덕션 빌드:

```bash
npm run build
npm run start
```

## 환경 변수

`.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

백엔드 주소가 다르면 이 값만 바꾸면 됩니다.

## 화면 구성

| 경로 | 설명 |
| --- | --- |
| `/` | 랜딩 페이지 |
| `/login`, `/register` | 이메일 + 구글/카카오 소셜 로그인 |
| `/auth/callback` | 소셜 로그인 토큰 처리 (쿼리의 `accessToken`/`token` 저장) |
| `/jobs` | 공고 탐색 — 검색·필터·페이지네이션·북마크 |
| `/matching` | **핵심.** AI 매칭 (자유 텍스트 / 조건 선택 / 저장된 이력서) |
| `/resume` | 이력서 CRUD |
| `/cover-letter` | 자소서 초안 생성 + 첨삭 (합격 자소서 RAG) |
| `/interview` | 공고 기반 예상 면접 질문 (일반 / 맞춤) |
| `/mypage` | 북마크 · 매칭 이력 · 이메일 알림 설정 |

## 구조

```
src/
├── app/                  # App Router 페이지
├── components/           # 공용 컴포넌트
│   └── ui/               # 버튼·인풋·모달 등 디자인 시스템 프리미티브
├── context/              # AuthContext, ToastContext
└── lib/
    ├── api.ts            # API 클라이언트 (엔드포인트 전부)
    ├── types.ts          # 백엔드 응답 타입
    ├── utils.ts          # 포맷터·헬퍼
    └── constants.ts      # 지역·직무·스킬 목록
```

## 구현 메모

- **토큰**: 로그인 응답의 `accessToken`을 `localStorage`에 저장하고, 인증
  필요 요청에 `Authorization: Bearer {token}` 헤더로 붙입니다. (`src/lib/api.ts`)
- **인증 상태**: `AuthProvider`가 `/auth/me`로 사용자 정보를 불러오며, 401
  응답이 오면 토큰을 자동으로 비웁니다.
- **LLM 응답 로딩**: 매칭·자소서·면접은 수 초 걸리므로 단계별 로딩 UI
  (`ThinkingState`)를 표시합니다.
- **JSON 결과 렌더링**: 매칭 `reason`, 자소서 `draft`/`review`, 면접 질문은
  모두 카드·섹션 형태로 구조화해 보여줍니다.
- 한글 인코딩을 위해 모든 요청은 `Content-Type: application/json; charset=utf-8`.
- 디자인: Pretendard 폰트, indigo/violet 브랜드 컬러, 반응형 레이아웃.
```
