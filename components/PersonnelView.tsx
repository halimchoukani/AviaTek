import { Feather, FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

import { getAcademyAdmins } from "@/lib/api/academies";
import { getPilotsByAcademy } from "@/lib/api/pilots";
import { useSuspenseQuery } from "@tanstack/react-query";
import PilotCard from "./PilotCard";
;

export default function PersonnelView() {
    const { data: pilots, isFetching: isPilotsFetching } = useSuspenseQuery({
        queryKey: ["pilots"],
        queryFn: getPilotsByAcademy,
    })
    const { data: admins, isFetching: isAdminsFetching } = useSuspenseQuery({
        queryKey: ["admins"],
        queryFn: getAcademyAdmins,
    })
    if (isPilotsFetching || isAdminsFetching) {
        return <ActivityIndicator size={"large"} color={"#C9A961"} />
    }

    return (
        <View style={styles.container}>
            {/* Stats Row */}
            <View style={styles.statsRow}>
                <View style={styles.statsCard}>
                    <View style={styles.statsHeader}>
                        <Text style={styles.statsLabel}>Admins</Text>
                        <FontAwesome5 name="user-tie" size={16} color="#94A3B8" />
                    </View>
                    <Text style={styles.statsValue}>{1}</Text>
                </View>
                <View style={styles.statsCard}>
                    <View style={styles.statsHeader}>
                        <Text style={styles.statsLabel}>Pilots</Text>
                        <Feather name="user" size={16} color="#4ADE80" />
                    </View>
                    <Text style={[styles.statsValue, styles.textGreen]}>{pilots.length}</Text>
                </View>
            </View>

            {/* Admin Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <FontAwesome5 name="user-tie" size={14} color="#94A3B8" />
                    <Text style={styles.sectionTitle}>Admins</Text>
                </View>
                <FlatList
                    contentContainerStyle={styles.listContainer}
                    data={admins}
                    renderItem={({ item: staff }) => (
                        <View key={staff.userId} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View>
                                    <Text style={styles.cardTitle}>
                                        {staff.userName}
                                    </Text>
                                    <Text style={styles.cardSubtitle}>
                                        {staff.userEmail}
                                    </Text>
                                </View>
                                {/* <View style={[
                                    styles.badge,
                                    staff.userStatus === "Online" ? styles.badgeAvailable : styles.badgeDefault
                                ]}>
                                    <View style={styles.badgeContent}>
                                        <View style={[
                                            styles.statusDot,
                                            staff.userStatus === "Online"
                                                ? styles.bgSecondary
                                                : staff.status === "Offline"
                                                    ? styles.bgGreen
                                                    : styles.bgGray
                                        ]} />
                                        <Text style={[
                                            styles.badgeText,
                                            staff.status === "Online" ? styles.textGreen :
                                                staff.status === "Offline" ? styles.textSecondary : styles.textGray
                                        ]}>
                                            {staff.status}
                                        </Text>
                                    </View>
                                </View> */}
                            </View>
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                />

            </View>

            {/* Pilots Section */}
            <View style={styles.sectionHeader}>
                <FontAwesome5 name="id-card" size={16} color="#94A3B8" />
                <Text style={styles.sectionTitle}>Pilots</Text>
            </View>

            <FlatList
                contentContainerStyle={styles.listContainer}
                data={pilots}
                keyExtractor={(item) => item.$id}
                renderItem={({ item: pilot }) => (
                    <PilotCard pilot={pilot} />
                )}
                showsVerticalScrollIndicator={false}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        color: "#94A3B8",
        fontWeight: "500",
    },
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
