import { useEffect, useState } from 'react';
import { Card, Table, Group, Text, Loader, Center } from '@mantine/core';
import { supabase } from '../supabase';
import type { Reservation } from '../types/reservation';
import { ReservationStatusBadge } from '../components/ReservationStatusBadge';
import { ReservationActions } from '../components/ReservationActions';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) {
      console.error(error);
      setReservations([]);
    } else {
      setReservations(data as Reservation[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancelled = (id: string) => {
    setReservations((prev) => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
  };

  const handleStatusChanged = (id: string, status: 'approved' | 'rejected') => {
    setReservations((prev) => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const handleDeleted = (id: string) => {
    setReservations((prev) => prev.filter(r => r.id !== id));
  };

  const handleUpdated = (id: string, updates: Partial<Reservation>) => {
    setReservations((prev) => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  if (loading) {
    return <Center h={200}><Loader /></Center>;
  }

  if (!reservations.length) {
    return (
      <Card p="lg"><Text c="dimmed">No reservations found.</Text></Card>
    );
  }

  return (
    <Card p="lg">
      <Table withTableBorder withColumnBorders verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>Start</Table.Th>
            <Table.Th>End</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {reservations.map((r) => (
            <Table.Tr key={r.id}>
              <Table.Td>{r.title}</Table.Td>
              <Table.Td>{new Date(r.start_time).toLocaleString()}</Table.Td>
              <Table.Td>{new Date(r.end_time).toLocaleString()}</Table.Td>
              <Table.Td><ReservationStatusBadge status={r.status} /></Table.Td>
              <Table.Td><ReservationActions reservation={r} onCancelled={handleCancelled} onStatusChanged={handleStatusChanged} onDeleted={handleDeleted} onUpdated={handleUpdated} /></Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}