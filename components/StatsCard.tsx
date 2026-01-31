import { Text, View } from "react-native";

export default function StatsCard({ label, value, valueColor = "text-white" }: { label: string; value: string; valueColor?: string }) {
    return (
        <View className="flex-1 rounded-xl bg-card p-4 border border-border">
            <Text className="text-xs font-medium text-slate-500 mb-1">{label}</Text>
            <Text className={`text-2xl font-bold ${valueColor}`}>{value}</Text>
        </View>
    )
}