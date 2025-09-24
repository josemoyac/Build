import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service.js';
import { createBusinessCentralConnector } from '@build/erp-sdk';

@Injectable()
export class ErpService {
  constructor(private readonly prisma: PrismaService) {}

  createConnection(dto: { tenantId: string; name: string; type: string; config: Record<string, unknown> }) {
    return this.prisma.erpConnection.create({ data: { ...dto } });
  }

  async pushAward(connectionId: string, awardId: string) {
    const [connection, award] = await Promise.all([
      this.prisma.erpConnection.findUnique({ where: { id: connectionId } }),
      this.prisma.award.findUnique({ where: { id: awardId }, include: { tender: true, vendor: true } })
    ]);
    if (!connection || !award) {
      throw new NotFoundException('Conexión o adjudicación no encontrada');
    }
    const config = connection.config as Record<string, string | undefined>;
    const connector = createBusinessCentralConnector({
      baseUrl: config.baseUrl ?? '',
      tenantId: config.tenantId ?? '',
      clientId: config.clientId ?? 'demo',
      clientSecret: config.clientSecret ?? 'demo'
    });
    const response = await connector.pushPurchaseQuote({
      tenderId: award.tenderId,
      vendorName: award.vendor.name,
      totalAmount: award.amount,
      currency: award.tender.currency
    });
    await this.prisma.auditEvent.create({
      data: {
        tenantId: connection.tenantId,
        entity: 'Award',
        entityId: award.id,
        action: 'EXPORT_ERP',
        performedBy: 'system',
        payload: { response }
      }
    });
    return response;
  }

  async test(id: string) {
    const connection = await this.prisma.erpConnection.findUnique({ where: { id } });
    if (!connection) {
      throw new NotFoundException('Conexión no encontrada');
    }
    return { status: 'ok', id: connection.id };
  }

  receiveWebhook(id: string, body: unknown) {
    return { connectionId: id, received: body };
  }
}
