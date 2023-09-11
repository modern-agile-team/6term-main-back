# Node.js 버전을 기반으로 하는 도커 이미지 사용
FROM node:18.16.0-alpine

# 작업 디렉토리 설정
WORKDIR /home/app

# 작업 디렉토리에 내용 복사 (package.json 및 package-lock.json 포함)
COPY package*.json ./

# 애플리케이션 의존성 설치 (npm ci는 package-lock.json을 사용하여 의존성을 설치)
RUN npm ci

# ts -> js 변환 dist 폴더생성
RUN npm run build

# 로컬에서 이미 빌드된 /dist 폴더를 이미지에 복사
COPY ./dist ./dist

# 애플리케이션 실행
CMD ["npm", "run", "start:prod"]

# 애플리케이션을 실행할 포트
EXPOSE 3000
