import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { registerPilot } from "../../lib/api/pilots";

const SignUp = () => {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: "",
        lastName: "",
        email: "",
        phone: "",
        licenseNumber: "",
        password: "",
        confirmPassword: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const nextStep = () => {
        if (step === 1) {
            if (!form.name || !form.lastName || !form.email || !form.phone) {
                Alert.alert("Error", "Please fill in all required fields");
                return;
            }
        } else if (step === 2) {
            // Step 2 is optional (License Number), so we can proceed
        }
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const submit = async () => {
        if (!form.password || !form.confirmPassword) {
            Alert.alert("Error", "Please set your password");
            return;
        }

        if (form.password.length < 8) {
            Alert.alert("Error", "Password must be at least 8 characters long");
            return;
        }

        if (form.password !== form.confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        setIsSubmitting(true);
        try {
            await registerPilot(
                form.email,
                form.password,
                form.name,
                form.lastName,
                form.phone,
                form.licenseNumber,

            );

            // Navigate to the main app (tabs)
            router.replace("/(pilot)/home");
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepIndicator = () => (
        <View className="flex-row justify-center space-x-2 mb-8 gap-2">
            {[1, 2, 3].map((s) => (
                <View
                    key={s}
                    className={`h-2 rounded-full ${s === step ? 'w-8 bg-secondary' : 'w-2 bg-gray-600'} ${s < step ? 'bg-secondary opacity-50' : ''}`}
                />
            ))}
        </View>
    );

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <View className="w-full px-4 my-6">

                    {/* LOGO Placeholder */}
                    <View className="justify-center items-center mb-6">
                        <View className="w-16 h-16 rounded-full bg-card items-center justify-center border border-border">
                            <Ionicons name="airplane-outline" size={28} color="#C9A961" />
                        </View>
                    </View>

                    <Text className="text-2xl text-text-primary text-center font-bold">
                        Pilot Registration
                    </Text>
                    <Text className="text-text-secondary text-center mb-6 mt-2 text-sm">
                        Create your aviation identity
                    </Text>

                    {renderStepIndicator()}

                    <View className="space-y-4">

                        {step === 1 && (
                            <View className="gap-4">
                                {/* Full Name */}
                                <View className="flex-row gap-2 w-full">
                                    <View className="space-y-2 flex-col gap-2 w-1/2">
                                        <Text className="text-sm text-text-secondary font-medium">First Name *</Text>
                                        <View className="w-full h-14 px-4 bg-card rounded-xl border border-border focus:border-secondary items-center flex-row">
                                            <TextInput
                                                className="flex-1 text-white font-semibold text-base"
                                                value={form.name}
                                                placeholder="John"
                                                placeholderTextColor="#64748B"
                                                onChangeText={(e) => setForm({ ...form, name: e })}
                                            />
                                        </View>
                                    </View>
                                    <View className="space-y-2 flex-col gap-2 w-1/2">
                                        <Text className="text-sm text-text-secondary font-medium">Last Name *</Text>
                                        <View className="w-full h-14 px-4 bg-card rounded-xl border border-border focus:border-secondary items-center flex-row">
                                            <TextInput
                                                className="flex-1 text-white font-semibold text-base"
                                                value={form.lastName}
                                                placeholder="Doe"
                                                placeholderTextColor="#64748B"
                                                onChangeText={(e) => setForm({ ...form, lastName: e })}
                                            />
                                        </View>
                                    </View>
                                </View>

                                {/* Email */}
                                <View className="space-y-2 flex-col gap-2">
                                    <Text className="text-sm text-text-secondary font-medium">Email *</Text>
                                    <View className="w-full h-14 px-4 bg-card rounded-xl border border-border focus:border-secondary items-center flex-row">
                                        <TextInput
                                            className="flex-1 text-white font-semibold text-base"
                                            value={form.email}
                                            placeholder="pilot@aviation.id"
                                            placeholderTextColor="#64748B"
                                            onChangeText={(e) => setForm({ ...form, email: e })}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </View>
                                </View>

                                {/* Phone */}
                                <View className="space-y-2 flex-col gap-2">
                                    <Text className="text-sm text-text-secondary font-medium">Phone *</Text>
                                    <View className="w-full h-14 px-4 bg-card rounded-xl border border-border focus:border-secondary items-center flex-row">
                                        <TextInput
                                            className="flex-1 text-white font-semibold text-base"
                                            value={form.phone}
                                            placeholder="+1 (555) 123-4567"
                                            placeholderTextColor="#64748B"
                                            onChangeText={(e) => setForm({ ...form, phone: e })}
                                            keyboardType="phone-pad"
                                        />
                                    </View>
                                </View>
                            </View>
                        )}

                        {step === 2 && (
                            <View className="gap-4">
                                {/* License Number */}
                                <View className="space-y-2 flex-col gap-2">
                                    <View className="flex-row justify-between">
                                        <Text className="text-sm text-text-secondary font-medium">License Number</Text>
                                        <Text className="text-xs text-text-secondary opacity-50">(Please Provide a verified License Number)</Text>
                                    </View>
                                    <View className="w-full h-14 px-4 bg-card rounded-xl border border-border focus:border-secondary items-center flex-row">
                                        <TextInput
                                            className="flex-1 text-white font-semibold text-base"
                                            value={form.licenseNumber}
                                            placeholder="PPL-1234-US"
                                            placeholderTextColor="#64748B"
                                            onChangeText={(e) => setForm({ ...form, licenseNumber: e })}
                                        />
                                    </View>
                                    <Text className="text-xs text-text-secondary mt-2">
                                        Enter your primary pilot license number. You can verify additional ratings later in your profile.
                                    </Text>
                                </View>
                            </View>
                        )}

                        {step === 3 && (
                            <View className="gap-4">
                                {/* Password */}
                                <View className="space-y-2 flex-col gap-2">
                                    <Text className="text-sm text-text-secondary font-medium">Password *</Text>
                                    <View className="w-full h-14 px-4 bg-card rounded-xl border border-border focus:border-secondary items-center flex-row">
                                        <TextInput
                                            className="flex-1 text-white font-semibold text-base"
                                            value={form.password}
                                            placeholder="Min. 8 characters"
                                            placeholderTextColor="#64748B"
                                            onChangeText={(e) => setForm({ ...form, password: e })}
                                            secureTextEntry={!showPassword}
                                        />
                                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                            <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#64748B" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Confirm Password */}
                                <View className="space-y-2 flex-col gap-2">
                                    <Text className="text-sm text-text-secondary font-medium">Confirm Password *</Text>
                                    <View className="w-full h-14 px-4 bg-card rounded-xl border border-border focus:border-secondary items-center flex-row">
                                        <TextInput
                                            className="flex-1 text-white font-semibold text-base"
                                            value={form.confirmPassword}
                                            placeholder={"*".repeat(8)}
                                            placeholderTextColor="#64748B"
                                            onChangeText={(e) => setForm({ ...form, confirmPassword: e })}
                                            secureTextEntry={!showConfirmPassword}
                                        />
                                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            <Ionicons name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="#64748B" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}

                    </View>

                    <View className="mt-8 flex-row space-x-4 gap-4">
                        {step > 1 && (
                            <TouchableOpacity
                                onPress={prevStep}
                                activeOpacity={0.7}
                                className="flex-1 bg-card border border-border rounded-xl min-h-[56px] justify-center items-center"
                                disabled={isSubmitting}
                            >
                                <Text className="text-white font-semibold text-base">Back</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            onPress={step === 3 ? submit : nextStep}
                            activeOpacity={0.7}
                            className={`flex-1 bg-secondary rounded-xl min-h-[56px] justify-center items-center flex-row space-x-2 ${isSubmitting ? 'opacity-50' : ''}`}
                            disabled={isSubmitting}
                        >
                            <Text className="text-primary font-bold text-lg mr-2">
                                {step === 3 ? 'Finish' : 'Next'}
                            </Text>
                            {step < 3 && <Ionicons name="chevron-forward" size={20} color="#020617" />}
                        </TouchableOpacity>
                    </View>

                    <View className="justify-center pt-6 flex-row gap-2">
                        <Text className="text-text-secondary text-sm font-regular">
                            Already have an account?
                        </Text>
                        <Link href={"/sign-in" as any} className="text-secondary text-sm font-semibold">
                            Sign In
                        </Link>
                    </View>

                    <Text className="text-text-secondary text-xs font-regular text-center opacity-70 mt-8 px-4">
                        By registering, you agree to the Aviation Identity Terms of Service.
                    </Text>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignUp;
