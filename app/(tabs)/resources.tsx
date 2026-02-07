import { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PersonnelView from "@/components/PersonnelView";
import MaterielView from "../../components/MaterielView";

const STAFF_DATA = [
  {
    id: 1,
    name: "Capt. Sarah Chen",
    role: "ATPL-9921",
    tags: ["CFI", "MEI"],
    status: "ON DUTY",
    hours: "4,250",
    location: "C172-N9283",
  },
  {
    id: 2,
    name: "FO. Marcus Rodriguez",
    role: "CPL-4421",
    tags: ["CFI"],
    status: "AVAILABLE",
    hours: "1,850",
    location: null,
  },
  {
    id: 3,
    name: "Capt. James Wilson",
    role: "ATPL-1102",
    tags: ["CFII", "MEI"],
    status: "OFF DUTY",
    hours: "5,100",
    location: null,
  },
  {
    id: 4,
    name: "FO. Elena Popov",
    role: "CPL-3391",
    tags: ["IR"],
    status: "ON DUTY",
    hours: "950",
    location: "Sim-01",
  },
];

export default function Resources() {
  const [activeTab, setActiveTab] = useState<"personnel" | "materiel">("personnel");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.safeContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Resource Management
          </Text>
          <Text style={styles.headerSubtitle}>
            Academy Operations
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab("personnel")}
            style={[
              styles.tab,
              activeTab === "personnel" ? styles.tabActive : styles.tabInactive
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "personnel" ? styles.tabTextActive : styles.tabTextInactive
              ]}
            >
              Personnel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("materiel")}
            style={[
              styles.tab,
              activeTab === "materiel" ? styles.tabActive : styles.tabInactive
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "materiel" ? styles.tabTextActive : styles.tabTextInactive
              ]}
            >
              Materiel
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {activeTab === "personnel" ? (
            <PersonnelView />
          ) : (
            <MaterielView />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  safeContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  header: {
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#C9A961",
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
    marginBottom: 24,
  },
  tab: {
    paddingBottom: 12,
    marginRight: 32,
    borderBottomWidth: 2,
  },
  tabActive: {
    borderBottomColor: "#C9A961",
  },
  tabInactive: {
    borderBottomColor: "transparent",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#C9A961",
  },
  tabTextInactive: {
    color: "#9CA3AF",
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    backgroundColor: "#1E293B",
    padding: 16,
    borderRadius: 12,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  statsLabel: {
    color: "#94A3B8",
    fontSize: 12,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  listContainer: {
    gap: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#1E293B",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
  },
  badgeAvailable: {
    borderColor: "rgba(6, 78, 59, 0.3)",
    backgroundColor: "rgba(6, 78, 59, 0.1)",
  },
  badgeDefault: {
    borderColor: "#374151",
    backgroundColor: "rgba(17, 24, 39, 0.5)",
  },
  badgeContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: "#020617",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#D1D5DB",
  },
  cardFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    color: "#94A3B8",
  },
  textSecondary: {
    color: "#C9A961",
  },
  textGreen: {
    color: "#22C55E",
  },
  textGray: {
    color: "#6B7280",
  },
  bgSecondary: {
    backgroundColor: "#C9A961",
  },
  bgGreen: {
    backgroundColor: "#22C55E",
  },
  bgGray: {
    backgroundColor: "#6B7280",
  },
});
