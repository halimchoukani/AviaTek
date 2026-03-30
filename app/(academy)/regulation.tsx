import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { getCurrentUser } from '@/lib/appwrite';
import { getRegulationById } from '@/lib/api/regulations';
import { getProgramsByAcademyId, getProgramsByRegulationId } from '@/lib/api/programs';
import { ProgramLicenseDocument } from '@/lib/types';

const ProgramCard = ({ program }: { program: ProgramLicenseDocument }) => {
    const getBorderColor = (code: string) => {
        const c = code.toUpperCase();
        if (c.includes('PPL')) return '#3B82F6'; // Blue
        if (c.includes('CPL')) return '#8B5CF6'; // Purple
        if (c.includes('ATPL')) return '#10B981'; // Green
        if (c.includes('IR')) return '#F59E0B'; // Orange
        return '#3B82F6';
    };

    const borderColor = getBorderColor(program.code);

    return (
        <View style={styles.programCard}>
            <View style={[styles.programCardBorder, { backgroundColor: borderColor }]} />
            
            <View style={styles.programHeader}>
                <View style={styles.programCodeContainer}>
                    <Text style={styles.programCode}>{program.code}</Text>
                </View>
                
                <View style={styles.programInfo}>
                    <Text style={styles.programName}>{program.name}</Text>
                    <View style={styles.programBadges}>
                        <Text style={styles.levelText}>{program.description || 'Level'}</Text>
                        <View style={styles.statusBadge}>
                            <View style={styles.activeDot} />
                            <Text style={styles.statusText}>Active</Text>
                        </View>
                        {program.requiresMedical && (
                            <View style={styles.medicalBadge}>
                                <View style={styles.medicalDot} />
                                <Text style={styles.medicalText}>Medical</Text>
                            </View>
                        )}
                    </View>
                </View>

                <TouchableOpacity style={styles.editButton}>
                    <Feather name="edit-2" size={18} color="#64748B" />
                </TouchableOpacity>
            </View>

            <View style={styles.programStats}>
                <View style={styles.statItem}>
                    <Feather name="clock" size={14} color="#64748B" />
                    <Text style={styles.statValue}>{program.totalHours} h</Text>
                </View>
                
                <View style={styles.statItem}>
                    <Feather name="user" size={14} color="#64748B" />
                    <Text style={styles.statValue}>{program.minAgeYears}+</Text>
                </View>
                
                <View style={styles.statItem}>
                    <Feather name="book-open" size={14} color="#64748B" />
                    <Text style={styles.statValue}>{program.theoryExamsCount}</Text>
                </View>

                <View style={styles.flightStats}>
                    <FontAwesome5 name="paper-plane" size={12} color="#64748B" />
                    <Text style={styles.flightStatsText}>
                        {program.simHoursMin} / {program.soloHoursMin} / {program.dualHoursMin}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default function RegulationScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');

    // Fetch Academy
    const { data: academy } = useSuspenseQuery({
        queryKey: ['academy'],
        queryFn: () => getCurrentUser(),
    });

    const regulationId = (academy as any)?.programId;

    console.log("Academy Context:", { id: academy?.$id, name: academy?.name, regulationId });

    // Fetch Regulation
    const { data: regulation } = useSuspenseQuery({
        queryKey: ['regulation', regulationId],
        queryFn: () => {
            console.log("Fetching Regulation Details for:", regulationId);
            return regulationId ? getRegulationById(regulationId) : Promise.resolve(null);
        },
    });

    // Fetch Programs
    const { data: programs = [] } = useSuspenseQuery({
        queryKey: ['programs', academy?.$id, regulationId],
        queryFn: async () => {
            console.log("--- Program Fetching Start ---");
            console.log("Academy ID:", academy?.$id);
            console.log("Regulation ID:", regulationId);

            const [regPrograms, acadPrograms] = await Promise.all([
                regulationId ? getProgramsByRegulationId(regulationId) : Promise.resolve([]),
                academy?.$id ? getProgramsByAcademyId(academy.$id) : Promise.resolve([])
            ]);

            console.log("Regulation Programs count:", regPrograms.length);
            console.log("Academy Programs count:", acadPrograms.length);

            // Use academy-specific programs if available, otherwise fallback to regulation-wide programs
            const finalPrograms = acadPrograms.length > 0 ? acadPrograms : regPrograms;
            console.log("Final programs to display:", finalPrograms.length);
            return finalPrograms;
        },
    });

    console.log("Final Programs state in UI:", programs.length, "programs found");

    const filteredPrograms = useMemo(() => {
        return programs.filter((p: ProgramLicenseDocument) => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                p.code.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filter === 'All' || (filter === 'Active' && p.isActive) || (filter === 'Inactive' && !p.isActive);
            return matchesSearch && matchesFilter;
        });
    }, [programs, searchQuery, filter]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTitleContainer}>
                    <View style={styles.logoCircle}>
                        <FontAwesome5 name="plane" size={14} color="#C9A961" />
                    </View>
                    <Text style={styles.academyTitle}>{academy?.name || 'Fly Academy'}</Text>
                </View>
                <TouchableOpacity style={styles.settingsButton}>
                    <Feather name="settings" size={20} color="#94A3B8" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Regulation Authority Card */}
                <View style={styles.authorityCard}>
                    <View style={styles.authorityBadge}>
                        <Text style={styles.authorityBadgeText}>{regulation?.code || 'EASA'}</Text>
                        <View style={styles.activeIndicator} />
                        <Text style={styles.indicatorText}>Active</Text>
                    </View>
                    <Text style={styles.authorityName}>
                        {regulation?.name || 'European Union Aviation Safety Agency'}
                    </Text>
                    <View style={styles.regionContainer}>
                        <Feather name="globe" size={14} color="#64748B" />
                        <Text style={styles.regionText}>{regulation?.region || 'Europe'}</Text>
                    </View>
                </View>

                {/* Regulation Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{programs.length}</Text>
                        <Text style={styles.statLabel}>Total Programs</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={[styles.statNumber, { color: '#C9A961' }]}>
                            {programs.filter(p => p.isActive).length}
                        </Text>
                        <Text style={styles.statLabel}>Active</Text>
                    </View>
                </View>

                {/* Training Programs Header */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Training Programs</Text>
                    <TouchableOpacity style={styles.addButton}>
                        <Feather name="plus" size={18} color="#C9A961" />
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <Feather name="search" size={18} color="#64748B" />
                    <TextInput
                        placeholder="Search programs..."
                        placeholderTextColor="#64748B"
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Filter Tabs */}
                <View style={styles.filterTabs}>
                    {['All', 'Active', 'Inactive'].map(tab => (
                        <TouchableOpacity 
                            key={tab} 
                            onPress={() => setFilter(tab)}
                            style={[styles.filterTab, filter === tab && styles.filterTabActive]}
                        >
                            <Text style={[styles.filterTabText, filter === tab && styles.filterTabTextActive]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Programs List */}
                <View style={styles.programsList}>
                    {filteredPrograms.map((program: ProgramLicenseDocument) => (
                        <ProgramCard key={program.$id || (program as any).id} program={program} />
                    ))}
                    {filteredPrograms.length === 0 && (
                        <Text style={styles.emptyText}>No programs found.</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 20,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logoCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#1E293B',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#334155',
    },
    academyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    settingsButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    authorityCard: {
        marginBottom: 24,
    },
    authorityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E293B',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#334155',
    },
    authorityBadgeText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 12,
        marginRight: 10,
    },
    activeIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
        marginRight: 6,
    },
    indicatorText: {
        color: '#94A3B8',
        fontSize: 10,
        fontWeight: '500',
    },
    authorityName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        lineHeight: 32,
        marginBottom: 12,
    },
    regionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    regionText: {
        color: '#64748B',
        fontSize: 14,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#0F172A',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#1E293B',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    statLabel: {
        color: '#64748B',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    addButtonText: {
        color: '#C9A961',
        fontWeight: 'bold',
        fontSize: 14,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0F172A',
        paddingHorizontal: 16,
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1E293B',
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        color: '#FFFFFF',
        fontSize: 14,
    },
    filterTabs: {
        flexDirection: 'row',
        gap: 24,
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#1E293B',
    },
    filterTab: {
        paddingBottom: 12,
    },
    filterTabActive: {
        borderBottomWidth: 2,
        borderBottomColor: '#3B82F6',
    },
    filterTabText: {
        color: '#64748B',
        fontSize: 14,
        fontWeight: '500',
    },
    filterTabTextActive: {
        color: '#FFFFFF',
    },
    programsList: {
        gap: 16,
    },
    programCard: {
        backgroundColor: '#111827',
        borderRadius: 16,
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
    },
    programCardBorder: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 4,
        backgroundColor: '#3B82F6', // Will vary if I want to match screenshot exactly
    },
    programHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    programCodeContainer: {
        width: 48,
        height: 48, // Made it taller in screenshot and text wrapped
        paddingTop: 4,
    },
    programCode: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        lineHeight: 24,
    },
    programInfo: {
        flex: 1,
    },
    programName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    programBadges: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
    },
    levelText: {
        color: '#94A3B8',
        fontSize: 12,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
    },
    statusText: {
        color: '#94A3B8',
        fontSize: 10,
    },
    medicalBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    medicalDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#EF4444',
    },
    medicalText: {
        color: '#EF4444',
        fontSize: 10,
    },
    editButton: {
        padding: 4,
    },
    programStats: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#1F2937',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statValue: {
        color: '#94A3B8',
        fontSize: 12,
        fontWeight: '500',
    },
    flightStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    flightStatsText: {
        color: '#94A3B8',
        fontSize: 12,
        fontWeight: '500',
    },
    emptyText: {
        color: '#64748B',
        textAlign: 'center',
        marginTop: 20,
    }
});
