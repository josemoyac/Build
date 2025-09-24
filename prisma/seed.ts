import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  await prisma.auditEvent.deleteMany();
  await prisma.award.deleteMany();
  await prisma.bidLine.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.tenderLine.deleteMany();
  await prisma.tender.deleteMany();
  await prisma.measurement.deleteMany();
  await prisma.item.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.user.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.company.deleteMany();
  await prisma.tradeType.deleteMany();
  await prisma.zone.deleteMany();
  await prisma.unitOfMeasure.deleteMany();
  await prisma.currency.deleteMany();
  await prisma.tax.deleteMany();
  await prisma.erpConnection.deleteMany();
  await prisma.tenant.deleteMany();

  const tenants = await Promise.all(
    ['Aconser', 'Innovación', 'Constructiva'].map((name) =>
      prisma.tenant.create({ data: { name, locale: 'es-ES' } })
    )
  );

  const [tenantA] = tenants;

  const companies = await prisma.$transaction([
    prisma.company.create({ data: { name: 'Constructora Atlántico', tenantId: tenantA.id } }),
    prisma.company.create({ data: { name: 'Infraestructuras Norte', tenantId: tenantA.id } }),
    prisma.company.create({ data: { name: 'Instaladora Levante', tenantId: tenantA.id } })
  ]);

  await prisma.vendor.createMany({
    data: Array.from({ length: 15 }).map((_, index) => ({
      name: `Proveedor ${index + 1}`,
      tenantId: tenantA.id
    }))
  });

  await prisma.tradeType.createMany({
    data: [
      'Movimiento de tierras',
      'Estructuras',
      'Instalaciones eléctricas',
      'Climatización',
      'Acabados',
      'Suministros industriales',
      'Seguridad'
    ].map((name) => ({ name }))
  });

  await prisma.zone.createMany({
    data: [
      { name: 'Madrid', path: 'ES/Madrid' },
      { name: 'Barcelona', path: 'ES/Cataluña/Barcelona' },
      { name: 'Valencia', path: 'ES/Valencia' },
      { name: 'Sevilla', path: 'ES/Andalucía/Sevilla' },
      { name: 'Bilbao', path: 'ES/PaisVasco/Bizkaia' },
      { name: 'Lisboa', path: 'PT/Lisboa' }
    ]
  });

  await prisma.currency.createMany({
    data: [
      { code: 'EUR', name: 'Euro' },
      { code: 'USD', name: 'Dólar estadounidense' }
    ]
  });

  await prisma.unitOfMeasure.createMany({
    data: [
      { code: 'm2', name: 'Metro cuadrado' },
      { code: 'm3', name: 'Metro cúbico' },
      { code: 'kg', name: 'Kilogramo' },
      { code: 'ud', name: 'Unidad' }
    ]
  });

  await prisma.tax.createMany({ data: [{ name: 'IVA 21%', rate: 0.21 }, { name: 'IVA 10%', rate: 0.1 }] });

  const budget = await prisma.budget.create({
    include: { chapters: { include: { items: true } } },
    data: {
      tenantId: tenantA.id,
      name: 'Edificio oficinas Centro',
      description: 'Presupuesto de referencia',
      chapters: {
        create: [
          {
            code: '01',
            name: 'Movimiento de tierras',
            items: {
              create: [
                {
                  code: '01.01',
                  name: 'Excavación en zanja',
                  unit: 'm3',
                  quantity: 100,
                  price: 12.5,
                  measurements: {
                    create: [
                      { description: 'Zona norte', quantity: 50 },
                      { description: 'Zona sur', quantity: 50 }
                    ]
                  }
                }
              ]
            }
          },
          {
            code: '02',
            name: 'Estructura',
            items: {
              create: [
                { code: '02.01', name: 'Pilares metálicos', unit: 'ud', quantity: 10, price: 500 },
                { code: '02.02', name: 'Forjado alveolar', unit: 'm2', quantity: 200, price: 45 }
              ]
            }
          }
        ]
      }
    }
  });

  const firstItemId = budget.chapters?.[0]?.items?.[0]?.id;

  const tender = await prisma.tender.create({
    data: {
      tenantId: tenantA.id,
      companyId: companies[0].id,
      budgetId: budget.id,
      title: 'Construcción edificio innovación',
      description: 'Proyecto llave en mano',
      zone: 'Madrid',
      tradeType: 'Estructuras',
      status: 'Publicada',
      publishedAt: new Date(),
      closingAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      currency: 'EUR',
      amount: 500000,
      tenderLines: {
        create: [
          {
            description: 'Excavación en zanja',
            quantity: 100,
            unit: 'm3',
            targetPrice: 1250,
            itemId: firstItemId ?? undefined
          },
          {
            description: 'Pilares metálicos',
            quantity: 10,
            unit: 'ud',
            targetPrice: 5000
          }
        ]
      }
    }
  });

  for (let i = 0; i < 9; i += 1) {
    await prisma.tender.create({
      data: {
        tenantId: tenantA.id,
        companyId: companies[i % companies.length].id,
        title: `Licitación demo ${i + 2}`,
        description: 'Proceso automático generado por seed',
        zone: 'Barcelona',
        tradeType: 'Climatización',
        status: i % 2 === 0 ? 'Publicada' : 'Cerrada',
        currency: 'EUR',
        amount: 100000 + i * 5000
      }
    });
  }

  const vendors = await prisma.vendor.findMany({ take: 2 });

  for (const vendor of vendors) {
    const bid = await prisma.bid.create({
      data: {
        tenderId: tender.id,
        vendorId: vendor.id,
        status: 'Enviada',
        total: 120000,
        lines: {
          create: tender.tenderLines.map((line) => ({
            tenderLineId: line.id,
            unitPrice: 100,
            total: line.quantity * 100
          }))
        }
      }
    });
    await prisma.auditEvent.create({
      data: {
        tenantId: vendor.tenantId,
        entity: 'Bid',
        entityId: bid.id,
        action: 'CREATE',
        performedBy: 'seed-script',
        payload: { vendor: vendor.name }
      }
    });
  }

  await prisma.erpConnection.create({
    data: {
      tenantId: tenantA.id,
      name: 'BusinessCentralSandbox',
      type: 'business-central',
      config: {
        baseUrl: process.env.BUSINESS_CENTRAL_BASE_URL,
        tenantId: process.env.BUSINESS_CENTRAL_TENANT_ID
      }
    }
  });

  await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@build.test',
        passwordHash: await argon2.hash('Build123!'),
        tenantId: tenantA.id,
        role: 'OrgAdmin'
      }
    }),
    prisma.user.create({
      data: {
        email: 'buyer@build.test',
        passwordHash: await argon2.hash('Build123!'),
        tenantId: tenantA.id,
        companyId: companies[0].id,
        role: 'Buyer'
      }
    }),
    prisma.user.create({
      data: {
        email: 'vendor@build.test',
        passwordHash: await argon2.hash('Build123!'),
        tenantId: tenantA.id,
        role: 'Vendor'
      }
    })
  ]);
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    return prisma.$disconnect();
  });
