import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from "expo-router";
import { useEffect } from "react";
import "../global.css";

export default function RootLayout() {
  const queryClient = new QueryClient();

  useEffect(() => {
    const hideNavigationBar = async () => {
      await NavigationBar.setVisibilityAsync('hidden');
      await NavigationBar.setBehaviorAsync('overlay-swipe');
    };

    const showNavigationBar = async () => {
      await NavigationBar.setVisibilityAsync('visible');
      await NavigationBar.setBehaviorAsync('inset-swipe');
    };

    hideNavigationBar();
    return () => {
      showNavigationBar();
    };
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  )
}
