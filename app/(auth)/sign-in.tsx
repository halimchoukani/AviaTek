import { signIn } from "@/lib/api/auth";
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
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

const SignIn = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Required", "Please enter both identity and credentials.");
            return;
        }

        setIsLoading(true);
        try {
            await signIn(email, password);
            router.replace("/");
        } catch (error: any) {
            console.error('Login error:', error);
            Alert.alert("Authentication Failed", "Please check your credentials and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['#020617', '#0F172A', '#1E293B']}
                style={StyleSheet.absoluteFill}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    {/* Header Section */}
                    <View style={styles.header}>
                        <View style={styles.logoBadge}>
                            <MaterialCommunityIcons name="airplane-takeoff" size={42} color="#C9A961" />
                        </View>
                        <Text style={styles.title}>AVIA<Text style={styles.titleGold}>TEK</Text></Text>
                        <Text style={styles.subtitle}>FLIGHT OPERATIONS PORTAL</Text>
                    </View>

                    {/* Glass Login Card */}
                    <View style={styles.card}>
                        <View style={styles.inputSection}>
                            <Text style={styles.label}>OPERATOR IDENTITY</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="person-outline" size={20} color="#64748B" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="license@aviation.id"
                                    placeholderTextColor="#475569"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>

                        <View style={styles.inputSection}>
                            <Text style={styles.label}>ACCESS CREDENTIALS</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={20} color="#64748B" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor="#475569"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>
                        </View>

                        <TouchableOpacity style={styles.forgotBtn}>
                            <Text style={styles.forgotText}>Request Access Reset?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#020617" />
                            ) : (
                                <>
                                    <Text style={styles.loginBtnText}>AUTHENTICATE MISSION</Text>
                                    <Ionicons name="chevron-forward" size={20} color="#020617" />
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Register Section */}
                    <View style={styles.footerLinks}>
                        <View style={styles.registerRow}>
                             <Text style={styles.footerText}>New Pilot?</Text>
                             <TouchableOpacity onPress={() => router.push("/pilot-sign-up")}>
                                <Text style={styles.signUpText}>Initialize Account</Text>
                             </TouchableOpacity>
                        </View>
                        <View style={styles.registerRow}>
                             <Text style={styles.footerText}>New Academy?</Text>
                             <TouchableOpacity onPress={() => router.push("/academy-sign-up")}>
                                <Text style={styles.signUpText}>Partner Access</Text>
                             </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>

            {/* Bottom Warning */}
            <View style={styles.legalFooter}>
                <View style={styles.legalLine} />
                <Text style={styles.legalText}>
                    CLASSIFIED SECTION. AUTHORIZED PERSONNEL ONLY.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoBadge: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        borderWidth: 1,
        borderColor: 'rgba(201, 169, 97, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: "#C9A961",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 4,
    },
    titleGold: {
        color: '#C9A961',
    },
    subtitle: {
        color: '#64748B',
        fontSize: 12,
        letterSpacing: 2,
        marginTop: 8,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    inputSection: {
        marginBottom: 20,
    },
    label: {
        color: '#94A3B8',
        fontSize: 10,
        fontWeight: '900',
        marginBottom: 8,
        marginLeft: 4,
        letterSpacing: 1,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(51, 65, 85, 0.8)',
        height: 56,
        paddingHorizontal: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotText: {
        color: '#C9A961',
        fontSize: 13,
        fontWeight: '600',
    },
    loginBtn: {
        backgroundColor: '#C9A961',
        height: 56,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#C9A961",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    loginBtnDisabled: {
        opacity: 0.6,
    },
    loginBtnText: {
        color: '#020617',
        fontSize: 15,
        fontWeight: '900',
        marginRight: 8,
        letterSpacing: 1,
    },
    footerLinks: {
        marginTop: 32,
        gap: 12,
    },
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    footerText: {
        color: '#94A3B8',
        fontSize: 14,
    },
    signUpText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    legalFooter: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    legalLine: {
        width: 40,
        height: 2,
        backgroundColor: '#334155',
        marginBottom: 16,
    },
    legalText: {
        color: '#475569',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 1,
    },
});

export default SignIn;
