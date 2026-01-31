import PilotCard from "@/components/PilotCard";
import StatsCard from "@/components/StatsCard";
import { PILOTS } from "@/constant/Pilots";

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
              <Text className="text-lg font-bold text-white"
                          onPress={() => router.push("/profile")}>
                Horizon Academy
              </Text>
              <Text className="text-sm font-medium text-secondary">
                Administration
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="p-2" >
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





