import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { OfferService } from './offer.service';
import { CreateOfferDto, UpdateOfferDto } from './dto/offer.dto';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';

@Controller('offers')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Get()
  async getPublicOffers() {
    const offers = await this.offerService.getPublicOffers();
    return { success: true, message: 'Active offers retrieved', data: { count: offers.length, offers } };
  }

  @Get('slug/:slug')
  async getOfferBySlug(@Param('slug') slug: string) {
    const offer = await this.offerService.getOfferBySlug(slug);
    return { success: true, message: 'Offer retrieved', data: { offer } };
  }

  @Get('admin/all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  async getAllAdminOffers() {
    const offers = await this.offerService.getAllAdminOffers();
    return { success: true, message: 'All admin offers retrieved', data: { count: offers.length, offers } };
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @HttpCode(HttpStatus.CREATED)
  async createOffer(@Body() dto: CreateOfferDto) {
    const offer = await this.offerService.createOffer(dto);
    return { success: true, message: 'Offer created successfully!', data: { offer } };
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  async updateOffer(@Param('id') id: string, @Body() dto: UpdateOfferDto) {
    const offer = await this.offerService.updateOffer(+id, dto);
    return { success: true, message: 'Offer updated successfully!', data: { offer } };
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  async deleteOffer(@Param('id') id: string) {
    await this.offerService.deleteOffer(+id);
    return { success: true, message: 'Offer permanently deleted!', data: null };
  }
}
