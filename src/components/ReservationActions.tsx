import { Button, Group, Tooltip, Modal, Stack, TextInput, Select } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { useRole } from '../hooks/useRole';
import { canCancelReservation } from '../utils/reservations';
import { useCancelReservation } from '../features/reservations/useCancelReservation';
import { supabase } from '../supabase';
import type { Reservation, ReservationStatus } from '../types/reservation';

type Props = {
  reservation: Reservation;
  onCancelled?: (reservationId: string) => void;
  onStatusChanged?: (reservationId: string, status: ReservationStatus) => void;
  onDeleted?: (reservationId: string) => void;
  onUpdated?: (reservationId: string, updates: Partial<Reservation>) => void;
};

export function ReservationActions({ reservation, onCancelled, onStatusChanged, onDeleted, onUpdated }: Props) {
  const { user } = useAuth();
  const { role } = useRole();
  const { cancel, loading: cancelLoading } = useCancelReservation();
  const [actionLoading, setActionLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [editForm, setEditForm] = useState({
    title: reservation.title,
    room_id: reservation.room_id,
    start_time: '',
    end_time: '',
  });

  const canCancel = canCancelReservation(user?.id, reservation);
  const isStaffOrAdmin = role === 'staff' || role === 'admin';
  const isPending = reservation.status === 'pending';
  const isApproved = reservation.status === 'approved';

  useEffect(() => {
    if (editModalOpen) {
      // Load rooms
      supabase.from('rooms').select('id, name').then(({ data }) => {
        setRooms(data || []);
      });
      // Format datetime for input
      const startDate = new Date(reservation.start_time);
      const endDate = new Date(reservation.end_time);
      setEditForm({
        title: reservation.title,
        room_id: reservation.room_id,
        start_time: formatDateTimeLocal(startDate),
        end_time: formatDateTimeLocal(endDate),
      });
    }
  }, [editModalOpen, reservation]);

  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleCancel = async () => {
    const confirmed = window.confirm('Cancel this pending reservation?');
    if (!confirmed) return;
    const res = await cancel(reservation.id);
    if (res.success) onCancelled?.(reservation.id);
    else alert(res.error?.message ?? 'Failed to cancel reservation.');
  };

  const handleApprove = async () => {
    const confirmed = window.confirm('Approve this reservation?');
    if (!confirmed) return;
    setActionLoading(true);
    const { error } = await supabase
      .from('reservations')
      .update({ status: 'approved' })
      .eq('id', reservation.id);
    setActionLoading(false);
    if (error) {
      alert('Failed to approve reservation: ' + error.message);
    } else {
      onStatusChanged?.(reservation.id, 'approved');
    }
  };

  const handleReject = async () => {
    const confirmed = window.confirm('Reject this reservation?');
    if (!confirmed) return;
    setActionLoading(true);
    const { error } = await supabase
      .from('reservations')
      .update({ status: 'rejected' })
      .eq('id', reservation.id);
    setActionLoading(false);
    if (error) {
      alert('Failed to reject reservation: ' + error.message);
    } else {
      onStatusChanged?.(reservation.id, 'rejected');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Permanently delete this reservation? This action cannot be undone.');
    if (!confirmed) return;
    setActionLoading(true);
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', reservation.id);
    setActionLoading(false);
    if (error) {
      alert('Failed to delete reservation: ' + error.message);
    } else {
      onDeleted?.(reservation.id);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const { error } = await supabase
      .from('reservations')
      .update({
        title: editForm.title,
        room_id: editForm.room_id,
        start_time: editForm.start_time,
        end_time: editForm.end_time,
      })
      .eq('id', reservation.id);
    setActionLoading(false);
    if (error) {
      alert('Failed to update reservation: ' + error.message);
    } else {
      onUpdated?.(reservation.id, {
        title: editForm.title,
        room_id: editForm.room_id,
        start_time: editForm.start_time,
        end_time: editForm.end_time,
      });
      setEditModalOpen(false);
    }
  };

  return (
    <>
      <Modal opened={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Reservation" size="md">
        <form onSubmit={handleEditSubmit}>
          <Stack gap="md">
            <TextInput
              label="Title"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.currentTarget.value })}
              required
            />
            <Select
              label="Room"
              data={rooms.map((r) => ({ value: r.id, label: r.name }))}
              value={editForm.room_id}
              onChange={(val) => setEditForm({ ...editForm, room_id: val || '' })}
              required
            />
            <TextInput
              label="Start Time"
              type="datetime-local"
              value={editForm.start_time}
              onChange={(e) => setEditForm({ ...editForm, start_time: e.currentTarget.value })}
              required
            />
            <TextInput
              label="End Time"
              type="datetime-local"
              value={editForm.end_time}
              onChange={(e) => setEditForm({ ...editForm, end_time: e.currentTarget.value })}
              required
            />
            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={actionLoading}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

    <Group gap="xs">
      {isStaffOrAdmin && isPending && (
        <>
          <Button size="xs" color="green" onClick={handleApprove} disabled={actionLoading} loading={actionLoading}>
            Approve
          </Button>
          <Button size="xs" color="red" variant="light" onClick={handleReject} disabled={actionLoading} loading={actionLoading}>
            Reject
          </Button>
        </>
      )}
      {isStaffOrAdmin && isApproved && (
        <>
          <Button size="xs" color="blue" variant="light" onClick={() => setEditModalOpen(true)} disabled={actionLoading}>
            Edit
          </Button>
          <Button size="xs" color="red" onClick={handleDelete} disabled={actionLoading} loading={actionLoading}>
            Delete
          </Button>
        </>
      )}
      {canCancel && (
        <Tooltip label="Cancel pending reservation">
          <Button size="xs" color="red" variant="outline" onClick={handleCancel} disabled={cancelLoading} loading={cancelLoading}>
            Cancel
          </Button>
        </Tooltip>
      )}
    </Group>
    </>
  );
}