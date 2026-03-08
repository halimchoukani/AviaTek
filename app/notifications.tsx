import { getNotifications } from "@/lib/api/notifications";
import { getCurrentUser } from "@/lib/appwrite";
import { PilotDocument } from "@/lib/types";
import { Feather } from "@expo/vector-icons";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ── Notification Types ──────────────────────────────────────────────

type NotificationType =
    | "request_approved"
    | "request_rejected"
    | "session_upcoming"
    | "session_rescheduled"
    | "request_pending";

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    description: string;
    timestamp: Date;
    read: boolean;
}

// ── Type-based style config ─────────────────────────────────────────

const NOTIFICATION_STYLE: Record<
    NotificationType,
    {
        iconName: string;       // Feather icon
        iconColor: string;
        iconBg: string;
        borderColor: string;
        cardBg: string;
    }
> = {
    request_approved: {
        iconName: "check-circle",
        iconColor: "#10B981",
        iconBg: "rgba(16, 185, 129, 0.15)",
        borderColor: "rgba(16, 185, 129, 0.3)",
        cardBg: "#1E293B",
    },
    request_rejected: {
        iconName: "x-circle",
        iconColor: "#EF4444",
        iconBg: "rgba(239, 68, 68, 0.15)",
        borderColor: "rgba(239, 68, 68, 0.3)",
        cardBg: "#1E293B",
    },
    session_upcoming: {
        iconName: "calendar",
        iconColor: "#10B981",
        iconBg: "rgba(16, 185, 129, 0.15)",
        borderColor: "rgba(16, 185, 129, 0.3)",
        cardBg: "#1E293B",
    },
    session_rescheduled: {
        iconName: "calendar",
        iconColor: "#F59E0B",
        iconBg: "rgba(245, 158, 11, 0.15)",
        borderColor: "rgba(245, 158, 11, 0.3)",
        cardBg: "#1E293B",
    },
    request_pending: {
        iconName: "send",
        iconColor: "#38BDF8",
        iconBg: "rgba(56, 189, 248, 0.15)",
        borderColor: "rgba(56, 189, 248, 0.3)",
        cardBg: "#1E293B",
    },
};

// ── Helpers ──────────────────────────────────────────────────────────

function timeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    const diffWeeks = Math.floor(diffDays / 7);
    return `${diffWeeks}w ago`;
}

// ── Component ────────────────────────────────────────────────────────

