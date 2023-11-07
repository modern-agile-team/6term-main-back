import { UserImage } from 'src/users/entities/user-image.entity';

export class commentResponseDTO {
  id: number;
  content: string;
  commentowner: true | false;
  userId: {
    name: string;
    userImage: UserImage | UserImage[];
  };
}
