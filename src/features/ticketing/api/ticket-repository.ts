import { Ticket, VerificationDocument } from '../../../types/ticket';
import { MOCK_TICKETS, MOCK_DOCUMENTS } from '../../../mock/tickets';
import { generateTicketCode } from '../../../lib/utils';

export interface TicketRepository {
  getTicketsByTenant(tenantId: string): Promise<Ticket[]>;
  getTicketByCode(code: string): Promise<Ticket | null>;
  createTicket(data: Partial<Ticket>): Promise<Ticket>;
  getDocumentsByTicket(ticketCode: string): Promise<VerificationDocument[]>;
}

export class MockTicketRepository implements TicketRepository {
  private tickets: Ticket[] = [...MOCK_TICKETS];
  private documents: VerificationDocument[] = [...MOCK_DOCUMENTS];

  async getTicketsByTenant(tenantId: string): Promise<Ticket[]> {
    return Promise.resolve(this.tickets.filter((t) => t.tenantId === tenantId));
  }

  async getTicketByCode(code: string): Promise<Ticket | null> {
    const found = this.tickets.find((t) => t.code.toLowerCase() === code.toLowerCase());
    return Promise.resolve(found || null);
  }

  async createTicket(data: Partial<Ticket>): Promise<Ticket> {
    const newTicket: Ticket = {
      id: `tck_${Date.now()}`,
      code: generateTicketCode('LM'),
      tenantId: data.tenantId || 'tenant_001',
      tenantName: data.tenantName || 'Acme Bank',
      branchId: data.branchId || 'br_admiralty',
      branchName: data.branchName || 'Lekki Admiralty Branch',
      serviceId: data.serviceId || 'srv_cash',
      serviceName: data.serviceName || 'Cash Deposit & Withdrawal',
      customerName: data.customerName || 'Walk-in Customer',
      customerPhone: data.customerPhone || '+234 800 000 0000',
      customerEmail: data.customerEmail,
      visitDate: data.visitDate || new Date().toISOString().slice(0, 10),
      windowStart: data.windowStart || '10:30',
      windowEnd: data.windowEnd || '11:00',
      position: Math.floor(1 + Math.random() * 5),
      estimatedWaitMinutes: Math.floor(5 + Math.random() * 15),
      counterNumber: null,
      status: 'waiting',
      createdAt: new Date().toISOString(),
    };
    this.tickets.unshift(newTicket);
    return Promise.resolve(newTicket);
  }

  async getDocumentsByTicket(ticketCode: string): Promise<VerificationDocument[]> {
    return Promise.resolve(this.documents.filter((d) => d.ticketCode === ticketCode));
  }
}

export const ticketRepository: TicketRepository = new MockTicketRepository();
