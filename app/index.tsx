import AntDesign from "@expo/vector-icons/AntDesign";
import Octicons from "@expo/vector-icons/Octicons";
import { FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
const stats = [
  { label: "Total", value: 142 },
  { label: "Active", value: 118 },
  { label: "Pending", value: 24 },
];

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-primary gap-4">
      {/* Header */}
      <View className="px-5 flex-row items-center">
        <View className="flex-row items-center flex-1 gap-3">
          <View className="bg-card p-3 rounded-lg border border-border">
            <Octicons name="organization" size={20} color="#C9A961" />
          </View>

          <View className="flex-col">
            <Text className="text-text-primary font-semibold">
              Horizon Academy
            </Text>
            <Text className="text-text-secondary text-sm">Administration</Text>
          </View>
        </View>

        <View>
          <AntDesign name="right" size={18} color="#64748B" />
        </View>
      </View>

      {/* Stats Grid */}
      <View className="h-120">
        <FlatList
          data={stats}
          numColumns={3}
          scrollEnabled={false}
          keyExtractor={(item) => item.label}
          columnWrapperStyle={{ gap: 8 }}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          renderItem={({ item }) => (
            <View className="flex-1 bg-card p-3 rounded-lg border border-border gap-2">
              <Text className="text-text-secondary text-sm">{item.label}</Text>
              <Text className="text-text-primary text-xl font-bold">
                {item.value}
              </Text>
            </View>
          )}
        />
      </View>

      {/* Divider */}
      <View className="h-px bg-border my-3" />
      <View className="px-5 flex-row flex-wrap gap-2">
        <View className="bg-card p-7 rounded-lg border border-border gap-2 flex-col items-center justify-center flex-2">
          <AntDesign name="user-add" size={24} color="white" />
          <Text className="text-white">Add Pilot</Text>
        </View>
        <View className="bg-card p-7 rounded-lg border border-border gap-2 flex-col items-center justify-center flex-1">
          <Octicons name="log" size={24} color="white" />
          <Text className="text-white">Access Logs</Text>
        </View>
      </View>
      <View className="px-4">
        <View className="bg-[#0f172a] border border-[#1e293b] rounded-2xl px-4 py-1">
          <TextInput
            placeholder="Search by name or license ID..."
            placeholderTextColor="#94a3b8"
            className="text-white text-xl"
          />
        </View>
      </View>
      <View className="px-4">
        <Text className="text-white">Pilot Roster</Text>
      </View>
    </SafeAreaView>
  );
}
