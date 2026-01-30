import {
    Feather,
    FontAwesome5,
    MaterialCommunityIcons
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    FlatList,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PILOTS = [
  {
    id: "1",
    name: "Capt. Sarah Chen",
    license: "ATPL-9921-CN",
    joined: "2023-11-12",
    status: "ACTIVE",
    statusColor: "text-amber-400", // Adjusted for gold/yellow look
  },
  {
    id: "2",
    name: "FO. Marcus Rodriguez",
    license: "CPL-4421-MX",
    joined: "2024-01-15",
    status: "ACTIVE",
    statusColor: "text-amber-400",
  },
  {
    id: "3",
    name: "Std. James Wilson",
    license: "SPL-1102-UK",
    joined: "2024-02-01",
    status: "SUSPENDED",
    statusColor: "text-red-500",
  },
  {
    id: "4",
    name: "Std. Elena Popov",
    license: "SPL-3391-RU",
    joined: "2024-02-10",
    status: "INACTIVE",
    statusColor: "text-slate-400",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <StatusBar barStyle="light-content" />

      <View className="flex-1 px-6 pt-2">
        {/* Header */}
        <View className="flex-row items-center justify-between py-4">
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-xl bg-card border border-border">
              <FontAwesome5 name="building" size={20} color="#C9A961" />
            </View>
            <View>
              <Text className="text-lg font-bold text-white">
                Horizon Academy
              </Text>
              <Text className="text-sm font-medium text-secondary">
                Administration
              </Text>
            </View>
          </View>
          
          <TouchableOpacity className="p-2">
             <Feather name="chevron-right" size={24} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View className="mt-4 flex-row gap-3">
            <StatsCard label="Total" value="142" />
            <StatsCard label="Active" value="118" valueColor="text-secondary" />
            <StatsCard label="Pending" value="24" />
        </View>

        {/* Action Buttons */}
        <View className="mt-6 flex-row gap-4">
            <TouchableOpacity className="flex-1 h-20 flex-col items-center justify-center rounded-xl bg-secondary shadow-lg active:opacity-90">
                <Feather name="user-plus" size={24} color="#020617" />
                 <Text className="mt-1 font-bold text-primary">Add Pilot</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 h-20 flex-col items-center justify-center rounded-xl bg-card border border-border active:opacity-80">
                <MaterialCommunityIcons name="shield-alert" size={24} color="#ffffff" />
                 <Text className="mt-1 font-medium text-white">Access Logs</Text>
            </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="mt-6 h-12 flex-row items-center rounded-xl bg-primary border border-border px-4">
            <TextInput 
                placeholder="Search by name or license ID..."
                placeholderTextColor="#64748B"
                className="flex-1 text-white text-base"
            />
        </View>

        {/* List Title */}
        <Text className="mt-6 mb-3 text-sm font-semibold text-slate-400 uppercase tracking-wide">
            Pilot Roster
        </Text>

        {/* List */}
        <FlatList
          data={PILOTS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20, gap: 12 }}
          renderItem={({ item }) => <PilotCard pilot={item} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}


function StatsCard({ label, value, valueColor = "text-white" }: { label: string; value: string; valueColor?: string }) {
    return (
        <View className="flex-1 rounded-xl bg-card p-4 border border-border">
            <Text className="text-xs font-medium text-slate-500 mb-1">{label}</Text>
            <Text className={`text-2xl font-bold ${valueColor}`}>{value}</Text>
        </View>
    )
}

function PilotCard({ pilot }: { pilot: typeof PILOTS[0] }) {
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
