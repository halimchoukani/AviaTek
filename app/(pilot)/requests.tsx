import PilotRequestCard from '@/components/PilotRequestCard';
import { getRequestsByPilot } from '@/lib/api/requests';
import { getCurrentUser } from '@/lib/appwrite';
import { PilotDocument } from '@/lib/types';
import { Feather } from '@expo/vector-icons';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FilterStatus = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

export default function RequestsPage() {
    const router = useRouter();
    const [selectedFilter, setSelectedFilter] = useState<FilterStatus>('ALL');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const { data: user } = useSuspenseQuery({
        queryKey: ["currentUser"],
        queryFn: () => getCurrentUser() as unknown as Promise<PilotDocument>,
    });

    const { data: requests = [], isLoading } = useQuery({
        queryKey: ["pilotRequests", user?.$id],
        queryFn: () => getRequestsByPilot(user!.$id),
        enabled: !!user?.$id,
        refetchInterval: 1000,
    });

    const counts = {
        ALL: requests.length,
        PENDING: requests.filter(r => r.status.toLowerCase() === 'pending').length,
        APPROVED: requests.filter(r => r.status.toLowerCase() === 'approved').length,
        REJECTED: requests.filter(r => r.status.toLowerCase() === 'rejected').length,
    };

    const filteredRequests = requests.filter(r => {
        if (selectedFilter === 'ALL') return true;
        return r.status.toLowerCase() === selectedFilter.toLowerCase();
    });

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.topHeader}>
                <View style={styles.titleWrapper}>
                    <Text style={styles.headerTitle}>My Requests</Text>
                    <Text style={styles.headerSubtitle}>TRAINING REQUESTS</Text>
                </View>
                <TouchableOpacity
                    style={styles.newBtn}
                    onPress={() => router.push("/request-training")}
                >
                    <Feather name="plus" size={18} color="#000" />
                    <Text style={styles.newBtnText}>New</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    <FilterChip
                        label={`ALL (${counts.ALL})`}
                        active={selectedFilter === 'ALL'}
                        onPress={() => setSelectedFilter('ALL')}
                    />
                    <FilterChip
                        label={`PENDING (${counts.PENDING})`}
                        active={selectedFilter === 'PENDING'}
                        onPress={() => setSelectedFilter('PENDING')}
                    />
                    <FilterChip
                        label={`OK (${counts.APPROVED})`}
                        active={selectedFilter === 'APPROVED'}
                        onPress={() => setSelectedFilter('APPROVED')}
                    />
                    <FilterChip
                        label={`NO (${counts.REJECTED})`}
                        active={selectedFilter === 'REJECTED'}
                        onPress={() => setSelectedFilter('REJECTED')}
                    />
                </ScrollView>
            </View>

            <View style={styles.statsContainer}>
                <StatBox value={counts.PENDING} label="PENDING" color="#F59E0B" />
                <StatBox value={counts.APPROVED} label="APPROVED" color="#10B981" />
                <StatBox value={counts.REJECTED} label="REJECTED" color="#EF4444" />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={filteredRequests}
                keyExtractor={(item) => item.$id}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <PilotRequestCard
                        request={item}
                        expanded={expandedId === item.$id}
                        onToggle={() => setExpandedId(expandedId === item.$id ? null : item.$id)}
                    />
                )}
                ListEmptyComponent={
                    !isLoading ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No requests found</Text>
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
}

function FilterChip({ label, active, onPress }: { label: string, active: boolean, onPress: () => void }) {
    return (
        <TouchableOpacity
            style={[styles.chip, active && styles.chipActive]}
            onPress={onPress}
        >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
        </TouchableOpacity>
    );
}

function StatBox({ value, label, color }: { value: number, label: string, color: string }) {
    return (
        <View style={styles.statBox}>
            <Text style={[styles.statValue, { color }]}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
    headerContainer: {
        paddingVertical: 16,
    },
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    titleWrapper: {
        flex: 1,
        marginLeft: 8,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: '#C9A961',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 2,
    },
    newBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#C9A961',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    newBtnText: {
        color: '#000000',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    filterContainer: {
        backgroundColor: '#0F172A',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
    },
    filterScroll: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
    },
    chip: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    chipActive: {
        backgroundColor: '#C9A961',
    },
    chipText: {
        color: '#64748B',
        fontSize: 12,
        fontWeight: 'bold',
    },
    chipTextActive: {
        color: '#000000',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 24,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#1E293B',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        color: '#64748B',
        fontSize: 10,
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: '#64748B',
        fontSize: 16,
    }
});