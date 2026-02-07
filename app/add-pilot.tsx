import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { assignPilotToAcademy, getPilotsNotAssignedToAcademy } from '@/lib/api/pilots';
import { PilotDocument } from '@/lib/types';


export default function AddPilot() {
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
    const handleAddPilotToAcademy = async (pilotId: string) => {
        try {
            const result = await assignPilotToAcademy(pilotId);
            router.back();
        } catch (error) {
            console.error('Error adding pilot to academy:', error);
        }
    }


    const [pilots, setPilots] = useState<PilotDocument[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getPilotsNotAssignedToAcademy()
                setPilots(response);
            } catch (error) {
                console.error('Error fetching pilots:', error);
            } finally {
                setLoading(false);
            }
        };
        if (searchQuery.length >= 2) {
            fetchData();
        }
    }, [searchQuery]);
    const filteredPilots = pilots.filter(pilot => {
        const matchesSearch = pilot.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pilot.lastname?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });


    return (
        <SafeAreaView className="flex-1 bg-primary">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="px-4 pt-2 pb-6">
                <View className="flex-row items-center mb-1">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <Feather name="arrow-left" size={24} color="#94A3B8" />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-white text-lg font-bold">Add Pilot</Text>
                        <Text className="text-amber-400 text-xs">Search & Add to Academy</Text>
                    </View>
                </View>

                {/* Search Bar */}
                <View className="mt-6 bg-card rounded-lg flex-row items-center px-4 py-3 border border-border">
                    <Feather name="search" size={20} color="#64748B" />
                    <TextInput
                        placeholder="Search by name or ID..."
                        placeholderTextColor="#64748B"
                        className="flex-1 ml-3 text-white"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Pilot List */}
            <FlatList
                data={filteredPilots}
                keyExtractor={(item) => item.$id}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
                ItemSeparatorComponent={() => <View className="h-4" />}
                renderItem={({ item }) => (
                    <View className="bg-card rounded-xl p-4 border border-border flex-row items-start justify-between">
                        {/* Left Content */}
                        <View className="flex-1 mr-4">
                            <Text className="text-white font-bold text-base mb-1">{item.name} {item.lastname}</Text>
                            <Text className="text-slate-300 text-xs mb-1">{item.licenseNumber}</Text>
                            <Text className="text-slate-400 text-xs mb-4">{item.email}</Text>

                            <View className="flex-row items-center gap-4">
                                {/* Rank Badge */}
                                <View className="flex-row items-center">
                                    <MaterialCommunityIcons name="medal-outline" size={16} color="#fbbf24" />
                                    <Text className="text-slate-300 text-xs ml-1.5">{item.rank}</Text>
                                </View>

                                {/* Hours */}
                                <View className="flex-row items-center">
                                    <Feather name="clock" size={14} color="#94A3B8" />
                                    <Text className="text-slate-300 text-xs ml-1.5">{item.flightHours} hrs</Text>
                                </View>
                            </View>
                        </View>

                        {/* Right Action */}
                        <TouchableOpacity onPress={() => handleAddPilotToAcademy(item.$id)} className="bg-secondary px-4 py-2 rounded-lg flex-row items-center">
                            <Feather name="user-plus" size={16} color="#020617" />
                            <Text className="text-primary font-bold text-xs ml-2">Add</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}
