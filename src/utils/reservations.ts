import type { Reservation } from '../types/reservation';

export const canCancelReservation = (userId: string | undefined, reservation: Reservation) => {
  return Boolean(userId && reservation.user_id === userId && reservation.status === 'pending');
};

export const canEditReservation = (reservation: Reservation) => reservation.status !== 'approved';