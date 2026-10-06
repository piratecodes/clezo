import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('ContactController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    // Clean up
    await prisma.admin.deleteMany();

    // Setup Admin and Login
    const adminData = {
      name: 'Super Admin',
      username: 'admincontact',
      email: 'admincontact@example.com',
      phone: '0987654321',
      password: 'password123',
      role: 'SUPER_ADMIN',
    };

    await request(app.getHttpServer()).post('/auth/setup').send(adminData);
    const loginRes = await request(app.getHttpServer()).post('/auth/login').send({
      username: adminData.username,
      password: adminData.password,
    });
    authToken = loginRes.body.data.token;
  });

  afterAll(async () => {
    await prisma.contact.deleteMany();
    await prisma.admin.deleteMany();
    await app.close();
  });

  describe('Contact Routes', () => {
    it('/contact (PATCH) - Create or Update Contact Info', async () => {
      const contactDto = {
        primaryPhone: '1112223333',
        supportEmail: 'support@example.com',
        headOfficeAddress: '123 Main St',
      };

      const response = await request(app.getHttpServer())
        .patch('/contact')
        .set('Authorization', `Bearer ${authToken}`)
        .send(contactDto)
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data.contact.primaryPhone).toBe(contactDto.primaryPhone);
    });

    it('/contact (GET) - Get Contact Info', async () => {
      const response = await request(app.getHttpServer())
        .get('/contact')
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data.contact).toHaveProperty('id');
      expect(response.body.data.contact.primaryPhone).toBe('1112223333');
    });

    it('/contact (POST) - Update Contact Info via POST', async () => {
      const contactDto = {
        primaryPhone: '9998887777',
      };

      const response = await request(app.getHttpServer())
        .post('/contact')
        .set('Authorization', `Bearer ${authToken}`)
        .send(contactDto)
        .expect(HttpStatus.CREATED); // Wait, auth.controller POST returns 201 by default unless @HttpCode is set.
        // The controller didn't have @HttpCode(HttpStatus.OK) on the POST method, so it might be 201.
        // Let's use expect((res) => { ... }) to handle either 201 or 200 safely in case we're not sure,
        // or just check for success true.

      // We'll just verify the response structure since NestJS POST default is 201
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
      expect(response.body.success).toBe(true);
      expect(response.body.data.contact.primaryPhone).toBe(contactDto.primaryPhone);
    });
  });
});
