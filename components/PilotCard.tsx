import { PILOTS } from "@/constant/Pilots";
import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function PilotCard({ pilot }: { pilot: typeof PILOTS[0] }) {
    return (
        <View className="rounded-xl bg-card p-4 border border-border">
            <View className="flex-row items-start justify-between">
                <View>
                    <Text className="text-base font-bold text-white">{pilot.name}</Text>
                    <Text className="text-xs text-slate-500 mt-1">{pilot.license}</Text>
                </View>

                <View className="flex-row items-center rounded-full bg-[#020617] border border-border px-3 py-1">
                    <View className={`h-2 w-2 rounded-full ${pilot.statusColor} bg-current mr-2`} />
                    <Text className="text-[10px] font-bold text-slate-400 uppercase">{pilot.status}</Text>
                </View>
            </View>

            <View className="mt-4 pt-4 border-t border-border flex-row items-center justify-between">
                <Text className="text-xs text-slate-500">
                    Joined  <Text className="text-slate-400">{pilot.joined}</Text>
                </Text>

                <View className="flex-row gap-3">
                    <TouchableOpacity>
                        <Feather name="check-circle" size={20} color="#64748B" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Feather name="x-circle" size={20} color="#64748B" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}