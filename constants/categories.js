export const ITEM_CATEGORIES = [
  { id: "phones", label: "Phones & tablets", emoji: "📱" },
  { id: "gadgets", label: "Laptops & gadgets", emoji: "💻" },
  { id: "books", label: "Books", emoji: "📚" },
  { id: "school", label: "School materials", emoji: "✏️" },
  { id: "tools", label: "Tools", emoji: "🔧" },
  { id: "sports", label: "Sports & recreation", emoji: "⚽" },
  { id: "other", label: "Other", emoji: "📦" },
];

export function getCategoryMeta(categoryId) {
  return (
    ITEM_CATEGORIES.find((c) => c.id === categoryId) ??
    ITEM_CATEGORIES.find((c) => c.id === "other") ??
    ITEM_CATEGORIES[ITEM_CATEGORIES.length - 1]
  );
}
