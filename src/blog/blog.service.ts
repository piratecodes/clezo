import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
import sanitizeHtml from 'sanitize-html';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  // Helper to generate automated JSON-LD schema
  private generateAutomatedSchema(blog: any, adminName: string): string {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.seoMetaTitle || blog.title,
      "description": blog.seoMetaDescription || blog.excerpt || "",
      "image": blog.coverImage ? [blog.coverImage] : [],
      "author": {
        "@type": "Person",
        "name": adminName || "Clezo Express Laundry"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Clezo Express Laundry",
        "logo": {
          "@type": "ImageObject",
          "url": "https://yourdomain.com/logo.png"
        }
      },
      "datePublished": blog.createdAt || new Date().toISOString(),
      "dateModified": blog.updatedAt || new Date().toISOString()
    };
    return JSON.stringify(schema);
  }

  async create(createBlogDto: CreateBlogDto, adminId: number) {
    // Check slug uniqueness
    const existing = await this.prisma.blog.findUnique({
      where: { slug: createBlogDto.slug },
    });
    if (existing) throw new BadRequestException('A blog with this slug already exists.');

    const admin = await this.prisma.admin.findUnique({ where: { id: adminId } });

    let finalSchema = createBlogDto.seoJsonLdSchema;
    if (!finalSchema || finalSchema.trim() === '') {
      finalSchema = this.generateAutomatedSchema(createBlogDto, admin?.name || 'Admin');
    }

    const cleanContent = createBlogDto.content ? sanitizeHtml(createBlogDto.content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span']),
      allowedAttributes: false, // Allow all attributes (like style, class, etc. for rich text editors)
      allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'data'], // Allow data URIs for images if any
    }) : undefined;

    return this.prisma.blog.create({
      data: {
        ...createBlogDto,
        content: cleanContent || createBlogDto.content,
        faqs: createBlogDto.faqs as any,
        authorId: createBlogDto.authorId ? Number(createBlogDto.authorId) : adminId,
        seoJsonLdSchema: finalSchema,
      },
      include: { author: { select: { name: true, profilePic: true } } }
    });
  }

  async findAll() {
    return this.prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true, profilePic: true } } }
    });
  }

  async findOne(slug: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { slug },
      include: { author: { select: { name: true, profilePic: true, bio: true } } }
    });
    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    const existing = await this.prisma.blog.findUnique({ where: { id }, include: { author: true } });
    if (!existing) throw new NotFoundException('Blog not found');

    if (updateBlogDto.slug && updateBlogDto.slug !== existing.slug) {
      const slugCheck = await this.prisma.blog.findUnique({
        where: { slug: updateBlogDto.slug },
      });
      if (slugCheck) throw new BadRequestException('A blog with this slug already exists.');
    }

    let finalSchema = updateBlogDto.seoJsonLdSchema;
    if (!finalSchema || finalSchema.trim() === '') {
      // Re-generate if cleared
      const mergedForSchema = { ...existing, ...updateBlogDto };
      finalSchema = this.generateAutomatedSchema(mergedForSchema, existing.author?.name || 'Admin');
    }

    const cleanContent = updateBlogDto.content ? sanitizeHtml(updateBlogDto.content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'iframe', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span']),
      allowedAttributes: false,
      allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'data'],
    }) : undefined;

    return this.prisma.blog.update({
      where: { id },
      data: {
        ...updateBlogDto,
        content: cleanContent || updateBlogDto.content,
        faqs: updateBlogDto.faqs ? (updateBlogDto.faqs as any) : undefined,
        seoJsonLdSchema: finalSchema,
      },
      include: { author: { select: { name: true, profilePic: true } } }
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.blog.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Blog not found');
    return this.prisma.blog.delete({ where: { id } });
  }

  async getCategories() {
    const blogs = await this.prisma.blog.findMany({
      where: { category: { not: null } },
      select: { category: true },
      distinct: ['category'],
    });
    return blogs.map(b => b.category).filter(c => c && c.trim() !== '');
  }
}
