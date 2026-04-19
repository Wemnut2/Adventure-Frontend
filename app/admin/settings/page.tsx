// src/app/admin/settings/page.tsx
'use client';

import { useState } from 'react';
import { useToast } from '@/libs/src/contexts/ToastContext';
import { ADMIN_STYLES } from '../_style/adminPageStyles';
import { Globe, Shield, Save, RefreshCw, DollarSign } from 'lucide-react';

const EXTRA = `
  .as-section {
    background: #fff; border: 1px solid rgba(0,0,0,0.07);
    border-radius: 14px; padding: 20px 20px 22px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  }
  .as-section-header {
    display: flex; align-items: center; gap: 9px;
    padding-bottom: 14px; margin-bottom: 18px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
  }
  .as-section-icon {
    width: 28px; height: 28px; border-radius: 8px;
    background: #f5f5f5; color: #888;
    display: flex; align-items: center; justify-content: center;
  }
  .as-section-title { font-size: 13px; font-weight: 600; color: #1a1a1a; }

  .as-field-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
  }
  @media (max-width: 640px) { .as-field-grid { grid-template-columns: 1fr; } }
`;

type Settings = {
  siteName: string; siteEmail: string; currency: string;
  minWithdrawal: number; maxWithdrawal: number;
  referralBonus: number; subscriptionPrice: number;
  maintenanceMode: boolean;
};

const SECTIONS = [
  {
    title: 'General Settings', icon: Globe,
    fields: [
      { label: 'Site Name',   key: 'siteName',   type: 'text',   placeholder: 'Enter site name'    },
      { label: 'Site Email',  key: 'siteEmail',  type: 'email',  placeholder: 'admin@example.com'  },
      { label: 'Currency',    key: 'currency',   type: 'select', options: ['USD', 'EUR', 'GBP', 'NGN'] },
    ],
  },
  {
    title: 'Financial Settings', icon: DollarSign,
    fields: [
      { label: 'Min Withdrawal (USD)',  key: 'minWithdrawal',    type: 'number', placeholder: '0.00' },
      { label: 'Max Withdrawal (USD)',  key: 'maxWithdrawal',    type: 'number', placeholder: '0.00' },
      { label: 'Referral Bonus (%)',    key: 'referralBonus',    type: 'number', placeholder: '0'    },
      { label: 'Subscription Price',   key: 'subscriptionPrice', type: 'number', placeholder: '0.00' },
    ],
  },
  {
    title: 'Security Settings', icon: Shield,
    fields: [
      { label: 'Maintenance Mode', key: 'maintenanceMode', type: 'checkbox' },
    ],
  },
] as const;

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    siteName:          'AD Investment Platform',
    siteEmail:         'admin@adplatform.com',
    currency:          'USD',
    minWithdrawal:     10,
    maxWithdrawal:     10000,
    referralBonus:     5,
    subscriptionPrice: 99,
    maintenanceMode:   false,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(r => setTimeout(r, 900));
      showToast('Settings saved successfully', 'success');
    } catch { showToast('Failed to save settings', 'error'); }
    finally { setSaving(false); }
  };

  const set = (key: keyof Settings, val: string | boolean | number) =>
    setSettings(p => ({ ...p, [key]: val }));

  return (
    <div className="adm adm-root">
      <style>{ADMIN_STYLES + EXTRA}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 className="adm-title">System Settings</h1>
          <p className="adm-subtitle">Configure platform settings and preferences</p>
        </div>
        <button className="adm-btn-primary" disabled={saving} onClick={handleSave}
          style={{ display:'flex', alignItems:'center', gap:7 }}>
          {saving
            ? <><RefreshCw size={13} style={{ animation:'spin 0.7s linear infinite' }} /> Saving…</>
            : <><Save size={13} /> Save Changes</>}
        </button>
      </div>

      {/* Sections */}
      {SECTIONS.map(section => {
        const Icon = section.icon;
        return (
          <div key={section.title} className="as-section">
            <div className="as-section-header">
              <div className="as-section-icon"><Icon size={14} /></div>
              <p className="as-section-title">{section.title}</p>
            </div>

            <div className="as-field-grid">
              {section.fields.map(field => {
                const val = settings[field.key as keyof Settings];
                return (
                  <div key={field.key}
                    style={{ gridColumn: field.type === 'checkbox' ? '1/-1' : undefined }}>
                    <label className="adm-field-label">{field.label}</label>

                    {field.type === 'select' ? (
                      <select className="adm-field-select"
                        value={val as string}
                        onChange={e => set(field.key as keyof Settings, e.target.value)}>
                        {'options' in field && field.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>

                    ) : field.type === 'checkbox' ? (
                      <label className="adm-check-row">
                        <input type="checkbox"
                          checked={val as boolean}
                          onChange={e => set(field.key as keyof Settings, e.target.checked)} />
                        Enable maintenance mode — site will show a maintenance notice to all visitors
                      </label>

                    ) : (
                      <input className="adm-field-input"
                        type={field.type}
                        value={val as string | number}
                        placeholder={'placeholder' in field ? field.placeholder : ''}
                        onChange={e => set(field.key as keyof Settings,
                          field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
                        )} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Save footer */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:12, paddingTop:4 }}>
        <p style={{ fontSize:11.5, color:'#bbb' }}>Changes are applied immediately after saving</p>
        <button className="adm-btn-primary" disabled={saving} onClick={handleSave}
          style={{ display:'flex', alignItems:'center', gap:7 }}>
          {saving
            ? <><RefreshCw size={13} style={{ animation:'spin 0.7s linear infinite' }} /> Saving…</>
            : <><Save size={13} /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}