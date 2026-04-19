import { getAcademyById } from "@/lib/api/academies";
import { getCurrentUser } from "@/lib/appwrite";
import { getSchedulesByPilot } from "@/lib/api/schedules";
import { AcademyDocument, PilotDocument, ScheduleDocument } from "@/lib/types";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { format } from "date-fns/format";
import { isAfter } from "date-fns/isAfter";
import { parseISO } from "date-fns/parseISO";
import { signOut } from "@/lib/api/auth";

export default function PilotHome() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [refreshing, setRefreshing] = useState(false);

    const { data: user, isLoading: isFetchingUser, refetch: refetchUser } = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => getCurrentUser() as unknown as Promise<PilotDocument>,
    })

    const { data: academy, isLoading: isFetchingAcademy, refetch: refetchAcademy } = useQuery({
        queryKey: ["academy", user?.$id],
        queryFn: async () => {
            if (!user) return null;
            const academyId = user.academy || user.prefs?.academyId;
            if (academyId) {
                return await getAcademyById(academyId) as unknown as AcademyDocument;
            }
            return null;
        },
        enabled: !!user,
    })

    const { data: schedules = [], isLoading: isFetchingSchedules, refetch: refetchSchedules } = useQuery({
        queryKey: ["pilot-schedules", user?.$id],
        queryFn: () => getSchedulesByPilot(user?.$id as string),
        enabled: !!user,
    })

    const onRefresh = async () => {
        setRefreshing(true);
        await Promise.all([refetchUser(), refetchAcademy(), refetchSchedules()]);
        setRefreshing(false);
    };

    const handleLogout = async () => {
        Alert.alert("Logout", "Are you sure you want to sign out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    await signOut();
                    router.replace("/(auth)/sign-in");
                }
            }
        ]);
    };

    const upcomingSessions = schedules
        .filter(s => isAfter(parseISO(s.startTime), new Date()))
        .sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime());

    const nextSession = upcomingSessions[0];

    if (isFetchingUser || isFetchingAcademy) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#C9A961" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C9A961" />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.welcomeText}>System Ready</Text>
                        <Text style={styles.userName}>{user?.name ? `${user.name} ${user.lastname}` : "Capt. Pilot"}</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.notificationBtn} onPress={() => router.push("/notifications")}>
                            <Feather name="bell" size={20} color="#FFFFFF" />
                            <View style={styles.notificationDot} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.notificationBtn} onPress={handleLogout}>
                            <Feather name="log-out" size={20} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Main Card: Pilot Status & Academy */}
                <View style={styles.mainCard}>
                    <View style={styles.mainCardTop}>
                        <View style={styles.rankContainer}>
                            <MaterialCommunityIcons name="shield-airplane" size={24} color="#C9A961" />
                            <Text style={styles.rankText}>{user?.rank || "Student Pilot"}</Text>
                        </View>
                        <View style={styles.activeBadge}>
                            <View style={styles.activeDot} />
                            <Text style={styles.activeText}>ON DUTY</Text>
                        </View>
                    </View>

                    <Text style={styles.academyNameMain}>{academy?.name || "Independent Pilot"}</Text>
                    <View style={styles.cardDivider} />

                    <View style={styles.cardFooter}>
                        <View>
                            <Text style={styles.footerLabel}>LICENSE</Text>
                            <Text style={styles.footerValue}>{user?.licenseNumber || "N/A"}</Text>
                        </View>
                        <View style={styles.hoursBadge}>
                            <Feather name="clock" size={14} color="#C9A961" />
                            <Text style={styles.hoursValue}>{user?.flightHours || 0}h Total</Text>
                        </View>
                    </View>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Feather name="map" size={18} color="#C9A961" />
                        <Text style={styles.statNum}>12</Text>
                        <Text style={styles.statDetail}>Destinations</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Feather name="shield" size={18} color="#C9A961" />
                        <Text style={styles.statNum}>100%</Text>
                        <Text style={styles.statDetail}>Safety Score</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Feather name="activity" size={18} color="#C9A961" />
                        <Text style={styles.statNum}>{upcomingSessions.length}</Text>
                        <Text style={styles.statDetail}>Upcoming</Text>
                    </View>
                </View>

                {/* Next Flight / Session */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Next Deployment</Text>
                </View>

                {nextSession ? (
                    <TouchableOpacity
                        style={styles.nextSessionCard}
                        onPress={() => router.push("/(pilot)/sessions")}
                    >
                        <View style={styles.sessionTimeContainer}>
                            <Text style={styles.sessionMonth}>{format(parseISO(nextSession.startTime), "MMM")}</Text>
                            <Text style={styles.sessionDay}>{format(parseISO(nextSession.startTime), "dd")}</Text>
                        </View>
                        <View style={styles.sessionDetails}>
                            <Text style={styles.sessionTitleText}>{nextSession.sessionType}</Text>
                            <Text style={styles.sessionSubText}>
                                {format(parseISO(nextSession.startTime), "HH:mm")} • {(nextSession as any).equipmentName}
                            </Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#475569" />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.emptyCard}>
                        <MaterialCommunityIcons name="calendar-blank" size={32} color="#475569" />
                        <Text style={styles.emptyText}>No upcoming sessions scheduled</Text>
                        <TouchableOpacity style={styles.bookBtn} onPress={() => router.push("../request-training")}>
                            <Text style={styles.bookBtnText}>Request Session</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Quick Actions */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Fast Access</Text>
                </View>

                <View style={styles.actionGrid}>
                    <TouchableOpacity style={styles.actionItem} onPress={() => router.push("/(pilot)/requests")}>
                        <View style={styles.actionIconBg}>
                            <Feather name="file-text" size={22} color="#FFFFFF" />
                        </View>
                        <Text style={styles.actionLabel}>Pending</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionItemMain} onPress={() => router.push("../request-training")}>
                        <View style={styles.actionIconBgMain}>
                            <MaterialCommunityIcons name="plus-circle" size={28} color="#020617" />
                        </View>
                        <Text style={styles.actionLabelMain}>Book</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionItem} onPress={() => router.push("/(pilot)/profile")}>
                        <View style={styles.actionIconBg}>
                            <Feather name="settings" size={22} color="#FFFFFF" />
                        </View>
                        <Text style={styles.actionLabel}>Account</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#020617",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 32,
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    welcomeText: {
        color: "#C9A961",
        fontSize: 12,
        fontWeight: "900",
        textTransform: "uppercase",
        letterSpacing: 2,
    },
    userName: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 4,
    },
    notificationBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#1E293B",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
    },
    notificationDot: {
        position: "absolute",
        top: 14,
        right: 14,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#C9A961",
        borderWidth: 2,
        borderColor: "#1E293B",
    },
    mainCard: {
        backgroundColor: "#1E293B",
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "rgba(201, 169, 97, 0.2)",
        shadowColor: "#C9A961",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    mainCardTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    rankContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    rankText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
        textTransform: "uppercase",
    },
    activeBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#10B981",
        marginRight: 8,
    },
    activeText: {
        color: "#10B981",
        fontSize: 10,
        fontWeight: "900",
    },
    academyNameMain: {
        color: "#94A3B8",
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 24,
    },
    cardDivider: {
        height: 1,
        backgroundColor: "rgba(148, 163, 184, 0.1)",
        marginBottom: 24,
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    footerLabel: {
        color: "#64748B",
        fontSize: 10,
        fontWeight: "900",
        marginBottom: 4,
    },
    footerValue: {
        color: "#C9A961",
        fontSize: 16,
        fontWeight: "800",
    },
    hoursBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "rgba(201, 169, 97, 0.1)",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    hoursValue: {
        color: "#C9A961",
        fontSize: 12,
        fontWeight: "bold",
    },
    statsGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 32,
    },
    statCard: {
        width: '31%',
        backgroundColor: "#0F172A",
        borderRadius: 20,
        padding: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    statNum: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 8,
    },
    statDetail: {
        color: "#475569",
        fontSize: 10,
        fontWeight: "600",
        marginTop: 2,
    },
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitle: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "900",
        textTransform: "uppercase",
        letterSpacing: 1.5,
        opacity: 0.8,
    },
    nextSessionCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1E293B",
        borderRadius: 20,
        padding: 16,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: "rgba(148, 163, 184, 0.1)",
    },
    sessionTimeContainer: {
        width: 60,
        height: 60,
        backgroundColor: "rgba(201, 169, 97, 0.1)",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    sessionMonth: {
        color: "#C9A961",
        fontSize: 10,
        fontWeight: "900",
        textTransform: "uppercase",
    },
    sessionDay: {
        color: "#C9A961",
        fontSize: 22,
        fontWeight: "bold",
    },
    sessionDetails: {
        flex: 1,
    },
    sessionTitleText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    sessionSubText: {
        color: "#64748B",
        fontSize: 13,
        fontWeight: "500",
    },
    emptyCard: {
        backgroundColor: "rgba(30, 41, 59, 0.5)",
        borderRadius: 20,
        padding: 32,
        alignItems: "center",
        marginBottom: 32,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#334155",
    },
    emptyText: {
        color: "#64748B",
        fontSize: 14,
        marginTop: 12,
        marginBottom: 20,
        textAlign: "center",
    },
    bookBtn: {
        backgroundColor: "rgba(201, 169, 97, 0.1)",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(201, 169, 97, 0.2)",
    },
    bookBtnText: {
        color: "#C9A961",
        fontSize: 13,
        fontWeight: "bold",
    },
    actionGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    actionItem: {
        width: '30%',
        backgroundColor: "#1E293B",
        borderRadius: 20,
        padding: 16,
        alignItems: "center",
        height: 100,
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(148, 163, 184, 0.1)",
    },
    actionItemMain: {
        width: '34%',
        backgroundColor: "#C9A961",
        borderRadius: 24,
        padding: 20,
        alignItems: "center",
        height: 110,
        justifyContent: "center",
        shadowColor: "#C9A961",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    actionIconBg: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.05)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    actionIconBgMain: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: "rgba(2, 6, 23, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    actionLabel: {
        color: "#94A3B8",
        fontSize: 12,
        fontWeight: "700",
    },
    actionLabelMain: {
        color: "#020617",
        fontSize: 13,
        fontWeight: "900",
        textTransform: "uppercase",
    },
});
