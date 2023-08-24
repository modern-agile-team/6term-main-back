import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
    // constructor(private uploadService: UploadsService) {}
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 100000 }), 
                // new FileTypeValidator({ fileType: 'image/jpg' }),
            ], 
        }),
    ) 
    file: Express.Multer.File,
    )   {
        // return  this.uploadService.uploadFile(file);
        console.log(file);
    }
}
