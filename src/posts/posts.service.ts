import { Injectable } from '@nestjs/common';
import CreatePostDto from './dto/createPost.dto';
import Post from './post.entity';
import UpdatePostDto from './dto/updatePost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import PostNotFoundException from './exceptions/postNotFound.exception';
import User from '../users/user.entity';
import PostsSearchService from './postsSearch.service';

@Injectable()
export default class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private postsSearchService: PostsSearchService,
  ) {}

  async getAllPosts(offset?: number, limit?: number) {
    const [items, count] = await this.postsRepository.findAndCount({
      relations: ['author'],
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit,
    });

    return {
      items,
      count,
    };
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne(id, { relations: ['author', 'categories', 'comments'] });
    if (post) {
      return post;
    }
    throw new PostNotFoundException(id);
  }

  async getPostsWithParagraph(paragraph: string) {
    return this.postsRepository.query('SELECT * from post WHERE $1 = ANY(paragraphs)', [paragraph]);
  }

  async createPost(post: CreatePostDto, user: User) {
    const newPost = await this.postsRepository.create({
      ...post,
      author: user,
    });
    await this.postsRepository.save(newPost);
    // this.postsSearchService.indexPost(newPost);
    return newPost;
  }

  async searchForPosts(text: string, offset?: number, limit?: number) {
    const { results, count } = await this.postsSearchService.search(text, offset, limit);
    const ids = results.map((result) => result.id);
    if (!ids.length) {
      return {
        items: [],
        count,
      };
    }
    const items = await this.postsRepository.find({
      where: { id: In(ids) },
    });
    return {
      items,
      count,
    };
  }

  async updatePost(id: number, post: UpdatePostDto) {
    await this.postsRepository.update(id, post);
    const updatedPost = await this.postsRepository.findOne(id, { relations: ['author'] });
    if (updatedPost) {
      // await this.postsSearchService.update(updatedPost);
      return updatedPost;
    }
    throw new PostNotFoundException(id);
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }
    // await this.postsSearchService.remove(id);
  }
}
