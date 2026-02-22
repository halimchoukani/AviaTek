import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const router = useRouter();
    const [identity, setIdentity] = useState('');
    const [credentials, setCredentials] = useState('');

    const handleLogin = () => {
        // Implement login logic here
        console.log('Login attempt:', identity);
        router.replace('/(tabs)/home');
    };

    return (
        <SafeAreaView className="flex-1 bg-primary items-center justify-center px-6">
            <StatusBar style="light" />

            {/* Logo Section */}
            <View className="items-center mb-12">
                <View className="w-20 h-20 rounded-full bg-slate-800 items-center justify-center mb-4 border border-slate-700">
                    <Ionicons name="airplane-outline" size={40} color="#C9A961" />
                </View>
                <Text className="text-3xl font-bold text-white mb-2 tracking-wider">AviaTeK</Text>
                <Text className="text-slate-400 text-sm tracking-wide">Secure Access Portal</Text>
            </View>

            {/* Form Section */}
            <View className="w-full space-y-4 ">
                <View className="mb-4">
                    <Text className="text-slate-400 text-s mb-2 ml-1">Identity</Text>
                    <TextInput
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500"
                        placeholder="license@aviation.id"
                        placeholderTextColor="#64748B"
                        value={identity}
                        onChangeText={setIdentity}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <View>
                    <Text className="text-slate-400 text-s mb-2 ml-1">Credentials</Text>
                    <TextInput
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500"
                        placeholder="••••••••"
                        placeholderTextColor="#64748B"
                        value={credentials}
                        onChangeText={setCredentials}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    className="w-full bg-secondary rounded-lg py-4 mt-4 items-center flex-row justify-center"
                    onPress={handleLogin}
                >
                    <Text className="text-primary font-bold text-base mr-2">AUTHENTICATE</Text>
                    <Ionicons name="chevron-forward" size={20} color="#020617" />
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="absolute bottom-10">
                <Text className="text-slate-600 text-xs text-center">
                    Authorized Personnel Only. System activity is monitored.
                </Text>
            </View>
        </SafeAreaView>
    );
}
