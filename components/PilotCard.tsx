import { PilotActivityStatus, PilotDocument } from "@/lib/types";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

// Helper to map Tailwind status colors to hex values
const STATUS_COLORS: Record<string, string> = {
    'online': '#5cbe00ff',
    'offline': '#ef4444',
    'on_leave': '#94a3b8',
    'on_duty': '#fbbf24',
    'inactive': '#94a3b8',
};

export default function PilotCard({ pilot }: { pilot: PilotDocument }) {
    const statusColor = STATUS_COLORS[pilot.status] || '#94a3b8';

    return (
        <View key={pilot.$id} style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.cardTitle}>
                        {pilot.rank + ". " + pilot.name}
                    </Text>
                    <Text style={styles.cardSubtitle}>
                        {pilot.licenseNumber}
                    </Text>
                </View>
                <View style={[
                    styles.badge,
                    pilot.activeStatus === PilotActivityStatus.Active ? styles.badgeAvailable : styles.badgeDefault
                ]}>
                    <View style={styles.badgeContent}>
                        <View style={[
                            styles.statusDot,
                            pilot.activeStatus === PilotActivityStatus.On_Duty
                                ? styles.bgSecondary
                                : pilot.activeStatus === PilotActivityStatus.Active
                                    ? styles.bgGreen
                                    : styles.bgGray
                        ]} />
                        <Text style={[
                            styles.badgeText,
                            pilot.activeStatus === PilotActivityStatus.Active ? styles.textGreen :
                                pilot.activeStatus === PilotActivityStatus.On_Duty ? styles.textSecondary : styles.textGray
                        ]}>
                            {pilot.activeStatus}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.tagsContainer}>
                {/* {pilot.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>
                            {tag}
                        </Text>
                    </View>
                ))} */}
            </View>
            <View style={styles.cardFooter}>
                <View style={styles.footerItem}>
                    <Feather name="clock" size={14} color="#94A3B8" />
                    <Text style={styles.footerText}>
                        {pilot.flightHours} hrs
                    </Text>
                </View>
                {/* {pilot.location && (
                    <View style={styles.footerItem}>
                        <Feather name="map-pin" size={14} color="#C9A961" />
                        <Text style={[styles.footerText, styles.textSecondary]}>
                            {pilot.location}
                        </Text>
                    </View>
                )} */}
            </View>
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