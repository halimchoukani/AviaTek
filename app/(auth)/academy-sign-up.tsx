import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { registerAcademy } from "@/lib/api/academies";

export default function AcademySignUp() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    // Form State
    // Step 1: Org Details
    const [orgName, setOrgName] = useState("");
    const [orgType, setOrgType] = useState(""); // Part 141, Part 61, etc.
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");

    // Step 2: Certifications
    const [certifications, setCertifications] = useState<string[]>([]);

    // Step 3: Contact & Admin
    const [orgEmail, setOrgEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [website, setWebsite] = useState("");
    const [adminName, setAdminName] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        if (!orgName || !adminEmail || !password || !orgType) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

        setLoading(true);
        try {
            await registerAcademy({
                name: orgName,
                country,
                city,
                address,
                email: orgEmail,
                phone,
                website,
                adminName,
                adminEmail,
                password
            });

            Alert.alert(
                "Success",
                "Academy registered successfully!",
                [{ text: "OK", onPress: () => router.replace("/(academy)/home") }]
            );
        } catch (error: any) {
            console.error(error);
            Alert.alert("Registration Failed", error.message || "An unknown error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (step === 1) {
            if (!orgName || !orgType) {
                Alert.alert("Error", "Please enter Organization Name and Type.");
                return;
            }
        }
        if (step === 3) {
            if (!adminEmail || !password || !adminName) {
                Alert.alert("Error", "Please enter Administrator Name, Email, and Password.");
                return;
            }
        }
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    const toggleCertification = (cert: string) => {
        if (certifications.includes(cert)) {
            setCertifications(certifications.filter(c => c !== cert));
        } else {
            setCertifications([...certifications, cert]);
        }
    };

    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>Organization Details</Text>
            <Text style={styles.sectionSubtitle}>Basic information about your academy</Text>

            <InputLabel label="Academy Name" />
            <TextInput
                style={styles.input}
                placeholder="e.g., Horizon Flight Academy"
                placeholderTextColor="#64748B"
                value={orgName}
                onChangeText={setOrgName}
            />

            {/* <InputLabel label="Organization Type" />
            <View style={styles.row}>
                <TypeCard
                    title="Part 141 School"
                    icon="certificate"
                    selected={orgType === "Part 141"}
                    onPress={() => setOrgType("Part 141")}
                />
                <TypeCard
                    title="Part 61 School"
                    icon="plane"
                    selected={orgType === "Part 61"}
                    onPress={() => setOrgType("Part 61")}
                />
            </View>
            <View style={[styles.row, { marginTop: 12 }]}>
                <TypeCard
                    title="Type Rating Org"
                    icon="users"
                    selected={orgType === "TRTO"}
                    onPress={() => setOrgType("TRTO")}
                />
                <TypeCard
                    title="Other"
                    icon="globe"
                    selected={orgType === "Other"}
                    onPress={() => setOrgType("Other")}
                />
            </View> */}

            <View style={[styles.row, { marginTop: 24 }]}>
                <View style={{ flex: 1, marginRight: 8 }}>
                    <InputLabel label="Country" />
                    <TextInput
                        style={styles.input}
                        placeholder="United States"
                        placeholderTextColor="#64748B"
                        value={country}
                        onChangeText={setCountry}
                    />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                    <InputLabel label="City" />
                    <TextInput
                        style={styles.input}
                        placeholder="Los Angeles"
                        placeholderTextColor="#64748B"
                        value={city}
                        onChangeText={setCity}
                    />
                </View>
            </View>

            <View style={{ marginTop: 16 }}>
                <InputLabel label="Address" />
                <TextInput
                    style={styles.input}
                    placeholder="123 Airport Road, Hangar 5"
                    placeholderTextColor="#64748B"
                    value={address}
                    onChangeText={setAddress}
                />
            </View>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <Text style={styles.sectionSubtitle}>Select your regulatory approvals</Text>

            {/* <CertOption
                title="FAA Part 141"
                subtitle="FAA Approved Flight School"
                selected={certifications.includes("FAA Part 141")}
                onPress={() => toggleCertification("FAA Part 141")}
            />
            <CertOption
                title="FAA Part 61"
                subtitle="FAA Certified Flight Training"
                selected={certifications.includes("FAA Part 61")}
                onPress={() => toggleCertification("FAA Part 61")}
            />
            <CertOption
                title="EASA ATO"
                subtitle="European Aviation Safety Agency"
                selected={certifications.includes("EASA ATO")}
                onPress={() => toggleCertification("EASA ATO")}
            />
            <CertOption
                title="CASA Part 141"
                subtitle="Australian Civil Aviation Safety Authority"
                selected={certifications.includes("CASA Part 141")}
                onPress={() => toggleCertification("CASA Part 141")}
            /> */}
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <Text style={styles.sectionSubtitle}>How students and authorities can reach you</Text>

            <InputLabel label="Organization Email" />
            <TextInput
                style={styles.input}
                placeholder="contact@academy.com"
                placeholderTextColor="#64748B"
                keyboardType="email-address"
                autoCapitalize="none"
                value={orgEmail}
                onChangeText={setOrgEmail}
            />

            <InputLabel label="Phone Number" />
            <TextInput
                style={styles.input}
                placeholder="+1 (555) 123-4567"
                placeholderTextColor="#64748B"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
            />

            <InputLabel label="Website (Optional)" />
            <TextInput
                style={styles.input}
                placeholder="https://www.academy.com"
                placeholderTextColor="#64748B"
                autoCapitalize="none"
                value={website}
                onChangeText={setWebsite}
            />

            <View style={styles.divider} />
            <Text style={[styles.sectionTitle, { fontSize: 16 }]}>Primary Administrator</Text>

            <InputLabel label="Full Name" />
            <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#64748B"
                value={adminName}
                onChangeText={setAdminName}
            />

            <InputLabel label="Admin Email" />
            <TextInput
                style={styles.input}
                placeholder="admin@academy.com"
                placeholderTextColor="#64748B"
                keyboardType="email-address"
                autoCapitalize="none"
                value={adminEmail}
                onChangeText={setAdminEmail}
            />

            <InputLabel label="Password" />
            <TextInput
                style={styles.input}
                placeholder="********"
                placeholderTextColor="#64748B"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
        </View>
    );

    const renderStep4 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>Review & Create</Text>
            <Text style={styles.sectionSubtitle}>Confirm your organization details</Text>

            <View style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                    <View style={styles.iconContainer}>
                        <FontAwesome5 name="building" size={20} color="#C9A961" />
                    </View>
                    <View>
                        <Text style={styles.reviewTitle}>{orgName}</Text>
                        <Text style={styles.reviewSubtitle}>{city}, {country}</Text>
                    </View>
                </View>

                <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Type</Text>
                    <Text style={styles.reviewValue}>{orgType}</Text>
                </View>
                <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Certifications</Text>
                    <View style={{ alignItems: 'flex-end' }}>
                        {certifications.map(c => (
                            <Text key={c} style={styles.reviewValue}>{c}</Text>
                        ))}
                        {certifications.length === 0 && <Text style={styles.reviewValue}>None</Text>}
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Admin</Text>
                    <Text style={styles.reviewValue}>{adminName}</Text>
                </View>
                <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Email</Text>
                    <Text style={styles.reviewValue}>{adminEmail}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <View style={styles.logoContainer}>
                            <FontAwesome5 name="plane" size={16} color="#C9A961" />
                        </View>
                        <Text style={styles.headerTitle}>Create Your Academy</Text>
                        <Text style={styles.headerSubtitle}>Set up your flight training organization</Text>
                    </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBar}>
                    {[1, 2, 3, 4].map((s) => (
                        <View key={s} style={styles.progressStepContainer}>
                            <View style={[
                                styles.progressStep,
                                step === s && styles.progressStepActive,
                                step > s && styles.progressStepCompleted
                            ]}>
                                {step > s ? (
                                    <Feather name="check" size={14} color="#020617" />
                                ) : (
                                    <Text style={[styles.stepNumber, step === s && styles.stepNumberActive]}>{s}</Text>
                                )}
                            </View>
                            {s < 4 && <View style={[styles.progressLine, step > s && styles.progressLineCompleted]} />}
                        </View>
                    ))}
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}
                </ScrollView>

                <View style={styles.footer}>
                    {step > 1 && (
                        <TouchableOpacity style={styles.prevButton} onPress={prevStep}>
                            <Feather name="chevron-left" size={20} color="#FFF" />
                            <Text style={styles.prevButtonText}>Back</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[styles.nextButton, step === 1 && { flex: 1 }]}
                        onPress={step === 4 ? handleRegister : nextStep}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#020617" />
                        ) : (
                            <>
                                <Text style={styles.nextButtonText}>
                                    {step === 4 ? "Create Organization" : "Continue"}
                                </Text>
                                {step < 4 && <Feather name="chevron-right" size={20} color="#020617" />}
                                {step === 4 && <Feather name="check" size={20} color="#020617" />}
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const InputLabel = ({ label }: { label: string }) => (
    <Text style={styles.inputLabel}>{label}</Text>
);

const TypeCard = ({ title, icon, selected, onPress }: any) => (
    <TouchableOpacity
        style={[styles.typeCard, selected && styles.typeCardSelected]}
        onPress={onPress}
    >
        <FontAwesome5 name={icon} size={20} color={selected ? "#C9A961" : "#64748B"} />
        <Text style={[styles.typeCardTitle, selected && styles.typeCardTitleSelected]}>{title}</Text>
    </TouchableOpacity>
);

const CertOption = ({ title, subtitle, selected, onPress }: any) => (
    <TouchableOpacity
        style={[styles.certOption, selected && styles.certOptionSelected]}
        onPress={onPress}
    >
        <View style={{ flex: 1 }}>
            <Text style={[styles.certTitle, selected && styles.certTitleSelected]}>{title}</Text>
            <Text style={styles.certSubtitle}>{subtitle}</Text>
        </View>
        <View style={[styles.radio, selected && styles.radioSelected]}>
            {selected && <View style={styles.radioInner} />}
        </View>
    </TouchableOpacity>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#020617",
    },
    header: {
        paddingTop: 16,
        paddingBottom: 24,
        paddingHorizontal: 24,
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: 'center'
    },
    backButton: {
        position: 'absolute',
        left: 24,
        top: 24,
        zIndex: 10
    },
    headerCenter: {
        alignItems: 'center'
    },
    logoContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#1E293B",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#334155"
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    headerSubtitle: {
        fontSize: 12,
        color: "#94A3B8",
        marginTop: 4,
    },
    progressBar: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
        paddingHorizontal: 48,
    },
    progressStepContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    progressStep: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#C9A961",
        justifyContent: "center",
        alignItems: "center",
    },
    progressStepActive: {
        backgroundColor: "#C9A961",
    },
    progressStepCompleted: {
        backgroundColor: "#C9A961",
    },
    stepNumber: {
        color: "#C9A961",
        fontSize: 14,
        fontWeight: "bold",
    },
    stepNumberActive: {
        color: "#020617",
    },
    progressLine: {
        width: 40,
        height: 1,
        backgroundColor: "#334155",
        marginHorizontal: 8,
    },
    progressLineCompleted: {
        backgroundColor: "#C9A961",
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    stepContainer: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: "#94A3B8",
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: "500",
        color: "#94A3B8",
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: "#1E293B",
        borderWidth: 1,
        borderColor: "#334155",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: "#FFFFFF",
        fontSize: 14,
    },
    row: {
        flexDirection: "row",
        gap: 12,
    },
    typeCard: {
        flex: 1,
        backgroundColor: "#1E293B",
        borderWidth: 1,
        borderColor: "#334155",
        borderRadius: 12,
        padding: 16,
        gap: 8,
        height: 100,
        justifyContent: 'space-between'
    },
    typeCardSelected: {
        borderColor: "#C9A961",
        backgroundColor: "rgba(201, 169, 97, 0.1)",
    },
    typeCardTitle: {
        color: "#94A3B8",
        fontSize: 12,
        fontWeight: "500",
    },
    typeCardTitleSelected: {
        color: "#C9A961",
    },
    certOption: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#1E293B",
        borderWidth: 1,
        borderColor: "#334155",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    certOptionSelected: {
        borderColor: "#C9A961",
        backgroundColor: "rgba(201, 169, 97, 0.05)",
    },
    certTitle: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 14,
        marginBottom: 4,
    },
    certTitleSelected: {
        color: "#C9A961",
    },
    certSubtitle: {
        color: "#64748B",
        fontSize: 12,
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#64748B",
        justifyContent: "center",
        alignItems: "center",
    },
    radioSelected: {
        borderColor: "#C9A961",
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#C9A961",
    },
    footer: {
        flexDirection: "row",
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: "#1E293B",
        gap: 12,
    },
    prevButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#334155",
        gap: 8,
    },
    prevButtonText: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
    nextButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: "#C9A961",
        gap: 8,
    },
    nextButtonText: {
        color: "#020617",
        fontWeight: "bold",
        fontSize: 16,
    },
    divider: {
        height: 1,
        backgroundColor: "#334155",
        marginVertical: 24,
    },
    reviewCard: {
        backgroundColor: "#1E293B",
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: "#334155",
    },
    reviewHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        marginBottom: 24,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: "rgba(201, 169, 97, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(201, 169, 97, 0.2)",
    },
    reviewTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    reviewSubtitle: {
        fontSize: 14,
        color: "#94A3B8",
    },
    reviewRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    reviewLabel: {
        fontSize: 14,
        color: "#94A3B8",
    },
    reviewValue: {
        fontSize: 14,
        color: "#FFFFFF",
        fontWeight: "500",
    },
});
