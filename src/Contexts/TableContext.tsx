import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// --- Types ---
export interface Table {
    id: string;
    tableNo: string;
    status: 'active' | 'inactive';
}

interface TableContextType {
    tables: Table[];
    addTable: (tableNo: string, status: 'active' | 'inactive') => void;
    updateTable: (id: string, updates: Partial<Table>) => void;
    deleteTable: (id: string) => void;
}

// --- Context ---
const TableContext = createContext<TableContextType | undefined>(undefined);

// --- Provider ---
export const TableProvider = ({ children }: { children: ReactNode }) => {
    const [tables, setTables] = useState<Table[]>(() => {
        const saved = localStorage.getItem('pos_tables');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('pos_tables', JSON.stringify(tables));
    }, [tables]);

    const addTable = (tableNo: string, status: 'active' | 'inactive') => {
        if (tables.some(t => t.tableNo === tableNo)) {
            alert(`Table ${tableNo} already exists!`);
            return;
        }
        const newTable: Table = {
            id: crypto.randomUUID(),
            tableNo,
            status,
        };
        setTables(prev => [...prev, newTable]);
    };

    const updateTable = (id: string, updates: Partial<Table>) => {
        setTables(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    };

    const deleteTable = (id: string) => {
        if (window.confirm("Are you sure you want to delete this table?")) {
            setTables(prev => prev.filter(t => t.id !== id));
        }
    };

    const value = {
        tables,
        addTable,
        updateTable,
        deleteTable,
    };

    return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
};

// --- Hook ---
export const useTables = () => {
    const context = useContext(TableContext);
    if (context === undefined) {
        throw new Error('useTables must be used within a TableProvider');
    }
    return context;
};
