import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service.js';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  tradeTypes() {
    return this.prisma.tradeType.findMany({ orderBy: { name: 'asc' } });
  }

  zones() {
    return this.prisma.zone.findMany({ orderBy: { path: 'asc' } });
  }

  units() {
    return this.prisma.unitOfMeasure.findMany({ orderBy: { code: 'asc' } });
  }

  taxes() {
    return this.prisma.tax.findMany({ orderBy: { name: 'asc' } });
  }

  currencies() {
    return this.prisma.currency.findMany({ orderBy: { code: 'asc' } });
  }
}
