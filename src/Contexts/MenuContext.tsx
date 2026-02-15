import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// --- Types ---
export interface Category {
    id: string;
    name: string;
    isActive: boolean;
}

export interface MenuItem {
    id: string;
    name: string;
    price: number;
    categoryId: string;
    isActive: boolean;
    description?: string;
    isVeg?: boolean;

}

interface MenuContextType {
    categories: Category[];
    menuItems: MenuItem[];
    addCategory: (name: string) => void;
    updateCategory: (id: string, name: string) => void;
    toggleCategoryStatus: (id: string) => void;
    deleteCategory: (id: string) => Promise<boolean>; // Returns true if deleted, false if blocked
    addMenuItem: (item: Omit<MenuItem, 'id' | 'isActive'>) => void;
    updateMenuItem: (id: string, item: Partial<Omit<MenuItem, 'id' | 'isActive'>>) => void;
    deleteMenuItem: (id: string) => void;
    toggleMenuItemStatus: (id: string) => void;
}

// --- Context ---
const MenuContext = createContext<MenuContextType | undefined>(undefined);

// --- Provider ---
export const MenuProvider = ({ children }: { children: ReactNode }) => {
    // Initialize state from localStorage or defaults
    const [categories, setCategories] = useState<Category[]>(() => {
        const saved = localStorage.getItem('menu_categories');
        return saved ? JSON.parse(saved) : [];
    });

    const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
        const saved = localStorage.getItem('menu_items');
        if (saved) return JSON.parse(saved);

        // Initialize with Mock Data if empty
        const mockCategoriesExists = localStorage.getItem('menu_categories');
        if (mockCategoriesExists) return []; // Don't add items if categories exist but items don't (user might have deleted all)

        // Return empty initially, will populate in useEffect if categories are also empty (handled below) or we can just load defaults.
        return [];
    });

    // Initialize Defaults if completely empty
    useEffect(() => {
        const savedCats = localStorage.getItem('menu_categories');
        const savedItems = localStorage.getItem('menu_items');

        if (!savedCats && !savedItems) {
            // Seed Data
            const MOCK_CATEGORIES: Category[] = [
                { id: "cat-1", name: "Rice", isActive: true },
                { id: "cat-2", name: "Beverages", isActive: true },
                { id: "cat-3", name: "Salads", isActive: true },
                { id: "cat-4", name: "Soup", isActive: true },
                { id: "cat-5", name: "Pizza", isActive: true },
                { id: "cat-6", name: "Burger", isActive: true },
                { id: "cat-7", name: "Snacks", isActive: true },
            ];

            const MOCK_ITEMS: MenuItem[] = [
                { id: "item-1", name: "Shrimp Basil Salad", price: 10.00, categoryId: "cat-3", isActive: true, isVeg: false },
                { id: "item-2", name: "Onion Rings", price: 5.00, categoryId: "cat-7", isActive: true, isVeg: true },
                { id: "item-3", name: "Smoked Bacon", price: 12.00, categoryId: "cat-7", isActive: true, isVeg: false },
                { id: "item-4", name: "Fresh Tomatoes", price: 4.00, categoryId: "cat-3", isActive: true, isVeg: true },
                { id: "item-5", name: "Chicken Burger", price: 10.00, categoryId: "cat-6", isActive: true, isVeg: false },
                { id: "item-6", name: "Red Onion Rings", price: 4.50, categoryId: "cat-7", isActive: true, isVeg: true },
                { id: "item-7", name: "Beef Burger", price: 11.00, categoryId: "cat-6", isActive: true, isVeg: false },
                { id: "item-8", name: "Grilled Burger", price: 10.50, categoryId: "cat-6", isActive: true, isVeg: false },
                { id: "item-9", name: "Chicken Pizza", price: 14.00, categoryId: "cat-5", isActive: true, isVeg: false },
                { id: "item-10", name: "Veggie Pizza", price: 12.00, categoryId: "cat-5", isActive: true, isVeg: true },
                { id: "item-11", name: "Fried Rice", price: 9.00, categoryId: "cat-1", isActive: true, isVeg: true },
                { id: "item-12", name: "Lemonade", price: 3.00, categoryId: "cat-2", isActive: true, isVeg: true },
            ];

            setCategories(MOCK_CATEGORIES);
            setMenuItems(MOCK_ITEMS);
        }
    }, []);

    // Persistence Effects
    useEffect(() => {
        localStorage.setItem('menu_categories', JSON.stringify(categories));
    }, [categories]);

    useEffect(() => {
        localStorage.setItem('menu_items', JSON.stringify(menuItems));
    }, [menuItems]);

    // --- Actions ---

    // Categories
    const addCategory = (name: string) => {
        const newCategory: Category = {
            id: crypto.randomUUID(),
            name,
            isActive: true,
        };
        setCategories(prev => [...prev, newCategory]);
    };

    const updateCategory = (id: string, name: string) => {
        setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, name } : cat));
    };

    const toggleCategoryStatus = (id: string) => {
        setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, isActive: !cat.isActive } : cat));
    };

    const deleteCategory = async (id: string): Promise<boolean> => {
        const hasItems = menuItems.some(item => item.categoryId === id);
        if (hasItems) {
            return false; // Block deletion
        }
        setCategories(prev => prev.filter(cat => cat.id !== id));
        return true;
    };

    // Menu Items
    const addMenuItem = (item: Omit<MenuItem, 'id' | 'isActive'>) => {
        const newItem: MenuItem = {
            ...item,
            id: crypto.randomUUID(),
            isActive: true,
        };
        setMenuItems(prev => [...prev, newItem]);
    };

    const updateMenuItem = (id: string, updates: Partial<Omit<MenuItem, 'id' | 'isActive'>>) => {
        setMenuItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    };

    const deleteMenuItem = (id: string) => {
        setMenuItems(prev => prev.filter(item => item.id !== id));
    };

    const toggleMenuItemStatus = (id: string) => {
        setMenuItems(prev => prev.map(item => item.id === id ? { ...item, isActive: !item.isActive } : item));
    };

    const value = {
        categories,
        menuItems,
        addCategory,
        updateCategory,
        toggleCategoryStatus,
        deleteCategory,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleMenuItemStatus,
    };

    return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

// --- Hook ---
export const useMenu = () => {
    const context = useContext(MenuContext);
    if (context === undefined) {
        throw new Error('useMenu must be used within a MenuProvider');
    }
    return context;
};
