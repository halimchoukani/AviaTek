import { createProgram, getProgramsByRegulationId, updateProgram } from '@/lib/api/programs';
import { getRegulationById } from '@/lib/api/regulations';
import { ProgramLicense } from '@/lib/types';
import { Feather } from '@expo/vector-icons';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



const COMMON_MEDICAL_CLASSES = ['Class 1', 'Class 2', 'Class 3', 'LAPL Medical'];

// ─── Shared Components ────────────────────────────────────────────────────────

function BottomSheet({
    visible,
    onClose,
    children,
}: {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) {
    const translateY = useRef(new Animated.Value(800)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(backdropOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
                Animated.spring(translateY, { toValue: 0, damping: 26, stiffness: 200, useNativeDriver: true }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(backdropOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
                Animated.timing(translateY, { toValue: 800, duration: 220, useNativeDriver: true }),
            ]).start();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
            <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <Animated.View style={[{ opacity: backdropOpacity }]} className="absolute inset-0 bg-black/60">
                    <TouchableOpacity className="flex-1" activeOpacity={1} onPress={onClose} />
                </Animated.View>

                <Animated.View
                    style={{ transform: [{ translateY }] }}
                    className="absolute bottom-0 left-0 right-0 bg-primary border-t border-border/60 rounded-t-2xl max-h-[90%]"
                >
                    {children}
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
    const translateX = useRef(new Animated.Value(value ? 20 : 0)).current;

    useEffect(() => {
        Animated.spring(translateX, {
            toValue: value ? 20 : 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 300,
        }).start();
    }, [value]);

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={onToggle}
            className={`w-11 h-6 rounded-full p-0.5 justify-center ${value ? 'bg-secondary' : 'bg-slate-600'}`}
        >
            <Animated.View
                style={{ transform: [{ translateX }] }}
                className="w-5 h-5 rounded-full bg-primary shadow"
            />
        </TouchableOpacity>
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function Programs() {
    const router = useRouter();
    const { regId } = useLocalSearchParams<{ regId: string }>();

    // We can handle undefined regId, but typically you pass it in standard navigation
    const queryClient = useQueryClient();
    const { data: regulation } = useSuspenseQuery({
        queryKey: ['regulations', regId],
        queryFn: () => getRegulationById(regId),
    });

    // Default to empty array if backend errors and returns undefined to avoid mapping over undefined
    const { data: fetchedPrograms, isLoading: isProgramsLoading } = useSuspenseQuery({
        queryKey: ['programs', regId],
        queryFn: () => getProgramsByRegulationId(regId),
        refetchInterval: 3000,
    });
    if (isProgramsLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
        )
    }
    const programs = fetchedPrograms || [];

    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProg, setEditingProg] = useState<ProgramLicense | null>(null);

    const createMutation = useMutation({
        mutationFn: createProgram,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['programs', regId] });
            handleCloseModal();
        },
        onError: (e) => console.log('Error creating program:', e)
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<ProgramLicense> }) => updateProgram(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['programs', regId] });
            handleCloseModal();
        },
        onError: (e) => console.log('Error updating program:', e)
    });

    const [formData, setFormData] = useState<Partial<ProgramLicense>>({
        code: '',
        name: '',
        description: '',
        minAgeYears: 17,
        totalHours: 0,
        simHoursMin: 0,
        soloHoursMin: 0,
        dualHoursMin: 0,
        crossCountryMin: 0,
        theoryExamsCount: 1,
        requiresMedical: true,
        medicalClass: 'Class 1',
        isActive: true,
    });

    const filtered = programs.filter((p) => {
        const matchSearch =
            !search.trim() ||
            p.code.toLowerCase().includes(search.toLowerCase()) ||
            p.name.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });

    const counts = {
        total: programs.length,
        active: programs.filter((p) => p.isActive).length,
    };

    const toggleStatus = (id: string, currentStatus: boolean) => {
        updateMutation.mutate({ id, data: { isActive: !currentStatus } });
    };

    const handleOpenModal = (prog?: ProgramLicense) => {
        if (prog) {
            setEditingProg(prog);
            setFormData({ ...prog });
        } else {
            setEditingProg(null);
            setFormData({
                code: '',
                name: '',
                description: '',
                minAgeYears: 17,
                totalHours: 0,
                simHoursMin: 0,
                soloHoursMin: 0,
                dualHoursMin: 0,
                crossCountryMin: 0,
                theoryExamsCount: 1,
                requiresMedical: true,
                medicalClass: 'Class 1',
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setEditingProg(null);
            setFormData({});
        }, 250);
    };

    const handleSave = () => {
        if (!formData.code?.trim() || !formData.name?.trim()) return;

        if (editingProg) {
            updateMutation.mutate({ id: (editingProg as any).$id || editingProg.id, data: formData });
        } else {
            const payload = {
                ...formData,
                programId: regId || '',
            };
            createMutation.mutate(payload);
        }
    };

    const toggleMedicalClass = (medClass: string) => {
        if (formData.medicalClass === medClass) {
            setFormData({ ...formData, medicalClass: '' });
        } else {
            setFormData({ ...formData, medicalClass: medClass });
        }
    };

    if (!regulation) {
        return (
            <SafeAreaView className="flex-1 bg-primary items-center justify-center p-6">
                <Feather name="shield" size={48} color="#475569" className="mb-4" />
                <Text className="text-xl font-bold text-white mb-2">Regulation Not Found</Text>
                <Text className="text-text-secondary text-center mb-6">The regulation you are looking for does not exist or missing ID.</Text>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="px-5 py-2.5 bg-secondary rounded-lg"
                >
                    <Text className="text-primary font-bold">Back to Regulations</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const ListHeader = (
        <View className="mb-4">
            {/* Stats */}
            <View className="flex-row gap-2 mb-3 mt-4">
                <View className="flex-1 bg-card border border-border/60 rounded-lg p-3 items-center">
                    <Text className="text-lg font-bold text-white">{counts.total}</Text>
                    <Text className="text-[9px] text-text-secondary uppercase tracking-wider">Total Programs</Text>
                </View>
                <View className="flex-1 bg-card border border-border/60 rounded-lg p-3 items-center">
                    <Text className="text-lg font-bold text-emerald-500">{counts.active}</Text>
                    <Text className="text-[9px] text-text-secondary uppercase tracking-wider">Active</Text>
                </View>
            </View>
            <Text className="text-xs text-text-muted mb-2">
                Showing {filtered.length} of {counts.total} programs
            </Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-primary">
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            {/* Header */}
            <View className="bg-primary border-b border-border/60 px-6 pt-3 pb-3">
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center gap-3">
                        <TouchableOpacity onPress={() => router.back()} className="-ml-1 p-1" activeOpacity={0.7}>
                            <Feather name="arrow-left" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                        <View>
                            <View className="flex-row items-center gap-2">
                                <Text className="text-lg font-semibold text-white">Programs</Text>
                                <View className="px-1.5 py-0.5 bg-card border border-border/60 rounded">
                                    <Text className="text-[10px] font-bold text-secondary tracking-wider">{regulation.code}</Text>
                                </View>
                            </View>
                            <Text className="text-xs text-text-muted font-medium mt-0.5">{regulation.name}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        className="flex-row items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-lg"
                        onPress={() => handleOpenModal()}
                        activeOpacity={0.8}
                    >
                        <Feather name="plus" size={16} color="#0f172a" />
                        <Text className="text-sm font-bold text-primary">Add New</Text>
                    </TouchableOpacity>
                </View>

                {/* Search */}
                <View className="flex-row items-center bg-card rounded-xl px-4 py-1 border border-border/60 mt-1">
                    <Feather name="search" size={20} color="#64748B" />
                    <TextInput
                        className="flex-1 ml-3 text-white text-base py-2.5"
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search by code or name..."
                        placeholderTextColor="#475569"
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                    {!!search && (
                        <TouchableOpacity onPress={() => setSearch('')}>
                            <Feather name="x" size={16} color="#64748b" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* List */}
            <FlatList
                data={filtered}
                keyExtractor={(item: any) => item.$id || item.id}
                contentContainerClassName="px-6 pb-8"
                ListHeaderComponent={ListHeader}
                ItemSeparatorComponent={() => <View className="h-3.5" />}
                ListEmptyComponent={
                    <View className="items-center py-12 gap-3">
                        <Feather name="clipboard" size={44} color="#334155" />
                        <Text className="text-sm text-text-muted">No programs found</Text>
                    </View>
                }
                renderItem={({ item: prog }) => (
                    <View className="bg-card border border-border/60 rounded-xl overflow-hidden">
                        <View className="p-4">
                            {/* Card Header */}
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="flex-row items-center gap-2 flex-1">
                                    <View className="px-2 py-1 bg-primary border border-border/60 rounded">
                                        <Text className="text-xs font-bold text-white tracking-wider">{prog.code}</Text>
                                    </View>
                                    <Text className="text-sm font-semibold text-white flex-1" numberOfLines={1}>{prog.name}</Text>
                                </View>
                                {prog.requiresMedical && (
                                    <View className="flex-row items-center gap-1 px-1.5 py-0.5 bg-red-500/10 border border-red-500/20 rounded ml-2">
                                        <Feather name="shield" size={10} color="#f87171" />
                                        <Text className="text-[10px] font-medium text-red-400">Medical Req.</Text>
                                    </View>
                                )}
                            </View>

                            <Text className="text-xs text-text-secondary mb-4" numberOfLines={2}>
                                {prog.description}
                            </Text>

                            {/* Stats Grid */}
                            <View className="flex-row flex-wrap bg-primary/40 rounded-lg p-2 border border-border/40 gap-y-3">
                                <View className="w-1/3 items-center">
                                    <Text className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Min Age</Text>
                                    <Text className="text-xs font-semibold text-white">{prog.minAgeYears} yrs</Text>
                                </View>
                                <View className="w-1/3 items-center">
                                    <Text className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Total Hrs</Text>
                                    <Text className="text-xs font-semibold text-white">{prog.totalHours}</Text>
                                </View>
                                <View className="w-1/3 items-center">
                                    <Text className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Exams</Text>
                                    <Text className="text-xs font-semibold text-white">{prog.theoryExamsCount}</Text>
                                </View>
                                <View className="w-1/3 items-center">
                                    <Text className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Solo Hrs</Text>
                                    <Text className="text-xs font-semibold text-white">{prog.soloHoursMin}</Text>
                                </View>
                                <View className="w-1/3 items-center">
                                    <Text className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Dual Hrs</Text>
                                    <Text className="text-xs font-semibold text-white">{prog.dualHoursMin}</Text>
                                </View>
                                <View className="w-1/3 items-center">
                                    <Text className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Sim Hrs</Text>
                                    <Text className="text-xs font-semibold text-white">{prog.simHoursMin}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Footer Actions */}
                        <View className="bg-primary/50 border-t border-border/60 px-4 py-2.5 flex-row items-center justify-between">
                            <TouchableOpacity
                                className={`flex-row items-center gap-1.5 px-2 py-1 rounded ${prog.isActive ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-transparent border border-border/60'}`}
                                onPress={() => toggleStatus((prog as any).$id || prog.id, prog.isActive)}
                                activeOpacity={0.7}
                            >
                                <Feather name={prog.isActive ? 'check-circle' : 'x-circle'} size={13} color={prog.isActive ? '#34d399' : '#64748b'} />
                                <Text className={`text-xs font-medium ${prog.isActive ? 'text-emerald-500' : 'text-text-secondary'}`}>
                                    {prog.isActive ? 'Active' : 'Inactive'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-row items-center gap-1.5 px-2 py-1 rounded bg-secondary/10"
                                onPress={() => handleOpenModal(prog)}
                                activeOpacity={0.7}
                            >
                                <Feather name="edit-2" size={13} color="#94a3b8" />
                                <Text className="text-xs font-medium text-text-muted">Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            {/* Add/Edit Modal */}
            <BottomSheet visible={isModalOpen} onClose={handleCloseModal}>
                <View className="flex-row items-center justify-between px-6 py-4 border-b border-border/60">
                    <Text className="text-lg font-semibold text-white">
                        {editingProg ? 'Edit Program' : 'Add Program'}
                    </Text>
                    <TouchableOpacity className="p-2 rounded-full bg-primary" onPress={handleCloseModal} activeOpacity={0.7}>
                        <Feather name="x" size={20} color="#94a3b8" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerClassName="p-6 gap-6 pb-12" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

                    {/* Basic Info */}
                    <View className="gap-4">
                        <Text className="text-sm font-semibold text-white border-b border-border/60 pb-2">Basic Information</Text>

                        <View className="flex-row gap-4">
                            <View className="flex-1 gap-1.5">
                                <Text className="text-xs font-medium text-text-muted">Code *</Text>
                                <TextInput
                                    className="bg-primary border border-border/60 rounded-lg px-3 py-2.5 text-white text-sm uppercase"
                                    value={formData.code}
                                    onChangeText={(t) => setFormData({ ...formData, code: t.toUpperCase() })}
                                    placeholder="e.g. PPL"
                                    placeholderTextColor="#475569"
                                />
                            </View>
                            <View className="flex-[2] gap-1.5">
                                <Text className="text-xs font-medium text-text-muted">Name *</Text>
                                <TextInput
                                    className="bg-primary border border-border/60 rounded-lg px-3 py-2.5 text-white text-sm"
                                    value={formData.name}
                                    onChangeText={(t) => setFormData({ ...formData, name: t })}
                                    placeholder="e.g. Private Pilot License"
                                    placeholderTextColor="#475569"
                                />
                            </View>
                        </View>

                        <View className="gap-1.5">
                            <Text className="text-xs font-medium text-text-muted">Description</Text>
                            <TextInput
                                className="bg-primary border border-border/60 rounded-lg px-3 py-2.5 text-white text-sm"
                                value={formData.description}
                                onChangeText={(t) => setFormData({ ...formData, description: t })}
                                multiline
                                numberOfLines={2}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>

                    {/* Requirements */}
                    <View className="gap-4">
                        <Text className="text-sm font-semibold text-white border-b border-border/60 pb-2">Requirements</Text>

                        <View className="flex-row gap-4">
                            <View className="flex-1 gap-1.5">
                                <Text className="text-xs font-medium text-text-muted">Min Age (Years) *</Text>
                                <TextInput
                                    className="bg-primary border border-border/60 rounded-lg px-3 py-2.5 text-white text-sm"
                                    value={formData.minAgeYears?.toString()}
                                    onChangeText={(t) => setFormData({ ...formData, minAgeYears: parseInt(t) || 0 })}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View className="flex-1 gap-1.5">
                                <Text className="text-xs font-medium text-text-muted">Theory Exams Count *</Text>
                                <TextInput
                                    className="bg-primary border border-border/60 rounded-lg px-3 py-2.5 text-white text-sm"
                                    value={formData.theoryExamsCount?.toString()}
                                    onChangeText={(t) => setFormData({ ...formData, theoryExamsCount: parseInt(t) || 0 })}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Flight Hours */}
                    <View className="gap-4">
                        <Text className="text-sm font-semibold text-white border-b border-border/60 pb-2">Flight Hours Minimums</Text>

                        <View className="flex-row gap-4 mb-1">
                            <View className="flex-1 gap-1.5">
                                <Text className="text-xs font-medium text-text-muted">Total Hours *</Text>
                                <TextInput
                                    className="bg-primary border border-border/60 rounded-lg px-3 py-2.5 text-white text-sm"
                                    value={formData.totalHours?.toString()}
                                    onChangeText={(t) => setFormData({ ...formData, totalHours: parseFloat(t) || 0 })}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View className="flex-1 gap-1.5">
                                <Text className="text-xs font-medium text-text-muted">Sim Hours *</Text>
                                <TextInput
                                    className="bg-primary border border-border/60 rounded-lg px-3 py-2.5 text-white text-sm"
                                    value={formData.simHoursMin?.toString()}
                                    onChangeText={(t) => setFormData({ ...formData, simHoursMin: parseFloat(t) || 0 })}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View className="flex-row gap-4 mb-1">
                            <View className="flex-1 gap-1.5">
                                <Text className="text-xs font-medium text-text-muted">Solo Hours *</Text>
                                <TextInput
                                    className="bg-primary border border-border/60 rounded-lg px-3 py-2.5 text-white text-sm"
                                    value={formData.soloHoursMin?.toString()}
                                    onChangeText={(t) => setFormData({ ...formData, soloHoursMin: parseFloat(t) || 0 })}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View className="flex-1 gap-1.5">
                                <Text className="text-xs font-medium text-text-muted">Dual Hours *</Text>
                                <TextInput
                                    className="bg-primary border border-border/60 rounded-lg px-3 py-2.5 text-white text-sm"
                                    value={formData.dualHoursMin?.toString()}
                                    onChangeText={(t) => setFormData({ ...formData, dualHoursMin: parseFloat(t) || 0 })}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View className="flex-row gap-4">
                            <View className="flex-1 gap-1.5">
                                <Text className="text-xs font-medium text-text-muted">Cross Country *</Text>
                                <TextInput
                                    className="bg-primary border border-border/60 rounded-lg px-3 py-2.5 text-white text-sm"
                                    value={formData.crossCountryMin?.toString()}
                                    onChangeText={(t) => setFormData({ ...formData, crossCountryMin: parseFloat(t) || 0 })}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View className="flex-1" />
                        </View>
                    </View>

                    {/* Medical & Status */}
                    <View className="gap-4">
                        <Text className="text-sm font-semibold text-white border-b border-border/60 pb-2">Medical & Status</Text>

                        <View className="flex-row items-center justify-between p-3 bg-primary border border-border/60 rounded-lg">
                            <View>
                                <Text className="text-sm font-medium text-white">Medical Required</Text>
                                <Text className="text-xs text-text-muted">Does this program require a medical certificate?</Text>
                            </View>
                            <Toggle
                                value={!!formData.requiresMedical}
                                onToggle={() => setFormData({ ...formData, requiresMedical: !formData.requiresMedical })}
                            />
                        </View>

                        {formData.requiresMedical && (
                            <View className="space-y-2 p-3 bg-primary/50 border border-border/60 rounded-lg gap-2">
                                <Text className="text-xs font-medium text-text-muted">Accepted Medical Classes</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {COMMON_MEDICAL_CLASSES.map((medClass) => {
                                        const isSelected = formData.medicalClass === medClass;
                                        return (
                                            <TouchableOpacity
                                                key={medClass}
                                                onPress={() => toggleMedicalClass(medClass)}
                                                className={`px-3 py-1.5 rounded-lg border ${isSelected ? 'bg-red-500/20 border-red-500/30' : 'bg-card border-border/60'}`}
                                            >
                                                <Text className={`text-xs font-medium ${isSelected ? 'text-red-400' : 'text-text-muted'}`}>
                                                    {medClass}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        )}

                        <View className="flex-row items-center justify-between p-3 bg-primary border border-border/60 rounded-lg">
                            <View>
                                <Text className="text-sm font-medium text-white">Active Status</Text>
                                <Text className="text-xs text-text-muted">Enable or disable this program</Text>
                            </View>
                            <Toggle
                                value={!!formData.isActive}
                                onToggle={() => setFormData({ ...formData, isActive: !formData.isActive })}
                            />
                        </View>
                    </View>

                    {/* Submit */}
                    <TouchableOpacity
                        className="w-full py-3.5 bg-secondary rounded-lg items-center mt-2"
                        onPress={handleSave}
                        activeOpacity={0.85}
                    >
                        <Text className="text-base font-bold text-primary">
                            {editingProg ? 'Save Changes' : 'Create Program'}
                        </Text>
                    </TouchableOpacity>

                </ScrollView>
            </BottomSheet>
        </SafeAreaView>
    );
}
