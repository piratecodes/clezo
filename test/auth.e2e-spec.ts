import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
    
    await prisma.admin.deleteMany();
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.admin.deleteMany();
    await app.close();
  });

  describe('Authentication flow', () => {
    const adminDto = {
      name: 'Test Admin',
      username: 'testadmin',
      email: 'testadmin@example.com',
      phone: '1234567890',
      password: 'password123',
    };

    it('/auth/setup (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/setup')
        .send(adminDto)
        .expect(HttpStatus.CREATED);

      expect(response.body.success).toBe(true);
      expect(response.body.data.admin).toHaveProperty('id');
      expect(response.body.data.admin.username).toBe(adminDto.username);
    });

    it('/auth/login (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: adminDto.username,
          password: adminDto.password,
        })
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
    });

    it('/auth/login (POST) - invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: adminDto.username,
          password: 'wrongpassword',
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('/auth/me (GET)', async () => {
      // First login
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: adminDto.username,
          password: adminDto.password,
        });
      const token = loginRes.body.data.token;

      // Then get me
      const meRes = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(meRes.body.success).toBe(true);
      expect(meRes.body.data.admin.username).toBe(adminDto.username);
    });
  });
});
