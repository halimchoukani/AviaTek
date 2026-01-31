import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MaterielView from "../../components/MaterielView";

const STAFF_DATA = [
  {
    id: 1,
    name: "Capt. Sarah Chen",
    role: "ATPL-9921",
    tags: ["CFI", "MEI"],
    status: "ON DUTY",
    hours: "4,250",
    location: "C172-N9283",
  },
  {
    id: 2,
    name: "FO. Marcus Rodriguez",
    role: "CPL-4421",
    tags: ["CFI"],
    status: "AVAILABLE",
    hours: "1,850",
    location: null,
  },
  {
    id: 3,
    name: "Capt. James Wilson",
    role: "ATPL-1102",
    tags: ["CFII", "MEI"],
    status: "OFF DUTY",
    hours: "5,100",
    location: null,
  },
  {
    id: 4,
    name: "FO. Elena Popov",
    role: "CPL-3391",
    tags: ["IR"],
    status: "ON DUTY",
    hours: "950",
    location: "Sim-01",
  },
];

export default function Resources() {
  const [activeTab, setActiveTab] = useState<"personnel" | "materiel">("personnel");

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <StatusBar barStyle="light-content" />
      <View className="flex-1 px-6 pt-2">
        {/* Header */}
        <View className="py-4">
          <Text className="text-xl font-bold text-white">
            Resource Management
          </Text>
          <Text className="text-sm font-medium text-secondary mt-1">
            Academy Operations
          </Text>
        </View>

        {/* Tabs */}
        <View className="flex-row border-b border-gray-800 mb-6">
          <TouchableOpacity
            onPress={() => setActiveTab("personnel")}
            className={`pb-3 mr-8 ${activeTab === "personnel"
              ? "border-b-2 border-secondary"
              : "border-transparent"
              }`}
          >
            <Text
              className={`text-base font-medium ${activeTab === "personnel" ? "text-secondary" : "text-gray-400"
                }`}
            >
              Personnel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("materiel")}
            className={`pb-3 ${activeTab === "materiel"
              ? "border-b-2 border-secondary"
              : "border-transparent"
              }`}
          >
            <Text
              className={`text-base font-medium ${activeTab === "materiel" ? "text-secondary" : "text-gray-400"
                }`}
            >
              Materiel
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {activeTab === "personnel" ? (
            <>
              {/* Stats Row */}
              <View className="flex-row gap-4 mb-6">
                <View className="flex-1 bg-card p-4 rounded-xl">
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-gray-400 text-xs">Total Pilots</Text>
                    <Feather name="users" size={16} color="#94A3B8" />
                  </View>
                  <Text className="text-2xl font-bold text-white">4</Text>
                </View>
                <View className="flex-1 bg-card p-4 rounded-xl">
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-gray-400 text-xs">On Duty</Text>
                    <Feather name="activity" size={16} color="#C9A961" />
                  </View>
                  <Text className="text-2xl font-bold text-secondary">2</Text>
                </View>
              </View>

              {/* Personnel List */}
              <View className="gap-4 pb-6">
                {STAFF_DATA.map((staff) => (
                  <View key={staff.id} className="bg-card p-4 rounded-xl border border-gray-800">
                    {/* Header */}
                    <View className="flex-row justify-between items-start mb-2">
                      <View>
                        <Text className="text-lg font-bold text-white">
                          {staff.name}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">
                          {staff.role}
                        </Text>
                      </View>
                      <View className={`px-3 py-1 rounded-full border ${staff.status === "ON DUTY"
                        ? "border-gray-700 bg-gray-900/50"
                        : staff.status === "AVAILABLE"
                          ? "border-green-900/30 bg-green-900/10"
                          : "border-gray-700 bg-gray-900/50"
                        }`}>
                        <View className="flex-row items-center gap-2">
                          <View className={`w-2 h-2 rounded-full ${staff.status === "ON DUTY"
                            ? "bg-secondary"
                            : staff.status === "AVAILABLE"
                              ? "bg-green-500"
                              : "bg-gray-500"
                            }`} />
                          <Text className={`text-[10px] font-bold ${staff.status === "AVAILABLE" ? "text-green-500" :
                            staff.status === "ON DUTY" ? "text-secondary" : "text-gray-500"
                            }`}>
                            {staff.status}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Tags */}
                    <View className="flex-row gap-2 mb-4">
                      {staff.tags.map((tag, index) => (
                        <View key={index} className="bg-primary px-3 py-1 rounded-md border border-gray-800">
                          <Text className="text-xs font-medium text-gray-300">
                            {tag}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Footer */}
                    <View className="pt-3 border-t border-gray-800 flex-row justify-between items-center">
                      <View className="flex-row items-center gap-2">
                        <Feather name="clock" size={14} color="#94A3B8" />
                        <Text className="text-sm text-gray-400">
                          {staff.hours} hrs
                        </Text>
                      </View>
                      {staff.location && (
                        <View className="flex-row items-center gap-2">
                          <Feather name="map-pin" size={14} color="#C9A961" />
                          <Text className="text-sm text-secondary">
                            {staff.location}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <MaterielView />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
