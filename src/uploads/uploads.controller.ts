import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private uploadService: UploadsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<string> {
    // 반환 형식을 { url: string } 에서 string 로 변경
    return this.uploadService.uploadFile(file); // uploadService.uploadFile의 반환 값을 그대로 반환
  }
  @Post('/multi')
  @UseInterceptors(FilesInterceptor('files', 3)) 
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]): Promise<string[]> {
    try {
      return await this.uploadService.uploadFiles(files);
    }
    catch (err) {
      throw new Error;
    }
  }
}
