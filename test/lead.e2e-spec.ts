import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('LeadController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let authToken: string;
  let createdLeadId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    // Clean up
    await prisma.lead.deleteMany();
    await prisma.admin.deleteMany();

    // Setup Admin and Login
    const adminData = {
      name: 'Super Admin',
      username: 'adminlead',
      email: 'adminlead@example.com',
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
    await prisma.lead.deleteMany();
    await prisma.admin.deleteMany();
    await app.close();
  });

  describe('Lead Routes', () => {
    const leadDto = {
      serviceRequested: 'House Shifting',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '9876543210',
      originCity: 'Mumbai',
      destinationCity: 'Pune',
    };

    it('/leads (POST) - Create Lead', async () => {
      const response = await request(app.getHttpServer())
        .post('/leads')
        .send(leadDto)
        .expect(HttpStatus.CREATED);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('orderId');
      expect(response.body.data).toHaveProperty('leadId');
      createdLeadId = response.body.data.leadId;
    });

    it('/leads (GET) - Get All Leads (Admin)', async () => {
      const response = await request(app.getHttpServer())
        .get('/leads')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data.leads.length).toBeGreaterThan(0);
      expect(response.body.data.leads[0].customerName).toBe(leadDto.customerName);
    });

    it('/leads/:id (GET) - Get Lead By ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/leads/${createdLeadId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data.lead.id).toBe(createdLeadId);
    });

    it('/leads/:id (PATCH) - Update Lead', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/leads/${createdLeadId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'CONTACTED', adminNotes: 'Called the customer' });
        
      if (response.status !== HttpStatus.OK) {
        console.error('PATCH /leads/:id FAILED:', response.body);
      }
      expect(response.status).toBe(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data.lead.status).toBe('CONTACTED');
      expect(response.body.data.lead.adminNotes).toBe('Called the customer');
    });

    it('/leads/:id (DELETE) - Delete Lead', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/leads/${createdLeadId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
    });
  });
});
