# 새 프로젝트 시작 가이드

## 템플릿으로 새 프로젝트 시작하기

### 1. 템플릿 복사
```bash
# _template_settings를 새 프로젝트 이름으로 복사
cp -r _template_settings my-new-project
cd my-new-project
```

### 2. 프로젝트 초기화
```bash
# package.json의 name 변경 후
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

## 기본 포함 패키지
- React + Vite
- React Router DOM
- MUI (Material-UI)
- MUI Icons
- Roboto Font

## 추천 추가 패키지
```bash
npm install axios           # HTTP 클라이언트
npm install react-query     # 서버 상태 관리
npm install zustand         # 클라이언트 상태 관리
npm install react-hook-form # 폼 관리
```

## 디렉토리 구조 권장
```
src/
├── components/    # 재사용 컴포넌트
├── pages/         # 페이지 컴포넌트
├── hooks/         # 커스텀 훅
├── utils/         # 유틸 함수
├── context/       # Context API
├── theme.js       # MUI 테마
└── main.jsx       # 앱 진입점
```
