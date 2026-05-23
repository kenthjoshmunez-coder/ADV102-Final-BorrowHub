/** @param {import('../types').Item} item */
export function getItemStock(item) {
  if (typeof item?.stock === "number") return Math.max(0, item.stock);
  return item?.availabilityStatus === "available" ? 1 : 0;
}

export function isInStock(item) {
  return getItemStock(item) > 0;
}

export function canBorrowItem(item, userId) {
  return item?.ownerId !== userId && isInStock(item);
}
