import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto, UpdateGalleryDto } from './dto/gallery.dto';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  async getPublicGalleries() {
    const galleries = await this.galleryService.getPublicGalleries();
    return { success: true, message: 'Published galleries retrieved', data: { count: galleries.length, galleries } };
  }

  @Get('slug/:slug')
  async getGalleryBySlug(@Param('slug') slug: string) {
    const gallery = await this.galleryService.getGalleryBySlug(slug);
    return { success: true, message: 'Gallery retrieved', data: { gallery } };
  }

  @Get('admin/all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  async getAllAdminGalleries() {
    const galleries = await this.galleryService.getAllAdminGalleries();
    return { success: true, message: 'All admin galleries retrieved', data: { count: galleries.length, galleries } };
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @HttpCode(HttpStatus.CREATED)
  async createGallery(@Body() dto: CreateGalleryDto) {
    const gallery = await this.galleryService.createGallery(dto);
    return { success: true, message: 'Gallery album created successfully!', data: { gallery } };
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  async updateGallery(@Param('id') id: string, @Body() dto: UpdateGalleryDto) {
    const gallery = await this.galleryService.updateGallery(+id, dto);
    return { success: true, message: 'Gallery updated successfully', data: { gallery } };
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  async deleteGallery(@Param('id') id: string) {
    await this.galleryService.deleteGallery(+id);
    return { success: true, message: 'Album and all Cloudinary images permanently deleted!', data: null };
  }
}
