import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { getPlanes } from "@/lib/api/planes";
import { getSimulators } from "@/lib/api/simulators";
import { getCurrentAcademy } from "@/lib/appwrite";
import { EquipmentStatus, Plane, Simulator } from "@/lib/types";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function MaterielView() {
    const [planes, setPlanes] = useState<Plane[]>([]);
    const [simulators, setSimulators] = useState<Simulator[]>([]);
    const { data: academyId, isLoading } = useSuspenseQuery({
        queryKey: ["academyId"],
        queryFn: () => getCurrentAcademy()
    })

    const fetchData = useCallback(async () => {
        try {
            const [planesResult, simulatorsResult] = await Promise.all([
                getPlanes(academyId!),
                getSimulators(academyId!)
            ]);
            setPlanes(planesResult);
            setSimulators(simulatorsResult);
        } catch (error) {
            console.error("Error fetching Materiel Resources:", error);
        }
    }, [academyId]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Stats Row */}
            <View style={styles.statsRow}>
                <View style={styles.statsCard}>
                    <View style={styles.statsHeader}>
                        <Text style={styles.statsLabel}>Fleet Size</Text>
                        <FontAwesome5 name="plane" size={16} color="#94A3B8" />
                    </View>
                    <Text style={styles.statsValue}>{planes.length}</Text>
                </View>
                <View style={styles.statsCard}>
                    <View style={styles.statsHeader}>
                        <Text style={styles.statsLabel}>Simulators</Text>
                        <Feather name="monitor" size={16} color="#4ADE80" />
                    </View>
                    <Text style={[styles.statsValue, styles.textGreen]}>{simulators.length}</Text>
                </View>
            </View>

            {/* Fleet Status Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <FontAwesome5 name="plane" size={14} color="#94A3B8" />
                    <Text style={styles.sectionTitle}>Fleet Status</Text>
                </View>
                <View style={styles.listContainer}>
                    {planes.map((aircraft) => (
                        <View
                            key={aircraft.$id}
                            style={styles.card}
                        >
                            {/* image of the plane  */}
                            <View>
                                <Image
                                    source={{ uri: aircraft.images[0] ?? "" }}
                                    style={styles.image}
                                />
                            </View>
                            <View style={styles.cardHeader}>
                                <View>
                                    <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
                                        {aircraft.modelNumber}
                                    </Text>
                                    <Text style={styles.cardSubtitle}>
                                        {aircraft.manufacturer}
                                    </Text>
                                </View>

                                <View
                                    style={[
                                        styles.badge,
                                        aircraft.status === EquipmentStatus.Operational
                                            ? styles.badgeOperational
                                            : aircraft.status === EquipmentStatus.Maintenance
                                                ? styles.badgeMaintenance
                                                : styles.badgeGrounded
                                    ]}
                                >
                                    <View style={styles.badgeContent}>
                                        <View
                                            style={[
                                                styles.statusDot,
                                                aircraft.status === EquipmentStatus.Operational
                                                    ? styles.bgGreen
                                                    : aircraft.status === EquipmentStatus.Maintenance
                                                        ? styles.bgYellow
                                                        : styles.bgGray
                                            ]}
                                        />
                                        <Text
                                            style={[
                                                styles.badgeText,
                                                aircraft.status === EquipmentStatus.Operational
                                                    ? styles.textGreen
                                                    : aircraft.status === EquipmentStatus.Maintenance
                                                        ? styles.textYellow
                                                        : styles.textGray
                                            ]}
                                        >
                                            {aircraft.status}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.cardFooter}>
                                <View style={styles.footerItem}>
                                    <FontAwesome5 name="wrench" size={14} color="#F59E0B" />
                                    <Text style={styles.footerText}>
                                        Last Check <Text style={styles.footerTextMuted}>{new Date(aircraft.lastCheckDate).toLocaleDateString()}</Text>
                                    </Text>
                                </View>
                                <View style={styles.footerItem}>
                                    <Feather name="map-pin" size={12} color="#94A3B8" />
                                    <Text style={styles.locationText}>
                                        {aircraft.location}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

            </View>
            <View style={styles.sectionHeader}>
                <Feather name="monitor" size={14} color="#94A3B8" />
                <Text style={styles.sectionTitle}>Training Devices</Text>
            </View>

            <View style={styles.listContainer}>
                {simulators.map((sim) => (
                    <View
                        key={sim.$id}
                        style={styles.card}
                    >
                        {/* image of the simulator  */}
                        <View>
                            <Image
                                source={{ uri: sim.images[0] ?? "" }}
                                style={styles.image}
                            />
                        </View>
                        <View style={styles.cardHeader}>
                            <View>
                                <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
                                    {sim.simulatorModel}
                                </Text>
                                <Text style={styles.cardSubtitleSim}>
                                    {sim.location}
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.badge,
                                    sim.status === EquipmentStatus.Operational
                                        ? styles.badgeOperational
                                        : styles.badgeMaintenance
                                ]}
                            >
                                <View style={styles.badgeContent}>
                                    <View
                                        style={[
                                            styles.statusDot,
                                            sim.status === EquipmentStatus.Operational
                                                ? styles.bgGreen
                                                : styles.bgYellow
                                        ]}
                                    />
                                    <Text
                                        style={[
                                            styles.badgeText,
                                            sim.status === EquipmentStatus.Operational
                                                ? styles.textGreen
                                                : sim.status === EquipmentStatus.Maintenance
                                                    ? styles.textYellow
                                                    : styles.textGray
                                        ]}
                                    >
                                        {sim.status}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {sim.lastMaintenanceDate && (
                            <View style={styles.cardFooterSimple}>
                                <Feather name="calendar" size={12} color="#94A3B8" />
                                <Text style={styles.footerTextSmall}>
                                    Last Maintenance:  <Text style={styles.footerTextHighlight}>{new Date(sim.lastMaintenanceDate).toLocaleDateString()}</Text>
                                </Text>
                            </View>
                        )}
                    </View>
                ))}
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: 100,
        borderRadius: 12,
        marginBottom: 16,
    },
    container: {
        flex: 1,
    },
    statsRow: {
        flexDirection: "row",
        gap: 16,
        marginBottom: 16,
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
    listContainer: {
        gap: 12,
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
        marginBottom: 16,
    },
    cardTitle: {
        width: 100,
        fontSize: 18,
        fontWeight: "bold",
        overflow: "hidden",
        color: "#FFFFFF",
    },
    cardSubtitle: {
        fontSize: 12,
        color: "#FFFFFF",
        marginTop: 4,
    },
    cardSubtitleSim: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 4,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 9999,
        borderWidth: 1,
    },
    badgeOperational: {
        borderColor: "rgba(6, 78, 59, 0.3)",
        backgroundColor: "rgba(6, 78, 59, 0.1)",
    },
    badgeMaintenance: {
        borderColor: "rgba(120, 53, 15, 0.3)",
        backgroundColor: "rgba(120, 53, 15, 0.1)",
    },
    badgeGrounded: {
        borderColor: "#374151",
        backgroundColor: "rgba(17, 24, 39, 0.5)",
    },
    badgeContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: "bold",
    },
    cardFooter: {
        borderTopWidth: 1,
        borderTopColor: "#1F2937",
        paddingTop: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardFooterSimple: {
        borderTopWidth: 1,
        borderTopColor: "#1F2937",
        paddingTop: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    footerItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    footerText: {
        color: "#94A3B8",
        fontSize: 14,
        fontWeight: "500",
    },
    footerTextMuted: {
        fontSize: 14,
        color: "#94A3B8",
    },
    footerTextSmall: {
        fontSize: 12,
        color: "#94A3B8",
    },
    footerTextHighlight: {
        color: "#D1D5DB",
    },
    locationText: {
        fontSize: 12,
        color: "#94A3B8",
    },
    textGreen: {
        color: "#4ADE80",
    },
    textYellow: {
        color: "#F59E0B",
    },
    textGray: {
        color: "#9CA3AF",
    },
    textRed: {
        color: "#EF4444",
    },
    bgGreen: {
        backgroundColor: "#22C55E",
    },
    bgYellow: {
        backgroundColor: "#EAB308",
    },
    bgGray: {
        backgroundColor: "#6B7280",
    },
});
