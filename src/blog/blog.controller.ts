import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  async create(@Body() createBlogDto: CreateBlogDto, @Req() req: any) {
    const adminId = req.user.id;
    const blog = await this.blogService.create(createBlogDto, adminId);
    return { success: true, message: 'Blog created successfully', data: { blog } };
  }

  @Get()
  async findAll() {
    const blogs = await this.blogService.findAll();
    return { success: true, data: { blogs } };
  }

  @Get('categories')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  async getCategories() {
    const categories = await this.blogService.getCategories();
    return { success: true, data: { categories } };
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const blog = await this.blogService.findOne(slug);
    return { success: true, data: { blog } };
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  async update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    const blog = await this.blogService.update(+id, updateBlogDto);
    return { success: true, message: 'Blog updated successfully', data: { blog } };
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  async remove(@Param('id') id: string) {
    await this.blogService.remove(+id);
    return { success: true, message: 'Blog deleted successfully' };
  }
}
