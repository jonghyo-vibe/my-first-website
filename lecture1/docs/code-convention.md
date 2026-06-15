# Code Convention

## 파일 및 컴포넌트 네이밍
- 컴포넌트 파일: PascalCase (예: `UserProfile.jsx`)
- 훅 파일: camelCase with use prefix (예: `useAuth.js`)
- 유틸 파일: camelCase (예: `formatDate.js`)

## 컴포넌트 구조
```jsx
// 1. imports
import React from 'react'
import { Box } from '@mui/material'

// 2. 컴포넌트 정의
const ComponentName = ({ prop1, prop2 }) => {
  // 3. 상태 및 훅
  // 4. 이벤트 핸들러
  // 5. JSX 반환
  return (
    <Box>
      {/* 내용 */}
    </Box>
  )
}

export default ComponentName
```

## 스타일링 규칙
- MUI sx prop 또는 styled() 사용
- inline style 지양
- CSS 모듈은 MUI와 혼용 시 주의

## 상태 관리
- 로컬 상태: useState
- 전역 상태: Context API 또는 Redux Toolkit
- 서버 상태: React Query 권장
