import { Injectable } from '@nestjs/common';
import CreateCategoryDto from './dto/createCategory.dto';
import Category from './category.entity';
import UpdateCategoryDto from './dto/updateCategory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CategoryNotFoundException from './exceptions/categoryNotFound.exception';

@Injectable()
export default class CategoriesService {
  /**
   * @ignore
   */
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  /**
   * A method that fetches the categories from the database
   * @returns A promise with the list of categories
   */
  getAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.find({ relations: ['posts'] });
  }

  /**
   * A method that fetches a category with a given id. Example:
   * @example
   * const category = await categoriesService.getCategoryById(1);
   */
  async getCategoryById(id: number) {
    const category = await this.categoriesRepository.findOne(id, { relations: ['posts'] });
    if (category) {
      return category;
    }
    throw new CategoryNotFoundException(id);
  }

  async createCategory(category: CreateCategoryDto) {
    const newCategory = await this.categoriesRepository.create(category);
    await this.categoriesRepository.save(newCategory);
    return newCategory;
  }

  /**
   * See the [definition of the UpdateCategoryDto file]{@link UpdateCategoryDto} to see a list of required properties
   */
  async updateCategory(id: number, category: UpdateCategoryDto): Promise<Category> {
    await this.categoriesRepository.update(id, category);
    const updatedCategory = await this.categoriesRepository.findOne(id, { relations: ['posts'] });
    if (updatedCategory) {
      return updatedCategory;
    }
    throw new CategoryNotFoundException(id);
  }

  /**
   * A method that deletes a category from the database
   * @param id An id of a category. A category with this id should exist in the database
   */
  async deleteCategory(id: number): Promise<void> {
    const deleteResponse = await this.categoriesRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new CategoryNotFoundException(id);
    }
  }

  /**
   * @deprecated Use deleteCategory instead
   */
  async deleteCategoryById(id: number): Promise<void> {
    return this.deleteCategory(id);
  }
}
