import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { PropsWithChildren } from 'react';
import type { MantineThemeOverride } from '@mantine/core';
import { AuthProvider } from './context/AuthContext';

const theme: MantineThemeOverride = {
  primaryColor: 'blue',
};

export function UIProvider({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <Notifications />
        {children}
      </MantineProvider>
    </AuthProvider>
  );
}