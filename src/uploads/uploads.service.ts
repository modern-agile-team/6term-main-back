import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';

dotenv.config();

@Injectable()
export class UploadsService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Image) private imageRepository: Repository<Image>,
  ) {}

  s3 = new S3({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_S3_REGION,
  });

  async uploadFile(file: Express.Multer.File): Promise<string> {
    // 현재 이미지 개수를 가져옵니다.
    const countImages = await this.imageRepository.count();

    // 이미지 파일명을 순차적인 숫자로 생성합니다.
    const fileName = `${countImages + 1}.jpeg`;

    const params = new PutObjectCommand({
      ACL: 'public-read',
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName, // 파일명을 S3 업로드 Key로 사용
      Body: file.buffer,
      ContentType: 'image/jpeg',
      ContentDisposition: 'inline',
    });

    await this.s3.send(params); // 업로드가 완료될 때까지 기다림

    // 업로드된 파일의 URL 생성
    const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}`;

    // 이미지 테이블에 이미지 정보 저장
    const image = new Image();
    image.image_url = fileUrl;
    await this.imageRepository.save(image);

    return fileUrl; // 업로드된 파일의 URL 반환
  }
}
