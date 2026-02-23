import { useEffect } from "react";
import { router } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { signOut } from "@/lib/appwrite";

import { signOut } from "@/lib/appwrite";

export default function Exit() {
  useEffect(() => {
    const logout = async () => {
      try {
        // 🔥 destroy Appwrite session
        await signOut();

        // redirect to login
        router.replace("/(auth)/sign-in");
      } catch (error) {
        console.log("Logout error:", error);
      }
    };

    logout();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
