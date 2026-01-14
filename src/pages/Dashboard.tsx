import { useEffect, useState } from 'react';
import { Card, Loader, SimpleGrid, Text, Title, Center, Container, Box } from '@mantine/core';
import { supabase } from '../supabase';
import { useRole } from '../hooks/useRole';
import { useAuth } from '../context/useAuth';
import { ROLE } from '../types/roles';

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card withBorder shadow="sm" p="xl" radius="md">
      <Text size="sm" c="dimmed" fw={500} mb="xs" tt="uppercase">
        {label}
      </Text>
      <Title order={2} fw={700} size="h1">
        {value}
      </Title>
    </Card>
  );
}

export default function Dashboard() {
  const { role, loading: roleLoading } = useRole();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ rooms: 0, reservations: 0, pending: 0, today: 0, upcoming: 0 });

  useEffect(() => {
    const load = async () => {
      if (roleLoading) return;
      setLoading(true);

      if (role === ROLE.Admin) {
        const [rooms, reservations, pending] = await Promise.all([
          supabase.from('rooms').select('id', { count: 'exact', head: true }),
          supabase.from('reservations').select('id', { count: 'exact', head: true }),
          supabase.from('reservations').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        ]);
        setStats({ rooms: rooms.count ?? 0, reservations: reservations.count ?? 0, pending: pending.count ?? 0, today: 0, upcoming: 0 });
      }

      if (role === ROLE.Student && user?.id) {
        const { count } = await supabase.from('reservations').select('id', { count: 'exact', head: true })
          .eq('user_id', user.id).gt('start_time', new Date().toISOString());
        setStats(s => ({ ...s, upcoming: count ?? 0 }));
      }

      setLoading(false);
    };
    load();
  }, [role, roleLoading, user?.id]);

  if (roleLoading || loading) return <Center h={500}><Loader size="lg" /></Center>;

  return (
    <Container size="xl" fluid>
      <Box mb="xl">
        <Title order={1} fw={700} size="h2" mb="xs">
          Dashboard
        </Title>
        <Text c="dimmed" size="md">
          Welcome back! Here's your overview.
        </Text>
      </Box>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {role === ROLE.Admin && (
          <>
            <StatCard label="Total Rooms" value={stats.rooms} />
            <StatCard label="Total Reservations" value={stats.reservations} />
            <StatCard label="Pending Approvals" value={stats.pending} />
          </>
        )}
        {role === ROLE.Student && <StatCard label="My Upcoming Reservations" value={stats.upcoming} />}
      </SimpleGrid>
    </Container>
  );
}

