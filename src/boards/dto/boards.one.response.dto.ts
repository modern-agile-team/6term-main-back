import { UserImage } from 'src/users/entities/user-image.entity';

export class oneBoardResponseDTO {
  id: number;
  head: string;
  body: string;
  main_category: string;
  sub_category: string;
  createAt: Date;
  updateAt: Date;
  unitowner: true | false;
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
