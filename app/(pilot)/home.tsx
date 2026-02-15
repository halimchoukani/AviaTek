import { signOut } from "@/lib/appwrite";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PilotHome() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Pilot Dashboard</Text>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => router.push("/(pilot)/profile")}
                >
                    <View style={styles.iconContainer}>
                        <Feather name="user" size={24} color="#C9A961" />
                    </View>
                    <View>
                        <Text style={styles.cardTitle}>My Profile</Text>
                        <Text style={styles.cardSubtitle}>View and edit your pilot profile</Text>
                    </View>
                    <Feather name="chevron-right" size={24} color="#64748B" style={{ marginLeft: "auto" }} />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <TouchableOpacity
                    style={styles.card}
                    onPress={async () => { await signOut(); router.replace("/(auth)/sign-in") }}
                >
                    <Text style={styles.cardTitle}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#020617",
    },
    content: {
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 24,
    },
    card: {
        backgroundColor: "#1E293B",
        padding: 16,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        borderWidth: 1,
        borderColor: "#334155",
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(201, 169, 97, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(201, 169, 97, 0.2)",
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    cardSubtitle: {
        fontSize: 14,
        color: "#94A3B8",
    },
});