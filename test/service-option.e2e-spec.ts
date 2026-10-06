import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('ServiceOptionController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let authToken: string;
  let createdOptionId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    // Clean up
    await prisma.serviceOption.deleteMany();
    await prisma.admin.deleteMany();

    // Setup Admin and Login
    const adminData = {
      name: 'Super Admin',
      username: 'adminservice',
      email: 'adminservice@example.com',
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
    await prisma.serviceOption.deleteMany();
    await prisma.admin.deleteMany();
    await app.close();
  });

  describe('Service Option Routes', () => {
    const optionDto = {
      categoryName: '1 BHK',
      serviceType: 'house-shifting',
      isActive: true,
      priceStartingFrom: 5000,
    };

    it('/service-options (POST) - Create Option', async () => {
      const response = await request(app.getHttpServer())
        .post('/service-options')
        .set('Authorization', `Bearer ${authToken}`)
        .send(optionDto)
        .expect(HttpStatus.CREATED);

      expect(response.body.success).toBe(true);
      expect(response.body.data.option.categoryName).toBe(optionDto.categoryName);
      createdOptionId = response.body.data.option.id;
    });

    it('/service-options (GET) - Get All Options (Admin)', async () => {
      const response = await request(app.getHttpServer())
        .get('/service-options')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data.options.length).toBeGreaterThan(0);
    });

    it('/service-options/service/:serviceSlug (GET) - Get Options by Service', async () => {
      const response = await request(app.getHttpServer())
        .get(`/service-options/service/${optionDto.serviceType}`)
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data.options[0].categoryName).toBe(optionDto.categoryName);
    });

    it('/service-options/:id (PATCH) - Update Option', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/service-options/${createdOptionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ priceStartingFrom: 6000 })
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data.option.priceStartingFrom).toBe(6000);
    });

    it('/service-options/:id/toggle (PATCH) - Toggle Status', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/service-options/${createdOptionId}/toggle`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data.option.isActive).toBe(false);
    });

    it('/service-options/:id (DELETE) - Delete Option', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/service-options/${createdOptionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
    });
  });
});
