import { createRegulation, getAllRegulations, updateRegulation } from '@/lib/api/regulations';
import { Regulation } from '@/lib/types';
import { Feather } from '@expo/vector-icons';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, FlatList, Image, KeyboardAvoidingView, Linking, Modal, Platform, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


type StatusFilter = 'all' | 'active' | 'inactive'

// ─── Animated bottom sheet ────────────────────────────────────────────────────

function BottomSheet({
    visible,
    onClose,
    children,
}: {
    visible: boolean
    onClose: () => void
    children: React.ReactNode
}) {
    const translateY = useRef(new Animated.Value(700)).current
    const backdropOpacity = useRef(new Animated.Value(0)).current

    React.useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(backdropOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
                Animated.spring(translateY, { toValue: 0, damping: 26, stiffness: 200, useNativeDriver: true }),
            ]).start()
        } else {
            Animated.parallel([
                Animated.timing(backdropOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
                Animated.timing(translateY, { toValue: 700, duration: 220, useNativeDriver: true }),
            ]).start()
        }
    }, [visible])

    if (!visible) return null

    return (
        <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
            <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                {/* Backdrop */}
                <Animated.View
                    style={[{ opacity: backdropOpacity }]}
                    className="absolute inset-0 bg-black/60"
                >
                    <TouchableOpacity className="flex-1" activeOpacity={1} onPress={onClose} />
                </Animated.View>

                {/* Sheet */}
                <Animated.View
                    style={{ transform: [{ translateY }] }}
                    className="absolute bottom-0 left-0 right-0 bg-primary border-t border-border/60 rounded-t-2xl max-h-[90%]"
                >
                    {children}
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

// ─── Animated toggle ──────────────────────────────────────────────────────────

function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
    const translateX = useRef(new Animated.Value(value ? 20 : 0)).current

    React.useEffect(() => {
        Animated.spring(translateX, {
            toValue: value ? 20 : 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 300,
        }).start()
    }, [value])

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={onToggle}
            className={`w-11 h-6 rounded-full p-0.5 justify-center ${value ? 'bg-emerald-500' : 'bg-slate-600'}`}
        >
            <Animated.View
                style={{ transform: [{ translateX }] }}
                className="w-5 h-5 rounded-full bg-white shadow"
            />
        </TouchableOpacity>
    )
}

// ─── Form field ───────────────────────────────────────────────────────────────

function Field({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType,
    autoCapitalize,
    className: extraClass,
}: {
    label: string
    value?: string
    onChangeText: (t: string) => void
    placeholder?: string
    keyboardType?: 'default' | 'url'
    autoCapitalize?: 'none' | 'characters' | 'words' | 'sentences'
    className?: string
}) {
    return (
        <View className={`gap-1.5 ${extraClass ?? ''}`}>
            <Text className="text-xs font-medium text-text-muted">{label}</Text>
            <TextInput
                className="bg-primary border border-border/60 rounded-lg px-3 py-2.5 text-white text-sm"
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#475569"
                keyboardType={keyboardType ?? 'default'}
                autoCapitalize={autoCapitalize ?? 'sentences'}
                autoCorrect={false}
            />
        </View>
    )
}

// ─── Regulation card ──────────────────────────────────────────────────────────

