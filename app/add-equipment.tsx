import { createPlane } from '@/lib/api/planes';
import { createSimulator } from '@/lib/api/simulators';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { EquipmentStatus } from '@/lib/types';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type EquipmentType = 'plane' | 'simulator';

export default function AddEquipment() {
    const [type, setType] = useState<EquipmentType>('plane');
    const [loading, setLoading] = useState(false);

    // Common fields
    const [status, setStatus] = useState<EquipmentStatus>(EquipmentStatus.Operational);
    const [location, setLocation] = useState('');
    const [maxOccupancy, setMaxOccupancy] = useState('0');

    // Plane specific fields
    const [name, setName] = useState('');
    const [modelNumber, setModelNumber] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);

    // Simulator specific fields
    const [simulatorModel, setSimulatorModel] = useState('');
    const [installationDate, setInstallationDate] = useState(new Date().toISOString().split('T')[0]);

    const [image, setImage] = useState<string | null>(null);

    const pickImage = async () => {
        const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (result.granted === false) {
            Alert.alert("Permission Required", "Allow access to your photo library to pick an image.");
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!pickerResult.canceled) {
            setImage(pickerResult.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (type === 'plane') {
            if (!name || !manufacturer || !location) {
                Alert.alert("Missing Fields", "Please fill in all required fields.");
                return;
            }
        } else {
            if (!simulatorModel || !location) {
                Alert.alert("Missing Fields", "Please fill in all required fields.");
                return;
            }
        }

        try {
            setLoading(true);

            let imageUrl = '';
            if (image) {
                const equipmentType = type === 'plane' ? 'Planes' : 'Simulators';
                imageUrl = await uploadImageToCloudinary('aviatek', 'Academy1', equipmentType, image);
            }

            if (type === 'plane') {
                await createPlane({
                    name,
                    modelNumber,
                    manufacturer,
                    purchaseDate,
                    lastServiceDate: new Date().toISOString().split('T')[0],
                    lastCheckDate: new Date().toISOString().split('T')[0],
                    status,
                    maxOccupancy: parseInt(maxOccupancy) || 0,
                    location,
                    images: imageUrl ? [imageUrl] : []
                });
            } else {
                await createSimulator({
                    simulatorModel,
                    installationDate,
                    lastMaintenanceDate: new Date().toISOString().split('T')[0],
                    location,
                    status,
                    maxOccupancy: parseInt(maxOccupancy) || 0,
                    images: imageUrl ? [imageUrl] : []
                });
            }
            Alert.alert("Success", `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully!`);
            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert("Error", `Failed to add ${type}. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-primary">
            <Stack.Screen options={{ headerShown: false }} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {/* Header */}
                <View className="px-6 pt-4 pb-6">
                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 items-center justify-center rounded-full bg-card/50 border border-border"
                        >
                            <Feather name="arrow-left" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text className="text-white text-xl font-bold">New Equipment</Text>
                        <View className="w-10" />
                    </View>
                </View>

                <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
                    {/* Image Picker */}
                    <View className="mb-8">
                        <Text className="text-text-secondary text-xs uppercase font-bold mb-3 ml-1">Equipment Image</Text>
                        <TouchableOpacity
                            onPress={pickImage}
                            className="bg-card h-48 rounded-2xl border border-dashed border-border items-center justify-center overflow-hidden"
                        >
                            {image ? (
                                <Image
                                    source={{ uri: image }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            ) : (
                                <View className="items-center">
                                    <View className="w-12 h-12 bg-primary/50 rounded-full items-center justify-center mb-2">
                                        <Feather name="image" size={24} color="#C9A961" />
                                    </View>
                                    <Text className="text-text-secondary text-sm">Tap to upload photo</Text>
                                    <Text className="text-text-muted text-xs mt-1">PNG, JPG up to 10MB</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Toggle */}
                    <View className="flex-row bg-card p-1 rounded-2xl mb-8 border border-border">
                        <TouchableOpacity
                            onPress={() => setType('plane')}
                            className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${type === 'plane' ? 'bg-secondary' : ''}`}
                        >
                            <MaterialCommunityIcons
                                name="airplane"
                                size={20}
                                color={type === 'plane' ? '#020617' : '#94A3B8'}
                            />
                            <Text className={`ml-2 font-bold ${type === 'plane' ? 'text-primary' : 'text-text-secondary'}`}>Plane</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setType('simulator')}
                            className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${type === 'simulator' ? 'bg-secondary' : ''}`}
                        >
                            <MaterialCommunityIcons
                                name="access-point"
                                size={20}
                                color={type === 'simulator' ? '#020617' : '#94A3B8'}
                            />
                            <Text className={`ml-2 font-bold ${type === 'simulator' ? 'text-primary' : 'text-text-secondary'}`}>Simulator</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Fields */}
                    <View className="gap-y-6 mb-10">
                        {type === 'plane' ? (
                            <>
                                <View>
                                    <Text className="text-text-secondary text-xs uppercase font-bold mb-2 ml-1">Aircraft Name</Text>
                                    <View className="bg-card rounded-2xl border border-border px-4 py-4">
                                        <TextInput
                                            placeholder="e.g. Cessna 172 Skyhawk"
                                            placeholderTextColor="#64748B"
                                            className="text-white font-medium"
                                            value={name}
                                            onChangeText={setName}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <Text className="text-text-secondary text-xs uppercase font-bold mb-2 ml-1">Registration / Model Number</Text>
                                    <View className="bg-card rounded-2xl border border-border px-4 py-4">
                                        <TextInput
                                            placeholder="e.g. N23456"
                                            placeholderTextColor="#64748B"
                                            className="text-white font-medium"
                                            value={modelNumber}
                                            onChangeText={setModelNumber}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <Text className="text-text-secondary text-xs uppercase font-bold mb-2 ml-1">Manufacturer</Text>
                                    <View className="bg-card rounded-2xl border border-border px-4 py-4">
                                        <TextInput
                                            placeholder="e.g. Cessna"
                                            placeholderTextColor="#64748B"
                                            className="text-white font-medium"
                                            value={manufacturer}
                                            onChangeText={setManufacturer}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <Text className="text-text-secondary text-xs uppercase font-bold mb-2 ml-1">Purchase Date</Text>
                                    <View className="bg-card rounded-2xl border border-border px-4 py-4">
                                        <TextInput
                                            placeholder="YYYY-MM-DD"
                                            placeholderTextColor="#64748B"
                                            className="text-white font-medium"
                                            value={purchaseDate}
                                            onChangeText={setPurchaseDate}
                                        />
                                    </View>
                                </View>
                            </>
                        ) : (
                            <>
                                <View>
                                    <Text className="text-text-secondary text-xs uppercase font-bold mb-2 ml-1">Simulator Model</Text>
                                    <View className="bg-card rounded-2xl border border-border px-4 py-4">
                                        <TextInput
                                            placeholder="e.g. FTD Level 5"
                                            placeholderTextColor="#64748B"
                                            className="text-white font-medium"
                                            value={simulatorModel}
                                            onChangeText={setSimulatorModel}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <Text className="text-text-secondary text-xs uppercase font-bold mb-2 ml-1">Installation Date</Text>
                                    <View className="bg-card rounded-2xl border border-border px-4 py-4">
                                        <TextInput
                                            placeholder="YYYY-MM-DD"
                                            placeholderTextColor="#64748B"
                                            className="text-white font-medium"
                                            value={installationDate}
                                            onChangeText={setInstallationDate}
                                        />
                                    </View>
                                </View>
                            </>
                        )}

                        <View>
                            <Text className="text-text-secondary text-xs uppercase font-bold mb-2 ml-1">Location / Base</Text>
                            <View className="bg-card rounded-2xl border border-border px-4 py-4">
                                <TextInput
                                    placeholder="e.g. Hangar A1 / Room 102"
                                    placeholderTextColor="#64748B"
                                    className="text-white font-medium"
                                    value={location}
                                    onChangeText={setLocation}
                                />
                            </View>
                        </View>

                        <View>
                            <Text className="text-text-secondary text-xs uppercase font-bold mb-2 ml-1">Max Occupancy</Text>
                            <View className="bg-card rounded-2xl border border-border px-4 py-4">
                                <TextInput
                                    placeholder="e.g. 4"
                                    placeholderTextColor="#64748B"
                                    className="text-white font-medium"
                                    keyboardType="numeric"
                                    value={maxOccupancy}
                                    onChangeText={setMaxOccupancy}
                                />
                            </View>
                        </View>

                        <View>
                            <Text className="text-text-secondary text-xs uppercase font-bold mb-2 ml-1">Initial Status</Text>
                            <View className="flex-row gap-x-3">
                                {[EquipmentStatus.Operational, EquipmentStatus.Maintenance, EquipmentStatus.Grounded].map((s) => (
                                    <TouchableOpacity
                                        key={s}
                                        onPress={() => setStatus(s)}
                                        className={`flex-1 py-3 rounded-xl border items-center ${status === s ? 'bg-secondary border-secondary' : 'bg-card border-border'}`}
                                    >
                                        <Text className={`text-[10px] font-bold uppercase ${status === s ? 'text-primary' : 'text-text-secondary'}`}>
                                            {s}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={loading}
                        className="bg-secondary mb-12 py-5 rounded-2xl flex-row items-center justify-center shadow-lg shadow-secondary/20"
                    >
                        {loading ? (
                            <ActivityIndicator color="#020617" />
                        ) : (
                            <>
                                <Feather name="check" size={20} color="#020617" />
                                <Text className="text-primary font-bold text-lg ml-2">Add to Fleet</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
