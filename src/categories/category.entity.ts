import { Column, Entity, ManyToMany, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import Post from '../posts/post.entity';

@Entity()
class Category {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToMany(() => Post, (post: Post) => post.categories)
  public posts: Post[];

  @DeleteDateColumn()
  public deletedAt: Date;
}

export default Category;