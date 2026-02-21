import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { signOut } from "@/lib/appwrite";

export default function Exit() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Feather name="log-out" size={32} color="#EF4444" />
        </View>
        <Text style={styles.title}>Sign Out</Text>
        <Text style={styles.subtitle}>
          Are you sure you want to log out of your academy account?
        </Text>

        <TouchableOpacity
          onPress={handleLogout}
          disabled={isLoading}
          style={styles.logoutButton}
        >
          {isLoading ? (
            <ActivityIndicator color="#020617" />
          ) : (
            <>
              <Text style={styles.logoutText}>Confirm Logout</Text>
              <Feather name="arrow-right" size={18} color="#020617" />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          disabled={isLoading}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelText}>Stay Logged In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 24,
    padding: 32,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    color: "#020617",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    color: "#94A3B8",
    fontSize: 16,
    fontWeight: "500",
  },
});
