import { Injectable, Put } from '@nestjs/common';
import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';

dotenv.config();

@Injectable()
export class UploadsService {
    constructor(private readonly configService: ConfigService) {}

    bucketName = process.env.AWS_BUCKET_NAME;
    s3 = new S3({
        credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
        region: process.env.AWS_S3_REGION,

    });

    async uploadFile(file) {
        const params = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: String(file.originalname),
            Body: file.buffer,
        });

        this.s3.send(params)
    
    }

}