// ============================================================
// useOrders Hook
// ============================================================

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { Order } from '@/types/models';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

// Fetch all orders for current customer
async function fetchOrders(customerId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*), delivery:deliveries(*)')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Order[];
}

// Fetch a single order
async function fetchOrderDetails(orderId: string): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*), delivery:deliveries(*), address:addresses(*)')
    .eq('id', orderId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Order;
}

export function useOrders() {
  const customer = useAuthStore((s) => s.customer);
  const queryClient = useQueryClient();

  // Query for all orders
  const query = useQuery({
    queryKey: ['orders', customer?.id],
    queryFn: () => fetchOrders(customer!.id),
    enabled: !!customer?.id,
  });

  // Realtime subscription for order status updates
  useEffect(() => {
    if (!customer?.id) return;

    const channel = supabase
      .channel(`orders-${customer.id}`)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'orders',
          filter: `customer_id=eq.${customer.id}`
        },
        (payload) => {
          // Invalidate cache to refetch the updated order list
          queryClient.invalidateQueries({ queryKey: ['orders', customer.id] });
          queryClient.invalidateQueries({ queryKey: ['order', payload.new.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [customer?.id, queryClient]);

  return query;
}

export function useOrderDetails(orderId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrderDetails(orderId),
    enabled: !!orderId,
  });

  // Realtime subscription for delivery updates on this specific order
  useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel(`delivery-${orderId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'deliveries',
          filter: `order_id=eq.${orderId}`
        },
        () => {
          // Refetch order details if delivery status changes
          queryClient.invalidateQueries({ queryKey: ['order', orderId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, queryClient]);

  return query;
}
