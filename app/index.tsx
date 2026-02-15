import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCurrentUser, getCurrentUserRole } from "../lib/appwrite";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await getCurrentUser();
        if (res) {
          setIsLoggedIn(true);
          const userRole = await getCurrentUserRole();
          setRole(userRole);
        } else {
          setIsLoggedIn(false);
          setRole(null);
        }
      } catch (error) {
        console.error("Error checking user:", error);
        setIsLoggedIn(false);
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView className="bg-primary h-full flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#C9A961" />
      </SafeAreaView>
    );
  }

  if (!isLoggedIn) {
    return <Redirect href={"/sign-in" as any} />;
  }
  if (role === "pilot") {
    return <Redirect href="/(pilot)/home" />;
  }
  return <Redirect href="/(academy)/home" />;
}
