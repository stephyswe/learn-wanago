import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import PublicFile from '../files/publicFile.entity';
import Post from '../posts/post.entity';
import PrivateFile from '../privateFiles/privateFile.entity';
import { Address } from './address.entity';

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column()
  @Exclude()
  public password: string;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToOne(() => Address, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public address: Address;

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts?: Post[];

  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  public avatar?: PublicFile;

  @OneToMany(() => PrivateFile, (file: PrivateFile) => file.owner)
  public files?: PrivateFile[];

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @Column({ nullable: true })
  public twoFactorAuthenticationSecret?: string;

  @Column({ default: false })
  public isTwoFactorAuthenticationEnabled: boolean;

  @Column()
  public stripeCustomerId: string;

  @Column({ nullable: true })
  public monthlySubscriptionStatus?: string;
}

export default User;
