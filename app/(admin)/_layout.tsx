import { Feather } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function AdminLayout() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#020617", // darker slate
                    borderTopColor: "#1e293b",
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: "#C9A961",
                tabBarInactiveTintColor: "#64748B",
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "500",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Dashboard",
                    tabBarIcon: ({ color }) => <Feather name="grid" size={24} color={color} />,
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