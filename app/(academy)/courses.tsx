import { getAcademyCourses, getAcademyStats } from "@/lib/api/courses";
import { getCurrentAcademy } from "@/lib/appwrite";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Courses() {
  const [activeTab, setActiveTab] = useState("Courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Fetch Academy ID
  const { data: academyId } = useSuspenseQuery({
    queryKey: ["academyId"],
    queryFn: getCurrentAcademy,
  });

  // Fetch Courses
  const {
    data: courses = [],
    isLoading: coursesLoading,
    refetch: refetchCourses
  } = useQuery({
    queryKey: ["courses", academyId],
    queryFn: () => getAcademyCourses(academyId!),
    enabled: !!academyId,
  });

  // Fetch Stats
  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats
  } = useQuery({
    queryKey: ["academyStats", academyId],
    queryFn: () => getAcademyStats(academyId!),
    enabled: !!academyId,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchCourses(), refetchStats()]);
    setRefreshing(false);
  };

  const filteredData = useMemo(() => {
    const data = Array.isArray(courses) ? courses : [];
    return data.filter((course) => {
      const courseCode = course.code || course.id || "";
      const matchesSearch =
        course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        courseCode.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeTab === "Courses") return matchesSearch;
      const progress = course.progress || 0;
      return matchesSearch;
    });
  }, [courses, searchQuery, activeTab]);

  const stats = [
    { label: "Courses", value: statsData?.coursesCount || "0", icon: "book-open" },
    { label: "Pilots", value: statsData?.pilotsCount || "0", icon: "users" },
    { label: "Instructors", value: statsData?.instructorsCount || "0", icon: "briefcase" },
  ];

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

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Feather name={stat.icon as any} size={16} color="#C9A961" />
              <View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses, codes..."
            placeholderTextColor="#64748B"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Feather name="x" size={18} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Bar */}
        <View style={styles.filterBar}>
          {["Courses"].map((tab) => {
            const isActive = activeTab === tab;
            const counts: Record<string, number> = {
              Courses: (courses as any[]).length,
            };
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.filterTab, isActive && styles.filterTabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <View style={styles.filterTabContent}>
                  <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>{tab}</Text>
                  <View style={[styles.badgeContainer, isActive && styles.badgeContainerActive]}>
                    <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>{counts[tab]}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Course List */}
        {coursesLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#C9A961" />
            <Text style={styles.loadingText}>Loading training data...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id || item._id}
            renderItem={({ item }) => <CourseCard course={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C9A961" />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Feather name="book-open" size={48} color="#1E293B" />
                <Text style={styles.emptyStateTitle}>
                  {searchQuery ? "No results found" : "No courses available"}
                </Text>
                <Text style={styles.emptyStateText}>
                  {searchQuery ? "Try adjusting your search or filters" : "New courses will appear here"}
                </Text>
              </View>
            }
          />
        )}
      </View>


    </SafeAreaView>
  );
}

function CourseCard({ course }: { course: any }) {
  const courseCode = course.code || course.id || "N/A";
  const progress = course.progress || 0;
  const enrolled = course.enrolled || course.studentsList?.length || 0;
  const category = course.category || course.programId || "General";
  const color = course.color || "#C9A961";

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.thumbnailContainer}>
          <View style={[styles.thumbnailOverlay, { backgroundColor: color + "20" }]} />
          <MaterialCommunityIcons
            name={courseCode.includes("PPL") ? "airplane" : "book-open-variant"}
            size={32}
            color={color}
          />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.courseCode}>{courseCode}</Text>
          <Text style={styles.courseTitle}>{course.title}</Text>
        </View>
        <Feather name="chevron-right" size={20} color="#64748B" />
      </View>

      <Text style={styles.courseDescription}>{course.description}</Text>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Current Progress</Text>
          <Text style={styles.progressValue}>{progress}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progress}%`, backgroundColor: color },
            ]}
          />
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.footerInfo}>
          <View style={styles.enrollmentInfo}>
            <Feather name="users" size={14} color="#94A3B8" />
            <Text style={styles.enrollmentText}>{enrolled} enrolled</Text>
          </View>
          <View style={styles.dotSeparator} />
          <Text style={styles.instructorText}>Aviatek Academy</Text>
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{category}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 10,
    color: "#64748B",
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
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
    padding: 4,
    marginBottom: 20,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
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
    color: "#64748B",
  },
  filterTabTextActive: {
    color: "#020617",
  },
  badgeContainer: {
    backgroundColor: "#1E293B",
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
  listContent: {
    paddingBottom: 100,
    gap: 16,
  },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  thumbnailContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  thumbnailOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerText: {
    flex: 1,
  },
  courseCode: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#C9A961",
    marginBottom: 2,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  courseTitle: {
    fontSize: 17,
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
    fontWeight: "800",
    color: "#FFFFFF",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#020617",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
  footerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#334155",
  },
  instructorText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  enrollmentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  enrollmentText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  categoryBadge: {
    backgroundColor: "rgba(201, 169, 97, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#C9A961",
    textTransform: "uppercase",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#C9A961",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  emptyStateText: {
    fontSize: 14,
    color: "#64748B",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    color: "#C9A961",
    fontSize: 14,
    fontWeight: "600",
  },
});
