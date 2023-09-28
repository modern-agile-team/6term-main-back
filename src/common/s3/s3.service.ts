import { Injectable } from '@nestjs/common';
import { DeleteObjectCommand, S3 } from '@aws-sdk/client-s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class S3Service {
  private s3 = new S3({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_S3_REGION,
  });

  private s3Adress = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/`;

  async imgUpload(file, userId): Promise<{ url: string; key: string } | false> {
    const currentTime = new Date().getTime();
    const filename = `${userId}_${currentTime}.jpeg`;

    const params = {
      ACL: 'public-read',
      Bucket: process.env.AWS_S3_BUCKET,
      Key: filename,
      Body: file.buffer,
      ContentType: 'image/jpeg',
      ContentDisposition: 'inline',
    };

    try {
      await this.s3.send(new PutObjectCommand(params));

      const fileUrl = `${this.s3Adress}${filename}`;

      return { url: fileUrl, key: filename };
    } catch (error) {
      console.error('S3 업로드 오류:', error);
      return false;
    }
  }

  async deleteImage(key: string): Promise<boolean> {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    };

    try {
      await this.s3.send(new DeleteObjectCommand(params));
      return true; // 이미지 삭제 성공
    } catch (error) {
      console.error('S3 이미지 삭제 오류:', error);
      return false; // 이미지 삭제 실패
    }
  }
}