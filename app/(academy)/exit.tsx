import { signOut } from "@/lib/appwrite";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Exit() {
  useEffect(() => {
    const logout = async () => {
      try {
        await signOut();
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
