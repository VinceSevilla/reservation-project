import { Card, Title, TextInput, Button, Stack, Text, Center, Loader, Select, Container, Box } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabase';
import { useAuth } from '../context/useAuth';

export default function CreateReservation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [roomId, setRoomId] = useState('');
  const [startTime, setStartTime] = useState(params.get('start') || '');
  const [endTime, setEndTime] = useState('');
  const [rooms, setRooms] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('rooms').select('id, name');
      setRooms(data || []);
      setRoomsLoading(false);
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      const { error: err } = await supabase.from('reservations').insert({
        user_id: user.id,
        room_id: roomId,
        title,
        start_time: startTime,
        end_time: endTime,
        status: 'pending',
      });
      if (err) throw err;
      navigate('/reservations');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (roomsLoading) return <Center h={500}><Loader size="lg" /></Center>;

  return (
    <Container size="sm">
      <Box mb="xl">
        <Title order={1} fw={700} size="h2" mb="xs">
          Create Reservation
        </Title>
        <Text c="dimmed" size="md">
          Fill in the details to book a room.
        </Text>
      </Box>

      <Card withBorder shadow="sm" p="xl" radius="md">
        {error && (
          <Text c="red" size="sm" mb="md" p="xs" style={{ backgroundColor: '#ffe0e0', borderRadius: '4px' }}>
            {error}
          </Text>
        )}
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Title"
              placeholder="e.g., Team Meeting"
              size="md"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              required
              styles={{ label: { fontWeight: 500, fontSize: '14px' } }}
            />
            <Select
              label="Room"
              placeholder="Select a room"
              size="md"
              data={rooms.map((r) => ({ value: r.id, label: r.name }))}
              value={roomId}
              onChange={(val) => setRoomId(val || '')}
              required
              styles={{ label: { fontWeight: 500, fontSize: '14px' } }}
            />
            <TextInput
              label="Start Time"
              type="datetime-local"
              size="md"
              value={startTime}
              onChange={(e) => setStartTime(e.currentTarget.value)}
              required
              styles={{ label: { fontWeight: 500, fontSize: '14px' } }}
            />
            <TextInput
              label="End Time"
              type="datetime-local"
              size="md"
              value={endTime}
              onChange={(e) => setEndTime(e.currentTarget.value)}
              required
              styles={{ label: { fontWeight: 500, fontSize: '14px' } }}
            />
            <Button type="submit" loading={loading} fullWidth size="md" mt="md">
              Create Reservation
            </Button>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}
