import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service.js';
import { Bc3Service } from '../../shared/bc3/bc3.service.js';
import { CreateBudgetDto } from './budget.dto.js';

@Injectable()
export class BudgetService {
  constructor(private readonly prisma: PrismaService, private readonly bc3: Bc3Service) {}

  list() {
    return this.prisma.budget.findMany({ include: { chapters: true } });
  }

  get(id: string) {
    return this.prisma.budget.findUnique({
      where: { id },
      include: { chapters: { include: { items: true } } }
    });
  }

  async create(dto: CreateBudgetDto) {
    return this.prisma.budget.create({
      data: {
        tenantId: dto.tenantId,
        name: dto.name,
        description: dto.description ?? ''
      }
    });
  }

  async importBc3(id: string, buffer: Buffer) {
    const budget = await this.prisma.budget.findUnique({ where: { id } });
    if (!budget) {
      throw new NotFoundException('Presupuesto no encontrado');
    }
    const snapshot = this.bc3.parse(buffer);
    await this.prisma.$transaction(async (tx) => {
      await tx.chapter.deleteMany({ where: { budgetId: id } });
      for (const chapter of snapshot.chapters) {
        const createdChapter = await tx.chapter.create({
          data: {
            budgetId: id,
            code: chapter.code,
            name: chapter.name
          }
        });
        for (const item of chapter.items) {
          const createdItem = await tx.item.create({
            data: {
              chapterId: createdChapter.id,
              code: item.code,
              name: item.name,
              unit: item.unit,
              quantity: item.quantity,
              price: item.price
            }
          });
          for (const measurement of item.measurements ?? []) {
            await tx.measurement.create({
              data: {
                itemId: createdItem.id,
                description: measurement.description,
                quantity: measurement.quantity
              }
            });
          }
        }
      }
    });
    return { importedChapters: snapshot.chapters.length };
  }
}
