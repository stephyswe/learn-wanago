import {
  Body,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/guard/jwt.guard';
import FindOneParams from '../utils/findOneParams';
import CreateProductDto from './dto/createProduct.dto';
import ProductsService from './products.service';

@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export default class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get('brands')
  getAllBrands() {
    return this.productsService.getAllBrands();
  }

  @Get('year/:id')
  getProductByPublicationYear(@Param() { id }: FindOneParams) {
    return this.productsService.getPublicationYear(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProduct(@Body() product: CreateProductDto) {
    return this.productsService.createProduct(product);
  }
}
