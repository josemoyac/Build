import { EvaluationService } from '../src/modules/evaluations/evaluation.service';

describe('EvaluationService', () => {
  it('orders bids by total', async () => {
    const prisma: any = {
      bid: {
        findMany: jest.fn().mockResolvedValue([
          { total: 200, vendor: { name: 'Proveedor B' } },
          { total: 150, vendor: { name: 'Proveedor A' } }
        ])
      }
    };
    const service = new EvaluationService(prisma);
    const result = await service.buildRanking('t1');
    expect(result[0]?.vendor).toBe('Proveedor A');
  });
});
