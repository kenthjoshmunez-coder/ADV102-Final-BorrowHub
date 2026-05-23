import { REQUEST_STATUS } from "../constants/transactionStatus";

/** Split requests into simple sections for the Requests tab */
export function groupActivity(requests, userId) {
  const needsReply = [];
  const yourLoans = [];
  const waiting = [];
  const finished = [];

  requests.forEach((request) => {
    const { status } = request;
    const isOwner = request.ownerId === userId;
    const isBorrower = request.borrowerId === userId;

    if (status === REQUEST_STATUS.PENDING && isOwner) {
      needsReply.push(request);
    } else if (status === REQUEST_STATUS.APPROVED) {
      yourLoans.push(request);
    } else if (status === REQUEST_STATUS.PENDING && isBorrower) {
      waiting.push(request);
    } else if (
      [
        REQUEST_STATUS.RETURNED,
        REQUEST_STATUS.REJECTED,
        REQUEST_STATUS.CANCELLED,
      ].includes(status)
    ) {
      finished.push(request);
    }
  });

  const sections = [];

  if (needsReply.length) {
    sections.push({
      title: "Reply needed",
      subtitle: "Someone wants to borrow from you",
      data: needsReply,
    });
  }
  if (yourLoans.length) {
    sections.push({
      title: "On loan now",
      subtitle: "Tap when the item is back",
      data: yourLoans,
    });
  }
  if (waiting.length) {
    sections.push({
      title: "Waiting for owner",
      subtitle: "You asked to borrow these",
      data: waiting,
    });
  }
  if (finished.length) {
    sections.push({
      title: "Done",
      subtitle: "Past requests",
      data: finished,
    });
  }

  return sections;
}
