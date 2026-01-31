import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
    const router = useRouter();
    const [orgName, setOrgName] = useState("Horizon Flight Academy");
    const [address, setAddress] = useState("123 Airport Road, Hangar 5, LAX");

    return (
        <View className="flex-1 bg-primary">
            <StatusBar barStyle="light-content" />

            {/* Header Banner - Gold Gradient */}
            <LinearGradient
                colors={['#C9A961', '#856f35', '#020617']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="h-48 w-full absolute top-0"
            />

            <SafeAreaView className="flex-1">
                <View className="flex-1 px-4">
                    {/* Top Bar with Back Button */}
                    <View className="flex-row justify-between items-center py-2 mb-4">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="bg-black/30 p-2 rounded-full"
                        >
                            <Feather name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-black/30 p-2 rounded-full">
                            <Feather name="edit-2" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">

                        {/* Profile Card */}
                        <View className="bg-card rounded-2xl p-6 mb-6 border border-gray-800 shadow-xl relative mt-8">
                            {/* Profile Icon - Floating */}
                            <View className="absolute -top-10 left-6 h-20 w-20 bg-card border border-secondary rounded-2xl items-center justify-center shadow-lg z-10">
                                <FontAwesome5 name="building" size={32} color="#C9A961" />
                            </View>

                            <View className="mt-10">
                                <View className="flex-row items-center justify-between">
                                    <Text className="text-xl font-bold text-white">Horizon Flight Academy</Text>
                                    <View className="bg-green-500/20 px-2 py-1 rounded-full border border-green-500/30 flex-row items-center gap-1">
                                        <Feather name="check-circle" size={10} color="#4ADE80" />
                                        <Text className="text-[10px] font-bold text-green-500">VERIFIED</Text>
                                    </View>
                                </View>
                                <Text className="text-xs text-gray-400 mt-1">FAA Part 141</Text>

                                <View className="flex-row items-center gap-2 mt-2">
                                    <Feather name="map-pin" size={12} color="#94A3B8" />
                                    <Text className="text-sm text-gray-400">Los Angeles, CA, USA</Text>
                                </View>

                                {/* Stats */}
                                <View className="flex-row justify-between border-t border-gray-800 mt-6 pt-6">
                                    <View className="items-center flex-1">
                                        <Text className="text-xl font-bold text-white">142</Text>
                                        <Text className="text-xs text-gray-500 mt-1">Pilots</Text>
                                    </View>
                                    <View className="items-center flex-1 border-l border-gray-800">
                                        <Text className="text-xl font-bold text-secondary">12</Text>
                                        <Text className="text-xs text-gray-500 mt-1">Aircraft</Text>
                                    </View>
                                    <View className="items-center flex-1 border-l border-gray-800">
                                        <Text className="text-xl font-bold text-white">2018</Text>
                                        <Text className="text-xs text-gray-500 mt-1">Est.</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row gap-3 mb-6">
                            <TouchableOpacity className="flex-1 bg-card rounded-xl p-4 items-center border border-gray-800 active:bg-gray-800">
                                <Feather name="mail" size={20} color="#C9A961" />
                                <Text className="text-xs text-gray-400 mt-2">Email</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-1 bg-card rounded-xl p-4 items-center border border-gray-800 active:bg-gray-800">
                                <Feather name="phone" size={20} color="#C9A961" />
                                <Text className="text-xs text-gray-400 mt-2">Call</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-1 bg-card rounded-xl p-4 items-center border border-gray-800 active:bg-gray-800">
                                <Feather name="globe" size={20} color="#C9A961" />
                                <Text className="text-xs text-gray-400 mt-2">Website</Text>
                            </TouchableOpacity>
                        </View>

                        {/* General Settings */}
                        <View className="bg-card rounded-2xl p-6 mb-6 border border-gray-800">
                            <View className="flex-row justify-between items-center mb-6">
                                <View className="flex-row items-center gap-3">
                                    <View className="p-2 bg-gray-800 rounded-lg">
                                        <Feather name="settings" size={18} color="#C9A961" />
                                    </View>
                                    <View>
                                        <Text className="text-base font-bold text-white">General Settings</Text>
                                        <Text className="text-xs text-gray-500">Name, location, contact info</Text>
                                    </View>
                                </View>
                                <Feather name="chevron-right" size={16} color="#64748B" />
                            </View>

                            {/* Inputs */}
                            <View className="gap-4">
                                <View>
                                    <Text className="text-xs font-medium text-gray-500 mb-2 ml-1">Organization Name</Text>
                                    <TextInput
                                        value={orgName}
                                        onChangeText={setOrgName}
                                        className="bg-primary border border-gray-700 rounded-xl px-4 py-3 text-white text-sm"
                                        placeholderTextColor="#64748B"
                                    />
                                </View>
                                <View>
                                    <Text className="text-xs font-medium text-gray-500 mb-2 ml-1">Address</Text>
                                    <TextInput
                                        value={address}
                                        onChangeText={setAddress}
                                        className="bg-primary border border-gray-700 rounded-xl px-4 py-3 text-white text-sm"
                                        placeholderTextColor="#64748B"
                                    />
                                </View>

                                <TouchableOpacity className="bg-secondary rounded-xl py-3 items-center mt-2 shadow-lg active:opacity-90">
                                    <Text className="text-primary font-bold">Save Changes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Menu List */}
                        <View className="gap-3 mb-8">
                            <MenuOption icon="users" title="Team Members" subtitle="4 members" />
                            <MenuOption icon="award" title="Certifications" subtitle="2 active" />
                            <MenuOption icon="link" title="Integrations" subtitle="Moodle, Calendar, Payments" />
                            <MenuOption icon="credit-card" title="Billing & Plan" subtitle="Professional" />
                        </View>

                        {/* Footer */}
                        <TouchableOpacity className="flex-row items-center justify-center gap-2 mb-8 py-4">
                            <Feather name="trash-2" size={16} color="#EF4444" />
                            <Text className="text-red-500 font-medium text-sm">Delete Organization</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
}

function MenuOption({ icon, title, subtitle }: { icon: any, title: string, subtitle: string }) {
    return (
        <TouchableOpacity className="bg-card p-4 rounded-xl border border-gray-800 flex-row items-center justify-between active:bg-gray-800">
            <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 bg-primary rounded-lg items-center justify-center border border-gray-800">
                    <Feather name={icon} size={18} color="#C9A961" />
                </View>
                <View>
                    <Text className="text-white font-bold text-sm">{title}</Text>
                    <Text className="text-gray-500 text-xs">{subtitle}</Text>
                </View>
            </View>
            <Feather name="chevron-right" size={16} color="#475569" />
        </TouchableOpacity>
    );
}
