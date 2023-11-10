import { UserImage } from 'src/users/entities/user-image.entity';

export class commentResponseDTO {
  id: number;
  content: string;
  commentowner: boolean;
  user: {
    name: string;
    userImage: UserImage | UserImage[];
  };
  reComment: {
    id: number;
    content: string;
    reCommentowner: boolean;
    user: {
      name: string;
      userImage: UserImage | UserImage[];
    };
  }[];
}
