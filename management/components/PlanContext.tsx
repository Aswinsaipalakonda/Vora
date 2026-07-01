import React, { createContext, useContext, useState, useEffect } from 'react';

export type PlanType = 'FREE' | 'PROFESSIONAL' | 'BUSINESS' | 'ENTERPRISE';

interface PlanContextType {
    plan: PlanType;
    effectivePermissions: Record<string, boolean>;
    isLoading: boolean;
    refreshPlan: () => Promise<void>;
    isFeatureAllowed: (feature: string) => boolean;
    checkPermission: (feature: string) => boolean;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [plan, setPlan] = useState<PlanType>('FREE');
    // effectivePermissions is the server-authoritative map of feature → allowed
    const [effectivePermissions, setEffectivePermissions] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        const token = localStorage.getItem('vora_token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            // Single authoritative server-side call: gets plan + overrides + effective permissions
            const res = await fetch('http://127.0.0.1:8000/api/permissions/all/', {
                headers: { 'Authorization': `Token ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setPlan((data.tenant_plan || 'FREE') as PlanType);
                setEffectivePermissions(data.effective_permissions || {});
            }
        } catch (error) {
            console.error('Error fetching server-side permissions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const isFeatureAllowed = (feature: string): boolean => {
        // If the server hasn't told us yet, default to allow (so the UI doesn't flash locked state)
        if (Object.keys(effectivePermissions).length === 0) return true;
        // Features not gated by the server are always allowed
        if (!(feature in effectivePermissions)) return true;
        return effectivePermissions[feature];
    };

    const checkPermission = (feature: string): boolean => {
        if (!isFeatureAllowed(feature)) {
            window.dispatchEvent(new CustomEvent('show-upgrade-modal', { detail: { feature } }));
            return false;
        }
        return true;
    };

    return (
        <PlanContext.Provider value={{ plan, effectivePermissions, isLoading, refreshPlan: fetchData, isFeatureAllowed, checkPermission }}>
            {children}
        </PlanContext.Provider>
    );
};

export const usePlan = () => {
    const context = useContext(PlanContext);
    if (context === undefined) {
        throw new Error('usePlan must be used within a PlanProvider');
    }
    return context;
};
