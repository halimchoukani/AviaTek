import { REQUEST_TYPE_COLORS, STATUS_COLORS } from '@/constant/Colors';
import { RequestDocument } from '@/lib/types';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PilotRequestCardProps {
    request: RequestDocument;
    expanded: boolean;
    onToggle: () => void;
}

export default function PilotRequestCard({ request, expanded, onToggle }: PilotRequestCardProps) {
    const status = (request.status as string).toLowerCase();
    const statusColors = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.pending;
    const typeLabel = (request as any).type || 'Type Rating';
    const typeColors = REQUEST_TYPE_COLORS[typeLabel as keyof typeof REQUEST_TYPE_COLORS] || REQUEST_TYPE_COLORS["Recurrency"];

    const isApproved = status === 'approved';
    const isPending = status === 'pending';
    const isRejected = status === 'rejected';

    return (
        <View style={styles.cardContainer}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onToggle}
                style={[styles.header, expanded && styles.headerExpanded]}
            >
                <View style={styles.headerLeft}>
                    <View style={styles.iconContainer}>
                        {request.sessionType === 'flight' ? (
                            <MaterialIcons name="airplanemode-active" size={18} color="#C9A961" />
                        ) : (
                            <MaterialIcons name="computer" size={18} color="#C9A961" />
                        )}
                    </View>
                    <View style={styles.titleInfo}>
                        <Text style={styles.aircraftTitle}>{(request as any).aircraftName || 'N/A'}</Text>
                        <Text style={styles.registration}>{(request as any).equipmentId || 'N/A'}</Text>
                    </View>
                </View>

                <View style={styles.headerRight}>
                    <View style={[styles.statusBadge, { backgroundColor: statusColors.bg, borderColor: statusColors.border }]}>
                        {isApproved && <Feather name="check-circle" size={12} color={statusColors.text} style={{ marginRight: 4 }} />}
                        {isPending && <Feather name="clock" size={12} color={statusColors.text} style={{ marginRight: 4 }} />}
                        {isRejected && <Feather name="x-circle" size={12} color={statusColors.text} style={{ marginRight: 4 }} />}
                        <Text style={[styles.statusText, { color: statusColors.text }]}>
                            {request.status.toUpperCase()}
                        </Text>
                    </View>
                    <Feather
                        name={expanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#64748B"
                    />
                </View>
            </TouchableOpacity>

            <View style={styles.compactDetails}>
                <View style={[styles.typeBadge, { backgroundColor: typeColors.bg }]}>
                    <Text style={[styles.typeText, { color: typeColors.text }]}>{typeLabel}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Feather name="calendar" size={12} color="#64748B" />
                    <Text style={styles.detailText}>{request.startDate ? new Date(request.startDate).toLocaleDateString() : 'N/A'}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Feather name="clock" size={12} color="#64748B" />
                    <Text style={styles.detailText}>{request.hours}h</Text>
                </View>
            </View>

            {expanded && (
                <View style={styles.expandedContent}>
                    <View style={styles.infoGrid}>
                        <View style={styles.infoCol}>
                            <Text style={styles.infoLabel}>Preferred Times</Text>
                            <Text style={styles.infoValue}>{request.preferredTimes || 'N/A'}</Text>
                        </View>
                        <View style={styles.infoCol}>
                            <Text style={styles.infoLabel}>Submitted</Text>
                            <Text style={styles.infoValue}>{request.$createdAt ? new Date(request.$createdAt).toLocaleDateString() : 'N/A'}</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Your Notes</Text>
                        <View style={styles.notesBox}>
                            <Text style={styles.notesText}>{request.note || "No notes provided."}</Text>
                        </View>
                    </View>

                    {(request as any).response && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionLabel, { color: '#10B981' }]}>Academy Response</Text>
                            <View style={[styles.responseBox, isApproved && styles.responseBoxApproved]}>
                                <Text style={[styles.responseText, isApproved && { color: '#10B981' }]}>
                                    {(request as any).response}
                                </Text>
                            </View>
                        </View>
                    )}

                    {isApproved && (
                        <TouchableOpacity style={styles.sessionDetailsBtn}>
                            <Feather name="check-circle" size={16} color="#10B981" style={{ marginRight: 8 }} />
                            <Text style={styles.sessionDetailsText}>View Session Details</Text>
                            <Feather name="chevron-right" size={16} color="#10B981" style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#1E293B', // card bg from screenshot looks similar to this navy
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#334155',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    headerExpanded: {
        paddingBottom: 8,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#0F172A',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#334155',
    },
    titleInfo: {
        justifyContent: 'center',
    },
    aircraftTitle: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
    registration: {
        color: '#64748B',
        fontSize: 12,
        marginTop: 2,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        marginRight: 12,
        borderWidth: 1,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    compactDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 16,
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    typeText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        color: '#64748B',
        fontSize: 11,
    },
    expandedContent: {
        padding: 16,
        paddingTop: 0,
        borderTopWidth: 1,
        borderTopColor: '#334155',
    },
    infoGrid: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 16,
    },
    infoCol: {
        flex: 1,
    },
    infoLabel: {
        color: '#64748B',
        fontSize: 11,
        marginBottom: 4,
    },
    infoValue: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 16,
    },
    sectionLabel: {
        color: '#64748B',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
    },
    notesBox: {
        backgroundColor: '#0F172A',
        padding: 12,
        borderRadius: 8,
    },
    notesText: {
        color: '#94A3B8',
        fontSize: 13,
        lineHeight: 18,
    },
    responseBox: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#0F172A',
    },
    responseBoxApproved: {
        borderWidth: 1,
        borderColor: '#064E3B',
        backgroundColor: 'rgba(6, 78, 59, 0.1)',
    },
    responseText: {
        color: '#94A3B8',
        fontSize: 13,
        lineHeight: 18,
    },
    sessionDetailsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#064E3B',
        backgroundColor: 'rgba(6, 78, 59, 0.1)',
        marginTop: 8,
    },
    sessionDetailsText: {
        color: '#10B981',
        fontSize: 14,
        fontWeight: '600',
    }
});
