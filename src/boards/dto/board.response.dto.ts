export class BoardResponseDTO {
  id: number;
  head: string;
  body: string;
  main_category: string;
  sub_category: string;
  createAt: Date;
  updateAt: Date;
  userId: {
    id: number;
    name: string;
    userImage: {
      id: number;
      imageUrl: string;
    };
  };
  boardImages: any[]; // 여기에 실제 boardImages 데이터 타입을 지정해야 합니다.
}
