import { describe, expect, it } from 'vitest';
import { createBusinessCentralConnector } from '../src/index.js';

describe('BusinessCentralConnector', () => {
  it('pushes quotes with fake token', async () => {
    const connector = createBusinessCentralConnector({
      baseUrl: 'https://example.com',
      tenantId: 'tenant',
      clientId: 'client',
      clientSecret: 'secret'
    });
    const response = await connector.pushPurchaseQuote({ tenderId: 'T001', vendorName: 'Vendor', totalAmount: 1000, currency: 'EUR' });
    expect(response.status).toContain('QUOTE_SENT');
  });
});
