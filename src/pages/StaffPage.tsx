import { Card, Title, Text, Container, Box } from '@mantine/core';

export default function StaffPage() {
  return (
    <Container size="xl" fluid>
      <Box mb="xl">
        <Title order={1} fw={700} size="h2" mb="xs">
          Staff Panel
        </Title>
        <Text c="dimmed" size="md">
          Approve or reject pending reservations.
        </Text>
      </Box>

      <Card withBorder shadow="sm" p="xl" radius="md">
        <Text size="lg" fw={500} mb="md">
          Staff Dashboard
        </Text>
        <Text c="dimmed">
          Staff features coming soon. Pending reservations will appear here for approval.
        </Text>
      </Card>
    </Container>
  );
}
