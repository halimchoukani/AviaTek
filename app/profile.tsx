import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
    const router = useRouter();
    const [orgName, setOrgName] = useState("Horizon Flight Academy");
    const [address, setAddress] = useState("123 Airport Road, Hangar 5, LAX");

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header Banner - Gold Gradient */}
            <LinearGradient
                colors={['#C9A961', '#856f35', '#020617']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.headerBanner}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.safeContent}>
                    {/* Top Bar with Back Button */}
                    <View style={styles.topBar}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.iconButton}
                        >
                            <Feather name="arrow-left" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <Feather name="edit-2" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>

                        {/* Profile Card */}
                        <View style={styles.profileCard}>
                            {/* Profile Icon - Floating */}
                            <View style={styles.floatingIcon}>
                                <FontAwesome5 name="building" size={32} color="#C9A961" />
                            </View>

                            <View style={styles.profileCardContent}>
                                <View style={styles.profileHeader}>
                                    <Text style={styles.profileName}>Horizon Flight Academy</Text>
                                    <View style={styles.verifiedBadge}>
                                        <Feather name="check-circle" size={10} color="#4ADE80" />
                                        <Text style={styles.verifiedText}>VERIFIED</Text>
                                    </View>
                                </View>
                                <Text style={styles.profileSubtitle}>FAA Part 141</Text>

                                <View style={styles.locationRow}>
                                    <Feather name="map-pin" size={12} color="#94A3B8" />
                                    <Text style={styles.locationText}>Los Angeles, CA, USA</Text>
                                </View>

                                {/* Stats */}
                                <View style={styles.statsContainer}>
                                    <View style={styles.statItem}>
                                        <Text style={styles.statValue}>142</Text>
                                        <Text style={styles.statLabel}>Pilots</Text>
                                    </View>
                                    <View style={[styles.statItem, styles.statDivider]}>
                                        <Text style={[styles.statValue, styles.textSecondary]}>12</Text>
                                        <Text style={styles.statLabel}>Aircraft</Text>
                                    </View>
                                    <View style={[styles.statItem, styles.statDivider]}>
                                        <Text style={styles.statValue}>2018</Text>
                                        <Text style={styles.statLabel}>Est.</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionButtonsRow}>
                            <TouchableOpacity style={styles.actionButton}>
                                <Feather name="mail" size={20} color="#C9A961" />
                                <Text style={styles.actionButtonText}>Email</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Feather name="phone" size={20} color="#C9A961" />
                                <Text style={styles.actionButtonText}>Call</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Feather name="globe" size={20} color="#C9A961" />
                                <Text style={styles.actionButtonText}>Website</Text>
                            </TouchableOpacity>
                        </View>

                        {/* General Settings */}
                        <View style={styles.settingsCard}>
                            <View style={styles.settingsHeader}>
                                <View style={styles.settingsHeaderLeft}>
                                    <View style={styles.settingsIconContainer}>
                                        <Feather name="settings" size={18} color="#C9A961" />
                                    </View>
                                    <View>
                                        <Text style={styles.settingsTitle}>General Settings</Text>
                                        <Text style={styles.settingsSubtitle}>Name, location, contact info</Text>
                                    </View>
                                </View>
                                <Feather name="chevron-right" size={16} color="#64748B" />
                            </View>

                            {/* Inputs */}
                            <View style={styles.inputsContainer}>
                                <View>
                                    <Text style={styles.inputLabel}>Organization Name</Text>
                                    <TextInput
                                        value={orgName}
                                        onChangeText={setOrgName}
                                        style={styles.textInput}
                                        placeholderTextColor="#64748B"
                                    />
                                </View>
                                <View>
                                    <Text style={styles.inputLabel}>Address</Text>
                                    <TextInput
                                        value={address}
                                        onChangeText={setAddress}
                                        style={styles.textInput}
                                        placeholderTextColor="#64748B"
                                    />
                                </View>

                                <TouchableOpacity style={styles.saveButton}>
                                    <Text style={styles.saveButtonText}>Save Changes</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Menu List */}
                        <View style={styles.menuList}>
                            <MenuOption icon="users" title="Team Members" subtitle="4 members" />
                            <MenuOption icon="award" title="Certifications" subtitle="2 active" />
                            <MenuOption icon="link" title="Integrations" subtitle="Moodle, Calendar, Payments" />
                            <MenuOption icon="credit-card" title="Billing & Plan" subtitle="Professional" />
                        </View>

                        {/* Footer */}
                        <TouchableOpacity style={styles.deleteButton}>
                            <Feather name="trash-2" size={16} color="#EF4444" />
                            <Text style={styles.deleteButtonText}>Delete Organization</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
}

