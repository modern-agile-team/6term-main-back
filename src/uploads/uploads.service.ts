import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class UploadsService {
    s3 = new AWS.S3();

    async uploadFile(file: Express.Multer.File) {
        const AWS_S3_BUCKET = 'nestjs-upload-test-bucket';

        const params = {
            Bucket: AWS_S3_BUCKET,
            Key: String(file.originalname),
            Body: file.buffer,
        };

        try {
            const response = await this.s3.upload(params).promise();

            return response;
        } catch (err) {
            throw new Error('Failed tp upload file.');
        }
    }
}
