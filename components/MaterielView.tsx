import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { Text, View } from "react-native";

const FLEET_DATA = [
    {
        id: "N92834",
        name: "N92834",
        type: "Cessna 172S",
        status: "OPERATIONAL",
        checkIn: "42 h",
        location: "Apron A",
    },
    {
        id: "N88219",
        name: "N88219",
        type: "Piper PA-28",
        status: "MAINTENANCE",
        checkIn: "0h",
        location: "Hangar 2",
    },
    {
        id: "N77321",
        name: "N77321",
        type: "Diamond DA42",
        status: "OPERATIONAL",
        checkIn: "85 h",
        location: "Apron B",
    },
    {
        id: "N11029",
        name: "N11029",
        type: "Cessna 152",
        status: "GROUNDED",
        checkIn: "-5 h",
        location: "Hangar 1",
    },
];

const SIM_DATA = [
    {
        id: "SIM-01",
        name: "SIM-01",
        type: "Redbird MCX",
        status: "OPERATIONAL",
        nextSession: "14:00",
    },
    {
        id: "SIM-02",
        name: "SIM-02",
        type: "Frasca 142",
        status: "MAINTENANCE",
        nextSession: null,
    },
];

export default function MaterielView() {
    return (
        <View className="pb-6">
            {/* Stats Row */}
            <View className="flex-row gap-4 mb-4">
                <View className="flex-1 bg-card  p-4 rounded-xl">
                    <View className="flex-row justify-between items-start mb-2">
                        <Text className="text-gray-400 text-xs">Fleet Size</Text>
                        <FontAwesome5 name="plane" size={16} color="#94A3B8" />
                    </View>
                    <Text className="text-2xl font-bold text-white">4</Text>
                </View>
                <View className="flex-1 bg-card p-4 rounded-xl">
                    <View className="flex-row justify-between items-start mb-2">
                        <Text className="text-gray-400 text-xs">Operational</Text>
                        <Feather name="activity" size={16} color="#4ADE80" />
                    </View>
                    <Text className="text-2xl font-bold text-green-500">2</Text>
                </View>
            </View>

            {/* Fleet Status Section */}
            <View className="mb-6">
                <View className="flex-row items-center gap-2 mb-4">
                    <FontAwesome5 name="plane" size={14} color="#94A3B8" />
                    <Text className="text-gray-400 font-medium">Fleet Status</Text>
                </View>

                <View className="gap-3">
                    {FLEET_DATA.map((aircraft) => (
                        <View
                            key={aircraft.id}
                            className="bg-card p-4 rounded-xl border border-gray-800"
                        >
                            <View className="flex-row justify-between items-start mb-4">
                                <View>
                                    <Text className="text-lg font-bold text-white">
                                        {aircraft.name}
                                    </Text>
                                    <Text className="text-xs text-white mt-1">
                                        {aircraft.type}
                                    </Text>
                                </View>

                                <View
                                    className={`px-3 py-1 rounded-full border ${aircraft.status === "OPERATIONAL"
                                            ? "border-green-900/30 bg-green-900/10"
                                            : aircraft.status === "MAINTENANCE"
                                                ? "border-yellow-900/30 bg-yellow-900/10"
                                                : "border-gray-700 bg-gray-900/50"
                                        }`}
                                >
                                    <View className="flex-row items-center gap-2">
                                        <View
                                            className={`w-1.5 h-1.5 rounded-full ${aircraft.status === "OPERATIONAL"
                                                    ? "bg-green-500"
                                                    : aircraft.status === "MAINTENANCE"
                                                        ? "bg-yellow-500"
                                                        : "bg-gray-500"
                                                }`}
                                        />
                                        <Text
                                            className={`text-[10px] font-bold ${aircraft.status === "OPERATIONAL"
                                                    ? "text-green-500"
                                                    : aircraft.status === "MAINTENANCE"
                                                        ? "text-yellow-500"
                                                        : "text-gray-00"
                                                }`}
                                        >
                                            {aircraft.status}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View className="border-t border-gray-800 pt-3 flex-row justify-between items-center">
                                <View className="flex-row items-center gap-2">
                                    <FontAwesome5 name="wrench" size={14} color={aircraft.checkIn.includes("-") ? "#EF4444" : "#F59E0B"} />
                                    <Text className={`text-gray-400 text-sm font-medium ${aircraft.checkIn.includes("-") ? "text-red-500" : "text-gray-400"}`}>
                                        Check in  <Text className= " text-sm text-gray-400">{aircraft.checkIn}</Text>
                                    </Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <Feather name="map-pin" size={12} color="#94A3B8" />
                                    <Text className="text-xs text-gray-400">
                                        {aircraft.location}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Training Devices Section */}
            <View>
                <View className="flex-row items-center gap-2 mb-4">
                    <Feather name="monitor" size={14} color="#94A3B8" />
                    <Text className="text-gray-400 font-medium">Training Devices</Text>
                </View>

                <View className="gap-3">
                    {SIM_DATA.map((sim) => (
                        <View
                            key={sim.id}
                            className="bg-card p-4 rounded-xl border border-gray-800"
                        >
                            <View className="flex-row justify-between items-start mb-4">
                                <View>
                                    <Text className="text-lg font-bold text-white">
                                        {sim.name}
                                    </Text>
                                    <Text className="text-xs text-gray-500 mt-1">
                                        {sim.type}
                                    </Text>
                                </View>

                                <View
                                    className={`px-3 py-1 rounded-full border ${sim.status === "OPERATIONAL"
                                            ? "border-green-900/30 bg-green-900/10"
                                            : "border-yellow-900/30 bg-yellow-900/10"
                                        }`}
                                >
                                    <View className="flex-row items-center gap-2">
                                        <View
                                            className={`w-1.5 h-1.5 rounded-full ${sim.status === "OPERATIONAL"
                                                    ? "bg-green-500"
                                                    : "bg-yellow-500"
                                                }`}
                                        />
                                        <Text
                                            className={`text-[10px] font-bold ${sim.status === "OPERATIONAL"
                                                    ? "text-green-500"
                                                    : "text-yellow-500"
                                                }`}
                                        >
                                            {sim.status}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {sim.nextSession && (
                                <View className="border-t border-gray-800 pt-3 flex-row items-center gap-2">
                                    <Feather name="calendar" size={12} color="#94A3B8" />
                                    <Text className="text-xs text-gray-400">
                                        Next Session:  <Text className="text-gray-300">{sim.nextSession}</Text>
                                    </Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}
