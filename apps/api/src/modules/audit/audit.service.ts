import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service.js';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  list(entity?: string) {
    return this.prisma.auditEvent.findMany({
      where: { entity: entity || undefined },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }
}
