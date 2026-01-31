
// ... existing imports ...
import RequestCard from "@/components/RequestCard";
import StatsCard from "@/components/StatsCard";
import { MOCK_REQUESTS } from "@/constant/Variables";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function RequestsScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>("0"); // Start with first expanded as per design

  const stats = {
    total: 5,
    approved: 1,
    pending: 3,
  };

  const filteredRequests = MOCK_REQUESTS.filter((req) => {
    if (activeFilter === "All") return true;
    return req.status === activeFilter;
  });

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="flex-1 px-6 pt-2">
        <>
          {/* Header */}
          <View className="flex-row items-center justify-between py-4">
            <View>
              <Text className="text-xl font-bold text-slate-50">Training Requests</Text>
              <Text className="text-xs text-[#C9A961] mt-1">Fleet Training Validation</Text>
            </View>
            <View className="flex-row items-center bg-amber-500/15 px-2.5 py-1.5 rounded-full border border-amber-500/30">
              <Feather name="alert-circle" size={14} color="#F59E0B" />
              <Text className="text-amber-500 text-xs font-semibold ml-1.5">3 Pending</Text>
            </View>
          </View>

          {/* Stats Cards */}
          <View className="mt-4 flex-row gap-3">
            <StatsCard label="Total" value={stats.total.toString()} />
            <StatsCard
              label="Approved"
              value={stats.approved.toString()}
            />
            <StatsCard
              label="Pending"
              value={stats.pending.toString()}
            />
          </View>

          {/* Filters */}
          <View className="mt-4 flex-row gap-3">
            {["All", "Pending", "Approved", "Rejected"].map((filter) => (
              <TouchableOpacity
                key={filter}
                className={`px-4 py-2 rounded-lg border ${activeFilter === filter
                  ? "bg-[#C9A961] border-[#C9A961]"
                  : "bg-slate-800 border-slate-700"
                  }`}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  className={`text-[13px] font-medium ${activeFilter === filter ? "text-slate-900 font-bold" : "text-slate-400"
                    }`}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
        <FlatList
          className="mt-5"
          data={filteredRequests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <RequestCard
              request={item}
              expanded={expandedId === item.id}
              onToggle={() =>
                setExpandedId(expandedId === item.id ? null : item.id)
              }
            />
          )}
          ItemSeparatorComponent={() => <View className="h-4" />}
        />
      </View>
    </SafeAreaView>
  );
}



