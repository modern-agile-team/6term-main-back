import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as dotenv from 'dotenv'

dotenv.config();

@Injectable()
export class S3Service {
    s3 = new S3({
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
        region: process.env.AWS_S3_REGION,
      });
    
    // @InjectRepository(Image) private imageRepository: Repository<Image> // entity 관련
    async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
        const uploadedUrls: string[] = [];
    
        try {
          for (const file of files) {
            // const countImages = await this.imageRepository.count();
            const uniqueId = uuidv4();
            // const fileName = `${uniqueId}_${countImages + 1}.jpeg`;
    
            const params = new PutObjectCommand({
              ACL: 'public-read',
              Bucket: process.env.AWS_S3_BUCKET,
              Key: __filename, // entity 정상 추가시 filename으로 변경
              Body: file.buffer,
              ContentType: 'image/jpeg',
              ContentDisposition: 'inline',
            });
    
            await this.s3.send(params);
    
            const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${__filename}`; // entity 정상 추가시 filename으로 변경경
    
            const image = new Image();
            // image.image_url = fileUrl;
            // await this.imageRepository.save(image); 
    
            uploadedUrls.push(fileUrl);
          }
          return uploadedUrls;
        } catch (err) {
          throw new Error();
        }
      }
}
function uuidv4() {
    throw new Error('Function not implemented.');
}

