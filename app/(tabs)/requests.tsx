
// ... existing imports ...
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ... Types and Requests Interface ...
type RequestStatus = "Pending" | "Approved" | "Rejected";
type RequestType = "Type Rating" | "Recurrency" | "Checkout" | "Proficiency" | "Initial";

interface Request {
  id: string;
  name: string;
  rank: string;
  licenseId: string;
  status: RequestStatus;
  type: RequestType;
  aircraft: string;
  aircraftId?: string;
  duration: string;
  requestedDate?: string;
  submittedDate?: string;
  preferredTimes?: string;
  reason?: string;
  isUrgent?: boolean;
}

// ... Mock Data ...
const MOCK_REQUESTS: Request[] = [
  {
    id: "1",
    name: "Sarah Chen",
    rank: "Capt.",
    licenseId: "ATPL-9921-CN",
    status: "Pending",
    type: "Type Rating",
    aircraft: "Diamond DA42",
    aircraftId: "N77321",
    duration: "15h",
    requestedDate: "2024-02-15",
    submittedDate: "2024-02-01",
    preferredTimes: "Morning, Afternoon",
    reason: "Multi-engine type rating for commercial operations expansion",
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    rank: "FO.",
    licenseId: "CPL-4421-MX",
    status: "Pending",
    type: "Recurrency",
    aircraft: "Cessna 172S",
    duration: "2h",
    isUrgent: true,
  },
  {
    id: "3",
    name: "James Wilson",
    rank: "Std.",
    licenseId: "SPL-1102-UK",
    status: "Approved",
    type: "Checkout",
    aircraft: "Piper PA-28",
    duration: "5h",
  },
  {
    id: "4",
    name: "Elena Popov",
    rank: "FO.",
    licenseId: "CPL-3391-RU",
    status: "Rejected",
    type: "Proficiency",
    aircraft: "Cessna 152",
    duration: "3h",
  },
  {
    id: "5",
    name: "David Park",
    rank: "Capt.",
    licenseId: "ATPL-5567-KR",
    status: "Pending",
    type: "Initial",
    aircraft: "Diamond DA42",
    duration: "20h",
    isUrgent: true,
  },
];

const STATUS_COLORS = {
  Pending: { bg: "#3A2D14", text: "#F59E0B", border: "#F59E0B" },
  Approved: { bg: "#064E3B", text: "#10B981", border: "#10B981" },
  Rejected: { bg: "#450A0A", text: "#EF4444", border: "#EF4444" },
};

const REQUEST_TYPE_COLORS: Record<string, { text: string; bg: string }> = {
  "Type Rating": { text: "#C9A961", bg: "#2D2612" }, // Goldish
  "Recurrency": { text: "#94A3B8", bg: "#1E293B" }, // Greyish
  "Checkout": { text: "#94A3B8", bg: "#1E293B" },
  "Proficiency": { text: "#D97706", bg: "#2D1B05" }, // Amber
  "Initial": { text: "#C9A961", bg: "#2D2612" },
};

export default function RequestsScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>("1"); // Start with first expanded as per design

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
    <View className="flex-1 bg-slate-950" style={{ paddingTop: insets.top }}>
      <View className="flex-1 px-4 pt-4">
        <>
          {/* Header */}
          <View className="flex-row justify-between items-start mb-5">
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
          <View className="flex-row justify-between mb-5 gap-2.5">
            <StatsCard label="Total" value={stats.total} />
            <StatsCard
              label="Approved"
              value={stats.approved}
              highlightColor="#10B981"
            />
            <StatsCard
              label="Pending"
              value={stats.pending}
              highlightColor="#F59E0B"
            />
          </View>

          {/* Filters */}
          <View className="flex-row mb-5 gap-2">
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
    </View>
  );
}

function StatsCard({
  label,
  value,
  highlightColor,
}: {
  label: string;
  value: number;
  highlightColor?: string;
}) {
  return (
    <View className="flex-1 bg-slate-800 p-4 rounded-xl border border-slate-700">
      <Text className="text-slate-400 text-[11px] mb-2">{label}</Text>
      <Text
        className="text-slate-50 text-2xl font-bold"
        style={highlightColor ? { color: highlightColor } : {}}
      >
        {value}
      </Text>
    </View>
  );
}

function RequestCard({
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
