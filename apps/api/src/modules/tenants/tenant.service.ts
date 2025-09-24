import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service.js';
import { CreateTenantDto } from './tenant.dto.js';

@Injectable()
export class TenantService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.tenant.findMany({ include: { companies: true } });
  }

  get(id: string) {
    return this.prisma.tenant.findUnique({ where: { id }, include: { companies: true } });
  }

  create(dto: CreateTenantDto) {
    return this.prisma.tenant.create({ data: { name: dto.name, locale: dto.locale ?? 'es-ES' } });
  }
}
