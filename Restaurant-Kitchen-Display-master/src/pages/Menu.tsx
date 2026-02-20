import { useState } from "react";
import { Search, Flame, Coffee, IceCream, Salad, LayoutGrid, Clock, DollarSign, ArrowLeft, Plus, Pencil, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { menuItems as initialMenuItems, type MenuItem } from "@/data/menuData";

type CategoryKey = "all" | "grill" | "drinks" | "desserts" | "salads";

const cats: { key: CategoryKey; label: string; icon: any }[] = [
  { key: "all", label: "All", icon: LayoutGrid },
  { key: "grill", label: "Grill", icon: Flame },
  { key: "drinks", label: "Drinks", icon: Coffee },
  { key: "desserts", label: "Desserts", icon: IceCream },
  { key: "salads", label: "Salads", icon: Salad },
];

const emptyItem: Omit<MenuItem, "image"> & { image: string } = {
  name: "", price: 0, category: "grill", image: "", description: "", prepTime: 5, available: true,
};

function MenuItemCard({ item, onEdit, onDelete }: { item: MenuItem; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="group rounded-lg border border-border bg-card overflow-hidden hover:border-primary/40 transition-colors relative">
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button onClick={onEdit} className="rounded-full bg-card/80 p-1.5 text-muted-foreground hover:text-primary transition-colors">
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button onClick={onDelete} className="rounded-full bg-card/80 p-1.5 text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="aspect-square overflow-hidden">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
      </div>
      <div className="p-3 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
          {!item.available && <span className="text-xs text-kds-delayed font-medium">Unavailable</span>}
        </div>
        <p className="text-xs text-muted-foreground">{item.description}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="flex items-center gap-1 text-sm font-bold text-kds-income">
            <DollarSign className="h-3.5 w-3.5" />{item.price.toFixed(2)}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />{item.prepTime}m
          </span>
        </div>
      </div>
    </div>
  );
}

function MenuDialog({ item, onSave, onClose, title }: { item: Omit<MenuItem, "image"> & { image: string }; onSave: (item: MenuItem) => void; onClose: () => void; title: string }) {
  const [form, setForm] = useState(item);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form as MenuItem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" required />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Description</label>
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Price ($)</label>
              <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Prep Time (min)</label>
              <input type="number" min="1" value={form.prepTime} onChange={e => setForm({ ...form, prepTime: parseInt(e.target.value) || 1 })} className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as MenuItem["category"] })} className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="grill">Grill</option>
                <option value="drinks">Drinks</option>
                <option value="desserts">Desserts</option>
                <option value="salads">Salads</option>
              </select>
            </div>
            <div className="flex items-end gap-2 pb-1">
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" checked={form.available} onChange={e => setForm({ ...form, available: e.target.checked })} className="rounded border-border" />
                Available
              </label>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Image URL</label>
            <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <button type="submit" className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<MenuItem[]>(initialMenuItems);
  const [category, setCategory] = useState<CategoryKey>("all");
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<{ mode: "add" | "edit"; item: MenuItem; index: number } | null>(null);

  const filtered = items.filter(item => {
    if (category !== "all" && item.category !== category) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSave = (saved: MenuItem) => {
    if (dialog?.mode === "edit") {
      setItems(prev => prev.map((it, i) => i === dialog.index ? saved : it));
    } else {
      setItems(prev => [...prev, saved]);
    }
    setDialog(null);
  };

  const handleDelete = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 px-6 py-4">
        <button onClick={() => navigate("/")} className="rounded-full bg-secondary p-2 text-secondary-foreground hover:bg-accent transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground">Menu</h1>
          <p className="text-xs text-muted-foreground">{items.length} items</p>
        </div>
        <button onClick={() => setDialog({ mode: "add", item: emptyItem as MenuItem, index: -1 })} className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors">
          <Plus className="h-4 w-4" /> Add Item
        </button>
      </header>

      <div className="space-y-4 px-6 pb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            {cats.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  category === key ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                <Icon className="h-4 w-4" />{label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search menu..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="rounded-lg border border-border bg-secondary pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring w-[200px]"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filtered.map((item, idx) => {
            const realIndex = items.indexOf(item);
            return (
              <MenuItemCard
                key={item.name + realIndex}
                item={item}
                onEdit={() => setDialog({ mode: "edit", item, index: realIndex })}
                onDelete={() => handleDelete(realIndex)}
              />
            );
          })}
        </div>
      </div>

      {dialog && (
        <MenuDialog
          title={dialog.mode === "add" ? "Add Menu Item" : "Edit Menu Item"}
          item={dialog.item}
          onSave={handleSave}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  );
}
