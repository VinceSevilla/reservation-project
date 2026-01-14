import { Card, Title, Text, Container, Box } from '@mantine/core';

export default function AdminPage() {
  return (
    <Container size="xl" fluid>
      <Box mb="xl">
        <Title order={1} fw={700} size="h2" mb="xs">
          Admin Panel
        </Title>
        <Text c="dimmed" size="md">
          Manage users, rooms, and system settings.
        </Text>
      </Box>

      <Card withBorder shadow="sm" p="xl" radius="md">
        <Text size="lg" fw={500} mb="md">
          Admin Dashboard
        </Text>
        <Text c="dimmed">
          Admin features coming soon. You can manage rooms from the Rooms page.
        </Text>
      </Card>
    </Container>
  );
}
