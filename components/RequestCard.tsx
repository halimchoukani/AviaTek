import { REQUEST_TYPE_COLORS, STATUS_COLORS } from "@/constant/Colors";
import { Request } from "@/constant/Types";
import { Feather } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RequestCard({
  request,
  expanded,
  onToggle,
}: {
  request: Request;
  expanded: boolean;
  onToggle: () => void;
}) {
  const statusColors = STATUS_COLORS[request.status];
  const typeColors =
    REQUEST_TYPE_COLORS[request.type] || REQUEST_TYPE_COLORS["Recurrency"];

  return (
    <View style={styles.card}>
      <Pressable onPress={onToggle}>
        <View style={styles.content}>
          {/* Top Row */}
          <View style={styles.topRow}>
            <View>
              <Text style={styles.name}>
                {request.rank} {request.name}
              </Text>
              <Text style={styles.license}>{request.licenseId}</Text>
            </View>

            <View style={styles.row}>
              {request.isUrgent && request.status === "Pending" && (
                <View style={styles.urgentBadge}>
                  <Text style={styles.urgentText}>URGENT</Text>
                </View>
              )}

              <View style={styles.statusBadge}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: statusColors.text },
                  ]}
                />
                <Text style={[styles.statusText, { color: statusColors.text }]}>
                  {request.status.toUpperCase()}
                </Text>
              </View>

              <Feather
                name={expanded ? "chevron-up" : "chevron-down"}
                size={20}
                color="#64748B"
                style={{ marginLeft: 8 }}
              />
            </View>
          </View>

          {/* Middle Row */}
          <View style={styles.middleRow}>
            <View style={styles.row}>
              <Feather
                name="send"
                size={14}
                color="#EAB308"
                style={{ transform: [{ rotate: "-45deg" }], marginRight: 6 }}
              />
              <Text style={styles.subtleText}>{request.aircraft}</Text>
            </View>

            <View
              style={[styles.typeBadge, { backgroundColor: typeColors.bg }]}
            >
              <Text style={[styles.typeText, { color: typeColors.text }]}>
                {request.type.toUpperCase()}
              </Text>
            </View>

            <View style={styles.row}>
              <Feather
                name="clock"
                size={14}
                color="#94A3B8"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.subtleText}>{request.duration}</Text>
            </View>
          </View>
        </View>
      </Pressable>

      {/* Expanded Content */}
      {expanded && (
        <View style={styles.expandedSection}>
          <View style={styles.divider} />

          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Aircraft</Text>
              <Text style={styles.value}>{request.aircraftId || "N/A"}</Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.label}>Requested Date</Text>
              <Text style={styles.value}>{request.requestedDate || "N/A"}</Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.label}>Preferred Times</Text>
              <Text style={styles.value}>
                {request.preferredTimes || "N/A"}
              </Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.label}>Submitted</Text>
              <Text style={styles.value}>{request.submittedDate || "N/A"}</Text>
            </View>
          </View>

          {request.reason && (
            <View style={{ marginBottom: 20 }}>
              <View style={[styles.row, { marginBottom: 8 }]}>
                <Feather
                  name="message-square"
                  size={14}
                  color="#64748B"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.label}>Reason</Text>
              </View>

              <View style={styles.reasonBox}>
                <Text style={styles.reasonText}>{request.reason}</Text>
              </View>
            </View>
          )}

          {request.status === "Pending" && (
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.approveBtn}>
                <Feather
                  name="check-circle"
                  size={18}
                  color="#10B981"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.approveText}>Approve</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.rejectBtn}>
                <Feather
                  name="x-circle"
                  size={18}
                  color="#EF4444"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.rejectText}>Reject</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    overflow: "hidden",
  },
  content: {
    padding: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  name: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "600",
  },
  license: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  urgentBadge: {
    backgroundColor: "rgba(239,68,68,0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  urgentText: {
    color: "#EF4444",
    fontSize: 10,
    fontWeight: "700",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#020617",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#334155",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  middleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subtleText: {
    color: "#94A3B8",
    fontSize: 12,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  expandedSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#334155",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 20,
  },
  gridItem: {
    width: "45%",
  },
  label: {
    color: "#64748B",
    fontSize: 11,
    marginBottom: 2,
  },
  value: {
    color: "#F8FAFC",
    fontSize: 13,
    fontWeight: "500",
  },
  reasonBox: {
    backgroundColor: "#020617",
    padding: 12,
    borderRadius: 8,
  },
  reasonText: {
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  approveBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "rgba(16,185,129,0.1)",
    borderWidth: 1,
    borderColor: "#10B981",
  },
  rejectBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  approveText: {
    color: "#10B981",
    fontSize: 14,
    fontWeight: "600",
  },
  rejectText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "600",
  },
});
