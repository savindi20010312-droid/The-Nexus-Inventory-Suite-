
export enum Category {
  ELECTRONICS = 'Electronics',
  ACCESSORIES = 'Accessories',
  APPLIANCES = 'Appliances',
  COMPUTING = 'Computing',
  AUDIO = 'Audio'
}

export enum ProductStatus {
  IN_STOCK = 'In Stock',
  LOW_STOCK = 'Low Stock',
  OUT_OF_STOCK = 'Out of Stock',
  DISCONTINUED = 'Discontinued'
}

export enum PriorityLevel {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export interface SystemConfig {
  lowStockThreshold: number;
  criticalStockThreshold: number;
  warehouseLocation: string;
  adminName: string;
  currency: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  quantity: number;
  status: ProductStatus;
  priority: PriorityLevel;
  lastUpdated: string;
}

export interface DashboardStats {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  categoryDistribution: { name: string; value: number }[];
  statusDistribution: { name: string; value: number }[];
}
