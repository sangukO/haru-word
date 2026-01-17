# 📖 하루단어

> **직장인의 어휘력을 높이는 하루 한 단어 큐레이션 서비스**
>
> [하루단어 서비스 바로가기](https://haruword.com)

## 📅 프로젝트 개요

**"바쁜 일상 속, 하루 한 단어로 채우는 지적 성장"**<br/>
하루단어는 숏폼과 짧은 글에 익숙해진 현대인들이 적절한 어휘를 선택하는 데 느끼는 어려움을 해소하고자 시작된 큐레이션 서비스입니다.

- **서비스 지향점:** 매일 자정, 오직 **하나의 새로운 단어**만 엄선하여 학습 부담 최소화
- **핵심 가치:** 가독성 높은 디자인으로 단어 뜻, 한자 표기, 국립국어원 '다듬은 말' 등 실무 지식 전달
- **타겟층:** 어휘력 및 문해력 향상을 꿈꾸는 직장인 및 사회초년생

---

### **🚀 개발 정보**
- **개발 기간:** 2024.12.07 ~ 현재 (v1.5.2 서비스 운영 중)
- **개발 인원:** 1인 개발 (기획, 디자인, FE 개발, 배포 전 과정 수행)
- **업데이트:** 사용자 피드백을 반영하여 지속적으로 기능 추가 및 개선 진행

<br/>

## 🛠 기술 스택

### **Framework & Language**
<img src="https://img.shields.io/badge/Next.js%2016-000000?style=flat-square&logo=next.js&logoColor=white"/> <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black"/> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white"/>

### **Styling & UI**
<img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white"/> <img src="https://img.shields.io/badge/Lucide_React-F7B93E?style=flat-square&logo=lucide&logoColor=black"/>

### **Backend & Database**
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white"/> <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white"/> <img src="https://img.shields.io/badge/Server%20Actions-black?style=flat-square&logo=next.js&logoColor=white"/>

### **AI & Deployment**
<img src="https://img.shields.io/badge/OpenAI%20GPT--4o--mini-412991?style=flat-square&logo=openai&logoColor=white"/> <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white"/>

### **Authentication**
<img src="https://img.shields.io/badge/Google%20Auth-4285F4?style=flat-square&logo=google&logoColor=white"/>

<br/>

## ✨ 주요 기능

1.  **오늘의 단어 큐레이션**
    * 매일 새로운 고급 어휘를 카드 형태로 제공
    * 직관적인 UI로 뜻, 유래, 기본 예문 학습

2.  **AI 기반 실시간 맞춤 예문 생성**
    * 기존의 고정된 예문이 아닌, 다양한 비즈니스 상황에 맞춰 OpenAI가 실시간으로 예문을 생성
    * 사용자 주도적인 학습 경험 제공

3.  **나만의 단어장**
    * Supabase DB와 연동된 개인화된 단어 저장 기능
    * 낙관적 업데이트를 적용하여 끊김 없는 사용자 경험 제공

4.  **소셜 로그인**
    * Google OAuth 2.0 연동을 통한 간편 회원가입 및 로그인

<br/>

## 🚀 업데이트 예정

프로젝트의 지속적인 개선을 위해 다음과 같은 업데이트를 계획하고 있습니다.

- **소셜 로그인 확장**: 사용자 접근성 향상을 위한 Kakao, Apple 로그인 추가 연동
- **PWA UX 고도화**: 사용자 몰입감을 높이는 브랜드 스플래시 화면(Loading Screen) 및 로딩 상태 처리 최적화
- **학습 데이터 시각화**: 사용자별 단어 학습 통계를 한눈에 볼 수 있는 대시보드 기능
