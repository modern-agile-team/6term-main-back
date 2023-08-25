import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Image' })
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'image_url' })
  image_url: string;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ name: 'form' })
  form: string;
}
