import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#020617", // darker slate
          borderTopColor: "#1e293b",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          
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
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Feather name="grid" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          title: "Resources",
          tabBarIcon: ({ color }) => (
            <Feather name="box" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: "Requests",
          tabBarIcon: ({ color }) => (
            <Feather name="clipboard" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: "Courses",
          tabBarIcon: ({ color }) => (
            <Feather name="book-open" size={24} color={color} />
          ),
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
      />
    </Tabs>
  );
}
