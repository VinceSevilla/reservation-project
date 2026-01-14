import { Alert } from '@mantine/core';
import { canEditReservation } from '../utils/reservations';
import type { Reservation } from '../types/reservation';

type Props = { reservation?: Reservation | null };

export function ReservationForm({ reservation }: Props) {
  const editable = reservation ? canEditReservation(reservation) : true;

  if (reservation && !editable) {
    return (
      <Alert color="blue" title="Approved reservation">
        Approved reservations cannot be edited.
      </Alert>
    );
  }

  return (
    <form>
      {/* ...existing code... */}
    </form>
  );
}