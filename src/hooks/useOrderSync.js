import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase, TABLES } from '@/api/supabaseClient';

const PROVIDER_API = 'https://www.paksmmportal.com/api/v2';
const PROVIDER_KEY = '1f881bf3954b1d4bd6bad99d3944abef6085c169';
const POLL_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

const STATUS_MAP = {
  Completed: 'completed',
  completed: 'completed',
  'In progress': 'in_progress',
  Processing: 'in_progress',
  Pending: 'pending',
  pending: 'pending',
  Partial: 'partial',
  partial: 'partial',
  Canceled: 'cancelled',
  Cancelled: 'cancelled',
  cancelled: 'cancelled',
  Failed: 'failed',
  failed: 'failed',
};

async function fetchStatusFromProvider(panelOrderId) {
  const body = new URLSearchParams({
    key: PROVIDER_KEY,
    action: 'status',
    order: panelOrderId,
  });

  try {
    const res = await fetch(PROVIDER_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    return await res.json();
  } catch {
    // CORS fallback - just skip for now
    return null;
  }
}

export default function useOrderSync(userEmail, isAdmin = false) {
  const queryClient = useQueryClient();
  const timerRef = useRef(null);
  const runningRef = useRef(false);

  const syncOrders = async () => {
    if (runningRef.current) return;
    runningRef.current = true;

    try {
      // Fetch active orders to check
      let query = supabase.from(TABLES.ORDERS).select('*').in('status', ['in_progress', 'pending']);
      
      const { data: ordersToCheck, error: fetchError } = await query.limit(100);
      if (fetchError || !ordersToCheck?.length) return;

      // Process in batches
      for (const order of ordersToCheck) {
        if (!order.panel_order_id) continue;
        
        try {
          const result = await fetchStatusFromProvider(order.panel_order_id);
          if (!result || result.error) continue;

          const newStatus = STATUS_MAP[result.status];
          if (!newStatus || newStatus === order.status) continue;

          const updateData = {
            status: newStatus,
            panel_status: result.status,
            panel_response: JSON.stringify(result),
          };

          if (result.remains != null) updateData.remains = Number(result.remains);
          if (result.start_count != null) updateData.start_count = Number(result.start_count);

          await supabase.from(TABLES.ORDERS).update(updateData).eq('id', order.id);
        } catch {
          // Silently skip failed order checks
        }

        await new Promise(r => setTimeout(r, 500));
      }

      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    } finally {
      runningRef.current = false;
    }
  };

  useEffect(() => {
    if (!userEmail) return;

    syncOrders();
    timerRef.current = setInterval(syncOrders, POLL_INTERVAL_MS);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [userEmail]);
}