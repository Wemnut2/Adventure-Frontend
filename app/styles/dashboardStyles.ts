// src/layout/styles/dashboardStyles.ts
// Design-system styles for all user-facing dashboard pages

export const DASH_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

  .ds * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }

  /* ── Page wrapper ── */
  .ds-page { display: flex; flex-direction: column; gap: 22px; padding-bottom: 40px; }

  /* ── Page header ── */
  .ds-page-title    { font-family: 'DM Serif Display', serif; font-size: 24px; color: #1a1a1a; letter-spacing: -0.02em; }
  .ds-page-subtitle { font-size: 12px; color: #aaa; margin-top: 3px; }

  /* ── Stat grid ── */
  .ds-stat-grid { display: grid; gap: 12px; }

  .ds-stat-card {
    background: #fff; border: 1px solid rgba(0,0,0,0.07);
    border-radius: 14px; padding: 18px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    transition: box-shadow .18s, transform .18s;
  }
  .ds-stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); transform: translateY(-1px); }
  .ds-stat-label { font-size: 11px; color: #aaa; font-weight: 500; letter-spacing: 0.03em; margin-bottom: 6px; }
  .ds-stat-value { font-size: 22px; font-weight: 600; color: #1a1a1a; letter-spacing: -0.02em; }
  .ds-stat-sub   { font-size: 11px; color: #ccc; margin-top: 2px; }
  .ds-stat-icon-pill {
    width: 36px; height: 36px; border-radius: 9px;
    background: #f5f5f5; color: #888;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 12px;
  }

  /* ── Tabs ── */
  .ds-tabs { display: flex; gap: 4px; background: #f0f0f0; padding: 4px; border-radius: 11px; width: fit-content; overflow-x: auto; }
  .ds-tab {
    padding: 7px 16px; border: none; background: transparent; border-radius: 8px;
    font-size: 12.5px; font-weight: 500; color: #aaa; cursor: pointer; white-space: nowrap;
    font-family: 'DM Sans', sans-serif; transition: background .15s, color .15s;
  }
  .ds-tab.active { background: #fff; color: #1a1a1a; box-shadow: 0 1px 3px rgba(0,0,0,0.07); }
  .ds-tab:hover:not(.active) { color: #555; }

  /* ── Cards ── */
  .ds-card {
    background: #fff; border: 1px solid rgba(0,0,0,0.07);
    border-radius: 14px; overflow: hidden;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  }
  .ds-card-header {
    padding: 14px 18px; border-bottom: 1px solid rgba(0,0,0,0.06);
    display: flex; align-items: center; justify-content: space-between;
  }
  .ds-card-title { font-size: 13px; font-weight: 600; color: #1a1a1a; }
  .ds-card-body  { padding: 18px; }

  /* ── Search ── */
  .ds-search-wrap {
    display: flex; align-items: center; gap: 8px;
    background: #fafafa; border: 1px solid rgba(0,0,0,0.1);
    border-radius: 9px; padding: 8px 12px;
    transition: border-color .15s, box-shadow .15s;
  }
  .ds-search-wrap:focus-within {
    border-color: rgba(0,0,0,0.22); box-shadow: 0 0 0 3px rgba(0,0,0,0.04); background: #fff;
  }
  .ds-search-input {
    background: none; border: none; outline: none;
    font-size: 12.5px; color: #1a1a1a; font-family: 'DM Sans', sans-serif; width: 200px;
  }
  .ds-search-input::placeholder { color: #ccc; }

  /* ── Select ── */
  .ds-select {
    background: #fafafa; border: 1px solid rgba(0,0,0,0.1);
    border-radius: 9px; padding: 8px 12px;
    font-size: 12.5px; color: #555; font-family: 'DM Sans', sans-serif;
    outline: none; cursor: pointer; transition: border-color .15s;
  }
  .ds-select:focus { border-color: rgba(0,0,0,0.22); }

  /* ── Inputs ── */
  .ds-input {
    width: 100%; padding: 9px 12px; font-size: 12.5px; color: #1a1a1a;
    background: #fafafa; border: 1px solid rgba(0,0,0,0.1); border-radius: 9px;
    font-family: 'DM Sans', sans-serif; outline: none;
    transition: border-color .15s, box-shadow .15s;
  }
  .ds-input:focus {
    border-color: rgba(0,0,0,0.25); box-shadow: 0 0 0 3px rgba(0,0,0,0.04); background: #fff;
  }
  .ds-input::placeholder { color: #ccc; }
  .ds-input-label { font-size: 11.5px; font-weight: 500; color: #555; margin-bottom: 5px; display: block; }
  .ds-input-hint  { font-size: 11px; color: #bbb; margin-top: 4px; }
  .ds-input-error { font-size: 11px; color: #e05252; margin-top: 4px; }

  /* ── Buttons ── */
  .ds-btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    padding: 10px 20px; border: none; border-radius: 10px; cursor: pointer;
    font-size: 13px; font-weight: 500; font-family: 'DM Sans', sans-serif;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    color: #fff; transition: opacity .15s, transform .15s;
  }
  .ds-btn-primary:hover  { opacity: .9; transform: translateY(-1px); }
  .ds-btn-primary:disabled { opacity: .45; cursor: not-allowed; transform: none; }

  .ds-btn-ghost {
    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    padding: 9px 16px; border: 1px solid rgba(0,0,0,0.1); border-radius: 10px; cursor: pointer;
    font-size: 12.5px; font-weight: 500; font-family: 'DM Sans', sans-serif;
    background: transparent; color: #555; transition: background .15s, border-color .15s;
  }
  .ds-btn-ghost:hover { background: #f5f5f5; border-color: rgba(0,0,0,0.18); color: #1a1a1a; }

  .ds-btn-sm { padding: 6px 12px; font-size: 11.5px; border-radius: 8px; }

  .ds-icon-btn {
    width: 30px; height: 30px; border-radius: 7px;
    background: none; border: none; cursor: pointer; color: #aaa;
    display: flex; align-items: center; justify-content: center;
    transition: background .15s, color .15s;
  }
  .ds-icon-btn:hover { background: #f0f0f0; color: #333; }

  /* ── Status badges ── */
  .ds-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 9px; border-radius: 20px;
    font-size: 11px; font-weight: 500; white-space: nowrap;
  }
  .ds-badge-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

  .ds-badge.completed,.ds-badge.active   { background: #f0fdf4; color: #15803d; }
  .ds-badge.active    .ds-badge-dot,
  .ds-badge.completed .ds-badge-dot      { background: #16a34a; }

  .ds-badge.pending,.ds-badge.pending_payment,.ds-badge.pending_review {
    background: #fffbeb; color: #b45309;
  }
  .ds-badge.pending    .ds-badge-dot,
  .ds-badge.pending_payment .ds-badge-dot,
  .ds-badge.pending_review  .ds-badge-dot { background: #d97706; }

  .ds-badge.in_progress { background: #f0f9ff; color: #0369a1; }
  .ds-badge.in_progress .ds-badge-dot { background: #0284c7; }

  .ds-badge.failed,.ds-badge.cancelled { background: #fff5f5; color: #b91c1c; }
  .ds-badge.failed    .ds-badge-dot,
  .ds-badge.cancelled .ds-badge-dot { background: #dc2626; }

  /* Tier badges */
  .ds-tier-bronze { background: #fdf6ec; color: #92400e; border: 1px solid rgba(180,95,30,0.15); }
  .ds-tier-silver { background: #f5f5f5; color: #555; border: 1px solid rgba(0,0,0,0.1); }
  .ds-tier-gold   { background: #fefce8; color: #713f12; border: 1px solid rgba(180,150,10,0.15); }

  /* ── Tables ── */
  .ds-table-card { background: #fff; border: 1px solid rgba(0,0,0,0.07); border-radius: 14px; overflow: hidden; }
  .ds-table { width: 100%; border-collapse: collapse; }
  .ds-table thead tr { background: #fafafa; border-bottom: 1px solid rgba(0,0,0,0.07); }
  .ds-table th { padding: 10px 16px; text-align: left; font-size: 10.5px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #aaa; }
  .ds-table tbody tr { border-bottom: 1px solid rgba(0,0,0,0.05); transition: background .12s; }
  .ds-table tbody tr:last-child { border-bottom: none; }
  .ds-table tbody tr:hover { background: #fafafa; }
  .ds-table td { padding: 12px 16px; font-size: 12.5px; color: #333; vertical-align: middle; }
  .ds-table-footer { padding: 10px 16px; border-top: 1px solid rgba(0,0,0,0.06); background: #fafafa; }
  .ds-empty-row td { text-align: center; padding: 40px 16px; font-size: 12.5px; color: #bbb; }

  /* ── Task card ── */
  .ds-task-card {
    background: #fff; border: 1px solid rgba(0,0,0,0.07);
    border-radius: 14px; overflow: hidden;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    transition: box-shadow .18s, transform .18s;
  }
  .ds-task-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); transform: translateY(-1px); }

  /* ── Tier option (selection) ── */
  .ds-tier-opt {
    border: 1.5px solid rgba(0,0,0,0.09); border-radius: 12px;
    padding: 14px; cursor: pointer; position: relative;
    background: #fafafa; transition: border-color .15s, background .15s, transform .15s;
  }
  .ds-tier-opt:hover   { border-color: rgba(0,0,0,0.2); background: #fff; transform: scale(1.01); }
  .ds-tier-opt.selected {
    border-color: #f97316; background: #fff8f4;
    box-shadow: 0 0 0 3px rgba(249,115,22,0.08);
  }

  /* ── Upload area ── */
  .ds-upload {
    border: 1.5px dashed rgba(0,0,0,0.14); border-radius: 12px;
    padding: 20px; text-align: center; cursor: pointer;
    transition: border-color .15s, background .15s;
  }
  .ds-upload:hover { border-color: rgba(0,0,0,0.28); background: #fafafa; }
  .ds-upload-label { font-size: 12.5px; font-weight: 500; color: #555; margin-top: 8px; }
  .ds-upload-hint  { font-size: 11px; color: #ccc; margin-top: 3px; }

  /* ── Info / warn strip ── */
  .ds-info-strip {
    background: #f5f5f5; border: 1px solid rgba(0,0,0,0.07);
    border-radius: 9px; padding: 10px 14px;
    display: flex; align-items: flex-start; gap: 8px;
    font-size: 12px; color: #666; line-height: 1.55;
  }
  .ds-warn-strip {
    background: #fffbeb; border: 1px solid rgba(217,119,6,0.2);
    border-radius: 9px; padding: 10px 14px;
    display: flex; align-items: flex-start; gap: 8px;
    font-size: 12px; color: #92400e; line-height: 1.55;
  }
  .ds-success-strip {
    background: #f0fdf4; border: 1px solid rgba(22,163,74,0.2);
    border-radius: 9px; padding: 10px 14px;
    display: flex; align-items: flex-start; gap: 8px;
    font-size: 12px; color: #15803d; line-height: 1.55;
  }

  /* ── Modal ── */
  .ds-modal-overlay {
    position: fixed; inset: 0; z-index: 50;
    background: rgba(0,0,0,0.45); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center; padding: 20px;
  }
  .ds-modal {
    background: #fff; border-radius: 18px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.12);
    max-width: 540px; width: 100%; max-height: 90vh; overflow-y: auto;
    padding: 28px 24px; animation: dsDropIn .18s ease;
  }
  .ds-modal.wide { max-width: 680px; }
  @keyframes dsDropIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }

  .ds-modal-title { font-family: 'DM Serif Display', serif; font-size: 20px; color: #1a1a1a; letter-spacing: -0.01em; margin-bottom: 4px; }
  .ds-modal-sub   { font-size: 12px; color: #aaa; margin-bottom: 20px; }
  .ds-modal-actions { display: flex; gap: 10px; margin-top: 22px; }
  .ds-modal-actions .ds-btn-ghost   { flex: 1; }
  .ds-modal-actions .ds-btn-primary { flex: 1; }

  /* ── Contact button (support popup / modal) ── */
  .ds-contact-btn {
    width: 100%; display: flex; align-items: center; gap: 10px;
    padding: 11px 14px; background: #fafafa;
    border: 1px solid rgba(0,0,0,0.08); border-radius: 10px;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    font-size: 12.5px; font-weight: 500; color: #1a1a1a;
    transition: background .15s, border-color .15s; text-align: left;
  }
  .ds-contact-btn:hover { background: #f0f0f0; border-color: rgba(0,0,0,0.16); }
  .ds-contact-icon {
    width: 30px; height: 30px; border-radius: 50%;
    background: #e5e5e5; color: #666;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .ds-contact-arrow { margin-left: auto; color: #ccc; font-size: 16px; }

  /* ── FAB support button ── */
  .ds-fab {
    display: flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    color: #fff; border: none; border-radius: 30px;
    padding: 11px 20px; cursor: pointer; font-size: 13px; font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 14px rgba(249,115,22,0.35);
    transition: opacity .15s, transform .15s;
  }
  .ds-fab:hover { opacity: .92; transform: translateY(-1px); }

  /* ── Support popup ── */
  .ds-support-popup {
    background: #fff; border: 1px solid rgba(0,0,0,0.09);
    border-radius: 16px; padding: 18px; width: 270px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    animation: dsDropIn .15s ease;
  }
  .ds-support-title { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #bbb; margin-bottom: 12px; }
  .ds-support-section-label { font-size: 11px; color: #ccc; margin: 10px 0 5px; }

  /* ── Progress bar ── */
  .ds-progress-bar { height: 5px; background: #f0f0f0; border-radius: 3px; overflow: hidden; margin-top: 8px; }
  .ds-progress-fill { height: 100%; background: linear-gradient(90deg, #f97316, #ea580c); border-radius: 3px; transition: width .3s; }

  /* ── Meta pill ── */
  .ds-meta-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; background: #fafafa;
    border: 1px solid rgba(0,0,0,0.08); border-radius: 20px;
    font-size: 11.5px; font-weight: 500; color: #555;
  }


  /* Add to DASH_STYLES */
.ds-video-thumb {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: #f5f5f5;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ds-video-thumb-img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.ds-video-placeholder {
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a1a, #333);
  color: white;
}

.ds-play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.ds-video-thumb:hover .ds-play-overlay {
  background: rgba(0, 0, 0, 0.5);
}

.ds-play-button {
  width: 50px;
  height: 50px;
  background: rgba(249, 115, 22, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  transition: transform 0.2s;
}

.ds-video-thumb:hover .ds-play-button {
  transform: scale(1.1);
}

.ds-video-modal {
  position: relative;
  width: 90%;
  max-width: 800px;
  height: 450px;
  background: black;
  border-radius: 12px;
  overflow: hidden;
}

.ds-close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 18px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ds-close-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.ds-video-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

@media (max-width: 768px) {
  .ds-video-modal {
    height: 250px;
  }
}
  /* ── List item ── */
  .ds-list-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px; border-bottom: 1px solid rgba(0,0,0,0.05);
    transition: background .12s;
  }
  .ds-list-item:last-child { border-bottom: none; }
  .ds-list-item:hover { background: #fafafa; }
  .ds-list-icon {
    width: 34px; height: 34px; border-radius: 9px; background: #f5f5f5;
    display: flex; align-items: center; justify-content: center; color: #aaa; flex-shrink: 0;
  }

  /* ── Divider ── */
  .ds-divider { height: 1px; background: rgba(0,0,0,0.06); margin: 6px 0; }

  /* ── Quick action ── */
  .ds-quick-action {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 16px; background: #fff;
    border: 1px solid rgba(0,0,0,0.07); border-radius: 12px;
    text-decoration: none; transition: background .15s, box-shadow .15s, transform .15s;
  }
  .ds-quick-action:hover { background: #fafafa; box-shadow: 0 4px 12px rgba(0,0,0,0.06); transform: translateY(-1px); }
  .ds-quick-action-icon {
    width: 36px; height: 36px; border-radius: 9px;
    background: #f5f5f5; color: #888; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .ds-quick-action-label { font-size: 12.5px; font-weight: 500; color: #1a1a1a; }
  .ds-quick-action-sub   { font-size: 11px; color: #bbb; }

  /* ── Spinner ── */
  @keyframes spin { to { transform: rotate(360deg); } }
  .ds-spinner { animation: spin 0.7s linear infinite; }
  .ds-spinner-page { display: flex; align-items: center; justify-content: center; height: 320px; }

  /* ── Empty state ── */
  .ds-empty { text-align: center; padding: 48px 24px; }
  .ds-empty-icon { width: 48px; height: 48px; border-radius: 12px; background: #f5f5f5; color: #ccc; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; }
  .ds-empty-title { font-size: 13px; font-weight: 500; color: #555; margin-bottom: 4px; }
  .ds-empty-sub   { font-size: 12px; color: #bbb; margin-bottom: 16px; }

  /* ── Fee summary ── */
  .ds-fee-strip {
    background: #fafafa; border: 1px solid rgba(0,0,0,0.07);
    border-radius: 10px; padding: 14px 16px;
  }
  .ds-fee-row { display: flex; justify-content: space-between; font-size: 12.5px; margin-bottom: 7px; }
  .ds-fee-row:last-child { margin-bottom: 0; }
  .ds-fee-divider { height: 1px; background: rgba(0,0,0,0.07); margin: 8px 0; }

  /* ── Method selector ── */
  .ds-method-btn {
    display: flex; flex-direction: column; align-items: center; gap: 5px;
    padding: 12px 8px; background: #fafafa;
    border: 1.5px solid rgba(0,0,0,0.09); border-radius: 11px;
    cursor: pointer; font-size: 11.5px; font-weight: 500; color: #555;
    font-family: 'DM Sans', sans-serif; transition: border-color .15s, background .15s;
  }
  .ds-method-btn.active { border-color: #f97316; background: #fff8f4; color: #c2410c; }
  .ds-method-btn:hover:not(.active) { border-color: rgba(0,0,0,0.18); background: #fff; }

  /* ── Animations ── */
  @keyframes fadeUp { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
  .ds-fade-up { animation: fadeUp .25s ease; }

  /* ── Welcome strip (replaces gradient hero) ── */
  .ds-welcome {
    background: #fff; border: 1px solid rgba(0,0,0,0.07);
    border-radius: 16px; padding: 24px 26px;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 14px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  }
  .ds-welcome-greeting { font-size: 11px; color: #bbb; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 6px; }
  .ds-welcome-name { font-family: 'DM Serif Display', serif; font-size: 22px; color: #1a1a1a; letter-spacing: -0.02em; }
  .ds-welcome-sub  { font-size: 12px; color: #aaa; margin-top: 3px; }
`;