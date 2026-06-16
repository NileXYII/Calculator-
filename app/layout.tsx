import { Stack } from 'expo-router';
import { MD3 } from '../constants/theme';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: MD3.background },
        animation: 'fade',
      }}
    />
  );
}
