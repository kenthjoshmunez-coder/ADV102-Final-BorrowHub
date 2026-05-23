import { SectionList, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../../constants/ui";
import { groupActivity } from "../../utils/activityGroups";
import EmptyState from "../EmptyState";
import SimpleRequestCard from "../SimpleRequestCard";

export default function ActivityTab({
  requests,
  userId,
  onApprove,
  onReject,
  onReturn,
  onCancel,
  processingId,
  listStyle,
}) {
  const sections = groupActivity(requests, userId);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[listStyle, sections.length === 0 && styles.emptyPad]}
      showsVerticalScrollIndicator={false}
      stickySectionHeadersEnabled={false}
      ListHeaderComponent={
        sections.length > 0 ? (
          <Text style={styles.intro}>
            Step 1: Reply to borrow asks. Step 2: Tap “Got it back” when items
            return.
          </Text>
        ) : null
      }
      ListEmptyComponent={
        <EmptyState
          emoji="📋"
          title="No requests yet"
          message="When you borrow an item or someone borrows yours, it shows up here."
        />
      }
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionSub}>{section.subtitle}</Text>
        </View>
      )}
      renderItem={({ item }) => (
        <SimpleRequestCard
          request={item}
          userId={userId}
          onApprove={onApprove}
          onReject={onReject}
          onReturn={onReturn}
          onCancel={onCancel}
          processingId={processingId}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  intro: {
    ...typography.caption,
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
    lineHeight: 20,
    color: colors.primaryDark,
  },
  sectionHead: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.title,
    fontSize: 17,
    color: colors.primaryDark,
  },
  sectionSub: {
    ...typography.caption,
    marginTop: 2,
  },
  emptyPad: {
    flexGrow: 1,
  },
});
