export type SpoilageRisk = 'High' | 'Medium' | 'Low';

export type FoodCategory =
  | 'Produce'
  | 'Dairy'
  | 'Protein'
  | 'Pantry'
  | 'Bakery'
  | 'Other';

export interface InventoryItem {
  item_name: string;
  category: FoodCategory | string;
  estimated_shelf_life_days: number;
  spoilage_risk: SpoilageRisk;
}

export interface Recipe {
  recipe_name: string;
  prep_time_minutes: number;
  cook_time_minutes: number;
  expiring_ingredients_used: string[];
  additional_staples_needed: string[];
  instructions: string[];
}

export interface ChefSaveResponse {
  detected_inventory: InventoryItem[];
  recipes: Recipe[];
  safety_warnings: string[];
}

export interface UserConstraints {
  dietary: string;
  maxCookingTime: number;
  recipeCount: number;
  notes?: string;
}