function RegulationCard({
    reg,
    onToggle,
    onEdit,
}: {
    reg: Regulation
    onToggle: () => void
    onEdit: () => void
}) {
    const [logoBroken, setLogoBroken] = useState(false)

    return (
        <View className="bg-card border border-border/60 rounded-xl overflow-hidden">
            {/* Body */}
            <View className="p-4 flex-row items-start gap-4">
                {/* Logo */}
                <View
                    className={`w-12 h-12 rounded-lg items-center justify-center overflow-hidden flex-shrink-0 border ${logoBroken
                        ? 'bg-primary border-border/60'
                        : 'bg-white border-slate-200'
                        }`}
                >
                    {!logoBroken && reg.logoUrl ? (
                        <Image
                            source={{ uri: reg.logoUrl }}
                            className="w-10 h-10"
                            resizeMode="contain"
                            onError={() => setLogoBroken(true)}
                        />
                    ) : (
                        <Feather name="book-open" size={22} color="#94a3b8" />
                    )}
                </View>

                {/* Info */}
                <View className="flex-1 min-w-0">
                    <View className="flex-row items-center gap-2 mb-1">
                        <View className="px-1.5 py-0.5 bg-primary border border-border/60 rounded">
                            <Text className="text-[10px] font-bold text-slate-300 tracking-wider">
                                {reg.code}
                            </Text>
                        </View>
                    </View>
                    <Text className="text-sm font-semibold text-white mb-1.5" numberOfLines={2}>
                        {reg.name}
                    </Text>
                    <View className="flex-row items-center gap-3">
                        <View className="flex-row items-center gap-1">
                            <Feather name="globe" size={11} color="#94a3b8" />
                            <Text className="text-xs text-text-muted">{reg.region}</Text>
                        </View>
                        {!!reg.contactUrl && (
                            <TouchableOpacity
                                className="flex-row items-center gap-1"
                                onPress={() => Linking.openURL(reg.contactUrl || "")}
                                activeOpacity={0.7}
                            >
                                <Feather name="link" size={11} color="#94a3b8" />
                                <Text className="text-xs text-text-muted">Contact</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View className="bg-primary/50 border-t border-border/60 px-4 py-2.5 flex-row items-center justify-between">
                <TouchableOpacity
                    className={`flex-row items-center gap-1.5 px-2 py-1 rounded ${reg.isActive ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-transparent border border-border/60'
                        }`}
                    onPress={onToggle}
                    activeOpacity={0.7}
                >
                    <Feather
                        name={reg.isActive ? 'check-circle' : 'x-circle'}
                        size={13}
                        color={reg.isActive ? '#34d399' : '#64748b'}
                    />
                    <Text className={`text-xs font-medium ${reg.isActive ? 'text-emerald-500' : 'text-text-secondary'}`}>
                        {reg.isActive ? 'Active' : 'Inactive'}
                    </Text>
                </TouchableOpacity>
                <View className='flex flex-row items-center space-x-4'>
                    <TouchableOpacity
                        onPress={() =>
                            router.push({ pathname: '/(admin)/programs', params: { regId: reg.$id } })
                        }
                        className="flex-row items-center gap-1.5 px-2 py-1 rounded"
                    >
                        <Feather name="list" size={13} color="#94a3b8" />
                        <Text className="text-xs font-medium text-text-muted">Programs</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex-row items-center gap-1.5 px-2 py-1 rounded bg-secondary/10"
                        onPress={onEdit}
                        activeOpacity={0.7}
                    >
                        <Feather name="edit-2" size={13} color="#94a3b8" />
                        <Text className="text-xs font-medium text-text-muted">Edit</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function Regulations({ navigation }: { navigation?: any }) {
    const queryClient = useQueryClient();
    const { data: regulations, isLoading: isRegulationsLoading } = useSuspenseQuery({
        queryKey: ["regulations"],
        queryFn: () => getAllRegulations(),
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchInterval: 1000,
    });
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingReg, setEditingReg] = useState<Regulation | null>(null)
    const [logoFile, setLogoFile] = useState<any>(null)
    const [formData, setFormData] = useState<Partial<Regulation>>({
        code: '',
        name: '',
        logoUrl: '',
        isActive: true,
        contactUrl: '',
        region: '',
    })

    const filtered = regulations.filter((r) => {
        const q = search.toLowerCase().trim()
        const matchSearch =
            !q ||
            r.code.toLowerCase().includes(q) ||
            r.name.toLowerCase().includes(q) ||
            r.region.toLowerCase().includes(q)
        const matchStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && r.isActive) ||
            (statusFilter === 'inactive' && !r.isActive)
        return matchSearch && matchStatus
    })

    const counts = {
        total: regulations.length,
        active: regulations.filter((r) => r.isActive).length,
        regions: new Set(regulations.map((r) => r.region)).size,
    }

    const toggleMutation = useMutation({
        mutationFn: (reg: Regulation) => updateRegulation(reg.$id, { isActive: !reg.isActive }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['regulations'] });
        },
    });

    const toggleStatus = (id: string) => {
        const reg = regulations.find(r => r.$id === id);
        if (reg) toggleMutation.mutate(reg);
    };

    const handleOpenModal = (reg?: Regulation) => {
        if (reg) {
            setEditingReg(reg)
            setFormData({ ...reg })
        } else {
            setEditingReg(null)
            setFormData({ code: '', name: '', logoUrl: '', isActive: true, contactUrl: '', region: '' })
        }
        setLogoFile(null)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setTimeout(() => { setEditingReg(null); setFormData({}); setLogoFile(null); }, 250)
    }

    const createMutation = useMutation({
        mutationFn: (data: Partial<Regulation>) => createRegulation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['regulations'] });
            handleCloseModal();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<Regulation> }) => updateRegulation(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['regulations'] });
            handleCloseModal();
        },
    });

    const handleSave = () => {
        if (!formData.code?.trim() || !formData.name?.trim() || !formData.region?.trim()) return

        // Remove document-specific fields if they exist in formData before sending update
        const payload: any = { ...formData };
        delete payload.$id;
        delete payload.$createdAt;
        delete payload.$updatedAt;
        delete payload.$permissions;
        delete payload.$databaseId;
        delete payload.$collectionId;

        if (logoFile) {
            payload.logoFile = logoFile;
        }

        if (editingReg) {
            updateMutation.mutate({ id: editingReg.$id, data: payload });
        } else {
            createMutation.mutate(payload);
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setLogoFile(result.assets[0]);
        }
    };

    const ListHeader = (
        <View className="pt-4 mb-3">
            {/* Stats */}
            <View className="flex-row gap-2 mb-2.5">
                <View className="flex-1 bg-card border border-border/60 rounded-lg py-2.5 items-center">
                    <Text className="text-base font-bold text-white">{counts.total}</Text>
                    <Text className="text-[9px] text-text-secondary uppercase tracking-wider">Total</Text>
                </View>
                <View className="flex-1 bg-card border border-border/60 rounded-lg py-2.5 items-center">
                    <Text className="text-base font-bold text-emerald-500">{counts.active}</Text>
                    <Text className="text-[9px] text-text-secondary uppercase tracking-wider">Active</Text>
                </View>
                <View className="flex-1 bg-card border border-border/60 rounded-lg py-2.5 items-center">
                    <Text className="text-base font-bold text-secondary">{counts.regions}</Text>
                    <Text className="text-[9px] text-text-secondary uppercase tracking-wider">Regions</Text>
                </View>
            </View>
            <Text className="text-xs text-text-secondary">
                Showing {filtered.length} of {regulations.length} regulations
            </Text>
        </View>
    )

    return (
        <SafeAreaView className="flex-1 bg-primary">
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            {/* ── Header ── */}
            <View className="bg-primary border-b border-border/60 px-6 pt-3 pb-3">
                {/* Title row */}
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center gap-3">
                        <View>
                            <Text className="text-lg font-semibold text-white">Regulations</Text>
                            <Text className="text-xs text-red-400 font-medium uppercase tracking-wider">
                                System Administration
                            </Text>
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
                <View className="flex-row items-center bg-card rounded-xl px-4 py-1 border border-border/60">
                    <Feather name="search" size={20} color="#64748B" />
                    <TextInput
                        className="flex-1 ml-3 text-white text-base"
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search by code, name, or region..."
                        placeholderTextColor="#475569"
                        autoCorrect={false}
                        autoCapitalize="none"
                    />
                    {!!search && (
                        <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.7}>
                            <Feather name="x" size={15} color="#64748b" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Status filter */}
                <View className="flex-row gap-2 mt-4">
                    {(['all', 'active', 'inactive'] as StatusFilter[]).map((f) => {
                        const isSelected = statusFilter === f;
                        return (
                            <TouchableOpacity
                                key={f}
                                className={`px-4 py-2 rounded-lg border ${isSelected ? 'bg-secondary border-secondary' : 'bg-card border-border/60'
                                    }`}
                                onPress={() => setStatusFilter(f)}
                                activeOpacity={0.7}
                            >
                                <Text
                                    className={`${isSelected ? 'text-primary font-bold' : 'text-text-secondary font-medium'
                                        } text-xs`}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* ── List ── */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.$id}
                contentContainerClassName="px-6 pb-8"
                ListHeaderComponent={ListHeader}
                ItemSeparatorComponent={() => <View className="h-3" />}
                ListEmptyComponent={
                    <View className="items-center pt-16 pb-10 gap-3">
                        <Feather name="book-open" size={44} color="#334155" />
                        <Text className="text-sm text-text-muted">No regulations found</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <RegulationCard
                        reg={item}
                        onToggle={() => toggleStatus(item.$id)}
                        onEdit={() => handleOpenModal(item)}
                    />
                )}
            />

            {/* ── Add / Edit Sheet ── */}
            <BottomSheet visible={isModalOpen} onClose={handleCloseModal}>
                {/* Sheet header */}
                <View className="flex-row items-center justify-between px-6 py-4 border-b border-border/60">
                    <Text className="text-lg font-semibold text-white">
                        {editingReg ? 'Edit Regulation' : 'Add Regulation'}
                    </Text>
                    <TouchableOpacity
                        className="p-2 rounded-full bg-primary"
                        onPress={handleCloseModal}
                        activeOpacity={0.7}
                    >
                        <Feather name="x" size={20} color="#94a3b8" />
                    </TouchableOpacity>
                </View>

                {/* Form */}
                <ScrollView
                    contentContainerClassName="p-6 gap-4 pb-12"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Code + Region row */}
                    <View className="flex-row gap-4">
                        <Field
                            label="Code (e.g. FAA) *"
                            value={formData.code}
                            onChangeText={(t) => setFormData({ ...formData, code: t.toUpperCase() })}
                            autoCapitalize="characters"
                            className="flex-1"
                        />
                        <Field
                            label="Region *"
                            value={formData.region}
                            onChangeText={(t) => setFormData({ ...formData, region: t })}
                            placeholder="e.g. North America"
                            className="flex-1"
                        />
                    </View>

                    <Field
                        label="Full Name *"
                        value={formData.name}
                        onChangeText={(t) => setFormData({ ...formData, name: t })}
                    />

                    {/* Logo Picker */}
                    <View className="gap-1.5">
                        <Text className="text-xs font-medium text-text-muted">Logo (Optional)</Text>
                        <TouchableOpacity
                            onPress={pickImage}
                            activeOpacity={0.8}
                            className="bg-primary border border-border/60 rounded-lg p-3 flex-row items-center justify-between"
                        >
                            <View className="flex-row items-center gap-3">
                                {logoFile ? (
                                    <Image source={{ uri: logoFile.uri }} className="w-8 h-8 rounded" />
                                ) : formData.logoUrl ? (
                                    <Image source={{ uri: formData.logoUrl }} className="w-8 h-8 rounded" />
                                ) : (
                                    <View className="w-8 h-8 rounded bg-card items-center justify-center border border-border/60">
                                        <Feather name="image" size={14} color="#94a3b8" />
                                    </View>
                                )}
                                <Text className="text-white text-sm">
                                    {logoFile ? 'File selected' : formData.logoUrl ? 'Update existing logo' : 'Select a file...'}
                                </Text>
                            </View>
                            <Feather name="upload" size={16} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>

                    <Field
                        label="Contact URL"
                        value={formData.contactUrl}
                        onChangeText={(t) => setFormData({ ...formData, contactUrl: t })}
                        placeholder="https://..."
                        keyboardType="url"
                        autoCapitalize="none"
                    />

                    {/* Active status */}
                    <View className="flex-row items-center justify-between p-3 bg-primary border border-border/60 rounded-lg">
                        <View>
                            <Text className="text-sm font-medium text-gray-300">Active Status</Text>
                            <Text className="text-xs text-text-secondary">Enable or disable this regulation</Text>
                        </View>
                        <Toggle
                            value={!!formData.isActive}
                            onToggle={() => setFormData({ ...formData, isActive: !formData.isActive })}
                        />
                    </View>

                    {/* Submit */}
                    <TouchableOpacity
                        className={`w-full py-3.5 rounded-lg items-center mt-1 ${createMutation.isPending || updateMutation.isPending ? 'bg-secondary/50' : 'bg-secondary'}`}
                        onPress={handleSave}
                        activeOpacity={0.85}
                        disabled={createMutation.isPending || updateMutation.isPending}
                    >
                        <Text className="text-base font-bold text-primary">
                            {createMutation.isPending || updateMutation.isPending
                                ? 'Saving...'
                                : editingReg ? 'Save Changes' : 'Create Regulation'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </BottomSheet>
        </SafeAreaView>
    )
}
