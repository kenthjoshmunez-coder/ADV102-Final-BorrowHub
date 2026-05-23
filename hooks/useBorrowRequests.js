import { useEffect, useMemo, useState } from "react";
import { REQUEST_STATUS } from "../constants/transactionStatus";
import { subscribeToUserRequests } from "../services/borrowService";

export function useBorrowRequests(userId) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToUserRequests(
      userId,
      (data) => {
        setRequests(data);
        setLoading(false);
      },
      () => setLoading(false),
    );

    return unsubscribe;
  }, [userId]);

  const incomingPending = useMemo(
    () =>
      requests.filter(
        (r) =>
          r.ownerId === userId && r.status === REQUEST_STATUS.PENDING,
      ),
    [requests, userId],
  );

  const myBorrows = useMemo(
    () => requests.filter((r) => r.borrowerId === userId),
    [requests, userId],
  );

  const activeBorrows = useMemo(
    () =>
      requests.filter((r) => r.status === REQUEST_STATUS.APPROVED),
    [requests],
  );

  return {
    requests,
    incomingPending,
    myBorrows,
    activeBorrows,
    loading,
  };
}
