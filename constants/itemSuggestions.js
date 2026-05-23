/** Quick-add templates when listing items to lend */
export const LISTING_SUGGESTIONS = [
  {
    name: "Smartphone (iPhone / Android)",
    category: "phones",
    description: "Short-term borrow; charger included if possible.",
    stock: "1",
  },
  {
    name: "Tablet / iPad",
    category: "phones",
    description: "Good for notes, reading, or light school work.",
    stock: "1",
  },
  {
    name: "Laptop",
    category: "gadgets",
    description: "For projects, coding, or online classes.",
    stock: "1",
  },
  {
    name: "Scientific calculator",
    category: "school",
    description: "Common for math, engineering, or accounting classes.",
    stock: "1",
  },
  {
    name: "Textbook",
    category: "books",
    description: "Include subject or edition in notes when borrowing.",
    stock: "1",
  },
  {
    name: "USB flash drive / hard drive",
    category: "gadgets",
    description: "For file transfers or backups.",
    stock: "1",
  },
  {
    name: "Power bank",
    category: "gadgets",
    description: "Handy for campus or events.",
    stock: "1",
  },
  {
    name: "Extension cord / adapter",
    category: "tools",
    description: "Useful in dorms or shared study spaces.",
    stock: "1",
  },
  {
    name: "Basketball / volleyball",
    category: "sports",
    description: "For PE or club practice.",
    stock: "1",
  },
  {
    name: "Board game",
    category: "other",
    description: "Great for clubs or dorm hangouts.",
    stock: "1",
  },
];

/** What students commonly search for — shown on Borrow tab */
export const BORROW_IDEAS = [
  {
    emoji: "📱",
    title: "Phones & tablets",
    tip: "Best for quick tasks — always confirm pickup time and battery %.",
  },
  {
    emoji: "💻",
    title: "Laptops & chargers",
    tip: "Ideal for assignments; ask about software installed.",
  },
  {
    emoji: "📚",
    title: "Books & readers",
    tip: "Cheaper than buying — check edition matches your syllabus.",
  },
  {
    emoji: "✏️",
    title: "School supplies",
    tip: "Calculators, rulers, lab goggles — often needed for one term only.",
  },
  {
    emoji: "🔧",
    title: "Tools & cables",
    tip: "Adapters and tools are high-demand in dorms.",
  },
];

export const BEST_TO_BORROW_NOTE =
  "Best to request: items you only need for days or weeks (phones, laptops, textbooks, calculators). Avoid borrowing personal hygiene items.";
