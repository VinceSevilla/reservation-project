import { Badge } from '@mantine/core';
import type { ReservationStatus } from '../types/reservation';

type Props = { status: ReservationStatus };

const statusProps: Record<ReservationStatus, { color: string; label: string }> = {
  pending: { color: '#B45309', label: 'Pending' },
  approved: { color: '#15803D', label: 'Approved' },
  rejected: { color: '#B91C1C', label: 'Rejected' },
  cancelled: { color: '#6B7280', label: 'Cancelled' },
};

export function ReservationStatusBadge({ status }: Props) {
  const { color, label } = statusProps[status];
  return (
    <Badge
      variant="light"
      style={{
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}40`,
      }}
    >
      {label}
    </Badge>
  );
}