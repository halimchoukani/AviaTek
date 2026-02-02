import RequestCard from "@/components/RequestCard";
import StatsCard from "@/components/StatsCard";
import { MOCK_REQUESTS } from "@/constant/Variables";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function RequestsScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>("0"); // Start with first expanded as per design

  const stats = {
    total: 5,
    approved: 1,
    pending: 3,
  };

  const filteredRequests = MOCK_REQUESTS.filter((req) => {
    if (activeFilter === "All") return true;
    return req.status === activeFilter;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Training Requests</Text>
              <Text style={styles.headerSubtitle}>Fleet Training Validation</Text>
            </View>
            <View style={styles.pendingBadge}>
              <Feather name="alert-circle" size={14} color="#F59E0B" />
              <Text style={styles.pendingBadgeText}>3 Pending</Text>
            </View>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsRow}>
            <StatsCard label="Total" value={stats.total.toString()} />
            <StatsCard
              label="Approved"
              value={stats.approved.toString()}
            />
            <StatsCard
              label="Pending"
              value={stats.pending.toString()}
            />
          </View>

          {/* Filters */}
          <View style={styles.filtersRow}>
            {["All", "Pending", "Approved", "Rejected"].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  activeFilter === filter
                    ? styles.filterButtonActive
                    : styles.filterButtonInactive
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    activeFilter === filter ? styles.filterButtonTextActive : styles.filterButtonTextInactive
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
        <FlatList
          style={styles.list}
          data={filteredRequests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <RequestCard
              request={item}
              expanded={expandedId === item.id}
              onToggle={() =>
                setExpandedId(expandedId === item.id ? null : item.id)
              }
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F8FAFC",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#C9A961",
    marginTop: 4,
  },
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  pendingBadgeText: {
    color: "#F59E0B",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  statsRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 12,
  },
  filtersRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterButtonActive: {
    backgroundColor: "#C9A961",
    borderColor: "#C9A961",
  },
  filterButtonInactive: {
    backgroundColor: "#1E293B",
    borderColor: "#334155",
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "#020617",
    fontWeight: "bold",
  },
  filterButtonTextInactive: {
    color: "#94A3B8",
  },
  list: {
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 80,
  },
  separator: {
    height: 16,
  },
});



