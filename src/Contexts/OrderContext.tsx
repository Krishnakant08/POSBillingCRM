import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { subDays, startOfDay, addHours, parseISO } from 'date-fns';

// --- Types ---
export interface OrderItem {
    id: string;
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    date: string; // ISO String
    items: OrderItem[];
    total: number;
    status: 'completed' | 'cancelled';
    tableNo?: string;
    paymentMethod: 'Cash' | 'Online';
}

export interface Draft {
    id: string;
    createdAt: string;
    items: any[]; // Using any[] to allow flexible cart structures (like CartItem from Dashboard)
    total: number;
    tableNo?: string;
    // We can store other metadata if needed, like customer info
}

interface OrderContextType {
    orders: Order[];
    addOrder: (order: Omit<Order, 'id' | 'date'>) => void;
    getOrdersByDateRange: (startDate: Date, endDate: Date) => Order[];
    // Drafts
    drafts: Draft[];
    saveDraft: (items: any[], total: number, tableNo?: string) => void;
    deleteDraft: (id: string) => void;
}

// --- Context ---
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// --- Mock Data Generator ---
const generateMockOrders = (): Order[] => {
    const orders: Order[] = [];
    const today = new Date();

    // Generate orders for the last 365 days
    for (let i = 0; i < 365; i++) {
        const date = subDays(today, i);
        // Random number of orders per day (0-15)
        const dailyOrderCount = Math.floor(Math.random() * 15);

        for (let j = 0; j < dailyOrderCount; j++) {
            // Random time during the day (10 AM to 10 PM)
            const hour = 10 + Math.floor(Math.random() * 12);
            const orderDate = addHours(startOfDay(date), hour);

            // Random items (Mocking item names since we might not have access to MenuContext here easily without circular dep, 
            // but for reports we just need names and prices)
            const mockItems = [
                { name: 'Butter Chicken', price: 350 },
                { name: 'Paneer Tikka', price: 280 },
                { name: 'Garlic Naan', price: 60 },
                { name: 'Dal Makhani', price: 220 },
                { name: 'Jeera Rice', price: 150 },
                { name: 'Gulab Jamun', price: 100 },
                { name: 'Masala Dosa', price: 180 },
                { name: 'Veg Hakka Noodles', price: 200 }
            ];

            const items: OrderItem[] = [];
            const itemCount = 1 + Math.floor(Math.random() * 4); // 1-4 items per order
            let orderTotal = 0;

            for (let k = 0; k < itemCount; k++) {
                const randomItem = mockItems[Math.floor(Math.random() * mockItems.length)];
                const quantity = 1 + Math.floor(Math.random() * 2);
                const itemTotal = randomItem.price * quantity;
                orderTotal += itemTotal;

                items.push({
                    id: crypto.randomUUID(),
                    menuItemId: `mock-item-${k}`,
                    name: randomItem.name,
                    price: randomItem.price,
                    quantity: quantity
                });
            }

            orders.push({
                id: crypto.randomUUID(),
                date: orderDate.toISOString(),
                items,
                total: orderTotal,

                status: 'completed',
                paymentMethod: Math.random() > 0.5 ? 'Cash' : 'Online'
            });
        }
    }
    return orders;
};

// --- Provider ---
export const OrderProvider = ({ children }: { children: ReactNode }) => {
    const [orders, setOrders] = useState<Order[]>(() => {
        const saved = localStorage.getItem('pos_orders');
        if (saved) {
            return JSON.parse(saved);
        }
        // Initialize with mock data if empty
        const mockData = generateMockOrders();
        return mockData;
    });

    const [drafts, setDrafts] = useState<Draft[]>(() => {
        const saved = localStorage.getItem('pos_drafts');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('pos_orders', JSON.stringify(orders));
    }, [orders]);

    useEffect(() => {
        localStorage.setItem('pos_drafts', JSON.stringify(drafts));
    }, [drafts]);

    const addOrder = (orderData: Omit<Order, 'id' | 'date'>) => {
        const newOrder: Order = {
            ...orderData,
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
        };
        setOrders(prev => [...prev, newOrder]);
    };

    const getOrdersByDateRange = (startDate: Date, endDate: Date) => {
        return orders.filter(order => {
            const orderDate = parseISO(order.date);
            return orderDate >= startDate && orderDate <= endDate;
        });
    };

    // Draft Actions
    const saveDraft = (items: any[], total: number, tableNo?: string) => {
        const newDraft: Draft = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            items,
            total,
            tableNo
        };
        setDrafts(prev => [newDraft, ...prev]);
    };

    const deleteDraft = (id: string) => {
        setDrafts(prev => prev.filter(d => d.id !== id));
    };

    const value = {
        orders,
        addOrder,
        getOrdersByDateRange,
        drafts,
        saveDraft,
        deleteDraft
    };

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

// --- Hook ---
export const useOrders = () => {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrders must be used within a OrderProvider');
    }
    return context;
};
