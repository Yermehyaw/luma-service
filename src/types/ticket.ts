export type TicketStatus = 'waiting' | 'called' | 'serving' | 'completed' | 'skipped' | 'cancelled';
export type DocStatus = 'queued' | 'awaiting' | 'verified' | 'flagged';

export interface Ticket {
  id: string;
  code: string;
  tenantId: string;
  tenantName: string;
  branchId: string;
  branchName: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  visitDate: string;
  windowStart: string;
  windowEnd: string;
  position: number;
  estimatedWaitMinutes: number;
  counterNumber?: number | null;
  status: TicketStatus;
  createdAt: string;
}

export interface VerificationDocument {
  id: string;
  tenantId: string;
  personName: string;
  docType: string;
  fileName: string;
  fileUrl: string;
  ticketCode?: string;
  status: DocStatus;
  confidence: number;
  notes?: string;
  createdAt: string;
}
