import SessionCard from "@/components/SessionCard";
import { getSchedulesByPilot } from "@/lib/api/schedules";
import { getCurrentUser } from "@/lib/appwrite";
import { ScheduleDocument } from "@/lib/types";
import { Feather } from "@expo/vector-icons";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabFilter = "upcoming" | "past";

export default function SessionsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabFilter>("upcoming");

    const { data: user } = useSuspenseQuery({
        queryKey: ["currentUser"],
        queryFn: () => getCurrentUser(),
    });

    const {
        data: schedules = [],
        isLoading,
    } = useQuery({
        queryKey: ["pilotSchedules", user?.$id],
        queryFn: () => getSchedulesByPilot(user!.$id),
        enabled: !!user?.$id,
        refetchInterval: 5000,
    });

    const now = new Date();

    const { upcoming, past } = useMemo(() => {
        const up: ScheduleDocument[] = [];
        const pa: ScheduleDocument[] = [];

        schedules.forEach((s) => {
            const endTime = new Date(s.endTime);
            if (endTime > now) {
                up.push(s);
            } else {
                pa.push(s);
            }
        });

        // Upcoming: nearest first
        up.sort(
            (a, b) =>
                new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );

        // Past: most recent first
        pa.sort(
            (a, b) =>
                new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );

        return { upcoming: up, past: pa };
    }, [schedules]);

    const activeData = activeTab === "upcoming" ? upcoming : past;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>

                    <View style={styles.titleWrapper}>
                        <Text style={styles.headerTitle}>My Sessions</Text>
                        <Text style={styles.headerSubtitle}>CONFIRMED TRAINING</Text>
                    </View>
                </View>

                {/* Tab Switcher */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === "upcoming" && styles.tabActive,
                        ]}
                        onPress={() => setActiveTab("upcoming")}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === "upcoming" && styles.tabTextActive,
                            ]}
                        >
                            Upcoming ({upcoming.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === "past" && styles.tabActive,
                        ]}
                        onPress={() => setActiveTab("past")}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === "past" && styles.tabTextActive,
                            ]}
                        >
                            Past ({past.length})
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#C9A961" />
                        <Text style={styles.loadingText}>Loading sessions...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={activeData}
                        keyExtractor={(item) => item.$id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <SessionCard
                                schedule={item as any}
                                isPast={activeTab === "past"}
                            />
                        )}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <View style={styles.emptyIconContainer}>
                                    <Feather
                                        name={activeTab === "upcoming" ? "calendar" : "archive"}
                                        size={40}
                                        color="#334155"
                                    />
                                </View>
                                <Text style={styles.emptyTitle}>
                                    {activeTab === "upcoming"
                                        ? "No Upcoming Sessions"
                                        : "No Past Sessions"}
                                </Text>
                                <Text style={styles.emptySubtitle}>
                                    {activeTab === "upcoming"
                                        ? "Your approved training sessions will appear here"
                                        : "Completed training sessions will appear here"}
                                </Text>
                            </View>
                        }
                    />
                )}
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
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    titleWrapper: {
        marginLeft: 8,
    },
    headerTitle: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "bold",
    },
    headerSubtitle: {
        color: "#C9A961",
        fontSize: 12,
        fontWeight: "bold",
        marginTop: 2,
        letterSpacing: 1,
    },
    tabContainer: {
        flexDirection: "row",
        backgroundColor: "#0F172A",
        borderRadius: 12,
        padding: 4,
        marginTop: 8,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },
    tabActive: {
        backgroundColor: "#C9A961",
    },
    tabText: {
        color: "#64748B",
        fontSize: 14,
        fontWeight: "600",
    },
    tabTextActive: {
        color: "#000000",
        fontWeight: "bold",
    },
    listContent: {
        paddingBottom: 100,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        color: "#64748B",
        marginTop: 12,
        fontSize: 14,
    },
    emptyContainer: {
        alignItems: "center",
        marginTop: 80,
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#1E293B",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#334155",
    },
    emptyTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    emptySubtitle: {
        color: "#64748B",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 20,
    },
});
