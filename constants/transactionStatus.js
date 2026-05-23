export const REQUEST_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  RETURNED: "returned",
  CANCELLED: "cancelled",
};

/** Short labels users see on cards */
export const STATUS_LABELS = {
  pending: "Waiting",
  approved: "On loan",
  rejected: "Declined",
  returned: "Finished",
  cancelled: "Cancelled",
};

export const STATUS_COLORS = {
  pending: { bg: "#FFF8E1", text: "#F57F17" },
  approved: { bg: "#E3F2FD", text: "#1565C0" },
  rejected: { bg: "#FFEBEE", text: "#C62828" },
  returned: { bg: "#E8F5E9", text: "#2E7D32" },
  cancelled: { bg: "#ECEFF1", text: "#546E7A" },
};

/** One plain sentence explaining this request to the current user */
export function getRequestSummary(request, userId) {
  const qty = request.quantity ?? 1;
  const item = request.itemName ?? "an item";
  const borrower =
    request.borrowerEmail?.split("@")[0] ?? "Someone";
  const owner = request.ownerEmail?.split("@")[0] ?? "the owner";

  if (request.ownerId === userId) {
    if (request.status === REQUEST_STATUS.PENDING) {
      return `${borrower} wants to borrow your ${item} (×${qty})`;
    }
    if (request.status === REQUEST_STATUS.APPROVED) {
      return `${borrower} has your ${item} (×${qty}) — mark when returned`;
    }
    if (request.status === REQUEST_STATUS.REJECTED) {
      return `You declined ${borrower}'s request for ${item}`;
    }
    if (request.status === REQUEST_STATUS.RETURNED) {
      return `${item} was returned by ${borrower}`;
    }
    return `Request for ${item} — ${STATUS_LABELS[request.status]}`;
  }

  if (request.status === REQUEST_STATUS.PENDING) {
    return `You asked to borrow ${item} from ${owner} (×${qty})`;
  }
  if (request.status === REQUEST_STATUS.APPROVED) {
    return `You are borrowing ${item} from ${owner} (×${qty})`;
  }
  if (request.status === REQUEST_STATUS.REJECTED) {
    return `${owner} declined your request for ${item}`;
  }
  if (request.status === REQUEST_STATUS.RETURNED) {
    return `You returned ${item} to ${owner}`;
  }
  if (request.status === REQUEST_STATUS.CANCELLED) {
    return `Your request for ${item} was cancelled`;
  }
  return `Request for ${item}`;
}
