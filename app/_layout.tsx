import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from "expo-router";
import { useEffect } from "react";
import "../global.css";
export default function RootLayout() {
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
  return <Stack screenOptions={{ headerShown: false }} />;
}
