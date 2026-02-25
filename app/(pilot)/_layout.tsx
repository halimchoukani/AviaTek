import { signOut } from "@/lib/appwrite";
import { Feather } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { Alert } from "react-native";

export default function PilotLayout() {
    const router = useRouter();

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await signOut();
                            router.replace("/(auth)/sign-in");
                        } catch (error) {
                            Alert.alert("Error", "Failed to logout. Please try again.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#020617",
                    borderTopColor: "#1E293B",
                    height: 60,
                    paddingBottom: 8,
                },
                tabBarActiveTintColor: "#C9A961",
                tabBarInactiveTintColor: "#64748B",
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Dashboard",
                    tabBarIcon: ({ color }) => <Feather name="grid" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profiler",
                    tabBarIcon: ({ color }) => <Feather name="calendar" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="exit"
                options={{
                    title: "Exit",
                    tabBarIcon: ({ color }) => (
                        <Feather name="log-out" size={24} color={color} />
                    ),
                }}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        router.push("/exit");
                    },
                }}
            />
        </Tabs>
    );
}