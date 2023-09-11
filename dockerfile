# Node.js 버전을 기반으로 하는 도커 이미지 사용
FROM node:18.16.0-alpine

# 작업 디렉토리 설정
WORKDIR /home/app

# 작업 디렉토리에 내용 복사
COPY . .

RUN npm ci
RUN npm i -g @nestjs/cli@10.0.0
RUN npm run build
# 애플리케이션 의존성 설치 및 빌드
# RUN npm ci && npm run build

# 애플리케이션 실행
CMD ["npm", "run", "start:prod"]

# 애플리케이션을 실행할 포트
EXPOSE 3000
