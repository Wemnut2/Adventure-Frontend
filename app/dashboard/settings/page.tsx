// src/app/(dashboard)/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/libs/stores/auth.store';
import { useSubscriptionStatus, useChangePassword } from '@/libs/hooks/useAuth';
import {
  User, Shield, LayoutGrid, Activity, Save, Pencil, X,
  Eye, EyeOff, RefreshCw, CheckCircle2, AlertCircle,
  ChevronRight, Wallet, Building2, Lock, Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '@/libs/utils/format';
import { ActivityLog } from '@/libs/types';
import { DASH_STYLES } from '@/app/styles/dashboardStyles';

/* ─── Extra styles ── */
const SETTINGS_STYLES = `
  ${DASH_STYLES}

  .st-card {
    background: #fff; border: 1px solid rgba(0,0,0,0.07);
    border-radius: 14px; padding: 22px 22px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  }

  .st-section-title { font-size: 13px; font-weight: 600; color: #1a1a1a; margin-bottom: 3px; }
  .st-section-sub   { font-size: 11.5px; color: #bbb; }

  .st-avatar {
    width: 42px; height: 42px; border-radius: 11px; flex-shrink:0;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: #fff; letter-spacing: 0.02em;
  }

  .st-field-label {
    font-size: 10.5px; font-weight: 600; letter-spacing: 0.06em;
    text-transform: uppercase; color: #bbb; margin-bottom: 5px; display: block;
  }
  .st-input {
    width: 100%; padding: 9px 12px; font-size: 12.5px; color: #1a1a1a;
    background: #fafafa; border: 1px solid rgba(0,0,0,0.1); border-radius: 9px;
    font-family: 'DM Sans', sans-serif; outline: none;
    transition: border-color .15s, box-shadow .15s;
  }
  .st-input:focus {
    border-color: rgba(0,0,0,0.25); box-shadow: 0 0 0 3px rgba(0,0,0,0.04); background: #fff;
  }
  .st-input:disabled { background: #f5f5f5; color: #bbb; cursor: not-allowed; }
  .st-input::placeholder { color: #ccc; }
  .st-textarea {
    width: 100%; padding: 9px 12px; font-size: 12.5px; color: #1a1a1a;
    background: #fafafa; border: 1px solid rgba(0,0,0,0.1); border-radius: 9px;
    font-family: 'DM Sans', sans-serif; outline: none; resize: vertical; min-height: 72px;
    transition: border-color .15s, box-shadow .15s;
  }
  .st-textarea:focus { border-color: rgba(0,0,0,0.25); box-shadow: 0 0 0 3px rgba(0,0,0,0.04); background: #fff; }
  .st-textarea:disabled { background: #f5f5f5; color: #bbb; cursor: not-allowed; }
  .st-textarea::placeholder { color: #ccc; }

  .st-divider { height: 1px; background: rgba(0,0,0,0.06); margin: 6px 0; }

  .st-pw-check { display: flex; align-items: center; gap: 7px; font-size: 12px; }
  .st-pw-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

  .st-sub-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 500;
  }
  .st-sub-active   { background: #f0fdf4; color: #15803d; border: 1px solid rgba(22,163,74,0.15); }
  .st-sub-inactive { background: #fafafa; color: #aaa; border: 1px solid rgba(0,0,0,0.09); }
`;

/* ─── Helpers ── */
type Tab = 'profile' | 'payment' | 'security' | 'subscription' | 'activity';

const TABS: { id: Tab; label: string; short: string; icon: React.ElementType }[] = [
  { id: 'profile',      label: 'Profile',       short: 'Profile',  icon: User       },
  { id: 'payment',      label: 'Bank & Crypto',  short: 'Payment',  icon: Wallet     },
  { id: 'security',     label: 'Security',       short: 'Security', icon: Shield     },
  { id: 'subscription', label: 'Subscription',   short: 'Plan',     icon: LayoutGrid },
  { id: 'activity',     label: 'Activity',       short: 'Activity', icon: Activity   },
];

const getChecks = (pw: string, confirm: string) => ({
  length:  pw.length >= 8,
  upper:   /[A-Z]/.test(pw),
  lower:   /[a-z]/.test(pw),
  number:  /[0-9]/.test(pw),
  special: /[^A-Za-z0-9]/.test(pw),
  match:   !!(pw && confirm && pw === confirm),
});

const isValid = (c: ReturnType<typeof getChecks>) =>
  c.length && c.upper && c.lower && c.number && c.special && c.match;

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
      <label className="st-field-label">{label}</label>
      {children}
      {hint && <p style={{ fontSize:11, color:'#ccc', marginTop:2 }}>{hint}</p>}
    </div>
  );
}

