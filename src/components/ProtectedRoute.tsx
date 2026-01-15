import { useAuth } from '../context/useAuth';
import { Navigate } from 'react-router-dom';
import { Loader, Center } from '@mantine/core';

type Props = { children: React.ReactNode };

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();

  console.log('ProtectedRoute - loading:', loading, 'user:', user?.email);

  if (loading) {
    console.log('ProtectedRoute showing loader');
    return <Center h="100vh"><Loader /></Center>;
  }

  if (!user) {
    console.log('ProtectedRoute redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  console.log('ProtectedRoute rendering children');
  return <>{children}</>;
}
