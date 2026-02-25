import { getAcademyById } from "@/lib/api/academies";
import { getPlanes } from "@/lib/api/planes";
import { sendRequest } from "@/lib/api/requests";
import { getSimulators } from "@/lib/api/simulators";
import { getCurrentUser } from "@/lib/appwrite";
import { AcademyDocument, PilotDocument, Plane, PreferredTimes, Simulator } from "@/lib/types";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RequestTraining() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [sessionType, setSessionType] = useState<"flight" | "simulator">("flight");
    const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
    const [date, setDate] = useState("");
    const [hours, setHours] = useState("2");
    const [notes, setNotes] = useState("");
    const [preferredTimes, setPreferredTimes] = useState<PreferredTimes>(PreferredTimes.Morning);

    // Queries
    const { data: user, isLoading: isLoadingUser } = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => getCurrentUser() as unknown as Promise<PilotDocument>,
    });

    const { data: academy, isLoading: isLoadingAcademy } = useQuery({
        queryKey: ["academy", user?.academy],
        queryFn: () => getAcademyById(user!.academy) as unknown as Promise<AcademyDocument>,
        enabled: !!user?.academy,
    });

    const { data: planes = [], isLoading: isLoadingPlanes } = useQuery({
        queryKey: ["planes", academy?.$id],
        queryFn: () => getPlanes(academy!.$id) as unknown as Promise<Plane[]>,
        enabled: !!academy?.$id,
    });

    const { data: simulators = [], isLoading: isLoadingSimulators } = useQuery({
        queryKey: ["simulators", academy?.$id],
        queryFn: () => getSimulators(academy!.$id) as unknown as Promise<Simulator[]>,
        enabled: !!academy?.$id,
    });

    // Mutation
    const { mutate: submitRequest, isPending: isSubmitting } = useMutation({
        mutationFn: sendRequest,
        onSuccess: () => {
            Alert.alert(
                "Success",
                "Your training request has been sent successfully!",
                [{ text: "OK", onPress: () => router.back() }]
            );
            queryClient.invalidateQueries({ queryKey: ["requests"] });
        },
        onError: (error) => {
            console.error("Submission error:", error);
            Alert.alert(
                "Error",
                "Failed to send training request. Please try again."
            );
        }
    });


    // Update selection when session type changes
    useEffect(() => {
        if (sessionType === "flight" && planes.length > 0) {
            setSelectedEquipment(planes[0].$id);
        } else if (sessionType === "simulator" && simulators.length > 0) {
            setSelectedEquipment(simulators[0].$id);
        } else {
            setSelectedEquipment(null);
        }
    }, [sessionType, planes, simulators]);

    // const categories = ["Recurrency", "Checkout", "Proficiency", "Type Rating", "Initial"];

    const selectPreferredTime = (time: PreferredTimes) => {
        setPreferredTimes(time);
    };

    const handleSubmit = async () => {
        if (!user) {
            Alert.alert("Error", "You must be logged in to send a request.");
            return;
        }

        if (!date || !selectedEquipment || !preferredTimes) {
            Alert.alert(
                "Error",
                "Please fill in all required fields (Date, Equipment, Preferred Time)."
            );
            return;
        }

        submitRequest({
            pilotId: user.$id,
            academyId: academy?.$id || user.academy || "",
            equipmentId: selectedEquipment,
            note: notes,
            startDate: date,
            hours: parseFloat(hours) || 0,
            preferredTimes: preferredTimes,
        });
    };

    if (isLoadingUser || isLoadingAcademy || isLoadingPlanes || isLoadingSimulators) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#C9A961" />
                </View>
            </SafeAreaView>
        );
    }

    const currentEquipmentList = sessionType === "flight" ? planes : simulators;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Request Training</Text>
                    <Text style={styles.headerSub}>Session Booking</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Session Type */}
                <Text style={styles.label}>Session Type</Text>
                <View style={styles.typeRow}>
                    <TouchableOpacity
                        style={[styles.typeBox, sessionType === "flight" && styles.typeBoxActive]}
                        onPress={() => setSessionType("flight")}
                    >
                        <MaterialCommunityIcons name="airplane" size={32} color={sessionType === "flight" ? "#C9A961" : "#94A3B8"} />
                        <Text style={[styles.typeLabel, sessionType === "flight" && styles.typeLabelActive]}>Flight</Text>
                        <Text style={styles.typeSub}>Aircraft session</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.typeBox, sessionType === "simulator" && styles.typeBoxActive]}
                        onPress={() => setSessionType("simulator")}
                    >
                        <MaterialCommunityIcons name="monitor" size={32} color={sessionType === "simulator" ? "#C9A961" : "#94A3B8"} />
                        <Text style={[styles.typeLabel, sessionType === "simulator" && styles.typeLabelActive]}>Simulator</Text>
                        <Text style={styles.typeSub}>SIM device</Text>
                    </TouchableOpacity>
                </View>

                {/* Select Equipment */}
                <Text style={styles.label}>Select {sessionType === "flight" ? "Aircraft" : "Simulator"}</Text>
                {currentEquipmentList.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No {sessionType}s available</Text>
                    </View>
                ) : (
                    currentEquipmentList.map((item) => (
                        <TouchableOpacity
                            key={item.$id}
                            style={[styles.aircraftItem, selectedEquipment === item.$id && styles.aircraftItemActive]}
                            onPress={() => setSelectedEquipment(item.$id)}
                        >
                            <View>
                                <Text style={styles.aircraftName}>
                                    {sessionType === "flight"
                                        ? (item as Plane).name
                                        : (item as Simulator).simulatorModel}
                                </Text>
                                <Text style={styles.aircraftId}>
                                    {sessionType === "flight"
                                        ? (item as Plane).modelNumber
                                        : (item as Simulator).location}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}

                {/* Training Category 
                <Text style={styles.label}>Training Category</Text>
                <View style={styles.categoryWrap}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.categoryBadge, category === cat && styles.categoryBadgeActive]}
                            onPress={() => setCategory(cat)}
                        >
                            <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                */}

                {/* Date and Hours */}
                <View style={styles.inputRow}>
                    <View style={{ flex: 1, marginRight: 15 }}>
                        <Text style={styles.label}>Preferred Date *</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="mm/dd/yyyy"
                                placeholderTextColor="#475569"
                                style={styles.textInput}
                                value={date}
                                onChangeText={setDate}
                            />
                            <Feather name="calendar" size={18} color="#94A3B8" />
                        </View>
                    </View>
                    <View style={{ width: 120 }}>
                        <Text style={styles.label}>Hours Needed</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="2"
                                placeholderTextColor="#475569"
                                style={styles.textInput}
                                value={hours}
                                onChangeText={setHours}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                </View>

                {/* Preferred Time */}
                <Text style={styles.label}>
                    Preferred Time *
                    <Text style={styles.labelHint}> (select one)</Text>
                </Text>

                <View style={styles.timeRow}>
                    {Object.values(PreferredTimes).map((time) => (
                        <TouchableOpacity
                            key={time}
                            style={[
                                styles.timeBox,
                                preferredTimes === time && styles.timeBoxActive
                            ]}
                            onPress={() => setPreferredTimes(time)}
                        >
                            <Text
                                style={[
                                    styles.timeText,
                                    preferredTimes === time && styles.timeTextActive
                                ]}
                            >
                                {time.charAt(0).toUpperCase() + time.slice(1)}
                            </Text>

                            <Text style={styles.timeSub}>
                                {time === PreferredTimes.Morning
                                    ? "06:00 - 12:00"
                                    : time === PreferredTimes.Afternoon
                                        ? "12:00 - 18:00"
                                        : "18:00 - 22:00"}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Reason / Notes */}
                <View style={styles.notesHeader}>
                    <Feather name="message-square" size={16} color="#C9A961" style={{ marginRight: 8 }} />
                    <Text style={styles.label}>Reason / Notes</Text>
                </View>
                <TextInput
                    placeholder="Describe the purpose of this training session..."
                    placeholderTextColor="#475569"
                    multiline
                    numberOfLines={4}
                    style={styles.textArea}
                    value={notes}
                    onChangeText={setNotes}
                />

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#020617" />
                    ) : (
                        <>
                            <MaterialCommunityIcons name="airplane-takeoff" size={20} color="#020617" style={{ marginRight: 10 }} />
                            <Text style={styles.submitBtnText}>Submit Training Request</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#020617",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#1E293B",
    },
    backBtn: {
        marginRight: 20,
    },
    headerTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    headerSub: {
        color: "#C9A961",
        fontSize: 12,
        marginTop: 2,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    label: {
        color: "#94A3B8",
        fontSize: 14,
        marginBottom: 12,
        marginTop: 10,
    },
    labelHint: {
        fontSize: 12,
        color: "#475569",
    },
    typeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 25,
    },
    typeBox: {
        width: '48%',
        backgroundColor: "#1E293B",
        borderRadius: 12,
        padding: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#334155",
    },
    typeBoxActive: {
        borderColor: "#C9A961",
        backgroundColor: "rgba(201, 169, 97, 0.05)",
    },
    typeLabel: {
        color: "#94A3B8",
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 12,
    },
    typeLabelActive: {
        color: "#C9A961",
    },
    typeSub: {
        color: "#475569",
        fontSize: 12,
        marginTop: 4,
    },
    aircraftItem: {
        backgroundColor: "#1E293B",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#334155",
    },
    aircraftItemActive: {
        borderColor: "#4F5E7B",
        backgroundColor: "#243147",
    },
    aircraftName: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    aircraftId: {
        color: "#64748B",
        fontSize: 12,
        marginTop: 4,
    },
    emptyContainer: {
        padding: 20,
        backgroundColor: "#1E293B",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        borderStyle: "dashed",
        borderWidth: 1,
        borderColor: "#334155",
    },
    emptyText: {
        color: "#64748B",
        fontSize: 14,
    },
    categoryWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 20,
    },
    categoryBadge: {
        backgroundColor: "#1E293B",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#334155",
    },
    categoryBadgeActive: {
        backgroundColor: "#C9A961",
        borderColor: "#C9A961",
    },
    categoryText: {
        color: "#94A3B8",
        fontSize: 14,
        fontWeight: "500",
    },
    categoryTextActive: {
        color: "#020617",
        fontWeight: "bold",
    },
    inputRow: {
        flexDirection: "row",
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1E293B",
        borderRadius: 8,
        paddingHorizontal: 15,
        height: 54,
        borderWidth: 1,
        borderColor: "#334155",
    },
    textInput: {
        flex: 1,
        color: "#FFFFFF",
        fontSize: 16,
    },
    timeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 25,
    },
    timeBox: {
        width: '31%',
        backgroundColor: "#1E293B",

        borderRadius: 12,
        padding: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#334155",
    },
    timeBoxActive: {
        borderColor: "#4F5E7B",
        backgroundColor: "#243147",
    },
    timeText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "bold",
    },
    timeTextActive: {
        color: "#FFFFFF",
    },
    timeSub: {
        color: "#475569",
        fontSize: 10,
        marginTop: 4,
    },
    notesHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    textArea: {
        backgroundColor: "#1E293B",
        borderRadius: 12,
        padding: 15,
        color: "#FFFFFF",
        fontSize: 14,
        minHeight: 120,
        textAlignVertical: "top",
        borderWidth: 1,
        borderColor: "#334155",
        marginBottom: 30,
    },
    submitBtn: {
        backgroundColor: "#C9A961",
        borderRadius: 12,
        height: 56,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.9,
    },
    submitBtnText: {
        color: "#020617",
        fontSize: 16,
        fontWeight: "bold",
    },
});