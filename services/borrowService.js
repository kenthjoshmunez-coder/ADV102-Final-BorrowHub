import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { COLLECTIONS } from "../constants/collections";
import { REQUEST_STATUS } from "../constants/transactionStatus";
import { auth, db } from "../firebase/config";
import { getItemStock } from "../utils/items";

/**
 * Pending borrow request — stock is checked but not deducted until approval.
 */
export async function createBorrowRequest(item, quantity) {
  const user = auth.currentUser;
  if (!user) throw new Error("You must be signed in.");

  if (item.ownerId === user.uid) {
    throw new Error("You cannot borrow your own item.");
  }

  const qty = Math.max(1, Math.floor(Number(quantity) || 1));
  const available = getItemStock(item);

  if (qty > available) {
    throw new Error(`Only ${available} in stock. Request a smaller quantity.`);
  }

  return addDoc(collection(db, COLLECTIONS.BORROW_REQUESTS), {
    itemId: item.id,
    itemName: item.itemName,
    itemCategory: item.category ?? "other",
    borrowerId: user.uid,
    borrowerEmail: user.email ?? "",
    ownerId: item.ownerId,
    ownerEmail: item.ownerEmail ?? "",
    quantity: qty,
    status: REQUEST_STATUS.PENDING,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Atomic approval: validates stock, deducts inventory, updates request status.
 */
export async function approveBorrowRequest(request) {
  const user = auth.currentUser;
  if (!user || user.uid !== request.ownerId) {
    throw new Error("Only the item owner can approve requests.");
  }

  const itemRef = doc(db, COLLECTIONS.ITEMS, request.itemId);
  const requestRef = doc(db, COLLECTIONS.BORROW_REQUESTS, request.id);

  await runTransaction(db, async (transaction) => {
    const itemSnap = await transaction.get(itemRef);
    const requestSnap = await transaction.get(requestRef);

    if (!itemSnap.exists()) throw new Error("Item no longer exists.");
    if (!requestSnap.exists()) throw new Error("Request no longer exists.");

    const item = itemSnap.data();
    const currentRequest = requestSnap.data();

    if (currentRequest.status !== REQUEST_STATUS.PENDING) {
      throw new Error("This request was already processed.");
    }

    const stock = getItemStock({ ...item, id: request.itemId });
    const qty = currentRequest.quantity ?? 1;

    if (qty > stock) {
      throw new Error(`Not enough stock. Only ${stock} available.`);
    }

    transaction.update(itemRef, { stock: stock - qty });
    transaction.update(requestRef, {
      status: REQUEST_STATUS.APPROVED,
      updatedAt: serverTimestamp(),
      respondedAt: serverTimestamp(),
    });
  });
}

export async function rejectBorrowRequest(request) {
  const user = auth.currentUser;
  if (!user || user.uid !== request.ownerId) {
    throw new Error("Only the item owner can reject requests.");
  }

  const requestRef = doc(db, COLLECTIONS.BORROW_REQUESTS, request.id);

  await runTransaction(db, async (transaction) => {
    const requestSnap = await transaction.get(requestRef);
    if (!requestSnap.exists()) throw new Error("Request no longer exists.");

    if (requestSnap.data().status !== REQUEST_STATUS.PENDING) {
      throw new Error("This request was already processed.");
    }

    transaction.update(requestRef, {
      status: REQUEST_STATUS.REJECTED,
      updatedAt: serverTimestamp(),
      respondedAt: serverTimestamp(),
    });
  });
}

/**
 * Return flow: restores stock atomically when borrower marks item returned.
 */
export async function returnBorrowedItem(request) {
  const user = auth.currentUser;
  if (!user) throw new Error("You must be signed in.");

  const isBorrower = user.uid === request.borrowerId;
  const isOwner = user.uid === request.ownerId;
  if (!isBorrower && !isOwner) {
    throw new Error("You cannot update this request.");
  }

  const itemRef = doc(db, COLLECTIONS.ITEMS, request.itemId);
  const requestRef = doc(db, COLLECTIONS.BORROW_REQUESTS, request.id);

  await runTransaction(db, async (transaction) => {
    const itemSnap = await transaction.get(itemRef);
    const requestSnap = await transaction.get(requestRef);

    if (!requestSnap.exists()) throw new Error("Request no longer exists.");

    const currentRequest = requestSnap.data();
    if (currentRequest.status !== REQUEST_STATUS.APPROVED) {
      throw new Error("Only active borrows can be marked as returned.");
    }

    const qty = currentRequest.quantity ?? 1;
    const stock = itemSnap.exists() ? getItemStock(itemSnap.data()) : 0;

    if (itemSnap.exists()) {
      transaction.update(itemRef, { stock: stock + qty });
    }

    transaction.update(requestRef, {
      status: REQUEST_STATUS.RETURNED,
      updatedAt: serverTimestamp(),
      returnedAt: serverTimestamp(),
    });
  });
}

export async function cancelBorrowRequest(request) {
  const user = auth.currentUser;
  if (!user || user.uid !== request.borrowerId) {
    throw new Error("Only the borrower can cancel a pending request.");
  }

  const requestRef = doc(db, COLLECTIONS.BORROW_REQUESTS, request.id);

  await runTransaction(db, async (transaction) => {
    const requestSnap = await transaction.get(requestRef);
    if (!requestSnap.exists()) throw new Error("Request no longer exists.");

    if (requestSnap.data().status !== REQUEST_STATUS.PENDING) {
      throw new Error("Only pending requests can be cancelled.");
    }

    transaction.update(requestRef, {
      status: REQUEST_STATUS.CANCELLED,
      updatedAt: serverTimestamp(),
    });
  });
}

/** Real-time: all requests involving the current user (borrower or owner) */
export function subscribeToUserRequests(userId, onData, onError) {
  const requestsRef = collection(db, COLLECTIONS.BORROW_REQUESTS);

  const unsubBorrower = onSnapshot(
    query(requestsRef, where("borrowerId", "==", userId)),
    () => {},
    onError,
  );

  const unsubOwner = onSnapshot(
    query(requestsRef, where("ownerId", "==", userId)),
    () => {},
    onError,
  );

  const mergeAndEmit = () => {
    const map = new Map();
    return map;
  };

  let borrowerDocs = [];
  let ownerDocs = [];

  const emit = () => {
    const merged = new Map();
    [...borrowerDocs, ...ownerDocs].forEach((d) => {
      merged.set(d.id, d);
    });
    onData(
      Array.from(merged.values()).sort(
        (a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0),
      ),
    );
  };

  const unsub1 = onSnapshot(
    query(requestsRef, where("borrowerId", "==", userId)),
    (snap) => {
      borrowerDocs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      emit();
    },
    onError,
  );

  const unsub2 = onSnapshot(
    query(requestsRef, where("ownerId", "==", userId)),
    (snap) => {
      ownerDocs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      emit();
    },
    onError,
  );

  return () => {
    unsub1();
    unsub2();
  };
}
