// src/app/admin/settings/page.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/layout/components/Card';
import { Button } from '@/layout/components/Button';
import { Input } from '@/layout/components/Input';
import { useToast } from '@/libs/src/contexts/ToastContext';
import {
  Settings,
  Globe,
  Mail,
  Shield,
  Bell,
  Database,
  Save,
  RefreshCw,
  DollarSign,
  Users,
  Award
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    siteName: 'AD Investment Platform',
    siteEmail: 'admin@adplatform.com',
    currency: 'USD',
    minWithdrawal: 10,
    maxWithdrawal: 10000,
    referralBonus: 5,
    subscriptionPrice: 99,
    maintenanceMode: false
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save settings to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('Settings saved successfully', 'success');
    } catch (error) {
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const settingSections = [
    {
      title: 'General Settings',
      icon: Globe,
      fields: [
        { label: 'Site Name', key: 'siteName', type: 'text', placeholder: 'Enter site name' },
        { label: 'Site Email', key: 'siteEmail', type: 'email', placeholder: 'admin@example.com' },
        { label: 'Currency', key: 'currency', type: 'select', options: ['USD', 'EUR', 'GBP', 'NGN'] }
      ]
    },
    {
      title: 'Financial Settings',
      icon: DollarSign,
      fields: [
        { label: 'Minimum Withdrawal', key: 'minWithdrawal', type: 'number', placeholder: '0.00' },
        { label: 'Maximum Withdrawal', key: 'maxWithdrawal', type: 'number', placeholder: '0.00' },
        { label: 'Referral Bonus (%)', key: 'referralBonus', type: 'number', placeholder: '0' },
        { label: 'Subscription Price', key: 'subscriptionPrice', type: 'number', placeholder: '0.00' }
      ]
    },
    {
      title: 'Security Settings',
      icon: Shield,
      fields: [
        { label: 'Maintenance Mode', key: 'maintenanceMode', type: 'checkbox' }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">System Settings</h1>
          <p className="mt-1 text-gray-600">Configure platform settings and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2 bg-orange-500 hover:bg-orange-600">
          {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {settingSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="p-6">
              <div className="mb-4 flex items-center gap-2 border-b pb-3">
                <Icon className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-semibold">{section.title}</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {section.fields.map((field) => (
                  <div key={field.key}>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        value={settings[field.key as keyof typeof settings] as string}
                        onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                      >
                        {'options' in field && field.options?.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'checkbox' ? (
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={settings[field.key as keyof typeof settings] as boolean}
                          onChange={(e) => setSettings({ ...settings, [field.key]: e.target.checked })}
                          className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-600">Enable maintenance mode</span>
                      </label>
                    ) : (
                      <Input
                        type={field.type}
                        value={settings[field.key as keyof typeof settings] as string}
                        onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                        placeholder={'placeholder' in field ? field.placeholder : ''}
                      />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}