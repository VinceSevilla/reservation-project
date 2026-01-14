import { Loader, Center } from '@mantine/core';
import { Navigate } from 'react-router-dom';
import { useRole } from '../hooks/useRole';
import type { Role } from '../types/roles';

type Props = {
  allowedRoles: Role[];
  children: React.ReactNode;
};

export default function RoleRoute({ allowedRoles, children }: Props) {
  const { role, loading } = useRole();

  if (loading) return <Center h={200}><Loader /></Center>;

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
