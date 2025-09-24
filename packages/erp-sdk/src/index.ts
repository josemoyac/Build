import axios from 'axios';
import type { AxiosInstance } from 'axios';

export interface ConnectorContext {
  baseUrl: string;
  tenantId: string;
  clientId: string;
  clientSecret: string;
  scope?: string;
  company?: string;
}

export interface VendorPayload {
  externalId: string;
  name: string;
  vatNumber?: string;
}

export interface ItemPayload {
  externalId: string;
  description: string;
  unit: string;
}

export interface AwardPayload {
  tenderId: string;
  vendorName: string;
  totalAmount: number;
  currency: string;
}

export interface ErpConnector {
  authenticate(): Promise<void>;
  pushPurchaseQuote(payload: AwardPayload): Promise<{ status: string }>;
  pullVendors(): Promise<VendorPayload[]>;
  pullItems(): Promise<ItemPayload[]>;
}

export class BusinessCentralConnector implements ErpConnector {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(private readonly context: ConnectorContext) {
    this.client = axios.create({ baseURL: context.baseUrl });
  }

  async authenticate() {
    this.token = `fake-token-for-${this.context.clientId}`;
  }

  async pushPurchaseQuote(payload: AwardPayload) {
    if (!this.token) {
      await this.authenticate();
    }
    return { status: `QUOTE_SENT_${payload.tenderId}` };
  }

  async pullVendors() {
    return [
      { externalId: 'V001', name: 'Proveedor Demo', vatNumber: 'B12345678' },
      { externalId: 'V002', name: 'Proveedor Construcción', vatNumber: 'B87654321' }
    ];
  }

  async pullItems() {
    return [
      { externalId: 'I001', description: 'Hormigón HA-25', unit: 'm3' },
      { externalId: 'I002', description: 'Acero B500S', unit: 'kg' }
    ];
  }
}

export function createBusinessCentralConnector(context: ConnectorContext): BusinessCentralConnector {
  return new BusinessCentralConnector(context);
}
