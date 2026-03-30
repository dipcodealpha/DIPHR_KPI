# 팀 성과관리 앱

사업, 교육, 수료 현황을 관리하는 내부 운영 도구입니다.

## 주요 기능

- 공통 비밀번호 기반 접근 제어
- 사업 등록 / 수정 / 비활성화
- 교육 등록 / 수정 / 목록 조회
- 대시보드 KPI, 차트, 최근 수정 이력 확인
- 프로그램 목록 CSV 다운로드
- 사업 목록 CSV 다운로드
- audit_logs 기반 변경 이력 기록

## 기술 스택

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- Zod
- Recharts

## 환경 변수

`.env.local` 파일을 생성하고 아래 값을 설정합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-anon-key
APP_ACCESS_PASSWORD=your-app-password