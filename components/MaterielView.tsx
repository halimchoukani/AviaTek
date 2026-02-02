import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

const FLEET_DATA = [
    {
        id: "N92834",
        name: "N92834",
        type: "Cessna 172S",
        status: "OPERATIONAL",
        checkIn: "42 h",
        location: "Apron A",
    },
    {
        id: "N88219",
        name: "N88219",
        type: "Piper PA-28",
        status: "MAINTENANCE",
        checkIn: "0h",
        location: "Hangar 2",
    },
    {
        id: "N77321",
        name: "N77321",
        type: "Diamond DA42",
        status: "OPERATIONAL",
        checkIn: "85 h",
        location: "Apron B",
    },
    {
        id: "N11029",
        name: "N11029",
        type: "Cessna 152",
        status: "GROUNDED",
        checkIn: "-5 h",
        location: "Hangar 1",
    },
];

const SIM_DATA = [
    {
        id: "SIM-01",
        name: "SIM-01",
        type: "Redbird MCX",
        status: "OPERATIONAL",
        nextSession: "14:00",
    },
    {
        id: "SIM-02",
        name: "SIM-02",
        type: "Frasca 142",
        status: "MAINTENANCE",
        nextSession: null,
    },
];

export default function MaterielView() {
    return (
        <View style={styles.container}>
            {/* Stats Row */}
            <View style={styles.statsRow}>
                <View style={styles.statsCard}>
                    <View style={styles.statsHeader}>
                        <Text style={styles.statsLabel}>Fleet Size</Text>
                        <FontAwesome5 name="plane" size={16} color="#94A3B8" />
                    </View>
                    <Text style={styles.statsValue}>4</Text>
                </View>
                <View style={styles.statsCard}>
                    <View style={styles.statsHeader}>
                        <Text style={styles.statsLabel}>Operational</Text>
                        <Feather name="activity" size={16} color="#4ADE80" />
                    </View>
                    <Text style={[styles.statsValue, styles.textGreen]}>2</Text>
                </View>
            </View>

            {/* Fleet Status Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <FontAwesome5 name="plane" size={14} color="#94A3B8" />
                    <Text style={styles.sectionTitle}>Fleet Status</Text>
                </View>

                <View style={styles.listContainer}>
                    {FLEET_DATA.map((aircraft) => (
                        <View
                            key={aircraft.id}
                            style={styles.card}
                        >
                            <View style={styles.cardHeader}>
                                <View>
                                    <Text style={styles.cardTitle}>
                                        {aircraft.name}
                                    </Text>
                                    <Text style={styles.cardSubtitle}>
                                        {aircraft.type}
                                    </Text>
                                </View>

                                <View
                                    style={[
                                        styles.badge,
                                        aircraft.status === "OPERATIONAL"
                                            ? styles.badgeOperational
                                            : aircraft.status === "MAINTENANCE"
                                                ? styles.badgeMaintenance
                                                : styles.badgeGrounded
                                    ]}
                                >
                                    <View style={styles.badgeContent}>
                                        <View
                                            style={[
                                                styles.statusDot,
                                                aircraft.status === "OPERATIONAL"
                                                    ? styles.bgGreen
                                                    : aircraft.status === "MAINTENANCE"
                                                        ? styles.bgYellow
                                                        : styles.bgGray
                                            ]}
                                        />
                                        <Text
                                            style={[
                                                styles.badgeText,
                                                aircraft.status === "OPERATIONAL"
                                                    ? styles.textGreen
                                                    : aircraft.status === "MAINTENANCE"
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
                                    <FontAwesome5 name="wrench" size={14} color={aircraft.checkIn.includes("-") ? "#EF4444" : "#F59E0B"} />
                                    <Text style={[styles.footerText, aircraft.checkIn.includes("-") && styles.textRed]}>
                                        Check in  <Text style={styles.footerTextMuted}>{aircraft.checkIn}</Text>
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

            {/* Training Devices Section */}
            <View>
                <View style={styles.sectionHeader}>
                    <Feather name="monitor" size={14} color="#94A3B8" />
                    <Text style={styles.sectionTitle}>Training Devices</Text>
                </View>

                <View style={styles.listContainer}>
                    {SIM_DATA.map((sim) => (
                        <View
                            key={sim.id}
                            style={styles.card}
                        >
                            <View style={styles.cardHeader}>
                                <View>
                                    <Text style={styles.cardTitle}>
                                        {sim.name}
                                    </Text>
                                    <Text style={styles.cardSubtitleSim}>
                                        {sim.type}
                                    </Text>
                                </View>

                                <View
                                    style={[
                                        styles.badge,
                                        sim.status === "OPERATIONAL"
                                            ? styles.badgeOperational
                                            : styles.badgeMaintenance
                                    ]}
                                >
                                    <View style={styles.badgeContent}>
                                        <View
                                            style={[
                                                styles.statusDot,
                                                sim.status === "OPERATIONAL"
                                                    ? styles.bgGreen
                                                    : styles.bgYellow
                                            ]}
                                        />
                                        <Text
                                            style={[
                                                styles.badgeText,
                                                sim.status === "OPERATIONAL"
                                                    ? styles.textGreen
                                                    : styles.textYellow
                                            ]}
                                        >
                                            {sim.status}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {sim.nextSession && (
                                <View style={styles.cardFooterSimple}>
                                    <Feather name="calendar" size={12} color="#94A3B8" />
                                    <Text style={styles.footerTextSmall}>
                                        Next Session:  <Text style={styles.footerTextHighlight}>{sim.nextSession}</Text>
                                    </Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 24,
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
        fontSize: 18,
        fontWeight: "bold",
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
