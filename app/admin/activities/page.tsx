// src/app/admin/activities/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/libs/services/admin.service';
import { formatDateTime } from '@/libs/utils/format';
import { ADMIN_STYLES } from '../_style/adminPageStyles';
import {
  Search, Download, RefreshCw, Activity,
  User, DollarSign, CheckSquare, Award, AlertCircle,
} from 'lucide-react';

interface ActivityItem {
  action: string; user_email?: string;
  details?: string; created_at: string; ip_address?: string;
}

function Spinner() {
  return (
    <div className="adm-loader-page">
      <div className="adm-loader-inner">
        <svg className="adm-spinner" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        <p className="adm-loader-text">Loading activities…</p>
      </div>
    </div>
  );
}

function activityIcon(action: string) {
  if (action.includes('login'))      return <User       size={13} />;
  if (action.includes('investment')) return <DollarSign size={13} />;
  if (action.includes('task'))       return <CheckSquare size={13} />;
  if (action.includes('challenge'))  return <Award      size={13} />;
  return <Activity size={13} />;
}

export default function AdminActivitiesPage() {
  const [activities, setActivities]   = useState<ActivityItem[]>([]);
  const [loading, setLoading]         = useState(true);
  const [searchTerm, setSearchTerm]   = useState('');
  const [typeFilter, setTypeFilter]   = useState('all');

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await adminService.getRecentActivities();
      setActivities(data);
    } catch { setActivities([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleExport = () => {
    if (!activities.length) return;
    const headers = ['Action', 'User', 'Details', 'IP', 'Date'];
    const rows = activities.map(a => [a.action, a.user_email || 'System', a.details || '', a.ip_address || '', a.created_at]);
    const csv = [headers, ...rows].map(r => r.map(v => JSON.stringify(v)).join(',')).join('\n');
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type:'text/csv' })), download: `activities_${new Date().toISOString().slice(0,10)}.csv` });
    a.click();
  };

  const typeMatch = (action: string) => {
    if (typeFilter === 'all')        return true;
    if (typeFilter === 'auth')       return action.includes('login') || action.includes('logout');
    if (typeFilter === 'investment') return action.includes('investment');
    if (typeFilter === 'task')       return action.includes('task');
    if (typeFilter === 'challenge')  return action.includes('challenge');
    return true;
  };

  const filtered = activities.filter(a =>
    (a.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     a.user_email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    typeMatch(a.action)
  );

  return (
    <div className="adm adm-root">
      <style>{ADMIN_STYLES}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 className="adm-title">Activity Log</h1>
          <p className="adm-subtitle">Track all user and system activities · {activities.length} total</p>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <button className="adm-btn-ghost" onClick={fetch}><RefreshCw size={13} /> Refresh</button>
          <button className="adm-btn-ghost" onClick={handleExport}><Download size={13} /> Export</button>
        </div>
      </div>

      {/* Filters */}
      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <Search size={13} color="#ccc" />
          <input className="adm-search-input" placeholder="Search by action or user…"
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <select className="adm-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">All Activities</option>
          <option value="auth">Authentication</option>
          <option value="investment">Investments</option>
          <option value="task">Tasks</option>
          <option value="challenge">Challenges</option>
        </select>
      </div>

      {/* Content */}
      {loading ? <Spinner /> : filtered.length === 0 ? (
        <div className="adm-table-card" style={{ padding:'48px 24px', textAlign:'center' }}>
          <Activity size={28} color="#ddd" style={{ marginBottom:12 }} />
          <p style={{ fontSize:12.5, color:'#bbb' }}>No activities found</p>
        </div>
      ) : (
        <div className="adm-table-card">
          {filtered.map((a, i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'14px 16px', borderBottom:'1px solid rgba(0,0,0,0.05)', transition:'background .12s' }}
              onMouseEnter={e => (e.currentTarget.style.background='#fafafa')}
              onMouseLeave={e => (e.currentTarget.style.background='transparent')}
            >
              {/* Icon pill */}
              <div style={{ width:30, height:30, borderRadius:8, background:'#f5f5f5', color:'#aaa', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
                {activityIcon(a.action)}
              </div>

              {/* Body */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
                  <div style={{ minWidth:0 }}>
                    <p style={{ fontSize:12.5, fontWeight:500, color:'#1a1a1a', marginBottom:3 }}>{a.action}</p>
                    {a.details && <p style={{ fontSize:11.5, color:'#aaa', marginBottom:5 }}>{a.details}</p>}
                    <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
                      <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'#bbb' }}>
                        <User size={10} />{a.user_email || 'System'}
                      </span>
                      {a.ip_address && (
                        <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'#ccc' }}>
                          <AlertCircle size={10} />IP: {a.ip_address}
                        </span>
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize:11, color:'#ccc', flexShrink:0, whiteSpace:'nowrap' }}>
                    {formatDateTime(a.created_at)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Footer count */}
          <div className="adm-table-footer" style={{ padding:'10px 16px', borderTop:'1px solid rgba(0,0,0,0.06)', background:'#fafafa' }}>
            <p style={{ fontSize:11.5, color:'#bbb' }}>Showing {filtered.length} of {activities.length} activities</p>
          </div>
        </div>
      )}
    </div>
  );
}