export default function SettingsPage() {
  const { user, updateUser, updateAccountInfo, activities, fetchActivities, isLoading: storeLoading } = useAuthStore();
  const { data: subscription, refetch: refetchSub } = useSubscriptionStatus();
  const changePwMutation = useChangePassword();

  const [activeTab, setActiveTab]     = useState<Tab>('profile');
  const [editingProfile, setEditing]  = useState(false);
  const [saving, setSaving]           = useState(false);
  const [pwSuccess, setPwSuccess]     = useState(false);

  const [profileForm, setProfileForm] = useState({ username:'', phone_number:'', address:'' });
  const [paymentForm, setPaymentForm] = useState({ bank_name:'', account_number:'', account_name:'', btc_wallet:'', eth_wallet:'', usdt_wallet:'' });
  const [pwForm, setPwForm]           = useState({ old_password:'', new_password:'', confirm_password:'' });
  const [showPw, setShowPw]           = useState({ old:false, new:false, confirm:false });

  const checks = getChecks(pwForm.new_password, pwForm.confirm_password);

  useEffect(() => {
    if (!user) return;
    setProfileForm({ username: user.username ?? '', phone_number: user.phone_number ?? '', address: user.address ?? '' });
    setPaymentForm({ bank_name: user.bank_name ?? '', account_number: user.account_number ?? '', account_name: user.account_name ?? '', btc_wallet: user.btc_wallet ?? '', eth_wallet: user.eth_wallet ?? '', usdt_wallet: user.usdt_wallet ?? '' });
  }, [user]);

  useEffect(() => {
    if (activeTab === 'activity' && user) fetchActivities();
  }, [activeTab, user, fetchActivities]);

  const handleProfile = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setProfileForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handlePayment = (e: React.ChangeEvent<HTMLInputElement>) => setPaymentForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handlePw      = (e: React.ChangeEvent<HTMLInputElement>) => setPwForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const activitiesArray = Array.isArray(activities) ? activities as ActivityLog[] : [];

const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setSaving(true);
    try { 
      await updateUser(profileForm); 
      setEditing(false); 
      toast.success('Profile updated'); 
    } catch (err: unknown) { 
      const error = err as { message?: string; response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message ?? error?.message ?? 'Failed to update profile'); 
    } finally { 
      setSaving(false); 
    }
  };


  const savePayment = async (e: React.FormEvent) => {
      e.preventDefault(); 
      setSaving(true);
      try { 
        await updateAccountInfo(paymentForm); 
        toast.success('Payment details saved'); 
      } catch (err: unknown) { 
        const error = err as { message?: string; response?: { data?: { message?: string } } };
        toast.error(error?.response?.data?.message ?? error?.message ?? 'Failed to save payment details'); 
      } finally { 
        setSaving(false); 
      }
    };


  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.confirm_password) { 
      toast.error('Passwords do not match'); 
      return; 
    }
    if (!isValid(checks)) { 
      toast.error('Password does not meet requirements'); 
      return; 
    }
    const t = toast.loading('Changing password…');
    try {
      await changePwMutation.mutateAsync({ 
        old_password: pwForm.old_password, 
        new_password: pwForm.new_password 
      });
      toast.dismiss(t); 
      toast.success('Password changed successfully!');
      setPwSuccess(true); 
      setPwForm({ old_password: '', new_password: '', confirm_password: '' });
      setTimeout(() => setPwSuccess(false), 5000);
    } catch (err: unknown) {
      toast.dismiss(t);
      const error = err as { 
        response?: { data?: { old_password?: string[]; message?: string } };
        message?: string 
      };
      const msg = error?.response?.data?.old_password?.[0] || 
                  error?.response?.data?.message || 
                  error?.message || 
                  'Failed to change password';
      toast.error(msg.includes('Wrong password') ? 'Current password is incorrect' : msg);
    }
  };

  const isSubscribed = subscription?.subscription_active ?? user?.is_subscribed ?? false;
  const subEndDate   = subscription?.subscription_end_date ?? user?.subscription_end_date;

  if (!user) {
    return (
      <>
        <div className="ds-spinner-page">
          <style>{SETTINGS_STYLES}</style>
          <svg className="ds-spinner" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="ds ds-fade-up" style={{ maxWidth:680, margin:'0 auto', paddingBottom:48, display:'flex', flexDirection:'column', gap:18 }}>
        <style>{SETTINGS_STYLES}</style>

        <div>
          <h1 className="ds-page-title">Settings</h1>
          <p className="ds-page-subtitle">Manage your profile, payment details, and security</p>
        </div>

        {/* User banner */}
        <div className="st-card" style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div className="st-avatar">{(user.username ?? '?').slice(0,2).toUpperCase()}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:14, fontWeight:600, color:'#1a1a1a', marginBottom:2 }}>{user.username}</p>
            <p style={{ fontSize:12, color:'#aaa' }}>{user.email}</p>
            <p style={{ fontSize:11, color:'#ccc', marginTop:2 }}>Member since {formatDate(user.created_at)}</p>
          </div>
          <span className={`st-sub-pill ${isSubscribed ? 'st-sub-active' : 'st-sub-inactive'}`}>
            {isSubscribed ? <><CheckCircle2 size={10} /> Active</> : <><AlertCircle size={10} /> No plan</>}
          </span>
        </div>

        {/* Tabs */}
        <div className="ds-tabs" style={{ flexWrap:'wrap' }}>
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} className={`ds-tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                <Icon size={12} style={{ display:'inline', marginRight:5 }} />
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">{t.short}</span>
              </button>
            );
          })}
        </div>

        {/* ── PROFILE ── */}
        {activeTab === 'profile' && (
          <div className="st-card">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
              <div>
                <p className="st-section-title">Personal Information</p>
                <p className="st-section-sub">Your public profile details</p>
              </div>
              <button onClick={() => { setEditing(e => !e); if (editingProfile) setProfileForm({ username: user.username ?? '', phone_number: user.phone_number ?? '', address: user.address ?? '' }); }}
                className="ds-btn-ghost ds-btn-sm" style={{ display:'flex', alignItems:'center', gap:6 }}>
                {editingProfile ? <><X size={12} /> Cancel</> : <><Pencil size={12} /> Edit</>}
              </button>
            </div>
            <form onSubmit={saveProfile} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <Field label="Email" hint="Cannot be changed">
                  <input className="st-input" value={user.email ?? ''} disabled type="text" name="email" />
                </Field>
                <Field label="Username">
                  <input className="st-input" name="username" value={profileForm.username} onChange={handleProfile} disabled={!editingProfile} placeholder="your_username" />
                </Field>
                <Field label="Phone Number">
                  <input className="st-input" name="phone_number" type="tel" value={profileForm.phone_number} onChange={handleProfile} disabled={!editingProfile} placeholder="+1 000 000 0000" />
                </Field>
                <div style={{ gridColumn:'1/-1' }}>
                  <Field label="Address">
                    <textarea className="st-textarea" name="address" value={profileForm.address} onChange={handleProfile} disabled={!editingProfile} rows={2} placeholder="Your home or business address" />
                  </Field>
                </div>
              </div>
              {editingProfile && (
                <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:4 }}>
                  <button type="submit" disabled={saving} className="ds-btn-primary ds-btn-sm" style={{ display:'flex', alignItems:'center', gap:7 }}>
                    {saving ? <Loader2 size={12} style={{ animation:'spin 0.7s linear infinite' }} /> : <Save size={12} />}
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                  <p style={{ fontSize:11, color:'#ccc' }}>Changes are saved instantly</p>
                </div>
              )}
            </form>
          </div>
        )}

        {/* ── PAYMENT ── */}
        {activeTab === 'payment' && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div className="st-card">
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
                <div style={{ width:32, height:32, borderRadius:9, background:'#f5f5f5', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Building2 size={14} color="#888" />
                </div>
                <div>
                  <p className="st-section-title">Bank Account</p>
                  <p className="st-section-sub">For USD withdrawals</p>
                </div>
              </div>
              <form onSubmit={savePayment} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div style={{ gridColumn:'1/-1' }}>
                    <Field label="Bank Name">
                      <input className="st-input" name="bank_name" value={paymentForm.bank_name} onChange={handlePayment} placeholder="e.g. Chase Bank, GTBank" />
                    </Field>
                  </div>
                  <Field label="Account Number">
                    <input className="st-input" name="account_number" value={paymentForm.account_number} onChange={handlePayment} placeholder="10-digit number" />
                  </Field>
                  <Field label="Account Name">
                    <input className="st-input" name="account_name" value={paymentForm.account_name} onChange={handlePayment} placeholder="Name on account" />
                  </Field>
                </div>
                <div className="st-divider" />
                <p className="st-field-label" style={{ marginBottom:0 }}>Crypto Wallets</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <Field label="Bitcoin (BTC)">
                    <input className="st-input" name="btc_wallet" value={paymentForm.btc_wallet} onChange={handlePayment} placeholder="bc1q…" />
                  </Field>
                  <Field label="Ethereum (ETH)">
                    <input className="st-input" name="eth_wallet" value={paymentForm.eth_wallet} onChange={handlePayment} placeholder="0x…" />
                  </Field>
                  <div style={{ gridColumn:'1/-1' }}>
                    <Field label="USDT (TRC-20)">
                      <input className="st-input" name="usdt_wallet" value={paymentForm.usdt_wallet} onChange={handlePayment} placeholder="T…" />
                    </Field>
                  </div>
                </div>
                <button type="submit" disabled={saving} className="ds-btn-primary ds-btn-sm" style={{ alignSelf:'flex-start', display:'flex', alignItems:'center', gap:7 }}>
                  {saving ? <Loader2 size={12} /> : <Save size={12} />} {saving ? 'Saving…' : 'Save Payment Details'}
                </button>
              </form>
            </div>
            <div style={{ background:'#fffbeb', border:'1px solid rgba(217,119,6,0.2)', borderRadius:10, padding:'12px 14px', display:'flex', gap:8, fontSize:12, color:'#92400e' }}>
              <AlertCircle size={13} style={{ flexShrink:0, marginTop:1 }} />
              Ensure your payment details are accurate. Incorrect information may cause withdrawal delays or failures.
            </div>
          </div>
        )}

        {/* ── SECURITY ── */}
        {activeTab === 'security' && (
          <div className="st-card" style={{ maxWidth:420 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
              <div style={{ width:32, height:32, borderRadius:9, background:'#f5f5f5', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Lock size={14} color="#888" />
              </div>
              <div>
                <p className="st-section-title">Change Password</p>
                <p className="st-section-sub">Keep your account secure</p>
              </div>
            </div>

            {pwSuccess && (
              <div style={{ background:'#f0fdf4', border:'1px solid rgba(22,163,74,0.2)', borderRadius:9, padding:'10px 14px', display:'flex', alignItems:'center', gap:8, marginBottom:16, fontSize:12, color:'#15803d' }}>
                <CheckCircle2 size={13} /> Your password has been updated successfully!
              </div>
            )}

            <form onSubmit={handleChangePassword} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {([
                { field:'old'     as const, name:'old_password',     label:'Current Password' },
                { field:'new'     as const, name:'new_password',     label:'New Password' },
                { field:'confirm' as const, name:'confirm_password', label:'Confirm New Password' },
              ]).map(({ field, name, label }) => (
                <Field key={name} label={label}>
                  <div style={{ position:'relative' }}>
                    <input className="st-input" style={{ paddingRight:40 }} type={showPw[field] ? 'text' : 'password'}
                      name={name} value={pwForm[name as keyof typeof pwForm]} onChange={handlePw} required />
                    <button type="button" onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))}
                      style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#bbb' }}>
                      {showPw[field] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </Field>
              ))}

              <div style={{ background:'#fafafa', border:'1px solid rgba(0,0,0,0.07)', borderRadius:9, padding:'12px 14px' }}>
                <p style={{ fontSize:11, fontWeight:600, color:'#bbb', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:8 }}>Password must include</p>
                {[
                  ['At least 8 characters',          checks.length],
                  ['One uppercase letter (A–Z)',      checks.upper],
                  ['One lowercase letter (a–z)',      checks.lower],
                  ['One number (0–9)',                checks.number],
                  ['One special character (!@#$…)',   checks.special],
                  ['Passwords match',                 checks.match],
                ].map(([label, valid]) => (
                  <div key={String(label)} className="st-pw-check" style={{ color: valid ? '#16a34a' : '#bbb', marginBottom:5 }}>
                    <span className="st-pw-dot" style={{ background: valid ? '#16a34a' : '#ddd' }} />
                    {label}
                  </div>
                ))}
              </div>

              <button type="submit" disabled={!isValid(checks) || changePwMutation.isPending}
                className="ds-btn-primary ds-btn-sm" style={{ alignSelf:'flex-start', display:'flex', alignItems:'center', gap:7 }}>
                {changePwMutation.isPending ? <Loader2 size={12} /> : <Shield size={12} />}
                {changePwMutation.isPending ? 'Changing…' : 'Change Password'}
              </button>
            </form>
          </div>
        )}

        {/* ── SUBSCRIPTION ── */}
        {activeTab === 'subscription' && (
          <div className="st-card">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
              <div>
                <p className="st-section-title">Subscription Status</p>
                <p className="st-section-sub">Your current plan details</p>
              </div>
              <button onClick={() => refetchSub?.()} className="ds-icon-btn"><RefreshCw size={13} /></button>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:10, marginBottom:14 }}>
              {[
                { label:'Status',    value: isSubscribed ? 'Active' : 'Inactive' },
                { label:'Expires',   value: subEndDate ? formatDate(subEndDate) : '—' },
                { label:'Auto-renew',value: 'Not set' },
              ].map(s => (
                <div key={s.label} style={{ background:'#fafafa', border:'1px solid rgba(0,0,0,0.07)', borderRadius:10, padding:'12px 14px' }}>
                  <p style={{ fontSize:11, color:'#bbb', marginBottom:4 }}>{s.label}</p>
                  <p style={{ fontSize:13, fontWeight:600, color:'#1a1a1a' }}>{s.value}</p>
                </div>
              ))}
            </div>

            {!isSubscribed && (
              <div style={{ background:'#fafafa', border:'1px solid rgba(0,0,0,0.07)', borderRadius:10, padding:'14px 16px' }}>
                <p style={{ fontSize:13, fontWeight:600, color:'#1a1a1a', marginBottom:4 }}>No active subscription</p>
                <p style={{ fontSize:12, color:'#aaa', marginBottom:12 }}>Subscribe to unlock premium investment plans and features.</p>
                <button style={{ display:'inline-flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', fontSize:12.5, fontWeight:500, color:'#f97316' }}>
                  View plans <ChevronRight size={13} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── ACTIVITY ── */}
        {activeTab === 'activity' && (
          <div className="st-card">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
              <div>
                <p className="st-section-title">Activity Log</p>
                <p className="st-section-sub">Your recent account actions</p>
              </div>
              <button onClick={fetchActivities} disabled={storeLoading}
                className="ds-btn-ghost ds-btn-sm" style={{ display:'flex', alignItems:'center', gap:6 }}>
                <RefreshCw size={12} style={{ animation: storeLoading ? 'spin 0.7s linear infinite' : undefined }} /> Refresh
              </button>
            </div>

            {storeLoading ? (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 0', gap:10 }}>
                <svg className="ds-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                <p style={{ fontSize:12, color:'#bbb' }}>Loading…</p>
              </div>
            ) : activitiesArray.length > 0  ? (
              <div>
                {activitiesArray.map((act, i) => (
                  <div key={act.id ?? i} className="ds-list-item">
                    <div style={{ display:'flex', alignItems:'flex-start', gap:10, flex:1, minWidth:0 }}>
                      <div className="ds-list-icon" style={{ marginTop:2 }}><Activity size={13} /></div>
                      <div style={{ minWidth:0 }}>
                        <p style={{ fontSize:12.5, fontWeight:500, color:'#1a1a1a', marginBottom:2 }}>{act.action}</p>
                        {act.details    && <p style={{ fontSize:11.5, color:'#aaa' }}>{act.details}</p>}
                        {act.ip_address && <p style={{ fontSize:11, color:'#ddd', marginTop:2 }}>IP: {act.ip_address}</p>}
                      </div>
                    </div>
                    <p style={{ fontSize:11, color:'#ccc', flexShrink:0, marginLeft:12 }}>{formatDate(act.created_at)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ds-empty">
                <div className="ds-empty-icon"><Activity size={18} /></div>
                <p className="ds-empty-title">No activities yet</p>
                <p className="ds-empty-sub">Actions you take will appear here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}