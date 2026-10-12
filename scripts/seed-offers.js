require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:1234@localhost:5432/Clezo_db?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding initial Clezo offers...");

  const existing = await prisma.offer.findMany();
  if (existing.length > 0) {
    console.log("Offers already exist in database:", existing.length);
    return;
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  tomorrow.setHours(23, 59, 59, 999);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(23, 59, 59, 999);

  await prisma.offer.createMany({
    data: [
      {
        title: "Flat 30% Off On Your First Live Laundry Order",
        slug: "flat-30-off-first-order",
        badge: "Most Popular",
        code: "CLEZO30",
        discount: "30% OFF",
        discountType: "PERCENTAGE",
        description: "Experience premium live laundry hygiene with an instant 30% flat discount on delicate dry cleaning, wash & iron, and steam sanitization.",
        terms: [
          "Valid exclusively for bookings made via the Clezo Mobile App",
          "Applicable on first order across Thane & Pune live stores",
          "Minimum order value ₹499",
          "Cannot be combined with other promotional coupons"
        ],
        bannerImage: {
          url: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=1200&q=80",
          alt: "Clezo Live Laundry Offer"
        },
        appStoreUrl: "https://apps.apple.com/in/app/clezo-express-laundry/id6756257943",
        playStoreUrl: "https://play.google.com/store/apps/details?id=com.quickdrycleaning.clezo",
        showCouponCode: true,
        startDate: new Date(),
        endDate: tomorrow,
        claimedCount: 84,
        maxClaims: 100,
        isActive: true,
        isFeatured: true,
        order: 1
      },
      {
        title: "Instant ₹150 Flat Off On Express Dry Cleaning",
        slug: "flat-150-off-express-dry-cleaning",
        badge: "Limited Slots",
        code: "EXPRESS150",
        discount: "₹150 FLAT",
        discountType: "FIXED",
        description: "Get lightning-fast 24-hour turnaround on premium designer garments, suits, lehengas, and silk sarees.",
        terms: [
          "Redeemable on the Clezo Android App & Store Pickup",
          "Minimum order value ₹799",
          "Free doorstep pickup and prompt express drop included",
          "Valid until stocks and daily machine slots last"
        ],
        bannerImage: {
          url: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=1200&q=80",
          alt: "Express Dry Cleaning Offer"
        },
        appStoreUrl: "https://apps.apple.com/in/app/clezo-express-laundry/id6756257943",
        playStoreUrl: "https://play.google.com/store/apps/details?id=com.quickdrycleaning.clezo",
        showCouponCode: true,
        startDate: new Date(),
        endDate: nextWeek,
        claimedCount: 62,
        maxClaims: 75,
        isActive: true,
        isFeatured: false,
        order: 2
      },
      {
        title: "Home Hygiene Festival: Flat 25% Off Curtains & Shoes",
        slug: "festival-curtains-shoes-care",
        badge: "Weekend Special",
        code: "CARE25",
        discount: "25% OFF",
        discountType: "PERCENTAGE",
        description: "Deep ultrasonic shoe refurbishment and chemical-free steam sanitization for living room curtains and carpets.",
        terms: [
          "Exclusive to Clezo Mobile App orders",
          "Valid on Shoe Spa and Home Furnishing categories",
          "Includes anti-bacterial germ shield treatment at zero extra charge"
        ],
        bannerImage: {
          url: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=1200&q=80",
          alt: "Shoe & Curtain Care Special"
        },
        appStoreUrl: "https://apps.apple.com/in/app/clezo-express-laundry/id6756257943",
        playStoreUrl: "https://play.google.com/store/apps/details?id=com.quickdrycleaning.clezo",
        showCouponCode: true,
        startDate: new Date(),
        endDate: nextWeek,
        claimedCount: 45,
        maxClaims: 50,
        isActive: true,
        isFeatured: false,
        order: 3
      }
    ]
  });

  console.log("Successfully seeded 3 dynamic Clezo offers!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
