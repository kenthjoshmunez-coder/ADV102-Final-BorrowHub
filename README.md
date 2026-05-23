# BorrowHub

BorrowHub is a mobile application for students and small communities who frequently borrow and lend items such as books, gadgets, school materials, and tools.

## Features

- **Register & log in** with email and password
- **Add items for lending** with name, description, category, and stock count
- **Browse items to borrow** from other members with live stock display
- **Send borrow requests** with quantity selection
- **Approve or reject** requests (owners) — stock deducts only on approval via Firestore transactions
- **Track transactions in real time** — pending, approved, returned, rejected, cancelled
- **Mark items returned** — stock is restored atomically

## Project structure

```
app/                 # Expo Router routes
components/          # Reusable UI (buttons, cards, tabs)
components/home/     # Home screen tab views
constants/           # Collections, statuses, categories, theme
hooks/               # useAuth, useItems, useBorrowRequests
screens/             # Login, Register, Home, AddItem
services/            # Firebase data & transactional logic
utils/               # Helpers (stock, errors)
firebase/            # Firebase initialization
```

## Setup

1. `npm install`
2. Enable **Email/Password** auth in Firebase Console
3. Create a **Firestore** database
4. Deploy rules: `firebase deploy --only firestore:rules` (optional)
5. `npx expo start -c`

## Home screen tabs

| Tab | Purpose |
|-----|---------|
| **Borrow** | Items from others with stock & borrow request |
| **My Stock** | Your listed items and total units |
| **Activity** | Real-time borrow request status & actions |
