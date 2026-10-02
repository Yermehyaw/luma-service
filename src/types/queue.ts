export type QueueStatus = 'active' | 'paused' | 'closed';

export interface QueueItem {
  id: string;
  ticketCode: string;
  customerName: string;
  customerPhone?: string;
  serviceName: string;
  position: number;
  estimatedWaitMinutes: number;
  counterNumber?: number | null;
  status: 'waiting' | 'called' | 'serving' | 'completed' | 'skipped' | 'cancelled';
  joinedAt: string;
  calledAt?: string;
  servedAt?: string;
}

export interface BranchQueue {
  id: string;
  tenantId: string;
  branchId: string;
  branchName: string;
  serviceId: string;
  serviceName: string;
  currentNumber: string;
  servingCounter: number;
  totalWaiting: number;
  averageWaitTimeMin: number;
  status: QueueStatus;
  items: QueueItem[];
}
