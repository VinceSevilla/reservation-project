import { useAuth } from '../context/useAuth';
import { Navigate } from 'react-router-dom';
import { Loader, Center } from '@mantine/core';

type Props = { children: React.ReactNode };

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) return <Center h="100vh"><Loader /></Center>;

  if (!user) return <Navigate to="/auth" replace />;

  return <>{children}</>;
}
