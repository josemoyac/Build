import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service.js';
import { EvaluationService } from '../evaluations/evaluation.service.js';
import { EvaluateTenderDto, CreateTenderDto, PublishTenderDto } from './tender.dto.js';

@Injectable()
export class TenderService {
  constructor(private readonly prisma: PrismaService, private readonly evaluation: EvaluationService) {}

  list(filters: Record<string, string>) {
    return this.prisma.tender.findMany({
      where: {
        zone: filters.zone ? { contains: filters.zone, mode: 'insensitive' } : undefined,
        tradeType: filters.tradeType ? { contains: filters.tradeType, mode: 'insensitive' } : undefined,
        status: filters.status || undefined
      },
      include: { company: true }
    }).then((rows) =>
      rows.map((row) => ({
        id: row.id,
        title: row.title,
        zone: row.zone,
        tradeType: row.tradeType,
        status: row.status,
        amount: row.amount,
        publishedAt: row.publishedAt?.toISOString() ?? '',
        buyerCompany: row.company.name
      }))
    );
  }

  get(id: string) {
    return this.prisma.tender.findUnique({
      where: { id },
      include: {
        budget: {
          include: {
            chapters: {
              include: { items: true }
            }
          }
        },
        tenderLines: true
      }
    });
  }

  create(dto: CreateTenderDto) {
    return this.prisma.tender.create({
      data: {
        tenantId: dto.tenantId,
        companyId: dto.companyId,
        budgetId: dto.budgetId,
        title: dto.title,
        description: dto.description,
        zone: dto.zone,
        tradeType: dto.tradeType,
        status: 'Borrador',
        openingAt: dto.openingAt ? new Date(dto.openingAt) : null,
        closingAt: dto.closingAt ? new Date(dto.closingAt) : null,
        currency: 'EUR',
        amount: dto.amount ?? 0
      }
    });
  }

  async publish(id: string, dto: PublishTenderDto) {
    const updated = await this.prisma.tender.update({
      where: { id },
      data: { status: 'Publicada', publishedAt: new Date(dto.publishedAt) }
    });
    await this.prisma.auditEvent.create({
      data: {
        tenantId: updated.tenantId,
        entity: 'Tender',
        entityId: updated.id,
        action: 'PUBLISH',
        performedBy: 'system',
        payload: { publishedAt: dto.publishedAt }
      }
    });
    return updated;
  }

  updateStatus(id: string, status: string) {
    return this.prisma.tender.update({ where: { id }, data: { status } });
  }

  async evaluate(id: string, dto: EvaluateTenderDto) {
    const [evaluation, tender] = await Promise.all([
      this.evaluation.buildRanking(id),
      this.prisma.tender.findUnique({ where: { id } })
    ]);
    await this.prisma.auditEvent.create({
      data: {
        tenantId: tender?.tenantId ?? 'unknown',
        entity: 'Tender',
        entityId: id,
        action: 'EVALUATE',
        performedBy: 'system',
        payload: { criteria: dto.criteria }
      }
    });
    return evaluation;
  }

  async award(id: string, vendorId: string) {
    const tender = await this.prisma.tender.findUnique({ where: { id } });
    if (!tender) {
      throw new NotFoundException('Licitación no encontrada');
    }
    const vendor = await this.prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) {
      throw new NotFoundException('Proveedor no encontrado');
    }
    const award = await this.prisma.award.create({
      data: {
        tenderId: id,
        vendorId,
        amount: tender.amount
      }
    });
    await this.prisma.auditEvent.create({
      data: {
        tenantId: tender.tenantId,
        entity: 'Tender',
        entityId: tender.id,
        action: 'AWARD',
        performedBy: 'system',
        payload: { vendorId, vendorName: vendor.name }
      }
    });
    return award;
  }

  async report(id: string) {
    const tender = await this.prisma.tender.findUnique({
      where: { id },
      include: { bids: { include: { vendor: true } }, awards: { include: { vendor: true } } }
    });
    if (!tender) {
      throw new NotFoundException('Licitación no encontrada');
    }
    return {
      id: tender.id,
      title: tender.title,
      bids: tender.bids.map((bid) => ({ vendor: bid.vendor.name, total: bid.total })),
      awards: tender.awards.map((award) => ({ vendor: award.vendor.name, amount: award.amount }))
    };
  }
}
