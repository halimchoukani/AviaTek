import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock Data
interface Pilot {
    $id: string;
    name: string;
    lastname: string;
    email:string ;
    licenseNumber: string;
    rank: string;
    flightHours: number;
}

export default function AddPilot() {
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);



    const [pilots, setPilots] = useState<Pilot[]>([]);

    useEffect(() => {
        const fetchPilots = async () => {
            // REPLACE THIS WITH YOUR LOCAL IP ADDRESS
            //i use ngrok Forwarding 
            const API_URL = "https://ivy-rhinencephalous-rosamaria.ngrok-free.dev/api/pilots";

            try {
                console.log("Fetching pilots from:", API_URL);
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPilots(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching pilots:", error);
                setLoading(false);
            }
        };

        fetchPilots();
    }, []);


    const filteredPilots = pilots.filter(pilot =>
        pilot.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pilot.lastname?.toLowerCase().includes(searchQuery.toLowerCase())
    );


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
                        <TouchableOpacity className="bg-secondary px-4 py-2 rounded-lg flex-row items-center">
                            <Feather name="user-plus" size={16} color="#020617" />
                            <Text className="text-primary font-bold text-xs ml-2">Add</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}
