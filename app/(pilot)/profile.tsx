import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { appwriteConfig, databases, getCurrentUser } from "@/lib/appwrite";
import { PilotDocument } from "@/lib/types";

export default function PilotProfile() {
    const router = useRouter();
    const [pilot, setPilot] = useState<PilotDocument | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form State
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [licenseExpiry, setLicenseExpiry] = useState("");
    const [medicalClass, setMedicalClass] = useState("");
    const [medicalExpiry, setMedicalExpiry] = useState("");
    const [emergencyName, setEmergencyName] = useState("");
    const [emergencyPhone, setEmergencyPhone] = useState("");

    const fetchPilotData = async () => {
        try {
            const user = await getCurrentUser();
            // Since getCurrentUser now returns a PilotDocument (from previous user edits)
            if (user) {
                setPilot(user as unknown as PilotDocument);
                initializeForm(user as unknown as PilotDocument);
            }
        } catch (error) {
            console.error("Error fetching pilot profile:", error);
            Alert.alert("Error", "Failed to load profile data.");
        } finally {
            setLoading(false);
        }
    };

    const initializeForm = (data: PilotDocument) => {
        setFirstName(data.name || "");
        setLastName(data.lastname || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setLicenseNumber(data.licenseNumber || "");
        setLicenseExpiry(data.licenseExpiry || "");
        setMedicalClass(data.medicalClass || "");
        setMedicalExpiry(data.medicalExpiry || "");
        setEmergencyName(data.emergencyContactName || "");
        setEmergencyPhone(data.emergencyContactPhone || "");
    };

    useEffect(() => {
        fetchPilotData();
    }, []);

    const handleSave = async () => {
        if (!pilot) return;

        setSaving(true);
        try {
            const updatedData = {
                name: firstName,
                lastname: lastName,
                phone,
                email, // Email might not be editable depending on auth, but let's allow it in UI for now or disable input
                licenseNumber,
                licenseExpiry,
                medicalClass,
                medicalExpiry,
                emergencyContactName: emergencyName,
                emergencyContactPhone: emergencyPhone,
            };

            await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.pilotCollectionId,
                pilot.$id,
                updatedData
            );

            const updatedPilot = { ...pilot, ...updatedData };
            setPilot(updatedPilot as PilotDocument);
            setIsEditing(false);
            Alert.alert("Success", "Profile updated successfully.");
        } catch (error) {
            console.error("Error updating profile:", error);
            Alert.alert("Error", "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const cancelEdit = () => {
        if (pilot) initializeForm(pilot);
        setIsEditing(false);
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#C9A961" />
            </View>
        );
    }

    // Initials for avatar
    const initials = pilot ?
        `${(pilot.name || "").charAt(0)}${(pilot.lastname || "").charAt(0)}`.toUpperCase()
        : "??";

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>{initials}</Text>
                        </View>
                        <Text style={styles.headerName}>
                            Capt. {firstName} {lastName}
                        </Text>
                        <Text style={styles.headerLicense}>
                            {licenseNumber || "No License Set"}
                        </Text>

                        <TouchableOpacity
                            style={isEditing ? styles.saveButtonHeader : styles.editButton}
                            onPress={isEditing ? handleSave : () => setIsEditing(true)}
                            disabled={saving}
                        >
                            <Feather
                                name={isEditing ? "save" : "edit-2"}
                                size={16}
                                color={isEditing ? "#020617" : "#FFFFFF"}
                            />
                            <Text style={isEditing ? styles.saveButtonText : styles.editButtonText}>
                                {saving ? "Saving..." : isEditing ? "Save" : "Edit"}
                            </Text>
                        </TouchableOpacity>

                        {isEditing && (
                            <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Contact Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Feather name="mail" size={16} color="#C9A961" />
                            <Text style={styles.sectionTitle}>Contact</Text>
                        </View>

                        <View style={styles.card}>
                            <InputGroup
                                label="First Name"
                                value={firstName}
                                onChangeText={setFirstName}
                                editable={isEditing}
                            />
                            <InputGroup
                                label="Last Name"
                                value={lastName}
                                onChangeText={setLastName}
                                editable={isEditing}
                            />
                            <InputGroup
                                label="Email"
                                value={email}
                                onChangeText={setEmail}
                                editable={isEditing} // Email usually read-only, but keeping editable as per request
                                keyboardType="email-address"
                            />
                            <InputGroup
                                label="Phone"
                                value={phone}
                                onChangeText={setPhone}
                                editable={isEditing}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    {/* License Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <FontAwesome5 name="certificate" size={16} color="#C9A961" />
                            <Text style={styles.sectionTitle}>License</Text>
                        </View>

                        <View style={styles.card}>
                            <View style={styles.licenseRow}>
                                <InputGroup
                                    label="License Number"
                                    value={licenseNumber}
                                    onChangeText={setLicenseNumber}
                                    editable={isEditing}
                                    containerStyle={{ flex: 1 }}
                                />
                                {!isEditing && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>ATPL</Text>
                                    </View>
                                )}
                            </View>

                            <InputGroup
                                label="Expiry Date"
                                value={licenseExpiry}
                                onChangeText={setLicenseExpiry}
                                editable={isEditing}
                                placeholder="YYYY-MM-DD"
                                icon="calendar"
                            />
                        </View>
                    </View>

                    {/* Medical Certificate Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <FontAwesome5 name="heartbeat" size={16} color="#C9A961" />
                            <Text style={styles.sectionTitle}>Medical Certificate</Text>
                        </View>

                        <View style={styles.card}>
                            <InputGroup
                                label="Medical Class"
                                value={medicalClass}
                                onChangeText={setMedicalClass}
                                editable={isEditing}
                            />
                            <InputGroup
                                label="Expiry Date"
                                value={medicalExpiry}
                                onChangeText={setMedicalExpiry}
                                editable={isEditing}
                                placeholder="YYYY-MM-DD"
                                icon="calendar"
                            />
                        </View>
                    </View>

                    {/* Emergency Contact Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Feather name="alert-circle" size={16} color="#C9A961" />
                            <Text style={styles.sectionTitle}>Emergency Contact</Text>
                        </View>

                        <View style={styles.card}>
                            <InputGroup
                                label="Name"
                                value={emergencyName}
                                onChangeText={setEmergencyName}
                                editable={isEditing}
                            />
                            <InputGroup
                                label="Phone"
                                value={emergencyPhone}
                                onChangeText={setEmergencyPhone}
                                editable={isEditing}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// Reusable Input Component
const InputGroup = ({
    label,
    value,
    onChangeText,
    editable,
    placeholder,
    keyboardType,
    containerStyle,
    icon
}: any) => (
    <View style={[styles.inputGroup, containerStyle]}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={[styles.inputContainer, !editable && styles.inputDisabled]}>
            <TextInput
                style={[styles.input, !editable && styles.inputTextDisabled]}
                value={value}
                onChangeText={onChangeText}
                editable={editable}
                placeholder={placeholder}
                placeholderTextColor="#64748B"
                keyboardType={keyboardType}
            />
            {icon && <Feather name={icon as any} size={18} color="#64748B" style={{ marginRight: 12 }} />}
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#020617",
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
    },
    scrollContent: {
        padding: 24,
    },
    header: {
        alignItems: "center",
        marginBottom: 32,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#1E293B",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#334155",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#C9A961",
    },
    headerName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    headerLicense: {
        fontSize: 14,
        color: "#C9A961",
        marginBottom: 24,
    },
    editButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(30, 41, 59, 0.8)",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#334155",
        gap: 8,
    },
    editButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "500",
    },
    saveButtonHeader: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#C9A961",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 8,
    },
    saveButtonText: {
        color: "#020617",
        fontSize: 14,
        fontWeight: "bold",
    },
    cancelButton: {
        marginTop: 12,
    },
    cancelButtonText: {
        color: "#94A3B8",
        fontSize: 14,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 14,
        color: "#94A3B8",
        fontWeight: "500",
    },
    card: {
        backgroundColor: "#1E293B",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#334155",
        gap: 16,
    },
    inputGroup: {
        // marginBottom: 16,
    },
    inputLabel: {
        fontSize: 12,
        color: "#64748B",
        marginBottom: 6,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0F172A",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#334155",
    },
    inputDisabled: {
        backgroundColor: "transparent",
        borderColor: "#334155",
        borderWidth: 1,
    },
    input: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: "#FFFFFF",
        fontSize: 16,
    },
    inputTextDisabled: {
        color: "#FFFFFF",
    },
    licenseRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 12,
    },
    badge: {
        backgroundColor: "rgba(201, 169, 97, 0.2)",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        marginBottom: 2,
        borderWidth: 1,
        borderColor: "rgba(201, 169, 97, 0.3)",
        height: 48,
        justifyContent: 'center'
    },
    badgeText: {
        color: "#C9A961",
        fontSize: 12,
        fontWeight: "bold",
    },
});
