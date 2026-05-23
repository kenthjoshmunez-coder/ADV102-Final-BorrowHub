import { useEffect, useMemo, useState } from "react";
import { subscribeToItems } from "../services/itemsService";
import { canBorrowItem } from "../utils/items";

export function useItems(userId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToItems(
      (data) => {
        setItems(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [userId]);

  const browseItems = useMemo(
    () =>
      items.filter((item) => canBorrowItem(item, userId)),
    [items, userId],
  );

  const myItems = useMemo(
    () => items.filter((item) => item.ownerId === userId),
    [items, userId],
  );

  const myStockCount = useMemo(
    () => myItems.reduce((sum, item) => sum + (item.stock ?? 0), 0),
    [myItems],
  );

  return {
    items,
    browseItems,
    myItems,
    myStockCount,
    loading,
    error,
  };
}
