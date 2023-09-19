import { S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

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

  // 레포 없애고 각자 서비스에서 테이블로 업로드하는로직만 짜고
  // 여기서는 무조건 s3업로드만 다루기. (url까지만 만들어서 업로드하는 형식)
  // @InjectRepository(Image) private imageRepository: Repository<Image>; // entity 관련
  // async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
  //   const uploadedUrls: string[] = [];

  //     try {
  //       for (const file of files) {
  //         const countImages = await this.imageRepository.count();
  //         const uniqueId = uuidv4();
  //         const filename = `${uniqueId}_${countImages + 1}.jpeg`;

  //         const params = new PutObjectCommand({
  //           ACL: 'public-read',
  //           Bucket: process.env.AWS_S3_BUCKET,
  //           Key: filename, // entity 정상 추가시 filename으로 변경
  //           Body: file.buffer,
  //           ContentType: 'image/jpeg',
  //           ContentDisposition: 'inline',
  //         });

  //         await this.s3.send(params);

  //         const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${filename}`; // entity 정상 추가시 filename으로 변경경

  //         const image = new Image();
  //         image.image_url = fileUrl;
  //         await this.imageRepository.save(image);

  //         uploadedUrls.push(fileUrl);
  //       }
  //       return uploadedUrls;
  //     } catch (err) {
  //       throw new Error();
  //     }
  //   }
  // // }
  // function uuidv4() {
  //   throw new Error('Function not implemented.');
}
// async s3upload() {
//   const s3 = new S3({
//     credentials: {
//       accesKeyId: process.env.AWS_ACCESS_KEY,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     },
//   });

// }
