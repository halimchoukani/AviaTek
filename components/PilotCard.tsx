import { PILOTS } from "@/constant/Pilots";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Helper to map Tailwind status colors to hex values
const STATUS_COLORS: Record<string, string> = {
    'text-amber-400': '#fbbf24',
    'text-red-500': '#ef4444',
    'text-slate-400': '#94a3b8',
};

export default function PilotCard({ pilot }: { pilot: typeof PILOTS[0] }) {
    const statusColor = STATUS_COLORS[pilot.statusColor] || '#94a3b8';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.name}>{pilot.name}</Text>
                    <Text style={styles.license}>{pilot.license}</Text>
                </View>

                <View style={styles.statusBadge}>
                    <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                    <Text style={styles.statusText}>{pilot.status}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={styles.joinedLabel}>
                    Joined  <Text style={styles.joinedDate}>{pilot.joined}</Text>
                </Text>

                <View style={styles.actions}>
                    <TouchableOpacity>
                        <Feather name="check-circle" size={20} color="#64748B" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Feather name="x-circle" size={20} color="#64748B" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        backgroundColor: '#1E293B',
        padding: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    license: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 4,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 9999,
        backgroundColor: '#020617',
        borderWidth: 1,
        borderColor: '#334155',
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    statusDot: {
        height: 8,
        width: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#94A3B8',
        textTransform: 'uppercase',
    },
    footer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#334155',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    joinedLabel: {
        fontSize: 12,
        color: '#64748B',
    },
    joinedDate: {
        color: '#94A3B8',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
});