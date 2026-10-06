import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async getContactInfo() {
    const contactInfo = await this.prisma.contact.findFirst();
    return contactInfo || {};
  }

  async updateContactInfo(dto: UpdateContactDto) {
    const contactInfo = await this.prisma.contact.findFirst();

    if (contactInfo) {
      return this.prisma.contact.update({
        where: { id: contactInfo.id },
        data: dto,
      });
    } else {
      return this.prisma.contact.create({
        data: dto as any, // Cast because create usually requires all non-optional fields
      });
    }
  }
}
