import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import AppButton from "../components/AppButton";
import ActivityTab from "../components/home/ActivityTab";
import BrowseTab from "../components/home/BrowseTab";
import StockTab from "../components/home/StockTab";
import Screen from "../components/Screen";
import TabBar from "../components/TabBar";
import { colors, radius, spacing, typography } from "../constants/ui";
import { useAuth } from "../hooks/useAuth";
import { useBorrowRequests } from "../hooks/useBorrowRequests";
import { useItems } from "../hooks/useItems";
import {
  approveBorrowRequest,
  cancelBorrowRequest,
  createBorrowRequest,
  rejectBorrowRequest,
  returnBorrowedItem,
} from "../services/borrowService";
import { deleteItem } from "../services/itemsService";
import { confirmAction } from "../utils/confirm";
import { getFriendlyError } from "../utils/errors";
import { showMessage } from "../utils/feedback";

export default function HomeScreen() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth(true);
  const { browseItems, myItems, myStockCount, loading: itemsLoading } =
    useItems(user?.uid);
  const { requests, incomingPending, loading: requestsLoading } =
    useBorrowRequests(user?.uid);

  const [activeTab, setActiveTab] = useState("browse");
  const [borrowingId, setBorrowingId] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const loading = authLoading || itemsLoading;

  const handleBorrow = async (item, quantity) => {
    setBorrowingId(item.id);
    try {
      await createBorrowRequest(item, quantity);
      showMessage(
        "Request sent",
        `Wait for the owner to say yes. Check the Requests tab.`,
      );
      setActiveTab("activity");
    } catch (error) {
      Alert.alert("Request failed", getFriendlyError(error));
    } finally {
      setBorrowingId(null);
    }
  };

  const runAction = async (id, action) => {
    setProcessingId(id);
    try {
      await action();
    } catch (error) {
      Alert.alert("Action failed", getFriendlyError(error));
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemoveItem = async (item) => {
    const ok = await confirmAction(
      "Delete this listing?",
      `Delete "${item.itemName}"? This cannot be undone.`,
    );
    if (!ok) return;

    setRemovingId(item.id);
    try {
      await deleteItem(item.id);
      showMessage("Deleted", `"${item.itemName}" was removed.`);
    } catch (error) {
      showMessage("Could not delete", getFriendlyError(error));
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <Screen center>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading BorrowHub...</Text>
      </Screen>
    );
  }

  if (!user) {
    return null;
  }

  const firstName = user.email?.split("@")[0] ?? "there";
  const pendingCount = incomingPending.length;

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.brand}>BorrowHub</Text>
          <Text style={styles.greeting}>Hi, {firstName} 👋</Text>
          <Text style={styles.tagline}>Find · Share · Track borrows</Text>
        </View>
        <Pressable onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sign out</Text>
        </Pressable>
      </View>

      {pendingCount > 0 ? (
        <Pressable
          style={styles.alertBanner}
          onPress={() => setActiveTab("activity")}
        >
          <Text style={styles.alertText}>
            {pendingCount} person{pendingCount > 1 ? "s" : ""} want to borrow
            from you — tap to reply
          </Text>
        </Pressable>
      ) : null}

      <TabBar activeTab={activeTab} onChange={setActiveTab} />

      <View style={styles.tabContent}>
        {activeTab === "browse" ? (
          <BrowseTab
            items={browseItems}
            onBorrow={handleBorrow}
            borrowingId={borrowingId}
            listStyle={styles.list}
          />
        ) : null}

        {activeTab === "stock" ? (
          <>
            <View style={styles.stockActions}>
              <AppButton
                title="+ Share new item"
                onPress={() => router.push("/add-item")}
              />
            </View>
            <StockTab
              items={myItems}
              totalStock={myStockCount}
              listStyle={styles.list}
              onRemoveItem={handleRemoveItem}
              removingId={removingId}
            />
          </>
        ) : null}

        {activeTab === "activity" ? (
          requestsLoading ? (
            <ActivityIndicator
              style={styles.activityLoader}
              color={colors.primary}
            />
          ) : (
            <ActivityTab
              requests={requests}
              userId={user.uid}
              onApprove={(r) =>
                runAction(r.id, () => approveBorrowRequest(r))
              }
              onReject={(r) =>
                runAction(r.id, () => rejectBorrowRequest(r))
              }
              onReturn={(r) =>
                runAction(r.id, () => returnBorrowedItem(r))
              }
              onCancel={(r) =>
                runAction(r.id, () => cancelBorrowRequest(r))
              }
              processingId={processingId}
              listStyle={styles.list}
            />
          )
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingText: { ...typography.caption, marginTop: spacing.md },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerLeft: { flex: 1, paddingRight: spacing.md },
  brand: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  greeting: { ...typography.hero, fontSize: 24, marginTop: 2 },
  tagline: { ...typography.caption, marginTop: 4 },
  logoutBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.full,
    alignSelf: "flex-start",
  },
  logoutText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "600",
  },
  alertBanner: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: "#FFF3E0",
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "#FFE0B2",
  },
  alertText: {
    color: "#E65100",
    fontWeight: "600",
    fontSize: 14,
  },
  tabContent: { flex: 1 },
  stockActions: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  activityLoader: { marginTop: spacing.xl },
});
