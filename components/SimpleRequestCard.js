import { StyleSheet, Text, View } from "react-native";
import {
  REQUEST_STATUS,
  STATUS_COLORS,
  STATUS_LABELS,
  getRequestSummary,
} from "../constants/transactionStatus";
import { colors, radius, spacing, typography } from "../constants/ui";
import AppButton from "./AppButton";

export default function SimpleRequestCard({
  request,
  userId,
  onApprove,
  onReject,
  onReturn,
  onCancel,
  processingId,
}) {
  const isOwner = request.ownerId === userId;
  const statusStyle = STATUS_COLORS[request.status] ?? STATUS_COLORS.pending;
  const busy = processingId === request.id;
  const summary = getRequestSummary(request, userId);

  return (
    <View style={styles.card}>
      <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
        <Text style={[styles.badgeText, { color: statusStyle.text }]}>
          {STATUS_LABELS[request.status]}
        </Text>
      </View>

      <Text style={styles.summary}>{summary}</Text>

      {isOwner && request.status === REQUEST_STATUS.PENDING ? (
        <View style={styles.row}>
          <View style={styles.half}>
            <AppButton
              title="Yes, lend it"
              onPress={() => onApprove(request)}
              loading={busy}
              disabled={busy}
            />
          </View>
          <View style={styles.half}>
            <AppButton
              title="No thanks"
              variant="secondary"
              onPress={() => onReject(request)}
              disabled={busy}
            />
          </View>
        </View>
      ) : null}

      {request.status === REQUEST_STATUS.APPROVED ? (
        <AppButton
          title="Got it back"
          onPress={() => onReturn(request)}
          loading={busy}
          disabled={busy}
        />
      ) : null}

      {!isOwner && request.status === REQUEST_STATUS.PENDING ? (
        <AppButton
          title="Cancel my request"
          variant="ghost"
          onPress={() => onCancel(request)}
          disabled={busy}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginBottom: spacing.sm,
  },
  badgeText: { fontSize: 12, fontWeight: "700" },
  summary: {
    ...typography.body,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  row: { flexDirection: "row", gap: spacing.sm },
  half: { flex: 1 },
});
