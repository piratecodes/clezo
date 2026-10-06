import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('GalleryController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let authToken: string;
  let createdGalleryId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    // Clean up
    await prisma.gallery.deleteMany();
    await prisma.admin.deleteMany();

    // Setup Admin and Login
    const adminData = {
      name: 'Super Admin',
      username: 'admingallery',
      email: 'admingallery@example.com',
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
    await prisma.gallery.deleteMany();
    await prisma.admin.deleteMany();
    await app.close();
  });

  describe('Gallery Routes', () => {
    const galleryDto = {
      categoryName: 'Test Category',
      description: 'Test Description',
      isPublished: true,
      featuredImage: { url: 'http://example.com/image.jpg', alt: 'Test Image' },
    };

    let testGallerySlug: string;

    it('/gallery (POST) - Create Gallery', async () => {
      const response = await request(app.getHttpServer())
        .post('/gallery')
        .set('Authorization', `Bearer ${authToken}`)
        .send(galleryDto)
        .expect(HttpStatus.CREATED);

      expect(response.body.success).toBe(true);
      expect(response.body.data.gallery.categoryName).toBe(galleryDto.categoryName);
      createdGalleryId = response.body.data.gallery.id;
      testGallerySlug = response.body.data.gallery.slug;
    });

    it('/gallery (GET) - Get Public Galleries', async () => {
      const response = await request(app.getHttpServer())
        .get('/gallery')
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data.galleries.length).toBeGreaterThan(0);
    });

    it('/gallery/slug/:slug (GET) - Get Gallery By Slug', async () => {
      console.log('Fetching slug:', testGallerySlug);
      const response = await request(app.getHttpServer())
        .get(`/gallery/slug/${testGallerySlug}`);
        
      if (response.status !== HttpStatus.OK) {
        console.error('FAILED GET /gallery/slug/:slug:', response.body);
      }
      expect(response.status).toBe(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data.gallery.categoryName).toBe(galleryDto.categoryName);
    });

    it('/gallery/admin/all (GET) - Get All Admin Galleries', async () => {
      const response = await request(app.getHttpServer())
        .get('/gallery/admin/all')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data.galleries.length).toBeGreaterThan(0);
    });

    it('/gallery/:id (PATCH) - Update Gallery', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/gallery/${createdGalleryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ categoryName: 'Updated Test Category' })
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data.gallery.categoryName).toBe('Updated Test Category');
    });

    it('/gallery/:id (DELETE) - Delete Gallery', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/gallery/${createdGalleryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
    });
  });
});
