import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service.js';
import { UpsertBidDto } from './bid.dto.js';

@Injectable()
export class BidService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(tenderId: string, dto: UpsertBidDto) {
    const existing = await this.prisma.bid.findFirst({ where: { tenderId, vendorId: dto.vendorId } });
    if (existing) {
      await this.prisma.bidLine.deleteMany({ where: { bidId: existing.id } });
      const lines = await this.prisma.$transaction(
        dto.lines.map((line) =>
          this.prisma.bidLine.create({
            data: {
              bidId: existing.id,
              tenderLineId: line.tenderLineId,
              unitPrice: line.unitPrice,
              total: line.unitPrice
            }
          })
        )
      );
      const total = lines.reduce((acc, line) => acc + line.total, 0);
      return this.prisma.bid.update({ where: { id: existing.id }, data: { total, status: 'Actualizada' } });
    }
    return this.prisma.bid.create({
      data: {
        tenderId,
        vendorId: dto.vendorId,
        status: 'Enviada',
        total: dto.lines.reduce((acc, line) => acc + line.unitPrice, 0),
        lines: {
          create: dto.lines.map((line) => ({
            tenderLineId: line.tenderLineId,
            unitPrice: line.unitPrice,
            total: line.unitPrice
          }))
        }
      }
    });
  }

  list(tenderId: string) {
    return this.prisma.bid.findMany({ where: { tenderId }, include: { vendor: true } });
  }

  get(id: string) {
    return this.prisma.bid.findUnique({ where: { id }, include: { lines: true, vendor: true } });
  }
}
