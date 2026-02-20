import ribeyeSteak from "@/assets/food/ribeye-steak.jpg";
import caesarSalad from "@/assets/food/caesar-salad.jpg";
import garlicBread from "@/assets/food/garlic-bread.jpg";
import grilledSalmon from "@/assets/food/grilled-salmon.jpg";
import mangoSmoothie from "@/assets/food/mango-smoothie.jpg";
import espressoMartini from "@/assets/food/espresso-martini.jpg";
import chocolateLavaCake from "@/assets/food/chocolate-lava-cake.jpg";
import cremeBrulee from "@/assets/food/creme-brulee.jpg";
import tiramisu from "@/assets/food/tiramisu.jpg";
import cappuccino from "@/assets/food/cappuccino.jpg";
import bbqChickenWings from "@/assets/food/bbq-chicken-wings.jpg";
import coleslaw from "@/assets/food/coleslaw.jpg";
import wagyuBurger from "@/assets/food/wagyu-burger.jpg";
import truffleFries from "@/assets/food/truffle-fries.jpg";
import icedLatte from "@/assets/food/iced-latte.jpg";

export const foodImages: Record<string, string> = {
  "Ribeye Steak": ribeyeSteak,
  "Caesar Salad": caesarSalad,
  "Garlic Bread": garlicBread,
  "Grilled Salmon": grilledSalmon,
  "Mango Smoothie": mangoSmoothie,
  "Espresso Martini": espressoMartini,
  "Chocolate Lava Cake": chocolateLavaCake,
  "Crème Brûlée": cremeBrulee,
  "Tiramisu": tiramisu,
  "Cappuccino": cappuccino,
  "BBQ Chicken Wings": bbqChickenWings,
  "Coleslaw": coleslaw,
  "Wagyu Burger": wagyuBurger,
  "Truffle Fries": truffleFries,
  "Iced Latte": icedLatte,
};

export interface MenuItem {
  name: string;
  price: number;
  category: "grill" | "drinks" | "desserts" | "salads";
  image: string;
  description: string;
  prepTime: number;
  available: boolean;
}

export const menuItems: MenuItem[] = [
  { name: "Ribeye Steak", price: 38.00, category: "grill", image: ribeyeSteak, description: "Premium cut, 12oz", prepTime: 18, available: true },
  { name: "Grilled Salmon", price: 34.00, category: "grill", image: grilledSalmon, description: "Atlantic salmon fillet", prepTime: 15, available: true },
  { name: "BBQ Chicken Wings", price: 16.00, category: "grill", image: bbqChickenWings, description: "House BBQ sauce, 8pc", prepTime: 14, available: true },
  { name: "Wagyu Burger", price: 32.00, category: "grill", image: wagyuBurger, description: "A5 Wagyu patty, brioche bun", prepTime: 12, available: true },
  { name: "Caesar Salad", price: 14.00, category: "salads", image: caesarSalad, description: "Romaine, parmesan, croutons", prepTime: 5, available: true },
  { name: "Garlic Bread", price: 8.00, category: "grill", image: garlicBread, description: "Toasted with herb butter", prepTime: 4, available: true },
  { name: "Truffle Fries", price: 14.00, category: "grill", image: truffleFries, description: "Truffle oil, parmesan", prepTime: 6, available: true },
  { name: "Coleslaw", price: 6.00, category: "salads", image: coleslaw, description: "Classic creamy coleslaw", prepTime: 3, available: true },
  { name: "Mango Smoothie", price: 9.00, category: "drinks", image: mangoSmoothie, description: "Fresh mango, yogurt", prepTime: 4, available: true },
  { name: "Espresso Martini", price: 15.00, category: "drinks", image: espressoMartini, description: "Vodka, espresso, Kahlúa", prepTime: 3, available: true },
  { name: "Cappuccino", price: 6.00, category: "drinks", image: cappuccino, description: "Double shot espresso", prepTime: 3, available: true },
  { name: "Iced Latte", price: 7.00, category: "drinks", image: icedLatte, description: "Cold brew, oat milk", prepTime: 3, available: true },
  { name: "Chocolate Lava Cake", price: 16.00, category: "desserts", image: chocolateLavaCake, description: "Molten center, vanilla ice cream", prepTime: 10, available: true },
  { name: "Crème Brûlée", price: 13.00, category: "desserts", image: cremeBrulee, description: "Classic French custard", prepTime: 8, available: true },
  { name: "Tiramisu", price: 14.00, category: "desserts", image: tiramisu, description: "Mascarpone, espresso, cocoa", prepTime: 5, available: true },
];

export const itemPrices: Record<string, number> = {};
