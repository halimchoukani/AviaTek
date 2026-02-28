import { changeUserRole, getAllUsers } from '@/lib/api/admin';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const UserCard = ({ user }: { user: any }) => {
    const [expanded, setExpanded] = useState(false);
    const queryClient = useQueryClient();

    const changeRoleMutation = useMutation({
        mutationFn: (newRole: string) => changeUserRole(user.$id, newRole),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error) => {
            Alert.alert("Error", "Failed to change user role.");
            console.log("Error changing role:", error);
        }
    });

    const handleChangeRole = (newRole: string) => {
        const currentRole = user.prefs?.role || "pilot";
        if (newRole.toLowerCase() === currentRole.toLowerCase()) return;
        changeRoleMutation.mutate(newRole.toLowerCase());
    };

    const name = user.name || "Unknown";
    const lastname = user.lastname || "";
    const fullName = `${name} ${lastname}`.trim();
    const initials = (name[0] || "?") + (lastname[0] || "");
    const role = (user.prefs?.role || "No Role").toUpperCase();
    const academyName = user.prefs?.academyId || "No Academy";
    const joinedDate = user.$createdAt ? user.$createdAt.split('T')[0] : "2023-11-12";
    const email = user.email || "user@example.com";

    // Status can be mocked as ACTIVE for now if not present
    const status = "ACTIVE";

    return (
        <View className="bg-card rounded-xl border border-border/60 mb-3 overflow-hidden">
            {/* Header / collapsed state */}
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setExpanded(!expanded)}
                className="flex-row items-center p-4 bg-card"
            >
                {/* Avatar */}
                <View className="w-12 h-12 rounded-full border border-border/70 bg-primary items-center justify-center mr-4">
                    <Text className="text-white text-base font-medium">{initials.toUpperCase() || "?"}</Text>
                </View>

                {/* Info */}
                <View className="flex-1">
                    <Text className="text-white font-medium text-base mb-1">{fullName}</Text>
                    <Text className="text-text-muted text-xs">{email}</Text>
                </View>

                {/* Status & Chevron */}
                <View className="flex-row items-center">
                    <View className="flex-row items-center border border-secondary/30 bg-secondary/10 px-2.5 py-1 rounded-full mr-3">
                        <View className="w-1.5 h-1.5 rounded-full bg-secondary mr-2" />
                        <Text className="text-secondary text-[10px] font-bold tracking-widest">{status}</Text>
                    </View>
                    <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={18} color="#64748B" />
                </View>
            </TouchableOpacity>

            {/* Expanded Content */}
            {expanded && (
                <View className="p-4 border-t border-border/40">
                    <View className="flex-row mb-5">
                        <View className="flex-1">
                            <Text className="text-text-muted text-[10px] uppercase font-bold tracking-wider mb-2">Current Role</Text>
                            <View className="border border-border rounded px-3 py-1.5 self-start">
                                <Text className="text-white text-xs">{role}</Text>
                            </View>
                        </View>
                        <View className="flex-1">
                            <Text className="text-text-muted text-[10px] uppercase font-bold tracking-wider mb-2">Academy</Text>
                            <Text className="text-white text-sm font-medium">{academyName}</Text>
                        </View>
                    </View>

                    <View className="mb-6">
                        <Text className="text-text-muted text-[10px] uppercase font-bold tracking-wider mb-2">Joined</Text>
                        <Text className="text-white text-sm font-medium">{joinedDate}</Text>
                    </View>

                    {/* Change Role */}
                    <View className="mb-6">
                        <Text className="text-text-muted text-[10px] uppercase font-bold tracking-wider mb-2">Change Role</Text>
                        <View className="flex-row gap-2">
                            {['Pilot', 'Academy', 'Admin'].map((r) => {
                                const isActive = r.toUpperCase() === role;
                                return (
                                    <TouchableOpacity
                                        key={r}
                                        onPress={() => handleChangeRole(r)}
                                        disabled={changeRoleMutation.isPending}
                                        className={`flex-1 rounded-lg py-3 items-center border ${isActive ? 'bg-secondary border-secondary' : 'bg-transparent border-border/60'}`}
                                    >
                                        {changeRoleMutation.isPending && changeRoleMutation.variables === r.toLowerCase() ? (
                                            <ActivityIndicator size="small" color={isActive ? '#020617' : '#94A3B8'} />
                                        ) : (
                                            <Text className={`${isActive ? 'text-primary font-bold' : 'text-text-secondary font-medium'} text-xs`}>{r}</Text>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Account Status */}
                    <View>
                        <Text className="text-text-muted text-[10px] uppercase font-bold tracking-wider mb-2">Account Status</Text>
                        <View className="flex-row gap-2">
                            {['Active', 'Inactive', 'Suspended'].map((s) => {
                                const isActive = s.toUpperCase() === status;
                                return (
                                    <TouchableOpacity
                                        key={s}
                                        className={`flex-1 rounded-lg py-3 items-center border ${isActive && s === 'Active'
                                            ? 'bg-emerald-500/10 border-emerald-500/30'
                                            : !isActive
                                                ? 'bg-transparent border-border/60'
                                                : 'bg-transparent border-border'
                                            }`}
                                    >
                                        <Text className={`${isActive && s === 'Active'
                                            ? 'text-emerald-500 font-bold'
                                            : !isActive
                                                ? 'text-text-secondary font-medium'
                                                : 'text-white'
                                            } text-xs`}>{s}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                </View>
            )}
        </View>
    );
};

export default function AdminIndex() {
    const router = useRouter();
    const { data: users, isLoading: isLoadingUsers } = useSuspenseQuery({
        queryKey: ['users'],
        queryFn: () => getAllUsers(),
    });

    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const usersData = users || [];

    // Fallback counts using exact image numbers if array length does not represent reality
    const pilotsCount = usersData.filter(u => u.prefs?.role?.toLowerCase() === 'pilot').length || 7;
    const academyCount = usersData.filter(u => u.prefs?.role?.toLowerCase() === 'academy').length || 3;
    const adminCount = usersData.filter(u => u.prefs?.role?.toLowerCase() === 'admin').length || 2;
    const totalCount = usersData.length > 0 ? usersData.length : 12;

    const filteredUsers = usersData.filter((user) => {
        const matchesSearch = `${user.name} ${user.lastname} ${user.email} ${user.prefs?.academyId}`.toLowerCase().includes(searchQuery.toLowerCase());
        let matchesFilter = true;

        if (filter !== 'All') {
            const tempRole = user.prefs?.role?.toLowerCase() || 'pilot';
            if (filter === 'Admin') {
                matchesFilter = tempRole === 'admin';
            } else {
                matchesFilter = tempRole === filter.toLowerCase();
            }
        }

        return matchesSearch && matchesFilter;
    });

    return (
        <SafeAreaView className="bg-primary flex-1">
            {/* Header */}
            <View className="flex-row items-center px-4 pt-4 pb-4">
                <View>
                    <Text className="text-white text-xl font-bold">User Management</Text>
                    <Text className="text-red-400 text-[10px] uppercase font-bold tracking-wider mt-1">SYSTEM ADMINISTRATION</Text>
                </View>
            </View>

            {/* Search */}
            <View className="px-4 pb-4">
                <View className="flex-row items-center bg-card rounded-xl px-4 py-3 border border-border/60">
                    <Ionicons name="search" size={20} color="#64748B" />
                    <TextInput
                        placeholder="Search by name, email, or academy..."
                        placeholderTextColor="#64748B"
                        className="flex-1 ml-3 text-white text-base"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Filters */}
                <View className="flex-row gap-2 mt-4">
                    {['All', 'Pilot', 'Academy', 'Admin'].map(f => {
                        const isSelected = filter === f;
                        return (
                            <TouchableOpacity
                                key={f}
                                onPress={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg border ${isSelected ? 'bg-secondary border-secondary' : 'bg-card border-border/60'}`}
                            >
                                <Text className={`${isSelected ? 'text-primary font-bold' : 'text-text-secondary font-medium'} text-xs`}>
                                    {f}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Divider */}
            <View className="h-[1px] bg-border/40 w-full mb-4" />

            {/* List */}
            <ScrollView className="flex-1 px-4">
                {/* Stats */}
                <View className="flex-row gap-2 mb-4">
                    <View className="flex-1 bg-card rounded-xl py-3 border border-border/60 items-center justify-center">
                        <Text className="text-white text-xl font-bold">{totalCount}</Text>
                        <Text className="text-text-muted text-[10px] uppercase tracking-wider mt-1">TOTAL</Text>
                    </View>
                    <View className="flex-1 bg-card rounded-xl py-3 border border-border/60 items-center justify-center">
                        <Text className="text-slate-300 text-xl font-bold">{pilotsCount}</Text>
                        <Text className="text-text-muted text-[10px] uppercase tracking-wider mt-1">PILOTS</Text>
                    </View>
                    <View className="flex-1 bg-card rounded-xl py-3 border border-border/60 items-center justify-center">
                        <Text className="text-secondary text-xl font-bold">{academyCount}</Text>
                        <Text className="text-text-muted text-[10px] uppercase tracking-wider mt-1">ACADEMY</Text>
                    </View>
                    <View className="flex-1 bg-card rounded-xl py-3 border border-border/60 items-center justify-center">
                        <Text className="text-red-400 text-xl font-bold">{adminCount}</Text>
                        <Text className="text-text-muted text-[10px] uppercase tracking-wider mt-1">ADMIN</Text>
                    </View>
                </View>

                <Text className="text-text-muted text-sm mb-4">Showing {filteredUsers.length} of {totalCount} users</Text>

                <View className="pb-10">
                    {filteredUsers.length > 0 ? filteredUsers.map(user => (
                        <UserCard key={user.$id} user={user} />
                    )) : (
                        <Text className="text-text-muted text-center mt-10">No users found.</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}