import { useEffect, useMemo, useState } from 'react';
import { Card, Group, Loader, Modal, Button, Text, Stack, Center, Container, Box, Title } from '@mantine/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg, EventClickArg } from '@fullcalendar/interaction';
import { supabase } from '../supabase';
import type { Reservation } from '../types/reservation';
import { ReservationStatusBadge } from '../components/ReservationStatusBadge';
import { useAuth } from '../context/useAuth';
import { useRole } from '../hooks/useRole';
import { isStudent } from '../types/roles';
import { useCancelReservation } from '../features/reservations/useCancelReservation';
import { canCancelReservation } from '../utils/reservations';
import { useNavigate } from 'react-router-dom';

const statusColor: Record<Reservation['status'], string> = {
  approved: '#2f9e44',
  pending: '#f59f00',
  rejected: '#fa5252',
  cancelled: '#868e96',
};

export default function CalendarPage() {
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selected, setSelected] = useState<Reservation | null>(null);
  const { user } = useAuth();
  const { role } = useRole();
  const { cancel, loading: canceling } = useCancelReservation();
  const navigate = useNavigate();

  const events = useMemo(() => reservations.map((r) => ({
    id: r.id,
    title: r.title,
    start: r.start_time,
    end: r.end_time,
    backgroundColor: statusColor[r.status],
    borderColor: statusColor[r.status],
    extendedProps: r,
  })), [reservations]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .gte('start_time', new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString())
        .lte('end_time', new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString());
      if (error) {
        console.error(error);
        setReservations([]);
      } else {
        setReservations(data as Reservation[]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const onDateClick = (arg: DateClickArg) => {
    if (isStudent(role)) navigate(`/create-reservation?start=${encodeURIComponent(arg.date.toISOString())}`);
  };

  const onEventClick = (arg: EventClickArg) => {
    const r = arg.event.extendedProps as Reservation;
    setSelected(r);
  };

  const handleCancel = async () => {
    if (!selected) return;
    const confirmed = window.confirm('Cancel this pending reservation?');
    if (!confirmed) return;
    const res = await cancel(selected.id);
    if (res.success) {
      setReservations((prev) => prev.map((r) => (r.id === selected.id ? { ...r, status: 'cancelled' } : r)));
      setSelected((prev) => (prev ? { ...prev, status: 'cancelled' } : prev));
    } else {
      alert(res.error?.message ?? 'Failed to cancel reservation.');
    }
  };

  if (loading) return <Center h={500}><Loader size="lg" /></Center>;

  return (
    <Container size="xl" fluid>
      <Box mb="xl">
        <Title order={1} fw={700} size="h2" mb="xs">
          Calendar
        </Title>
        <Text c="dimmed" size="md">
          View all reservations in calendar format.
        </Text>
      </Box>

      <Card withBorder shadow="sm" p="lg" radius="md">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          buttonText={{
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day',
          }}
          weekends
          events={events}
          eventClick={onEventClick}
          dateClick={onDateClick}
          height="auto"
          eventTextColor="#fff"
          dayMaxEventRows={3}
        />
      </Card>

      <Modal
        opened={!!selected}
        onClose={() => setSelected(null)}
        title={<Text fw={600} size="lg">Reservation Details</Text>}
        size="md"
        centered
      >
        {selected && (
          <Stack gap="md">
            <Box>
              <Text size="sm" c="dimmed" mb={4}>Title</Text>
              <Text fw={600} size="lg">{selected.title}</Text>
            </Box>
            <Box>
              <Text size="sm" c="dimmed" mb={4}>Time</Text>
              <Text size="md">
                {new Date(selected.start_time).toLocaleString()} — {new Date(selected.end_time).toLocaleString()}
              </Text>
            </Box>
            <Box>
              <Text size="sm" c="dimmed" mb={4}>Status</Text>
              <ReservationStatusBadge status={selected.status} />
            </Box>
            <Group justify="space-between" mt="md">
              <Button size="sm" variant="light" onClick={() => navigate('/reservations')}>
                View All
              </Button>
              <Button
                size="sm"
                color="red"
                variant="light"
                onClick={handleCancel}
                disabled={!canCancelReservation(user?.id, selected) || canceling}
                loading={canceling}
              >
                Cancel Reservation
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}