import { useState } from 'react';
import { supabase } from '../../supabase';

export function useCancelReservation() {
  const [loading, setLoading] = useState(false);

  const cancel = async (reservationId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('id', reservationId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Cancel reservation error:', err);
      return { success: false, error: err as Error };
    } finally {
      setLoading(false);
    }
  };

  return { cancel, loading };
}