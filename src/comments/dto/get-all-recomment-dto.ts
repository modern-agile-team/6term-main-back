import { UserImage } from 'src/users/entities/user-image.entity';

export class reCommentResponseDTO {
  id: number;
  content: string;
  reCommentowner: boolean;
  user: {
    name: string;
    userImage: UserImage | UserImage[];
  };
}
