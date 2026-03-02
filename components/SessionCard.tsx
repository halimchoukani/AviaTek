import { REQUEST_TYPE_COLORS } from "@/constant/Colors";
import { ScheduleDocument, ScheduleStatus } from "@/lib/types";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface SessionCardProps {
    schedule: ScheduleDocument & {
        equipmentName?: string;
        equipmentRegistration?: string;
    };
    isPast: boolean;
}

// Status-based color configuration
const STATUS_CONFIG = {
    [ScheduleStatus.Confirmed]: {
        label: "CONFIRMED",
        color: "#10B981",
        bg: "rgba(16, 185, 129, 0.12)",
        border: "rgba(16, 185, 129, 0.3)",
        icon: "check-circle" as const,
        checkInBg: "#10B981",
    },
    [ScheduleStatus.Pending]: {
        label: "PENDING",
        color: "#F59E0B",
        bg: "rgba(245, 158, 11, 0.12)",
        border: "rgba(245, 158, 11, 0.3)",
        icon: "clock" as const,
        checkInBg: "#D97706",
    },
    completed: {
        label: "COMPLETED",
        color: "#38BDF8",
        bg: "rgba(56, 189, 248, 0.12)",
        border: "rgba(56, 189, 248, 0.3)",
        icon: "check-circle" as const,
        checkInBg: "#0EA5E9",
    },
};

export default function SessionCard({ schedule, isPast }: SessionCardProps) {
    const [notesExpanded, setNotesExpanded] = useState(false);

    const startDate = new Date(schedule.startTime);
    const endDate = new Date(schedule.endTime);

    const dateStr = startDate.toISOString().split("T")[0];
    const startTimeStr = startDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
    const endTimeStr = endDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    // Determine visual config based on status
    const statusKey = isPast
        ? "completed"
        : (schedule.status || ScheduleStatus.Confirmed);
    const config = STATUS_CONFIG[statusKey as keyof typeof STATUS_CONFIG] || STATUS_CONFIG[ScheduleStatus.Confirmed];

    const sessionTypeLabel = (schedule.sessionType || "training").toUpperCase();
    const typeColors =
        REQUEST_TYPE_COLORS[schedule.sessionType as keyof typeof REQUEST_TYPE_COLORS] ||
        REQUEST_TYPE_COLORS["Type Rating"] ||
        { text: "#C9A961", bg: "#2D2612" };

    const isFlightSession =
        schedule.sessionType === "flight" ||
        schedule.sessionType === "Flight" ||
        !schedule.sessionType;

    const toggleNotes = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setNotesExpanded((prev) => !prev);
    };

    return (
        <View
            style={[
                styles.card,
                {
                    borderColor: config.border,
                    shadowColor: config.color,
                },
            ]}
        >
            {/* Top Row: Equipment + Status */}
            <View style={styles.topRow}>
                <View style={styles.topLeft}>
                    <View style={styles.iconBox}>
                        {isFlightSession ? (
                            <MaterialIcons
                                name="airplanemode-active"
                                size={20}
                                color="#C9A961"
                            />
                        ) : (
                            <MaterialIcons name="computer" size={20} color="#C9A961" />
                        )}
                    </View>
                    <View style={styles.equipmentInfo}>
                        <Text style={styles.equipmentName}>
                            {(schedule as any).equipmentName || "N/A"}
                        </Text>
                        <Text style={styles.equipmentReg}>
                            {(schedule as any).equipmentRegistration || schedule.equipmentId}
                        </Text>
                    </View>
                </View>

                <View
                    style={[
                        styles.statusBadge,
                        {
                            backgroundColor: config.bg,
                            borderColor: config.border,
                        },
                    ]}
                >
                    <Feather
                        name={config.icon}
                        size={12}
                        color={config.color}
                        style={{ marginRight: 4 }}
                    />
                    <Text style={[styles.statusText, { color: config.color }]}>
                        {config.label}
                    </Text>
                </View>
            </View>

            {/* Session Type Badge */}
            <View style={styles.typeBadgeRow}>
                <View
                    style={[styles.typeBadge, { backgroundColor: typeColors.bg }]}
                >
                    <Text style={[styles.typeBadgeText, { color: typeColors.text }]}>
                        {sessionTypeLabel}
                    </Text>
                </View>
            </View>

            {/* Details Grid */}
            <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                    <Feather name="calendar" size={14} color="#64748B" />
                    <Text style={styles.detailText}>{dateStr}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Feather name="clock" size={14} color="#64748B" />
                    <Text style={styles.detailText}>
                        {startTimeStr} – {endTimeStr}
                    </Text>
                </View>
            </View>

            <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                    <Feather name="user" size={14} color="#64748B" />
                    <Text style={styles.detailText}>{schedule.pilotId}</Text>
                </View>
            </View>

            {/* Briefing Notes */}
            <TouchableOpacity
                style={styles.notesRow}
                onPress={toggleNotes}
                activeOpacity={0.7}
            >
                <Text style={styles.notesLabel}>Briefing Notes</Text>
                <Feather
                    name={notesExpanded ? "chevron-down" : "chevron-right"}
                    size={18}
                    color="#64748B"
                />
            </TouchableOpacity>

            {notesExpanded && (
                <View style={styles.notesContent}>
                    <Text style={styles.notesText}>
                        {schedule.notes || "No briefing notes available."}
                    </Text>
                </View>
            )}

            {/* Check In Button (upcoming only) */}
            {!isPast && statusKey === ScheduleStatus.Confirmed && (
                <TouchableOpacity
                    style={[styles.checkInBtn, { backgroundColor: config.checkInBg }]}
                    activeOpacity={0.8}
                >
                    <Feather
                        name="check-circle"
                        size={18}
                        color="#FFFFFF"
                        style={{ marginRight: 8 }}
                    />
                    <Text style={styles.checkInText}>Check In for Session</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1E293B",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#334155",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    topLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#0F172A",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        borderWidth: 1,
        borderColor: "#334155",
    },
    equipmentInfo: {
        flex: 1,
    },
    equipmentName: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    equipmentReg: {
        color: "#64748B",
        fontSize: 12,
        marginTop: 2,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        borderWidth: 1,
    },
    statusText: {
        fontSize: 10,
        fontWeight: "bold",
        letterSpacing: 0.5,
    },
    typeBadgeRow: {
        flexDirection: "row",
        marginBottom: 16,
    },
    typeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    typeBadgeText: {
        fontSize: 11,
        fontWeight: "bold",
        letterSpacing: 0.5,
    },
    detailsGrid: {
        flexDirection: "row",
        gap: 24,
        marginBottom: 8,
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    detailText: {
        color: "#94A3B8",
        fontSize: 13,
    },
    notesRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 12,
        marginTop: 4,
        borderTopWidth: 1,
        borderTopColor: "#334155",
    },
    notesLabel: {
        color: "#64748B",
        fontSize: 14,
    },
    notesContent: {
        paddingTop: 12,
    },
    notesText: {
        color: "#94A3B8",
        fontSize: 13,
        lineHeight: 20,
        backgroundColor: "#0F172A",
        padding: 12,
        borderRadius: 8,
    },
    checkInBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#10B981",
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 16,
    },
    checkInText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "bold",
    },
});
