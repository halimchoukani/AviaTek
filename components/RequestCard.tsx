import { REQUEST_TYPE_COLORS, STATUS_COLORS } from "@/constant/Colors";
import { Request } from "@/constant/Types";
import { Feather } from "@expo/vector-icons";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

export default function RequestCard({
    request,
    expanded,
    onToggle,
}: {
    request: Request;
    expanded: boolean;
    onToggle: () => void;
}) {
    const statusColors = STATUS_COLORS[request.status];
    const typeColors =
        REQUEST_TYPE_COLORS[request.type] || REQUEST_TYPE_COLORS["Recurrency"];

    return (
        <View className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <Pressable onPress={onToggle}>
                <View className="p-4">
                    {/* Top Row: Name and Status */}
                    <View className="flex-row justify-between items-start mb-4">
                        <View>
                            <Text className="text-slate-50 text-base font-semibold">
                                {request.rank} {request.name}
                            </Text>
                            <Text className="text-slate-500 text-xs mt-0.5">{request.licenseId}</Text>
                        </View>
                        <View className="flex-row items-center">
                            {request.isUrgent && request.status === "Pending" && (
                                <View className="bg-red-500/20 px-1.5 py-0.5 rounded mr-2">
                                    <Text className="text-red-500 text-[10px] font-bold">URGENT</Text>
                                </View>
                            )}
                            <View className="flex-row items-center bg-slate-900 px-2.5 py-1 rounded-2xl border border-slate-700">
                                <View
                                    className="w-1.5 h-1.5 rounded-full mr-1.5"
                                    style={{ backgroundColor: statusColors.text }}
                                />
                                <Text
                                    className="text-[10px] font-bold"
                                    style={{ color: statusColors.text }}
                                >
                                    {request.status.toUpperCase()}
                                </Text>
                            </View>
                            <Feather
                                name={expanded ? "chevron-up" : "chevron-down"}
                                size={20}
                                color="#64748B"
                                style={{ marginLeft: 8 }}
                            />
                        </View>
                    </View>

                    {/* Middle Row: Aircraft, Type, Duration */}
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-1.5">
                            <Feather name="send" size={14} color="#EAB308" style={{ transform: [{ rotate: '-45deg' }] }} />
                            <Text className="text-slate-400 text-xs">{request.aircraft}</Text>
                        </View>

                        <View
                            className="px-2 py-1 rounded"
                            style={{ backgroundColor: typeColors.bg }}
                        >
                            <Text
                                className="text-[10px] font-bold"
                                style={{ color: typeColors.text }}
                            >
                                {request.type.toUpperCase()}
                            </Text>
                        </View>

                        <View className="flex-row items-center gap-1.5">
                            <Feather name="clock" size={14} color="#94A3B8" />
                            <Text className="text-slate-400 text-xs">{request.duration}</Text>
                        </View>
                    </View>
                </View>
            </Pressable>

            {/* Expanded Content */}
            {expanded && (
                <View className="px-4 pb-4">
                    <View className="h-[1px] bg-slate-700 mb-4" />

                    <View className="flex-row flex-wrap gap-4 mb-5">
                        <View className="w-[45%]">
                            <Text className="text-slate-500 text-[11px] mb-0.5">Aircraft</Text>
                            <Text className="text-slate-50 text-[13px] font-medium">{request.aircraftId || "N/A"}</Text>
                        </View>
                        <View className="w-[45%]">
                            <Text className="text-slate-500 text-[11px] mb-0.5">Requested Date</Text>
                            <Text className="text-slate-50 text-[13px] font-medium">{request.requestedDate || "N/A"}</Text>
                        </View>
                        <View className="w-[45%]">
                            <Text className="text-slate-500 text-[11px] mb-0.5">Preferred Times</Text>
                            <Text className="text-slate-50 text-[13px] font-medium">{request.preferredTimes || "N/A"}</Text>
                        </View>
                        <View className="w-[45%]">
                            <Text className="text-slate-500 text-[11px] mb-0.5">Submitted</Text>
                            <Text className="text-slate-50 text-[13px] font-medium">{request.submittedDate || "N/A"}</Text>
                        </View>
                    </View>

                    {request.reason && (
                        <View className="mb-5">
                            <View className="flex-row items-center gap-1.5 mb-2">
                                <Feather name="message-square" size={14} color="#64748B" />
                                <Text className="text-slate-500 text-xs">Reason</Text>
                            </View>
                            <View className="bg-slate-900 p-3 rounded-lg">
                                <Text className="text-slate-400 text-[13px] leading-5">{request.reason}</Text>
                            </View>
                        </View>
                    )}

                    {request.status === "Pending" && (
                        <View className="flex-row gap-3">
                            <TouchableOpacity className="flex-1 flex-row items-center justify-center py-3 rounded-lg bg-emerald-500/10 border border-emerald-500">
                                <Feather name="check-circle" size={18} color="#10B981" style={{ marginRight: 8 }} />
                                <Text className="text-emerald-500 text-sm font-semibold">Approve</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-1 flex-row items-center justify-center py-3 rounded-lg bg-red-500/10 border border-red-500">
                                <Feather name="x-circle" size={18} color="#EF4444" style={{ marginRight: 8 }} />
                                <Text className="text-red-500 text-sm font-semibold">Reject</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}