import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Package, ListOrdered, Wallet, Users, Settings } from 'lucide-react';
import AdminOrders from './Admin/Orders';
import AdminServices from './Admin/Services';
import AdminFunds from './Admin/Funds';
import AdminUsers from './Admin/Users';
import AdminSettings from './Admin/Settings';

const tabs = [
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'services', label: 'Services', icon: ListOrdered },
  { id: 'funds', label: 'Add Funds', icon: Wallet },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  const hasLocalAdminSession = (() => {
    try {
      return localStorage.getItem('admin_session') === 'true';
    } catch {
      return false;
    }
  })();

  const isAllowed = user?.role === 'admin' || hasLocalAdminSession;

  if (!isAllowed) {
    navigate('/admin-login');
    return null;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'orders': return <AdminOrders />;
      case 'services': return <AdminServices />;
      case 'funds': return <AdminFunds />;
      case 'users': return <AdminUsers />;
      case 'settings': return <AdminSettings />;
      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="font-heading text-2xl sm:text-3xl font-bold">Admin Control Panel</h1>
        </div>
        <p className="text-muted-foreground text-sm">Full access to manage orders, services, funds, users and settings.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-6 bg-muted/50 p-1.5 rounded-2xl border border-border/50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTab()}
    </div>
  );
}