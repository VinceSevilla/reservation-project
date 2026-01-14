export type ReservationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface Reservation {
  id: string;
  room_id: string;
  user_id: string;
  title: string;
  start_time: string; // ISO string
  end_time: string;   // ISO string
  status: ReservationStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}
