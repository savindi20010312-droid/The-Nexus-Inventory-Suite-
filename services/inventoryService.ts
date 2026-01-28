
import { Product, Category, ProductStatus, PriorityLevel, DashboardStats, SystemConfig } from '../types';

const DEFAULT_CONFIG: SystemConfig = {
  lowStockThreshold: 10,
  criticalStockThreshold: 5,
  warehouseLocation: 'Nexus Prime - Sector 7',
  adminName: 'Lead Engineer',
  currency: 'USD'
};

const INITIAL_PRODUCTS: Product[] = [
  { id: 'NX-1001', name: 'MacBook Pro 16" M3 Max', category: Category.COMPUTING, price: 3499, quantity: 4, status: ProductStatus.LOW_STOCK, priority: PriorityLevel.HIGH, lastUpdated: new Date().toISOString() },
  { id: 'NX-1002', name: 'Sony WH-1000XM5', category: Category.AUDIO, price: 399, quantity: 45, status: ProductStatus.IN_STOCK, priority: PriorityLevel.LOW, lastUpdated: new Date().toISOString() },
  { id: 'NX-1003', name: 'iPhone 15 Pro', category: Category.ELECTRONICS, price: 999, quantity: 0, status: ProductStatus.OUT_OF_STOCK, priority: PriorityLevel.CRITICAL, lastUpdated: new Date().toISOString() },
  { id: 'NX-1004', name: 'Logitech MX Master 3S', category: Category.ACCESSORIES, price: 99, quantity: 12, status: ProductStatus.IN_STOCK, priority: PriorityLevel.MEDIUM, lastUpdated: new Date().toISOString() },
  { id: 'NX-1005', name: 'Nexus Smart Fridge', category: Category.APPLIANCES, price: 2199, quantity: 2, status: ProductStatus.LOW_STOCK, priority: PriorityLevel.HIGH, lastUpdated: new Date().toISOString() },
  { id: 'NX-1006', name: 'iPad Pro 12.9"', category: Category.ELECTRONICS, price: 1099, quantity: 18, status: ProductStatus.IN_STOCK, priority: PriorityLevel.LOW, lastUpdated: new Date().toISOString() },
];

export class InventoryService {
  private products: Product[];
  private config: SystemConfig;

  constructor() {
    const savedDb = localStorage.getItem('nexus_tech_db');
    const savedConfig = localStorage.getItem('nexus_tech_config');
    
    this.products = savedDb ? JSON.parse(savedDb) : INITIAL_PRODUCTS;
    this.config = savedConfig ? JSON.parse(savedConfig) : DEFAULT_CONFIG;
  }

  private persist() {
    localStorage.setItem('nexus_tech_db', JSON.stringify(this.products));
    localStorage.setItem('nexus_tech_config', JSON.stringify(this.config));
  }

  public getConfig(): SystemConfig {
    return this.config;
  }

  public updateConfig(newConfig: Partial<SystemConfig>) {
    this.config = { ...this.config, ...newConfig };
    // Trigger recalculation of all products with new thresholds
    this.products = this.products.map(p => ({
      ...p,
      priority: this.calculatePriority(p.quantity),
      status: this.determineStatus(p.quantity)
    }));
    this.persist();
  }

  public calculatePriority(quantity: number): PriorityLevel {
    if (quantity === 0) return PriorityLevel.CRITICAL;
    if (quantity <= this.config.criticalStockThreshold) return PriorityLevel.HIGH;
    if (quantity <= this.config.lowStockThreshold) return PriorityLevel.MEDIUM;
    return PriorityLevel.LOW;
  }

  public determineStatus(quantity: number): ProductStatus {
    if (quantity === 0) return ProductStatus.OUT_OF_STOCK;
    if (quantity <= this.config.lowStockThreshold) return ProductStatus.LOW_STOCK;
    return ProductStatus.IN_STOCK;
  }

  public getProducts(): Product[] {
    return [...this.products].sort((a, b) => {
      const priorityOrder = { [PriorityLevel.CRITICAL]: 0, [PriorityLevel.HIGH]: 1, [PriorityLevel.MEDIUM]: 2, [PriorityLevel.LOW]: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  public addProduct(data: Omit<Product, 'id' | 'priority' | 'status' | 'lastUpdated'>): Product {
    const newProduct: Product = {
      ...data,
      id: `NX-${Math.floor(1000 + Math.random() * 9000)}`,
      priority: this.calculatePriority(data.quantity),
      status: this.determineStatus(data.quantity),
      lastUpdated: new Date().toISOString(),
    };
    this.products.push(newProduct);
    this.persist();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found.');
    
    const updated = { 
      ...this.products[index], 
      ...updates, 
      lastUpdated: new Date().toISOString() 
    };

    if (updates.quantity !== undefined) {
      updated.priority = this.calculatePriority(updates.quantity);
      updated.status = this.determineStatus(updates.quantity);
    }

    this.products[index] = updated;
    this.persist();
    return updated;
  }

  public deleteProduct(id: string): void {
    this.products = this.products.filter(p => p.id !== id);
    this.persist();
  }

  public getDashboardStats(): DashboardStats {
    const totalItems = this.products.reduce((acc, p) => acc + p.quantity, 0);
    const totalValue = this.products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
    const lowStockCount = this.products.filter(p => p.status === ProductStatus.LOW_STOCK).length;
    const outOfStockCount = this.products.filter(p => p.status === ProductStatus.OUT_OF_STOCK).length;

    const categoryMap: Record<string, number> = {};
    const statusMap: Record<string, number> = {
      [ProductStatus.IN_STOCK]: 0,
      [ProductStatus.LOW_STOCK]: 0,
      [ProductStatus.OUT_OF_STOCK]: 0,
      [ProductStatus.DISCONTINUED]: 0,
    };

    this.products.forEach(p => {
      categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
      statusMap[p.status]++;
    });

    return {
      totalItems,
      totalValue,
      lowStockCount,
      outOfStockCount,
      categoryDistribution: Object.entries(categoryMap).map(([name, value]) => ({ name, value })),
      statusDistribution: Object.entries(statusMap).map(([name, value]) => ({ name, value }))
    };
  }

  public exportDatabase(): string {
    return JSON.stringify({ products: this.products, config: this.config }, null, 2);
  }

  public importDatabase(json: string): boolean {
    try {
      const data = JSON.parse(json);
      if (Array.isArray(data.products)) {
        this.products = data.products;
        if (data.config) this.config = data.config;
        this.persist();
        window.location.reload();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  public resetDatabase() {
    this.products = INITIAL_PRODUCTS;
    this.config = DEFAULT_CONFIG;
    this.persist();
    window.location.reload();
  }
}

export const inventoryService = new InventoryService();
