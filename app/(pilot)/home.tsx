import { getAcademyById } from "@/lib/api/academies";
import { getCurrentUser } from "@/lib/appwrite";
import { AcademyDocument, PilotDocument } from "@/lib/types";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PilotHome() {
    const router = useRouter();

    const { data: user, isFetching: isFetchingCurrentUser } = useSuspenseQuery({
        queryKey: ["currentUser"],
        queryFn: () => getCurrentUser() as unknown as Promise<PilotDocument>,
    })
    const { data: academy, isFetching: isFetchingAcademy } = useSuspenseQuery({
        queryKey: ["academy", user.academy],
        queryFn: () => getAcademyById(user.academy) as unknown as Promise<AcademyDocument>,
    })
    if (isFetchingCurrentUser || isFetchingAcademy) {
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
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.welcomeText}>Welcome back</Text>
                        <Text style={styles.userName}>{user?.name ? `Capt. ${user.name} ${user.lastname}` : "Capt. Pilot"}</Text>
                    </View>
                    <TouchableOpacity style={styles.notificationBtn}>
                        <Feather name="bell" size={24} color="#FFFFFF" />
                        <View style={styles.notificationDot} />
                    </TouchableOpacity>
                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.profileCardHeader}>
                        <View style={styles.planeIconContainer}>
                            <MaterialCommunityIcons name="airplane" size={24} color="#C9A961" />
                        </View>
                        <View style={styles.statusBadge}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>ACTIVE</Text>
                        </View>
                    </View>

                    <Text style={styles.profileName}>{user?.name ? `Capt. ${user.name} ${user.lastname}` : "Capt. Pilot"}</Text>
                    <Text style={styles.academyName}>{academy?.name || "No Academy Assigned"}</Text>

                    <View style={styles.divider} />

                    <View style={styles.licenseRow}>
                        <View>
                            <Text style={styles.licenseLabel}>License ID</Text>
                            <Text style={styles.licenseId}>{user?.licenseNumber || "ATPL-8842-US"}</Text>
                        </View>
                        <View style={styles.roleBadge}>
                            <Text style={styles.roleBadgeText}>PILOT</Text>
                        </View>
                    </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Feather name="clock" size={20} color="#C9A961" style={styles.statIcon} />
                        <Text style={styles.statValue}>{user?.flightHours || 247}</Text>
                        <Text style={styles.statLabel}>Hours</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Feather name="book-open" size={20} color="#C9A961" style={styles.statIcon} />
                        <Text style={styles.statValue}>3</Text>
                        <Text style={styles.statLabel}>Courses</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Feather name="award" size={20} color="#C9A961" style={styles.statIcon} />
                        <Text style={styles.statValue}>2</Text>
                        <Text style={styles.statLabel}>Certs</Text>
                    </View>
                </View>

                {/* Current Training */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Current Training</Text>
                    <TouchableOpacity style={styles.viewAllBtn}>
                        <Text style={styles.viewAllText}>View all</Text>
                        <Feather name="chevron-right" size={16} color="#C9A961" />
                    </TouchableOpacity>
                </View>

                <View style={styles.trainingCard}>
                    <View style={styles.trainingHeader}>
                        <Text style={styles.trainingTitle}>PPL Ground School</Text>
                        <Text style={styles.trainingPercent}>78%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: '78%' }]} />
                    </View>
                    <Text style={styles.trainingSub}>8 of 12 modules • Next: Air Law Pt. 2</Text>
                </View>

                {/* Navigation Grid */}
                <View style={styles.navGrid}>
                    <TouchableOpacity style={styles.navItem} onPress={() => router.push("/(pilot)/profile")}>
                        <View style={styles.navIconCircle}>
                            <Feather name="user" size={24} color="#FFFFFF" />
                        </View>
                        <Text style={styles.navLabel}>Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navItemActive} onPress={() => router.push("../request-training")}>
                        <View style={styles.navIconCircleActive}>
                            <Feather name="clipboard" size={24} color="#020617" />
                        </View>
                        <Text style={styles.navLabelActive}>Request</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navItem}>
                        <View style={styles.navIconCircle}>
                            <Feather name="bar-chart-2" size={24} color="#FFFFFF" />
                        </View>
                        <Text style={styles.navLabel}>Stats</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Alerts */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Alerts</Text>
                    <TouchableOpacity style={styles.viewAllBtn}>
                        <Text style={styles.viewAllText}>View all</Text>
                        <Feather name="chevron-right" size={16} color="#C9A961" />
                    </TouchableOpacity>
                </View>

                <View style={styles.alertCard}>
                    <View style={styles.alertIconCircleSuccess}>
                        <Feather name="check-circle" size={20} color="#10B981" />
                    </View>
                    <View style={styles.alertContent}>
                        <Text style={styles.alertTitle}>Training Request Approved</Text>
                        <Text style={styles.alertSub}>DA42 type rating — starts Feb 15</Text>
                    </View>
                    <Text style={styles.alertTime}>2h</Text>
                </View>

                <View style={styles.alertCard}>
                    <View style={styles.alertIconCircleWarning}>
                        <Feather name="alert-triangle" size={20} color="#F59E0B" />
                    </View>
                    <View style={styles.alertContent}>
                        <Text style={styles.alertTitle}>Medical Expiring Soon</Text>
                        <Text style={styles.alertSub}>Class 1 — Aug 20, 2025</Text>
                    </View>
                    <Text style={styles.alertTime}>5h</Text>
                </View>

                <View style={styles.footer}>
                    <View style={styles.systemStatusRow}>
                        <Text style={styles.systemStatusLabel}>System Status</Text>
                        <View style={styles.operationalBadge}>
                            <View style={styles.operationalDot} />
                            <Text style={styles.operationalText}>Operational</Text>
                        </View>
                    </View>
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
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 25,
    },
    welcomeText: {
        color: "#94A3B8",
        fontSize: 14,
    },
    userName: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 4,
    },
    notificationBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#1E293B",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    notificationDot: {
        position: "absolute",
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#EF4444",
        borderWidth: 2,
        borderColor: "#1E293B",
    },
    profileCard: {
        backgroundColor: "#1E293B",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: "#C9A961",
    },
    profileCardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    planeIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: "rgba(201, 169, 97, 0.1)",
        justifyContent: "center",
        alignItems: "center",
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(201, 169, 97, 0.1)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#C9A961",
        marginRight: 6,
    },
    statusText: {
        color: "#C9A961",
        fontSize: 10,
        fontWeight: "bold",
    },
    profileName: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 4,
    },
    academyName: {
        color: "#94A3B8",
        fontSize: 14,
        marginBottom: 20,
    },
    divider: {
        height: 1,
        backgroundColor: "#334155",
        marginBottom: 20,
    },
    licenseRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    licenseLabel: {
        color: "#64748B",
        fontSize: 12,
        marginBottom: 4,
    },
    licenseId: {
        color: "#C9A961",
        fontSize: 16,
        fontWeight: "bold",
    },
    roleBadge: {
        backgroundColor: "rgba(148, 163, 184, 0.1)",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#475569",
    },
    roleBadgeText: {
        color: "#94A3B8",
        fontSize: 10,
        fontWeight: "bold",
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 25,
    },
    statBox: {
        width: '31%',
        backgroundColor: "#1E293B",
        borderRadius: 12,
        padding: 15,
        alignItems: "center",
    },
    statIcon: {
        marginBottom: 8,
    },
    statValue: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    statLabel: {
        color: "#64748B",
        fontSize: 12,
        marginTop: 2,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    sectionTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    viewAllBtn: {
        flexDirection: "row",
        alignItems: "center",
    },
    viewAllText: {
        color: "#C9A961",
        fontSize: 14,
        marginRight: 4,
    },
    trainingCard: {
        backgroundColor: "#1E293B",
        borderRadius: 12,
        padding: 15,
        marginBottom: 25,
    },
    trainingHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    trainingTitle: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    trainingPercent: {
        color: "#C9A961",
        fontSize: 14,
        fontWeight: "bold",
    },
    progressBarBg: {
        height: 6,
        backgroundColor: "#020617",
        borderRadius: 3,
        marginBottom: 12,
    },
    progressBarFill: {
        height: 6,
        backgroundColor: "#C9A961",
        borderRadius: 3,
    },
    trainingSub: {
        color: "#64748B",
        fontSize: 12,
    },
    navGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30,
    },
    navItem: {
        width: '31%',
        backgroundColor: "#1E293B",
        borderRadius: 12,
        padding: 15,
        alignItems: "center",
        height: 100,
        justifyContent: "center",
    },
    navItemActive: {
        width: '35%',
        backgroundColor: "#C9A961",
        borderRadius: 12,
        padding: 15,
        alignItems: "center",
        height: 110,
        justifyContent: "center",
        marginTop: -5,
    },
    navIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    navIconCircleActive: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "rgba(2, 6, 23, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    navLabel: {
        color: "#94A3B8",
        fontSize: 14,
        fontWeight: "bold",
    },
    navLabelActive: {
        color: "#020617",
        fontSize: 14,
        fontWeight: "bold",
    },
    alertCard: {
        flexDirection: "row",
        backgroundColor: "#1E293B",
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        alignItems: "center",
    },
    alertIconCircleSuccess: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    alertIconCircleWarning: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    alertContent: {
        flex: 1,
    },
    alertTitle: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 2,
    },
    alertSub: {
        color: "#64748B",
        fontSize: 12,
    },
    alertTime: {
        color: "#475569",
        fontSize: 12,
    },
    footer: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: "#1E293B",
        paddingTop: 20,
    },
    systemStatusRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    systemStatusLabel: {
        color: "#475569",
        fontSize: 14,
    },
    operationalBadge: {
        flexDirection: "row",
        alignItems: "center",
    },
    operationalDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#10B981",
        marginRight: 8,
    },
    operationalText: {
        color: "#10B981",
        fontSize: 14,
        fontWeight: "500",
    },
});