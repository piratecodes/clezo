import { Controller, Get, Patch, Post, Body, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { UpdateContactDto } from './dto/contact.dto';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  async getContactInfo() {
    const contact = await this.contactService.getContactInfo();
    return { success: true, message: 'Global contact info retrieved', data: { contact } };
  }

  @Patch()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  async updateContactInfoPatch(@Body() dto: UpdateContactDto) {
    const contact = await this.contactService.updateContactInfo(dto);
    return { success: true, message: 'Global contact info updated successfully', data: { contact } };
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  async updateContactInfoPost(@Body() dto: UpdateContactDto) {
    const contact = await this.contactService.updateContactInfo(dto);
    return { success: true, message: 'Global contact info updated successfully', data: { contact } };
  }
}
