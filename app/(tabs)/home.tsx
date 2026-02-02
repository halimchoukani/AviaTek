import PilotCard from "@/components/PilotCard";
import StatsCard from "@/components/StatsCard";
import { PILOTS } from "@/constant/Pilots";

import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <FontAwesome5 name="building" size={20} color="#C9A961" />
            </View>
            <View>
              <Text style={styles.academyName}
                onPress={() => router.push("/profile")}>
                Horizon Academy
              </Text>
              <Text style={styles.administrationText}>
                Administration
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.chevronButton} >
            <Feather name="chevron-right" size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatsCard label="Total" value="142" />
          <StatsCard label="Active" value="118" valueColor="text-secondary" />
          <StatsCard label="Pending" value="24" />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.addPilotButton}>
            <Feather name="user-plus" size={24} color="#020617" />
            <Text style={styles.addPilotText}>Add Pilot</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.accessLogsButton}>
            <MaterialCommunityIcons name="shield-alert" size={24} color="#ffffff" />
            <Text style={styles.accessLogsText}>Access Logs</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search by name or license ID..."
            placeholderTextColor="#64748B"
            style={styles.searchInput}
          />
        </View>

        {/* List Title */}
        <Text style={styles.listTitle}>
          Pilot Roster
        </Text>

        {/* List */}
        <FlatList
          data={PILOTS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <PilotCard pilot={item} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoContainer: {
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "#334155",
  },
  academyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  administrationText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#C9A961",
  },
  chevronButton: {
    padding: 8,
  },
  statsRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 12,
  },
  actionRow: {
    marginTop: 24,
    flexDirection: "row",
    gap: 16,
  },
  addPilotButton: {
    flex: 1,
    height: 80,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#C9A961",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  addPilotText: {
    marginTop: 4,
    fontWeight: "bold",
    color: "#020617",
  },
  accessLogsButton: {
    flex: 1,
    height: 80,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "#334155",
  },
  accessLogsText: {
    marginTop: 4,
    fontWeight: "500",
    color: "#ffffff",
  },
  searchBar: {
    marginTop: 24,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#334155",
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
  },
  listTitle: {
    marginTop: 24,
    marginBottom: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 1.25,
  },
  listContent: {
    paddingBottom: 20,
    gap: 12,
  },
});





