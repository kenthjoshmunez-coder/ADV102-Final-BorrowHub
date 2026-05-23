import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { COLLECTIONS } from "../constants/collections";
import { REQUEST_STATUS } from "../constants/transactionStatus";
import { auth, db } from "../firebase/config";

/**
 * @param {{ itemName: string, description: string, category: string, stock: number }} data
 */
export async function createItem(data) {
  const user = auth.currentUser;
  if (!user) throw new Error("You must be signed in to add items.");

  const stock = Math.max(1, Math.floor(Number(data.stock) || 1));

  return addDoc(collection(db, COLLECTIONS.ITEMS), {
    itemName: data.itemName.trim(),
    description: data.description?.trim() ?? "",
    category: data.category,
    ownerId: user.uid,
    ownerEmail: user.email ?? "",
    stock,
    createdAt: serverTimestamp(),
  });
}

async function getRequestsForItem(itemId) {
  const snap = await getDocs(
    query(
      collection(db, COLLECTIONS.BORROW_REQUESTS),
      where("itemId", "==", itemId),
    ),
  );
  return snap.docs;
}

/** Remove listing. Cancels waiting requests. Blocks if someone still has it borrowed. */
export async function deleteItem(itemId) {
  const user = auth.currentUser;
  if (!user) throw new Error("You must be signed in.");

  const itemRef = doc(db, COLLECTIONS.ITEMS, itemId);
  const itemSnap = await getDoc(itemRef);

  if (!itemSnap.exists()) {
    throw new Error("This item is already gone.");
  }

  if (itemSnap.data().ownerId !== user.uid) {
    throw new Error("You can only delete your own items.");
  }

  const requestDocs = await getRequestsForItem(itemId);

  const stillBorrowed = requestDocs.some(
    (d) => d.data().status === REQUEST_STATUS.APPROVED,
  );

  if (stillBorrowed) {
    throw new Error(
      "Someone still has this item. Go to Requests → tap “Got it back” first.",
    );
  }

  const batch = writeBatch(db);

  requestDocs.forEach((requestDoc) => {
    if (requestDoc.data().status === REQUEST_STATUS.PENDING) {
      batch.update(requestDoc.ref, {
        status: REQUEST_STATUS.CANCELLED,
        updatedAt: serverTimestamp(),
      });
    }
  });

  batch.delete(itemRef);
  await batch.commit();
}

/** Real-time listener for all community items */
export function subscribeToItems(onData, onError) {
  return onSnapshot(
    query(collection(db, COLLECTIONS.ITEMS)),
    (snapshot) => {
      onData(
        snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })),
      );
    },
    onError,
  );
}
