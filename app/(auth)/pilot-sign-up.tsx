import { registerPilot } from "@/lib/api/pilots";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const SignUp = () => {
    const router = useRouter();
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

    const nextStep = () => {
        if (step === 1) {
            if (!form.name || !form.lastName || !form.email || !form.phone) {
                Alert.alert("Required Fields", "Please complete all contact identity fields.");
                return;
            }
        }
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const submit = async () => {
        if (!form.password || !form.confirmPassword) {
            Alert.alert("Password Required", "Please set your access credentials.");
            return;
        }

        if (form.password.length < 8) {
            Alert.alert("Security Check", "Password must be at least 8 characters for mission security.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            Alert.alert("Mismatch", "Access credentials do not match.");
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
            router.replace("/(pilot)/home");
        } catch (error: any) {
            console.error(error);
            Alert.alert("System Error", error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepIndicator = () => (
        <View style={styles.indicatorContainer}>
            {[1, 2, 3].map((s) => (
                <View key={s} style={[
                    styles.indicator,
                    s === step && styles.indicatorActive,
                    s < step && styles.indicatorComplete
                ]} />
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['#020617', '#0F172A', '#1E293B']}
                style={StyleSheet.absoluteFill}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.logoBadge}>
                            <MaterialCommunityIcons name="airplane-takeoff" size={32} color="#C9A961" />
                        </View>
                        <Text style={styles.title}>PILOT <Text style={styles.titleGold}>JOINING</Text></Text>
                        <Text style={styles.subtitle}>INITIALIZE FLIGHT PROFILE</Text>
                    </View>

                    {renderStepIndicator()}

                    {/* Step Card */}
                    <View style={styles.card}>
                        {step === 1 && (
                            <View>
                                <Text style={styles.stepTitle}>Contact Telemetry</Text>
                                <View style={styles.row}>
                                    <View style={{ flex: 1, marginRight: 8 }}>
                                        <Text style={styles.label}>FIRST NAME</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={form.name}
                                            placeholder="John"
                                            placeholderTextColor="#475569"
                                            onChangeText={(e) => setForm({ ...form, name: e })}
                                        />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 8 }}>
                                        <Text style={styles.label}>LAST NAME</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={form.lastName}
                                            placeholder="Doe"
                                            placeholderTextColor="#475569"
                                            onChangeText={(e) => setForm({ ...form, lastName: e })}
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>EMAIL FREQUENCY</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={form.email}
                                        placeholder="pilot@aviation.id"
                                        placeholderTextColor="#475569"
                                        onChangeText={(e) => setForm({ ...form, email: e })}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>COMMS CHANNEL (PHONE)</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={form.phone}
                                        placeholder="+1 (555) 000-0000"
                                        placeholderTextColor="#475569"
                                        onChangeText={(e) => setForm({ ...form, phone: e })}
                                        keyboardType="phone-pad"
                                    />
                                </View>
                            </View>
                        )}

                        {step === 2 && (
                            <View>
                                <Text style={styles.stepTitle}>License & Rank</Text>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>PRIMARY LICENSE NUMBER</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={form.licenseNumber}
                                        placeholder="PPL-1234-US"
                                        placeholderTextColor="#475569"
                                        onChangeText={(e) => setForm({ ...form, licenseNumber: e })}
                                        autoCapitalize="characters"
                                    />
                                </View>
                                <Text style={styles.infoText}>
                                    Enter your primary license number. This will be verified by the academy flight department.
                                </Text>
                            </View>
                        )}

                        {step === 3 && (
                            <View>
                                <Text style={styles.stepTitle}>Secure Credentials</Text>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>ACCESS PASSWORD</Text>
                                    <View style={styles.passwordWrapper}>
                                        <TextInput
                                            style={[styles.input, { borderBottomWidth: 0, marginBottom: 0 }]}
                                            value={form.password}
                                            placeholder="Min. 8 characters"
                                            placeholderTextColor="#475569"
                                            onChangeText={(e) => setForm({ ...form, password: e })}
                                            secureTextEntry={!showPassword}
                                        />
                                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                            <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#64748B" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>CONFIRM PASSWORD</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={form.confirmPassword}
                                        placeholder="Repeat password"
                                        placeholderTextColor="#475569"
                                        onChangeText={(e) => setForm({ ...form, confirmPassword: e })}
                                        secureTextEntry={!showPassword}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Navigation Buttons */}
                        <View style={styles.navRow}>
                            {step > 1 && (
                                <TouchableOpacity style={styles.backBtn} onPress={prevStep}>
                                    <Text style={styles.backBtnText}>PREVIOUS</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={[styles.nextBtn, isSubmitting && { opacity: 0.7 }]}
                                onPress={step === 3 ? submit : nextStep}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color="#020617" />
                                ) : (
                                    <>
                                        <Text style={styles.nextBtnText}>{step === 3 ? 'FINALIZE' : 'NEXT PHASE'}</Text>
                                        <Ionicons name="chevron-forward" size={18} color="#020617" />
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Existing Operator?</Text>
                        <Link href={"/sign-in" as any} style={styles.signInLink}>
                            AUTHENTICATE
                        </Link>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    scrollContent: {
        padding: 24,
        paddingTop: 60,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoBadge: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        borderWidth: 1,
        borderColor: 'rgba(201, 169, 97, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 2,
    },
    titleGold: {
        color: '#C9A961',
    },
    subtitle: {
        color: '#64748B',
        fontSize: 10,
        letterSpacing: 2,
        marginTop: 4,
        fontWeight: 'bold',
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 32,
    },
    indicator: {
        height: 4,
        width: 24,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
    },
    indicatorActive: {
        backgroundColor: '#C9A961',
        width: 40,
    },
    indicatorComplete: {
        backgroundColor: 'rgba(201, 169, 97, 0.4)',
    },
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: '#94A3B8',
        fontSize: 10,
        fontWeight: '900',
        marginBottom: 8,
        letterSpacing: 1,
    },
    input: {
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(51, 65, 85, 0.8)',
        height: 52,
        paddingHorizontal: 16,
        color: '#FFFFFF',
        fontSize: 15,
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(51, 65, 85, 0.8)',
        height: 52,
        paddingHorizontal: 16,
    },
    infoText: {
        color: '#64748B',
        fontSize: 12,
        lineHeight: 18,
        marginTop: 4,
    },
    navRow: {
        flexDirection: 'row',
        marginTop: 24,
        gap: 12,
    },
    backBtn: {
        flex: 1,
        height: 52,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backBtnText: {
        color: '#94A3B8',
        fontSize: 12,
        fontWeight: 'bold',
    },
    nextBtn: {
        flex: 2,
        backgroundColor: '#C9A961',
        height: 52,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    nextBtnText: {
        color: '#020617',
        fontSize: 14,
        fontWeight: '900',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        gap: 8,
        paddingBottom: 40,
    },
    footerText: {
        color: '#94A3B8',
        fontSize: 14,
    },
    signInLink: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

