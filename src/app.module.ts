import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { GalleryModule } from './gallery/gallery.module';
import { LeadModule } from './lead/lead.module';
import { ServiceOptionModule } from './service-option/service-option.module';
import { MailModule } from './mail/mail.module';
import { BlogModule } from './blog/blog.module';
import { SessionModule } from './session/session.module';

import { CacheModule } from '@nestjs/cache-manager';
import { ServiceCategoryModule } from './service-category/service-category.module';
import { SupportTicketModule } from './support-ticket/support-ticket.module';
import { ServiceAreaModule } from './service-area/service-area.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true, ttl: 60 * 60 * 1000 }),
    PrismaModule,
    AdminModule,
    AuthModule,
    ContactModule,
    LeadModule,
    ServiceOptionModule,
    GalleryModule,
    MailModule,
    BlogModule,
    SessionModule,
    ServiceCategoryModule,
    SupportTicketModule,
    ServiceAreaModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
