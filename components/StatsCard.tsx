import { StyleSheet, Text, View } from "react-native";

const TEXT_COLORS: Record<string, string> = {
    'text-white': '#FFFFFF',
    'text-secondary': '#C9A961',
    'text-slate-500': '#64748B',
};

export default function StatsCard({ label, value, valueColor = "text-white" }: { label: string; value: string; valueColor?: string }) {
    const textColor = TEXT_COLORS[valueColor] || valueColor;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <Text style={[styles.value, { color: textColor }]}>{value}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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