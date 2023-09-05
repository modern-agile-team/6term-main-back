# Node.js 버전을 기반으로 하는 도커 이미지 사용
FROM node:18.16.0-alpine AS development

# 작업 디렉토리 설정
WORKDIR /home/app

# package.json 및 package-lock.json 복사
COPY package*.json ./

# 애플리케이션 의존성 설치
RUN npm ci

# 애플리케이션 소스 코드 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# 애플리케이션 실행
CMD ["npm", "run", "start:prod"]

# 애플리케이션을 실행할 포트
EXPOSE 3000
