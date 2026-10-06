import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('AdminController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let authToken: string;
  let currentAdminId: number;
  let testStaffId: number;

  const superAdminData = {
    name: 'Super Admin',
    username: 'superadmin',
    email: 'superadmin@example.com',
    phone: '0987654321',
    password: 'password123',
    role: 'SUPER_ADMIN',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    // Clean up
    await prisma.admin.deleteMany();

    // Setup Super Admin
    const resSetup = await request(app.getHttpServer())
      .post('/auth/setup')
      .send(superAdminData)
      .expect(HttpStatus.CREATED);
    currentAdminId = resSetup.body.data.id;

    // Login to get token
    const resLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: superAdminData.username,
        password: superAdminData.password,
      })
      .expect(HttpStatus.OK);
    authToken = resLogin.body.data.token;
  });

  afterAll(async () => {
    await prisma.admin.deleteMany();
    await app.close();
  });

  describe('Admin Routes', () => {
    it('/admins/me (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/admins/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.username).toBe(superAdminData.username);
    });

    it('/admins/dashboard-stats (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/admins/dashboard-stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data.stats).toHaveProperty('totalLeads');
    });

    it('/admins (POST) - Create Staff', async () => {
      const newStaff = {
        name: 'Staff User',
        username: 'staffuser',
        email: 'staff@example.com',
        phone: '1112223333',
        password: 'password123',
        designation: 'Sales Agent',
        role: 'SALES_AGENT',
      };

      const response = await request(app.getHttpServer())
        .post('/admins')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newStaff)
        .expect(HttpStatus.CREATED);

      expect(response.body.success).toBe(true);
      testStaffId = response.body.data.staff.id;
    });

    it('/admins (GET) - Get All', async () => {
      const response = await request(app.getHttpServer())
        .get('/admins?all=true')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data.staff.length).toBeGreaterThanOrEqual(2); // Super Admin + Staff User
    });

    it('/admins/:id (GET) - Get By ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/admins/${testStaffId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data.staff.id).toBe(testStaffId);
    });

    it('/admins/:id (PATCH) - Update Staff', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/admins/${testStaffId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Staff User' })
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data.staff.name).toBe('Updated Staff User');
    });

    it('/admins/:id/deactivate (PATCH) - Deactivate Staff', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/admins/${testStaffId}/deactivate`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
    });

    it('/admins/:id (DELETE) - Delete Staff', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/admins/${testStaffId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
    });
  });
});
