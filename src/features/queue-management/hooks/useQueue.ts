'use client';

import { useState, useEffect } from 'react';
import { BranchQueue, QueueItem } from '../types';
import { queueRepository } from '../api/queue-repository';

export function useQueue(tenantId: string) {
  const [queues, setQueues] = useState<BranchQueue[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshQueues = async () => {
    setLoading(true);
    const data = await queueRepository.getQueuesByTenant(tenantId);
    setQueues(data);
    setLoading(false);
  };

  useEffect(() => {
    refreshQueues();
  }, [tenantId]);

  return { queues, loading, refreshQueues };
}

export function useLiveQueue(branchId: string) {
  const [queue, setQueue] = useState<BranchQueue | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    const data = await queueRepository.getQueueByBranch(branchId);
    setQueue(data ? { ...data } : null);
    setLoading(false);
  };

  useEffect(() => {
    fetchQueue();
    // Polling simulation for live updates
    const interval = setInterval(() => {
      fetchQueue();
    }, 5000);
    return () => clearInterval(interval);
  }, [branchId]);

  const callNext = async (counterNumber: number = 1): Promise<QueueItem | null> => {
    const item = await queueRepository.callNext(branchId, counterNumber);
    await fetchQueue();
    return item;
  };

  const completeCurrent = async (ticketId: string): Promise<boolean> => {
    const res = await queueRepository.completeCurrent(ticketId);
    await fetchQueue();
    return res;
  };

  const skipCurrent = async (ticketId: string): Promise<boolean> => {
    const res = await queueRepository.skipCurrent(ticketId);
    await fetchQueue();
    return res;
  };

  return { queue, loading, callNext, completeCurrent, skipCurrent, refresh: fetchQueue };
}
