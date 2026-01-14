import { NavLink as MantineNavLink, Stack } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import { useRole } from '../hooks/useRole';
import { isAdmin, isStaff, isStudent } from '../types/roles';
import {
  IconHome,
  IconBuildingSkyscraper,
  IconCalendar,
  IconListDetails,
  IconPlus,
  IconTool,
  IconShield,
} from '@tabler/icons-react';

export default function Sidebar() {
  const { role, loading } = useRole();
  if (loading) return null;

  return (
    <Stack p="md" gap="xs">
      <MantineNavLink component={NavLink} to="/dashboard" label="Dashboard" leftSection={<IconHome size={16} />} />
      <MantineNavLink component={NavLink} to="/rooms" label="Rooms" leftSection={<IconBuildingSkyscraper size={16} />} />
      <MantineNavLink component={NavLink} to="/calendar" label="Reservation Calendar" leftSection={<IconCalendar size={16} />} />
      <MantineNavLink component={NavLink} to="/reservations" label="Reservations" leftSection={<IconListDetails size={16} />} />
      {isStudent(role) && (
        <MantineNavLink component={NavLink} to="/create-reservation" label="Create Reservation" leftSection={<IconPlus size={16} />} />
      )}
      {(isStaff(role) || isAdmin(role)) && (
        <MantineNavLink component={NavLink} to="/staff" label="Staff Panel" leftSection={<IconTool size={16} />} />
      )}
      {isAdmin(role) && (
        <MantineNavLink component={NavLink} to="/admin" label="Admin Panel" leftSection={<IconShield size={16} />} />
      )}
    </Stack>
  );
}
