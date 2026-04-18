// src/app/admin/_styles/adminPageStyles.ts
// Shared design-system styles for all admin pages

export const ADMIN_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

  .adm * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }

  /* Layout */
  .adm-root  { display: flex; flex-direction: column; gap: 22px; animation: fadeUp .25s ease; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }

  /* Page heading */
  .adm-title    { font-family: 'DM Serif Display', serif; font-size: 24px; color: #1a1a1a; letter-spacing: -0.02em; }
  .adm-subtitle { font-size: 12px; color: #aaa; margin-top: 3px; }

  /* Stat cards grid */
  .adm-stat-grid { display: grid; gap: 12px; }

  .adm-stat-card {
    background: #fff; border: 1px solid rgba(0,0,0,0.07);
    border-radius: 12px; padding: 16px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    transition: box-shadow .18s, transform .18s;
  }
  .adm-stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); transform: translateY(-1px); }
  .adm-stat-label { font-size: 11px; color: #aaa; font-weight: 500; letter-spacing: 0.03em; margin-bottom: 6px; }
  .adm-stat-value { font-size: 22px; font-weight: 600; color: #1a1a1a; letter-spacing: -0.02em; }
  .adm-stat-sub   { font-size: 10.5px; color: #ccc; margin-top: 2px; }

  /* Toolbar */
  .adm-toolbar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

  /* Search / filter inputs */
  .adm-search-wrap {
    display: flex; align-items: center; gap: 8px;
    background: #fafafa; border: 1px solid rgba(0,0,0,0.1);
    border-radius: 9px; padding: 8px 12px;
    transition: border-color .15s, box-shadow .15s;
  }
  .adm-search-wrap:focus-within {
    border-color: rgba(0,0,0,0.22); box-shadow: 0 0 0 3px rgba(0,0,0,0.04); background: #fff;
  }
  .adm-search-input {
    background: none; border: none; outline: none;
    font-size: 12.5px; color: #1a1a1a; font-family: 'DM Sans', sans-serif; width: 200px;
  }
  .adm-search-input::placeholder { color: #ccc; }

  .adm-select {
    background: #fafafa; border: 1px solid rgba(0,0,0,0.1);
    border-radius: 9px; padding: 8px 12px;
    font-size: 12.5px; color: #555; font-family: 'DM Sans', sans-serif;
    outline: none; cursor: pointer;
    transition: border-color .15s;
  }
  .adm-select:focus { border-color: rgba(0,0,0,0.22); }

  /* Table card */
  .adm-table-card {
    background: #fff; border: 1px solid rgba(0,0,0,0.07);
    border-radius: 14px; overflow: hidden;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  }

  /* Table */
  .adm-table { width: 100%; border-collapse: collapse; }
  .adm-table thead tr { background: #fafafa; border-bottom: 1px solid rgba(0,0,0,0.07); }
  .adm-table th {
    padding: 10px 16px; text-align: left;
    font-size: 10.5px; font-weight: 600; letter-spacing: 0.06em;
    text-transform: uppercase; color: #aaa;
  }
  .adm-table tbody tr { border-bottom: 1px solid rgba(0,0,0,0.05); transition: background .12s; }
  .adm-table tbody tr:last-child { border-bottom: none; }
  .adm-table tbody tr:hover { background: #fafafa; }
  .adm-table td { padding: 12px 16px; font-size: 12.5px; color: #333; vertical-align: middle; }

  .adm-empty-row td {
    text-align: center; padding: 40px 16px;
    font-size: 12.5px; color: #bbb;
  }

  /* Pagination footer */
  .adm-table-footer {
    padding: 12px 16px; border-top: 1px solid rgba(0,0,0,0.06);
    display: flex; align-items: center; justify-content: space-between;
    background: #fafafa;
  }
  .adm-table-count { font-size: 11.5px; color: #aaa; }

  /* Status badges */
  .adm-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 9px; border-radius: 20px;
    font-size: 11px; font-weight: 500; white-space: nowrap;
  }
  .adm-badge-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

  .adm-badge.active   { background: #f0fdf4; color: #15803d; }
  .adm-badge.pending  { background: #fffbeb; color: #b45309; }
  .adm-badge.completed{ background: #f0f9ff; color: #0369a1; }
  .adm-badge.failed,
  .adm-badge.cancelled{ background: #fff5f5; color: #b91c1c; }
  .adm-badge.inactive { background: #fafafa; color: #999; }
  .adm-badge.paid     { background: #f0fdf4; color: #15803d; }
  .adm-badge.unpaid   { background: #fff5f5; color: #b91c1c; }
  .adm-badge.premium  { background: #fafafa; color: #555; border: 1px solid rgba(0,0,0,0.08); }

  .adm-badge.active    .adm-badge-dot { background: #16a34a; }
  .adm-badge.pending   .adm-badge-dot { background: #d97706; }
  .adm-badge.completed .adm-badge-dot { background: #0284c7; }
  .adm-badge.failed    .adm-badge-dot,
  .adm-badge.cancelled .adm-badge-dot { background: #dc2626; }
  .adm-badge.inactive  .adm-badge-dot { background: #ccc; }
  .adm-badge.paid      .adm-badge-dot { background: #16a34a; }
  .adm-badge.unpaid    .adm-badge-dot { background: #dc2626; }

  /* Avatar */
  .adm-avatar {
    width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 600; color: #fff;
  }
  .adm-avatar.neutral {
    background: #f0f0f0; color: #888;
  }

  /* Icon button */
  .adm-icon-btn {
    width: 30px; height: 30px; border-radius: 7px;
    background: none; border: none; cursor: pointer; color: #aaa;
    display: flex; align-items: center; justify-content: center;
    transition: background .15s, color .15s;
  }
  .adm-icon-btn:hover             { background: #f0f0f0; color: #333; }
  .adm-icon-btn.danger:hover      { background: #fff5f5; color: #dc2626; }
  .adm-icon-btn.success:hover     { background: #f0fdf4; color: #16a34a; }

  /* Buttons */
  .adm-btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    padding: 8px 16px; border: none; border-radius: 9px; cursor: pointer;
    font-size: 12.5px; font-weight: 500; font-family: 'DM Sans', sans-serif;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    color: #fff; transition: opacity .15s, transform .15s;
  }
  .adm-btn-primary:hover { opacity: .9; transform: translateY(-1px); }

  .adm-btn-ghost {
    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    padding: 7px 14px; border: 1px solid rgba(0,0,0,0.1); border-radius: 9px; cursor: pointer;
    font-size: 12.5px; font-weight: 500; font-family: 'DM Sans', sans-serif;
    background: transparent; color: #555; transition: background .15s, border-color .15s;
  }
  .adm-btn-ghost:hover { background: #f5f5f5; border-color: rgba(0,0,0,0.18); color: #1a1a1a; }

  .adm-btn-sm {
    padding: 5px 11px; font-size: 11.5px; border-radius: 7px;
  }

  .adm-btn-danger {
    background: transparent; border: 1px solid rgba(220,38,38,0.2);
    color: #dc2626; border-radius: 9px;
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; cursor: pointer; font-size: 12.5px;
    font-family: 'DM Sans', sans-serif; font-weight: 500;
    transition: background .15s;
  }
  .adm-btn-danger:hover { background: #fff5f5; }

  .adm-btn-success {
    background: transparent; border: 1px solid rgba(22,163,74,0.2);
    color: #16a34a; border-radius: 9px;
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; cursor: pointer; font-size: 12.5px;
    font-family: 'DM Sans', sans-serif; font-weight: 500;
    transition: background .15s;
  }
  .adm-btn-success:hover { background: #f0fdf4; }

  /* Role select in table */
  .adm-role-select {
    background: #fafafa; border: 1px solid rgba(0,0,0,0.09);
    border-radius: 7px; padding: 5px 10px;
    font-size: 12px; color: #333; font-family: 'DM Sans', sans-serif;
    outline: none; cursor: pointer;
  }
  .adm-role-select:focus { border-color: rgba(0,0,0,0.2); }

  /* Password mono */
  .adm-mono {
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 11.5px; background: #f5f5f5;
    padding: 3px 8px; border-radius: 5px; color: #444;
  }

  /* Modal */
  .adm-modal-overlay {
    position: fixed; inset: 0; z-index: 50;
    background: rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center; padding: 20px;
  }
  .adm-modal {
    background: #fff; border-radius: 16px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.12);
    max-width: 560px; width: 100%;
    max-height: 90vh; overflow-y: auto;
    padding: 28px 24px;
    animation: dropIn .18s ease;
  }
  .adm-modal.wide { max-width: 720px; }
  @keyframes dropIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }

  .adm-modal-title { font-family: 'DM Serif Display', serif; font-size: 20px; color: #1a1a1a; letter-spacing: -0.01em; margin-bottom: 4px; }
  .adm-modal-sub   { font-size: 12px; color: #aaa; margin-bottom: 20px; }

  /* Detail sections in modal */
  .adm-detail-section {
    border: 1px solid rgba(0,0,0,0.07); border-radius: 10px;
    padding: 16px; margin-bottom: 14px;
  }
  .adm-detail-sec-title {
    font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
    color: #aaa; margin-bottom: 12px; display: flex; align-items: center; gap: 7px;
  }
  .adm-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  @media (max-width: 500px) { .adm-detail-grid { grid-template-columns: 1fr; } }
  .adm-detail-label { font-size: 11px; color: #bbb; margin-bottom: 3px; }
  .adm-detail-value { font-size: 12.5px; color: #1a1a1a; font-weight: 450; }

  /* Form fields in modal */
  .adm-field-wrap  { display: flex; flex-direction: column; gap: 5px; }
  .adm-field-label { font-size: 11.5px; font-weight: 500; color: #555; }
  .adm-field-input, .adm-field-textarea, .adm-field-select {
    width: 100%; padding: 9px 12px; font-size: 12.5px; color: #1a1a1a;
    background: #fafafa; border: 1px solid rgba(0,0,0,0.1); border-radius: 9px;
    font-family: 'DM Sans', sans-serif; outline: none;
    transition: border-color .15s, box-shadow .15s;
  }
  .adm-field-input:focus, .adm-field-textarea:focus, .adm-field-select:focus {
    border-color: rgba(0,0,0,0.25); box-shadow: 0 0 0 3px rgba(0,0,0,0.04); background: #fff;
  }
  .adm-field-textarea { resize: vertical; min-height: 80px; }
  .adm-field-input::placeholder, .adm-field-textarea::placeholder { color: #ccc; }

  /* Tier card */
  .adm-tier-card {
    border: 1px solid rgba(0,0,0,0.07); border-radius: 10px; padding: 14px;
  }
  .adm-tier-title {
    font-size: 11.5px; font-weight: 600; color: #555; margin-bottom: 12px;
    display: flex; align-items: center; gap: 6px;
  }
  .adm-tier-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 7px; font-size: 12px;
  }
  .adm-tier-row:last-child { margin-bottom: 0; }
  .adm-tier-row-label { color: #aaa; }
  .adm-tier-row-val   { font-weight: 500; color: #1a1a1a; }
  .adm-tier-row-val.red   { color: #e05252; }
  .adm-tier-row-val.green { color: #16a34a; }

  /* Check row */
  .adm-check-row {
    display: flex; align-items: center; gap: 8px; cursor: pointer;
    font-size: 12.5px; color: #444;
  }
  .adm-check-row input { accent-color: #f97316; width: 13px; height: 13px; cursor: pointer; }

  /* Loading / Error state */
  .adm-loader-page { display: flex; align-items: center; justify-content: center; height: 320px; }
  .adm-loader-inner { text-align: center; }
  .adm-loader-text { font-size: 12px; color: #aaa; margin-top: 12px; font-family: 'DM Sans', sans-serif; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .adm-spinner { animation: spin 0.7s linear infinite; }

  /* Section divider */
  .adm-divider { height: 1px; background: rgba(0,0,0,0.06); margin: 4px 0; }

  /* Modal action row */
  .adm-modal-actions { display: flex; gap: 10px; margin-top: 22px; }
  .adm-modal-actions .adm-btn-ghost { flex: 1; }
  .adm-modal-actions .adm-btn-primary { flex: 1; }
`;