import { StyleSheet, Text, View } from "react-native";

export default function StatsCard({ label, value, valueColor = "text-white" }: { label: string; value: string; valueColor?: string }) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        backgroundColor: '#1E293B',
        padding: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#64748B',
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
})