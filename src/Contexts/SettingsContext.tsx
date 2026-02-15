import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// --- Types ---
export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
}

export interface BillingSettings {
    businessName: string;
    businessAdresss: string;
    gstNo: string;
    fssaiNo: string;
    logoUrl: string | null;
    taxType: "forward" | "inclusive"; // 'inclusive' reserved for future
    taxValueType: "percentage" | "fixed";
    taxValue: number;
    discountType: "percentage" | "fixed";
    discountValue: number;
}

export interface PrinterSettings {
    billPrinter: string;
    kotPrinter: string;
    paperSize: '58mm' | '80mm';
    showLogo: boolean;
    fontSize: 'small' | 'medium' | 'large';
}

interface SettingsContextType {
    profile: UserProfile;
    updateProfile: (data: UserProfile) => void;
    billing: BillingSettings;
    updateBilling: (data: BillingSettings) => void;
    printer: PrinterSettings;
    updatePrinter: (data: PrinterSettings) => void;
}

// --- Defaults ---
const defaultProfile: UserProfile = {
    firstName: "Admin",
    lastName: "User",
    email: "admin@arambh.com",
    mobile: "9876543210"
};

const defaultBilling: BillingSettings = {
    businessName: "Arambh POS",
    businessAdresss: "adf",
    gstNo: "",
    fssaiNo: "",
    logoUrl: null,
    taxType: "forward",
    taxValueType: "percentage",
    taxValue: 5, // 5% default
    discountType: "percentage",
    discountValue: 0,
};

const defaultPrinter: PrinterSettings = {
    billPrinter: 'System Default',
    kotPrinter: 'System Default',
    paperSize: '80mm',
    showLogo: true,
    fontSize: 'medium'
};

// --- Context ---
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    // Profile State
    const [profile, setProfile] = useState<UserProfile>(() => {
        const saved = localStorage.getItem("pos_profile");
        return saved ? JSON.parse(saved) : defaultProfile;
    });

    // Billing State
    const [billing, setBilling] = useState<BillingSettings>(() => {
        const saved = localStorage.getItem("pos_billing");
        return saved ? JSON.parse(saved) : defaultBilling;
    });

    // Printer State
    const [printer, setPrinter] = useState<PrinterSettings>(() => {
        const saved = localStorage.getItem("pos_printer_settings");
        return saved ? JSON.parse(saved) : defaultPrinter;
    });

    // Persistence
    useEffect(() => {
        localStorage.setItem("pos_profile", JSON.stringify(profile));
    }, [profile]);

    useEffect(() => {
        localStorage.setItem("pos_billing", JSON.stringify(billing));
    }, [billing]);

    useEffect(() => {
        localStorage.setItem("pos_printer_settings", JSON.stringify(printer));
    }, [printer]);

    // Actions
    const updateProfile = (data: UserProfile) => setProfile(data);
    const updateBilling = (data: BillingSettings) => setBilling(data);
    const updatePrinter = (data: PrinterSettings) => setPrinter(data);

    return (
        <SettingsContext.Provider value={{
            profile, updateProfile,
            billing, updateBilling,
            printer, updatePrinter
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error("useSettings must be used within SettingsProvider");
    return context;
};
