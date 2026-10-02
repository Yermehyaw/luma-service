import { BranchQueue, QueueItem } from '../../../types/queue';
import { MOCK_BRANCHES } from '../../../mock/branches';
import { MOCK_TICKETS } from '../../../mock/tickets';

export interface QueueRepository {
  getQueuesByTenant(tenantId: string): Promise<BranchQueue[]>;
  getQueueByBranch(branchId: string): Promise<BranchQueue | null>;
  callNext(branchId: string, counterNumber: number): Promise<QueueItem | null>;
  skipCurrent(ticketId: string): Promise<boolean>;
  completeCurrent(ticketId: string): Promise<boolean>;
}

export class MockQueueRepository implements QueueRepository {
  private queues: BranchQueue[] = [];

  constructor() {
    this.queues = MOCK_BRANCHES.map((b) => ({
      id: `q_${b.id}`,
      tenantId: b.tenantId,
      branchId: b.id,
      branchName: b.name,
      serviceId: 'srv_default',
      serviceName: 'General Queue',
      currentNumber: 'LM-A042',
      servingCounter: 3,
      totalWaiting: Math.floor(2 + Math.random() * 8),
      averageWaitTimeMin: b.waitMin,
      status: 'active',
      items: MOCK_TICKETS.filter((t) => t.branchId === b.id).map((t) => ({
        id: t.id,
        ticketCode: t.code,
        customerName: t.customerName,
        customerPhone: t.customerPhone,
        serviceName: t.serviceName,
        position: t.position,
        estimatedWaitMinutes: t.estimatedWaitMinutes,
        counterNumber: t.counterNumber,
        status: t.status,
        joinedAt: t.createdAt,
      })),
    }));
  }

  async getQueuesByTenant(tenantId: string): Promise<BranchQueue[]> {
    return Promise.resolve(this.queues.filter((q) => q.tenantId === tenantId));
  }

  async getQueueByBranch(branchId: string): Promise<BranchQueue | null> {
    const found = this.queues.find((q) => q.branchId === branchId);
    return Promise.resolve(found || this.queues[0] || null);
  }

  async callNext(branchId: string, counterNumber: number): Promise<QueueItem | null> {
    const q = this.queues.find((item) => item.branchId === branchId);
    if (!q) return null;
    const nextItem = q.items.find((i) => i.status === 'waiting');
    if (nextItem) {
      nextItem.status = 'called';
      nextItem.counterNumber = counterNumber;
      q.currentNumber = nextItem.ticketCode;
      q.servingCounter = counterNumber;
      if (q.totalWaiting > 0) q.totalWaiting -= 1;
    }
    return Promise.resolve(nextItem || null);
  }

  async skipCurrent(ticketId: string): Promise<boolean> {
    for (const q of this.queues) {
      const item = q.items.find((i) => i.id === ticketId);
      if (item) {
        item.status = 'skipped';
        return Promise.resolve(true);
      }
    }
    return Promise.resolve(false);
  }

  async completeCurrent(ticketId: string): Promise<boolean> {
    for (const q of this.queues) {
      const item = q.items.find((i) => i.id === ticketId);
      if (item) {
        item.status = 'completed';
        return Promise.resolve(true);
      }
    }
    return Promise.resolve(false);
  }
}

export const queueRepository: QueueRepository = new MockQueueRepository();
