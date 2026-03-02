import RequestCard from "@/components/RequestCard";
import StatsCard from "@/components/StatsCard";
import { getAllRequestsForAcademy, getRequestsByStatus, updateRequestStatus } from "@/lib/api/requests";
import { getCurrentUser } from "@/lib/appwrite";
import { RequestStatus } from "@/lib/types";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RequestsScreen() {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Queries
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });

  const { data: requests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['requests', user?.$id, activeFilter],
    queryFn: () => {
      if (activeFilter === "All") {
        return getAllRequestsForAcademy(user!.prefs.academyId);
      } else {
        return getRequestsByStatus(user!.prefs.academyId, activeFilter.toLowerCase() as RequestStatus);
      }
    },
    enabled: !!user?.prefs.academyId,
    refetchInterval: 2000,

  });

  // Mutations
  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string, status: RequestStatus }) => updateRequestStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
    onError: (error) => {
      console.error("Error updating request status:", error);
    }
  });

  const stats = {
    total: requests.length,
    approved: requests.filter(r => r.status === RequestStatus.Approved).length,
    pending: requests.filter(r => r.status === RequestStatus.Pending).length,
  };

  const handleApprove = (id: string) => {
    updateStatus({ id, status: RequestStatus.Approved });
  };

  const handleReject = (id: string) => {
    updateStatus({ id, status: RequestStatus.Rejected });
  };

  if (userLoading || requestsLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#C9A961" />
        </View>
      </SafeAreaView>
    );
  }


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
              <Text style={styles.pendingBadgeText}>{stats.pending} Pending</Text>
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
          data={requests}
          keyExtractor={(item) => (item as any).$id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <RequestCard
              request={{
                id: item.$id,
                name: (item as any).pilotName || "Unknown Pilot",
                rank: (item as any).pilotRank || "",
                licenseId: (item as any).pilotLicense || "",
                status: (item.status.charAt(0).toUpperCase() + item.status.slice(1)) as any,
                type: (item as any).type || "Initial",
                sessionType: (item as any).sessionType || "",
                aircraft: (item as any).equipmentId || "N/A",
                aircraftId: item.equipmentId,
                duration: `${item.hours}h`,
                requestedDate: new Date(item.startDate).toLocaleDateString(),
                reason: item.note,
                $createdAt: item.$createdAt,
                preferredTimes: item.preferredTimes,
              } as any}



              expanded={expandedId === item.$id}
              onToggle={() =>
                setExpandedId(expandedId === item.$id ? null : item.$id)
              }
              onApprove={() => handleApprove(item.$id)}
              onReject={() => handleReject(item.$id)}

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