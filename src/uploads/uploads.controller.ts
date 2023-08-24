import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
    constructor(private uploadService: UploadsService) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile(
        new ParseFilePipe({
            validators: [
                // new MaxFileSizeValidator({ maxSize: 1000 }), 
                // new FileTypeValidator({ fileType: 'image/jpg' }),
            ], 
        }),
    ) 
    file: Express.Multer.File,
    )   {
        await this.uploadService.uploadFile(file);
    }
}
