import { signIn } from "@/lib/api/auth";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignIn = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async () => {
        if (!form.email || !form.password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setIsSubmitting(true);
        try {
            await signIn(form.email, form.password);
            router.replace("/");
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <View className="w-full justify-center min-h-[85vh] px-4 my-6">

                {/* LOGO Placeholder */}
                <View className="justify-center items-center mb-10">
                    <View className="w-20 h-20 rounded-full bg-card items-center justify-center border border-border">
                        <Ionicons name="airplane-outline" size={32} color="#C9A961" />
                    </View>
                </View>

                <Text className="text-3xl text-text-primary text-center font-bold">
                    Aviation Identity
                </Text>
                <Text className="text-text-secondary text-center mb-10 mt-2 text-base">
                    Secure Access Portal
                </Text>

                <View className="mt-7 space-y-2">
                    <Text className="text-base text-text-secondary font-medium mb-2">Identity</Text>
                    <View className="w-full h-16 px-4 bg-card rounded-xl border border-border focus:border-secondary items-center flex-row">
                        <TextInput
                            className="flex-1 text-white font-semibold text-base"
                            value={form.email}
                            placeholder="license@aviation.id"
                            placeholderTextColor="#64748B"
                            onChangeText={(e) => setForm({ ...form, email: e })}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <View className="mt-7 space-y-2">
                    <Text className="text-base text-text-secondary font-medium mb-2">Credentials</Text>
                    <View className="w-full h-16 px-4 bg-card rounded-xl border border-border focus:border-secondary items-center flex-row">
                        <TextInput
                            className="flex-1 text-white font-semibold text-base"
                            value={form.password}
                            placeholder={"*".repeat(8)}
                            placeholderTextColor="#64748B"
                            onChangeText={(e) => setForm({ ...form, password: e })}
                            secureTextEntry
                        />
                    </View>
                </View>

                <TouchableOpacity
                    onPress={submit}
                    activeOpacity={0.7}
                    className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center mt-10 flex-row space-x-2 ${isSubmitting ? 'opacity-50' : ''}`}
                    disabled={isSubmitting}
                >
                    <Text className="text-primary font-bold text-lg mr-2">AUTHENTICATE</Text>
                    <Ionicons name="chevron-forward" size={20} color="#020617" />
                </TouchableOpacity>

                <View className="mt-5 flex-col justify-between gap-2">
                    <View className="justify-center flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-regular">
                            Sign up as a new Pilot
                        </Text>
                        <Link href={"/pilot-sign-up" as any} className="text-lg font-semibold text-secondary">
                            Register
                        </Link>
                    </View>
                    <View className="justify-center flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-regular">
                            Sign up as a new Academy
                        </Text>
                        <Link href={"/academy-sign-up" as any} className="text-lg font-semibold text-secondary">
                            Register
                        </Link>
                    </View>
                </View>
                <View className="justify-center pt-20 flex-row gap-2">
                    <Text className="text-text-secondary text-xs font-regular text-center opacity-70">
                        Authorized Personnel Only. System activity is monitored.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SignIn;