function MenuOption({ icon, title, subtitle }: { icon: any, title: string, subtitle: string }) {
    return (
        <TouchableOpacity style={styles.menuOption}>
            <View style={styles.menuOptionLeft}>
                <View style={styles.menuOptionIconContainer}>
                    <Feather name={icon} size={18} color="#C9A961" />
                </View>
                <View>
                    <Text style={styles.menuOptionTitle}>{title}</Text>
                    <Text style={styles.menuOptionSubtitle}>{subtitle}</Text>
                </View>
            </View>
            <Feather name="chevron-right" size={16} color="#475569" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#020617",
    },
    headerBanner: {
        height: 192,
        width: '100%',
        position: 'absolute',
        top: 0,
    },
    safeArea: {
        flex: 1,
    },
    safeContent: {
        flex: 1,
        paddingHorizontal: 16,
    },
    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        marginBottom: 16,
    },
    iconButton: {
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        padding: 8,
        borderRadius: 9999,
    },
    scrollView: {
        flex: 1,
    },
    profileCard: {
        backgroundColor: "#1E293B",
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#1F2937",
        position: "relative",
        marginTop: 32,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 5,
    },
    floatingIcon: {
        position: "absolute",
        top: -40,
        left: 24,
        height: 80,
        width: 80,
        backgroundColor: "#1E293B",
        borderWidth: 1,
        borderColor: "#C9A961",
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        zIndex: 10,
    },
    profileCardContent: {
        marginTop: 40,
    },
    profileHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    profileName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    verifiedBadge: {
        backgroundColor: "rgba(74, 222, 128, 0.2)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 9999,
        borderWidth: 1,
        borderColor: "rgba(74, 222, 128, 0.3)",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    verifiedText: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#4ADE80",
    },
    profileSubtitle: {
        fontSize: 12,
        color: "#9CA3AF",
        marginTop: 4,
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 8,
    },
    locationText: {
        fontSize: 14,
        color: "#94A3B8",
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: "#1F2937",
        marginTop: 24,
        paddingTop: 24,
    },
    statItem: {
        alignItems: "center",
        flex: 1,
    },
    statDivider: {
        borderLeftWidth: 1,
        borderLeftColor: "#1F2937",
    },
    statValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    statLabel: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 4,
    },
    textSecondary: {
        color: "#C9A961",
    },
    actionButtonsRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 24,
    },
    actionButton: {
        flex: 1,
        backgroundColor: "#1E293B",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#1F2937",
    },
    actionButtonText: {
        fontSize: 12,
        color: "#9CA3AF",
        marginTop: 8,
    },
    settingsCard: {
        backgroundColor: "#1E293B",
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#1F2937",
    },
    settingsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    settingsHeaderLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    settingsIconContainer: {
        padding: 8,
        backgroundColor: "#1F2937",
        borderRadius: 8,
    },
    settingsTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    settingsSubtitle: {
        fontSize: 12,
        color: "#6B7280",
    },
    inputsContainer: {
        gap: 16,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: "500",
        color: "#6B7280",
        marginBottom: 8,
        marginLeft: 4,
    },
    textInput: {
        backgroundColor: "#020617",
        borderWidth: 1,
        borderColor: "#374151",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: "#FFFFFF",
        fontSize: 14,
    },
    saveButton: {
        backgroundColor: "#C9A961",
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center",
        marginTop: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    saveButtonText: {
        color: "#020617",
        fontWeight: "bold",
    },
    menuList: {
        gap: 12,
        marginBottom: 32,
    },
    menuOption: {
        backgroundColor: "#1E293B",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#1F2937",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    menuOptionLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    menuOptionIconContainer: {
        width: 40,
        height: 40,
        backgroundColor: "#020617",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#1F2937",
    },
    menuOptionTitle: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 14,
    },
    menuOptionSubtitle: {
        color: "#6B7280",
        fontSize: 12,
    },
    deleteButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginBottom: 32,
        paddingVertical: 16,
    },
    deleteButtonText: {
        color: "#EF4444",
        fontWeight: "500",
        fontSize: 14,
    },
});
