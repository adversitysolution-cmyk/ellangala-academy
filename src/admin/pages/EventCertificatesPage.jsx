import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import ActionMenu from '../components/ActionMenu';
import EmptyState from '../components/EmptyState';
import { certificateService, downloadCertificatePdf } from '../services/certificateService';
import {
  Award, Users, UploadCloud, Mail, MailWarning, FileCheck2, RefreshCw,
  Eye, Download, Send, Ban, ArrowLeft, Save, ShieldCheck
} from 'lucide-react';

const card = { backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px 24px' };

function Toggle({ checked, onChange, label }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '10px 0', cursor: 'pointer' }}>
      <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155' }}>{label}</span>
      <span
        onClick={() => onChange(!checked)}
        style={{
          width: '42px', height: '24px', borderRadius: '999px', flexShrink: 0,
          backgroundColor: checked ? '#CA8A38' : '#CBD5E1', position: 'relative', transition: 'background .15s'
        }}
      >
        <span style={{
          position: 'absolute', top: '3px', left: checked ? '21px' : '3px', width: '18px', height: '18px',
          borderRadius: '50%', backgroundColor: '#fff', transition: 'left .15s'
        }} />
      </span>
    </label>
  );
}

export default function EventCertificatesPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [cfg, setCfg] = useState(null);
  const [savingCfg, setSavingCfg] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [revokeFor, setRevokeFor] = useState(null);
  const [revokeReason, setRevokeReason] = useState('');
  const [busy, setBusy] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await certificateService.listCertificates(id, { search, filter });
      setData(res);
      setCfg((prev) => prev || res.config);
    } catch (e) {
      setError(e.message);
    }
  }, [id, search, filter]);

  useEffect(() => { load(); }, [load]);

  const saveConfig = async () => {
    setSavingCfg(true);
    try {
      const { config } = await certificateService.updateSettings(id, {
        certificateEnabled: cfg.certificateEnabled,
        templateId: cfg.templateId,
        requireRegistrationMatch: cfg.requireRegistrationMatch,
        autoSendEmail: cfg.autoSendEmail,
        eligibilityMode: cfg.eligibilityMode,
        idFormat: cfg.idFormat,
        orgCode: cfg.orgCode,
        eventCode: cfg.eventCode
      });
      setCfg(config);
    } catch (e) { setError(e.message); }
    setSavingCfg(false);
  };

  const doResend = async (certId) => {
    setBusy(certId);
    try { await certificateService.resend(certId); await load(); } catch (e) { setError(e.message); }
    setBusy('');
  };

  const doRevoke = async () => {
    try {
      await certificateService.revoke(revokeFor, revokeReason.trim());
      setRevokeFor(null); setRevokeReason('');
      await load();
    } catch (e) { setError(e.message); }
  };

  const retryEmails = async () => {
    setBusy('emails');
    try { await certificateService.retryFailedEmails(id); await load(); } catch (e) { setError(e.message); }
    setBusy('');
  };

  if (!data && !error) {
    return <AdminLayout title="Certificates"><div style={{ ...card, textAlign: 'center', color: '#64748B' }}>Loading…</div></AdminLayout>;
  }
  if (error && !data) {
    return <AdminLayout title="Certificates"><div style={{ ...card, textAlign: 'center', color: '#DC2626' }}>{error}</div></AdminLayout>;
  }

  const { event, stats, templates = [], certificates = [], audit = [] } = data;
  const templateConfigured = templates.length > 0 && cfg?.templateId;

  return (
    <AdminLayout
      title={`Certificates: ${event.title}`}
      subtitle={`${event.eventDateText} • ${event.mode}${event.venue ? ' • ' + event.venue : ''}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <Link to="/admin/events" style={{ color: '#64748B', fontWeight: 700, fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={16} /> Back to All Events
          </Link>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link to={`/admin/events/${id}/certificates/import`} className="btn-primary-gold">
              <UploadCloud size={16} /> <span>Upload Attendance Sheet</span>
            </Link>
            {stats.emailsFailed > 0 && (
              <button type="button" className="btn-secondary-outline" onClick={retryEmails} disabled={busy === 'emails'}>
                <RefreshCw size={15} /> Retry {stats.emailsFailed} Failed Emails
              </button>
            )}
          </div>
        </div>

        {error && <div style={{ ...card, color: '#DC2626', padding: '12px 20px' }}>{error}</div>}

        {/* stat grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px' }}>
          <StatCard title="Registered Participants" value={stats.registered} icon={Users} color="#2563EB" bgColor="#EFF6FF" />
          <StatCard title="Attendance Rows Uploaded" value={stats.attendanceUploaded} icon={UploadCloud} color="#8B5CF6" bgColor="#F3E8FF" />
          <StatCard title="Certificates Generated" value={stats.generated} icon={Award} color="#CA8A38" bgColor="#FAF5EC" />
          <StatCard title="Processing" value={stats.processing} icon={FileCheck2} color="#0891B2" bgColor="#ECFEFF" />
          <StatCard title="Emails Sent" value={stats.emailsSent} icon={Mail} color="#059669" bgColor="#ECFDF5" />
          <StatCard title="Emails Failed" value={stats.emailsFailed} icon={MailWarning} color="#DC2626" bgColor="#FEF2F2" />
        </div>

        {/* config */}
        {cfg && (
          <div style={card}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2347', margin: '0 0 4px' }}>Certificate Settings</h3>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '0 0 12px' }}>
              Event name and dates are read-only — pulled from the event.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '4px 32px' }}>
              <Toggle label="Certificates Enabled" checked={!!cfg.certificateEnabled} onChange={(v) => setCfg({ ...cfg, certificateEnabled: v })} />
              <Toggle label="Require Registration Match" checked={!!cfg.requireRegistrationMatch} onChange={(v) => setCfg({ ...cfg, requireRegistrationMatch: v })} />
              <Toggle label="Automatically Send Certificate Email" checked={!!cfg.autoSendEmail} onChange={(v) => setCfg({ ...cfg, autoSendEmail: v })} />
              <div style={{ padding: '10px 0' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Certificate Template</div>
                <select className="admin-select" value={cfg.templateId || ''} onChange={(e) => setCfg({ ...cfg, templateId: e.target.value })}>
                  <option value="">— Select template —</option>
                  {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div style={{ padding: '10px 0' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Eligibility Method</div>
                <input className="admin-input" value="Uploaded Attendance Sheet" readOnly />
              </div>
              <div style={{ padding: '10px 0' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Certificate ID Format</div>
                <input className="admin-input" value={cfg.idFormat || ''} onChange={(e) => setCfg({ ...cfg, idFormat: e.target.value })} placeholder="{org}-{event}-{year}-{seq}" />
              </div>
              <div style={{ padding: '10px 0' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Org Code / Event Code</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="admin-input" value={cfg.orgCode || ''} onChange={(e) => setCfg({ ...cfg, orgCode: e.target.value })} placeholder="ELA" />
                  <input className="admin-input" value={cfg.eventCode || ''} onChange={(e) => setCfg({ ...cfg, eventCode: e.target.value })} placeholder="auto" />
                </div>
              </div>
            </div>
            <div style={{ marginTop: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button type="button" className="btn-primary-gold" onClick={saveConfig} disabled={savingCfg}>
                <Save size={15} /> {savingCfg ? 'Saving…' : 'Save Settings'}
              </button>
              <Link to="/admin/certificate-templates" style={{ fontSize: '13px', fontWeight: 700, color: '#CA8A38' }}>Manage templates →</Link>
              {!templateConfigured && <span style={{ fontSize: '12.5px', color: '#DC2626' }}>No template selected.</span>}
            </div>
          </div>
        )}

        {/* certificate table */}
        <div style={{ ...card, padding: 0 }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <input
              className="admin-input" style={{ maxWidth: '320px' }}
              placeholder="Search participant, email or certificate ID…"
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
            <div className="admin-tabs" style={{ marginBottom: 0 }}>
              {['all', 'generated', 'email_sent', 'email_failed', 'revoked'].map((f) => (
                <button key={f} type="button" className={`admin-tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                  {f === 'all' ? 'All' : f.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          {certificates.length === 0 ? (
            <EmptyState title="No certificates generated yet" description="Upload an attendance sheet, review the participants, then generate certificates." />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Participant</th><th>Email</th><th>Certificate ID</th><th>Status</th>
                    <th>Email</th><th>Issued</th><th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 700, color: '#0A2347' }}>{c.participantName}</td>
                      <td style={{ color: '#475569' }}>{c.participantEmail}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '12.5px' }}>{c.certificateNumber}</td>
                      <td><StatusBadge status={c.status === 'revoked' ? 'cancelled' : (c.pdfPath ? 'published' : 'processing')} /></td>
                      <td><StatusBadge status={c.emailStatus === 'SENT' ? 'delivered' : c.emailStatus === 'FAILED' ? 'failed' : 'pending'} /></td>
                      <td style={{ fontSize: '12.5px', color: '#64748B' }}>{(c.issuedAt || '').slice(0, 10)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <ActionMenu items={[
                          { label: 'View / Verify', icon: Eye, to: `/verify-certificate?id=${encodeURIComponent(c.certificateNumber)}`, target: '_blank' },
                          {
                            label: 'Download PDF', icon: Download, onClick: () =>
                              downloadCertificatePdf(c.id, `${c.certificateNumber}.pdf`).catch((e) => setError(e.message))
                          },
                          { label: busy === c.id ? 'Sending…' : 'Resend Email', icon: Send, onClick: () => doResend(c.id) },
                          { divider: true },
                          ...(c.status === 'revoked' ? [] : [{ label: 'Revoke', icon: Ban, danger: true, onClick: () => setRevokeFor(c.id) }])
                        ]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* audit trail */}
        {audit.length > 0 && (
          <div style={card}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0A2347', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} /> Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px', color: '#475569' }}>
              {audit.map((a) => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <span><strong>{a.action}</strong> — {a.actor}</span>
                  <span style={{ color: '#94A3B8' }}>{(a.createdAt || '').replace('T', ' ').slice(0, 16)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {revokeFor && (
        <div onClick={() => setRevokeFor(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(8,35,73,0.6)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '28px', maxWidth: '440px', width: '100%' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0A2347', margin: '0 0 8px' }}>Revoke Certificate</h3>
            <p style={{ fontSize: '13.5px', color: '#64748B', margin: '0 0 14px' }}>
              The certificate stays on record for audit, and public verification will show it as revoked.
            </p>
            <textarea
              className="admin-textarea" rows={3} placeholder="Reason (required) — e.g. Certificate issued to incorrect participant."
              value={revokeReason} onChange={(e) => setRevokeReason(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
              <button type="button" className="btn-secondary-outline" onClick={() => setRevokeFor(null)}>Cancel</button>
              <button
                type="button"
                onClick={doRevoke}
                disabled={!revokeReason.trim()}
                style={{ backgroundColor: '#DC2626', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 700, cursor: revokeReason.trim() ? 'pointer' : 'not-allowed', opacity: revokeReason.trim() ? 1 : 0.6 }}
              >
                Revoke Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