export default function NotificationsPage() {
    const router = useRouter();
    const [readIds, setReadIds] = useState<Set<string>>(new Set());

    const { data: user } = useSuspenseQuery({
        queryKey: ["currentUser"],
        queryFn: () => getCurrentUser() as unknown as Promise<PilotDocument>,
    });

    const { data: apiNotifications = [], isLoading } = useQuery({
        queryKey: ["notifications", user?.$id],
        queryFn: () => getNotifications(user!.$id),
        enabled: !!user?.$id,
    });

    // Build notifications from real data
    const notifications: Notification[] = useMemo(() => {
        const items: Notification[] = apiNotifications.map((n) => ({
            id: n.$id,
            type: (n.type as NotificationType) || "request_pending",
            title: n.title,
            description: n.content,
            timestamp: new Date(n.$createdAt),
            read: n.read || readIds.has(n.$id),
        }));

        // Sort by timestamp descending (newest first)
        items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        return items;
    }, [apiNotifications, readIds]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleReadAll = () => {
        const allIds = new Set(notifications.map((n) => n.id));
        setReadIds(allIds);
    };

    const handleToggleRead = (id: string) => {
        setReadIds((prev) => {
            const copy = new Set(prev);
            if (copy.has(id)) {
                copy.delete(id);
            } else {
                copy.add(id);
            }
            return copy;
        });
    };

    const renderNotification = ({ item }: { item: Notification }) => {
        const style = NOTIFICATION_STYLE[item.type];
        const isUnread = !item.read;

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleToggleRead(item.id)}
                style={[
                    styles.notificationCard,
                    {
                        backgroundColor: style.cardBg,
                        borderLeftColor: isUnread ? style.borderColor : "#334155",
                        borderLeftWidth: isUnread ? 3 : 1,
                    },
                ]}
            >
                {/* Icon */}
                <View
                    style={[
                        styles.iconCircle,
                        { backgroundColor: style.iconBg },
                    ]}
                >
                    <Feather
                        name={style.iconName as any}
                        size={22}
                        color={style.iconColor}
                    />
                </View>

                {/* Content */}
                <View style={styles.cardContent}>
                    <View style={styles.cardTitleRow}>
                        <Text
                            style={[
                                styles.cardTitle,
                                !isUnread && styles.cardTitleRead,
                            ]}
                            numberOfLines={1}
                        >
                            {item.title}
                        </Text>
                        {isUnread && <View style={[styles.unreadDot, { backgroundColor: style.iconColor }]} />}
                    </View>
                    <Text
                        style={[
                            styles.cardDescription,
                            !isUnread && styles.cardDescriptionRead,
                        ]}
                        numberOfLines={2}
                    >
                        {item.description}
                    </Text>
                    <View style={styles.timestampRow}>
                        <Feather name="clock" size={12} color="#475569" />
                        <Text style={styles.timestampText}>
                            {timeAgo(item.timestamp)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => router.back()}
                        >
                            <Feather name="arrow-left" size={22} color="#FFFFFF" />
                        </TouchableOpacity>
                        <View style={styles.titleWrapper}>
                            <View style={styles.titleRow}>
                                <Text style={styles.headerTitle}>Notifications</Text>
                                {unreadCount > 0 && (
                                    <View style={styles.countBadge}>
                                        <Text style={styles.countBadgeText}>{unreadCount}</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.headerSubtitle}>ALERTS & UPDATES</Text>
                        </View>
                    </View>

                    {unreadCount > 0 && (
                        <TouchableOpacity
                            style={styles.readAllBtn}
                            onPress={handleReadAll}
                        >
                            <Feather name="check" size={16} color="#94A3B8" />
                            <Text style={styles.readAllText}>Read all</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* List */}
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#C9A961" />
                        <Text style={styles.loadingText}>Loading notifications...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={notifications}
                        keyExtractor={(item) => item.id}
                        renderItem={renderNotification}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <View style={styles.emptyIconContainer}>
                                    <Feather name="bell-off" size={40} color="#334155" />
                                </View>
                                <Text style={styles.emptyTitle}>No Notifications</Text>
                                <Text style={styles.emptySubtitle}>
                                    You're all caught up! New alerts will appear here.
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

// ── Styles ───────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#020617",
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    titleWrapper: {
        marginLeft: 8,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerTitle: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "bold",
    },
    countBadge: {
        backgroundColor: "#10B981",
        width: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
    },
    countBadgeText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "bold",
    },
    headerSubtitle: {
        color: "#C9A961",
        fontSize: 12,
        fontWeight: "bold",
        marginTop: 2,
        letterSpacing: 1,
    },
    readAllBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    readAllText: {
        color: "#94A3B8",
        fontSize: 14,
    },
    listContent: {
        paddingTop: 8,
        paddingBottom: 100,
    },
    notificationCard: {
        flexDirection: "row",
        alignItems: "flex-start",
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: "#334155",
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
        marginTop: 2,
    },
    cardContent: {
        flex: 1,
    },
    cardTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    cardTitle: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "bold",
        flex: 1,
    },
    cardTitleRead: {
        color: "#94A3B8",
    },
    unreadDot: {
        width: 9,
        height: 9,
        borderRadius: 5,
        marginLeft: 8,
    },
    cardDescription: {
        color: "#94A3B8",
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 8,
    },
    cardDescriptionRead: {
        color: "#64748B",
    },
    timestampRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    timestampText: {
        color: "#475569",
        fontSize: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        color: "#64748B",
        marginTop: 12,
        fontSize: 14,
    },
    emptyContainer: {
        alignItems: "center",
        marginTop: 80,
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#1E293B",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#334155",
    },
    emptyTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    emptySubtitle: {
        color: "#64748B",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 20,
    },
});
