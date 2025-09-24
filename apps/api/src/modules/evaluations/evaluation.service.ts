import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service.js';

@Injectable()
export class EvaluationService {
  constructor(private readonly prisma: PrismaService) {}

  async buildRanking(tenderId: string) {
    const bids = await this.prisma.bid.findMany({ where: { tenderId }, include: { vendor: true } });
    type BidSummary = { vendor: string; total: number };
    type BidWithVendor = {
      vendor: { name: string | null } | null;
      total: number | null;
    };
    const normalized: BidSummary[] = bids.map((bid: BidWithVendor): BidSummary => ({
      vendor: bid.vendor?.name ?? 'Desconocido',
      total: bid.total ?? 0,
    }));
    return normalized.sort((a, b) => a.total - b.total);
  }
}
