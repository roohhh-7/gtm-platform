'use client';

import { createContext, useContext, useState, HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type TabsContextType = {
  activeTab: string;
  setActiveTab: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, children, ...props }, ref) => {
    const [activeTab, setActiveTab] = useState(defaultValue);

    return (
      <TabsContext.Provider value={{ activeTab, setActiveTab }}>
        <div ref={ref} className={cn('w-full', className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = 'Tabs';

export const TabsList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex h-9 items-center justify-center rounded-lg bg-neutral-900/50 p-1 text-neutral-500',
        className
      )}
      {...props}
    />
  )
);
TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsTrigger must be used within Tabs');
    const { activeTab, setActiveTab } = context;
    const isActive = activeTab === value;

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setActiveTab(value)}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-700 disabled:pointer-events-none disabled:opacity-50',
          isActive
            ? 'bg-neutral-800 text-neutral-100 shadow'
            : 'hover:bg-neutral-800/50 hover:text-neutral-300',
          className
        )}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsContent must be used within Tabs');
    const { activeTab } = context;

    if (activeTab !== value) return null;

    return (
      <div
        ref={ref}
        className={cn('mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-700', className)}
        {...props}
      />
    );
  }
);
TabsContent.displayName = 'TabsContent';
