import { UserImage } from 'src/users/entities/user-image.entity';

export class BoardResponseDTO {
  id: number;
  head: string;
  body: string;
  main_category: string;
  sub_category: string;
  createAt: Date;
  updateAt: Date;
  userId: {
    // id: number;
    name: string;
    userImage: UserImage | UserImage[];
  };

  boardImages: {
    id: number;
    imageUrl: string;
  }[];
}
