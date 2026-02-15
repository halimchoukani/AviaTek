import { COURSES_DATA } from "@/constant/Variables";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Courses() {
  const [activeTab, setActiveTab] = useState("Courses");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Training Center</Text>
            <Text style={styles.headerSubtitle}>Moodle LMS Integration</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="refresh" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.syncBadge}>
              <View style={styles.syncDot} />
              <Text style={styles.syncText}>SYNCED</Text>
            </View>
          </View>
        </View>

        {/* Filter Bar */}
        <View style={styles.filterBar}>
          {["Courses", "Certs", "Tests"].map((tab) => {
            const isActive = activeTab === tab;
            const counts: Record<string, number> = { Courses: 4, Certs: 4, Tests: 5 };
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.filterTab, isActive && styles.filterTabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <View style={styles.filterTabContent}>
                  {tab === "Courses" && <Feather name="book-open" size={16} color={isActive ? "#020617" : "#FFFFFF"} />}
                  {tab === "Certs" && <Feather name="award" size={16} color={isActive ? "#020617" : "#FFFFFF"} />}
                  {tab === "Tests" && <Feather name="clipboard" size={16} color={isActive ? "#020617" : "#FFFFFF"} />}
                  <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>{tab}</Text>
                  <View style={[styles.badgeContainer, isActive && styles.badgeContainerActive]}>
                    <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>{counts[tab]}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Create Course Button */}
        <TouchableOpacity style={styles.createButton}>
          <Feather name="plus" size={20} color="#020617" style={styles.createIcon} />
          <Text style={styles.createButtonText}>Create New Course</Text>
        </TouchableOpacity>

        {/* Course List */}
        <FlatList
          data={COURSES_DATA}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CourseCard course={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

function CourseCard({ course }: { course: typeof COURSES_DATA[0] }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.courseCode}>{course.code}</Text>
          <Text style={styles.courseTitle}>{course.title}</Text>
        </View>
        <Feather name="chevron-right" size={20} color="#64748B" />
      </View>

      <Text style={styles.courseDescription}>{course.description}</Text>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressValue}>{course.progress} %</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${course.progress}%`, backgroundColor: course.color },
            ]}
          />
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.enrollmentInfo}>
          <Feather name="users" size={14} color="#94A3B8" />
          <Text style={styles.enrollmentText}>{course.enrolled} enrolled</Text>
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{course.category}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#C9A961",
    marginTop: 4,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  syncBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginRight: 6,
  },
  syncText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#10B981",
  },
  filterBar: {
    flexDirection: "row",
    backgroundColor: "#0F172A",
    borderRadius: 12,
    padding: 6,
    marginBottom: 24,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  filterTabActive: {
    backgroundColor: "#C9A961",
  },
  filterTabContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  filterTabTextActive: {
    color: "#020617",
  },
  badgeContainer: {
    backgroundColor: "#334155",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeContainerActive: {
    backgroundColor: "rgba(2, 6, 23, 0.2)",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#94A3B8",
  },
  badgeTextActive: {
    color: "#020617",
  },
  createButton: {
    backgroundColor: "#C9A961",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 24,
  },
  createIcon: {
    marginRight: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#020617",
  },
  listContent: {
    paddingBottom: 24,
    gap: 16,
  },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  courseCode: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#C9A961",
    marginBottom: 4,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  courseDescription: {
    fontSize: 14,
    color: "#94A3B8",
    marginBottom: 20,
    lineHeight: 20,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  progressValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#020617",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  enrollmentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  enrollmentText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  categoryBadge: {
    backgroundColor: "#0F172A",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#64748B",
  },
});
