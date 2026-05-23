/**
 * @typedef {Object} Item
 * @property {string} id
 * @property {string} itemName
 * @property {string} [description]
 * @property {string} category
 * @property {string} ownerId
 * @property {string} ownerEmail
 * @property {number} stock
 * @property {import('firebase/firestore').Timestamp} [createdAt]
 */

/**
 * @typedef {Object} BorrowRequest
 * @property {string} id
 * @property {string} itemId
 * @property {string} itemName
 * @property {string} borrowerId
 * @property {string} borrowerEmail
 * @property {string} ownerId
 * @property {number} quantity
 * @property {'pending'|'approved'|'rejected'|'returned'|'cancelled'} status
 */
