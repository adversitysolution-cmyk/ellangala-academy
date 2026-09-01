import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { certificateService } from '../services/certificateService';
import { UploadCloud, ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

const card = { backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px' };
const APP_FIELDS = [
  { key: 'name', label: 'Participant Name', required: true },
  { key: 'email', label: 'Email', required: true },
  { key: 'phone', label: 'Phone', required: false }
];
const STATUS_COLORS = {
  READY: '#059669', INVALID: '#DC2626', DUPLICATE: '#CA8A38',
  UNMATCHED: '#8B5CF6', ALREADY_CERTIFIED: '#2563EB', EXCLUDED: '#64748B'
};

export default function CertificateImportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState('upload'); // upload | map | review | done
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [uploadInfo, setUploadInfo] = useState(null);
  const [mapping, setMapping] = useState({ name: '', email: '', phone: '' });
  const [phoneRequired, setPhoneRequired] = useState(false);
  const [review, setReview] = useState(null); // { batch, counts, participants }
  const [showConfirm, setShowConfirm] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setError(''); setBusy(true);
    try {
      const info = await certificateService.uploadSpreadsheet(id, file);
      setUploadInfo(info);
      setMapping({ name: info.autoMapping.name || '', email: info.autoMapping.email || '', phone: info.autoMapping.phone || '' });
      setStep('map');
    } catch (e) { setError(e.message); }
    setBusy(false);
  };

  const applyMapping = async () => {
    setError('');
    if (!mapping.name) return setError('Please map the Participant Name column.');
    if (!mapping.email) return setError('Please map the Email column.');
    setBusy(true);
    try {
      const res = await certificateService.setColumnMapping(uploadInfo.batch.id, mapping, phoneRequired);
      setReview(res);
      setStep('review');
    } catch (e) { setError(e.message); }
    setBusy(false);
  };

  const toggleExclude = async (p) => {
    try {
      const updated = await certificateService.updateParticipant(p.id, {
        action: p.status === 'EXCLUDED' ? 'approve' : 'exclude'
      });
      setReview((r) => ({ ...r, participants: r.participants.map((x) => (x.id === p.id ? updated : x)) }));
    } catch (e) { setError(e.message); }
  };

  const editField = async (p, field, value) => {
    try {
      const updated = await certificateService.updateParticipant(p.id, { [field]: value });
      setReview((r) => ({ ...r, participants: r.participants.map((x) => (x.id === p.id ? updated : x)) }));
    } catch (e) { setError(e.message); }
  };

  const generate = async () => {
    setBusy(true); setError('');
    try {
      const res = await certificateService.generate(uploadInfo.batch.id);
      navigate(`/admin/events/${id}/certificates/batches/${res.batchId}`);
    } catch (e) { setError(e.message); setBusy(false); setShowConfirm(false); }
  };

  const counts = review?.participants?.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {}) || {};
  const eligibleCount = review?.participants?.filter((p) => p.eligible && p.status === 'READY').length || 0;

  return (
    <AdminLayout title="Upload Attendance Sheet" subtitle="Google Form → Google Sheet → download XLSX/CSV → upload here.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '960px' }}>
        <Link to={`/admin/events/${id}/certificates`} style={{ color: '#64748B', fontWeight: 700, fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={16} /> Back to Certificate Dashboard
        </Link>

        {/* step indicator */}
        <div style={{ display: 'flex', gap: '8px', fontSize: '12.5px', fontWeight: 700, color: '#94A3B8' }}>
          {['upload', 'map', 'review'].map((s, i) => (
            <span key={s} style={{ color: step === s ? '#CA8A38' : (['upload', 'map', 'review'].indexOf(step) > i ? '#059669' : '#94A3B8') }}>
              {i + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
              {i < 2 && <span style={{ margin: '0 6px', color: '#CBD5E1' }}>→</span>}
            </span>
          ))}
        </div>

        {error && <div style={{ ...card, color: '#DC2626', padding: '12px 20px', display: 'flex', gap: '8px', alignItems: 'center' }}><AlertTriangle size={16} />{error}</div>}

        {step === 'upload' && (
          <label style={{ ...card, borderStyle: 'dashed', borderColor: '#CBD5E1', textAlign: 'center', cursor: 'pointer', padding: '48px 24px' }}>
            <UploadCloud size={40} style={{ color: '#CA8A38' }} />
            <div style={{ fontWeight: 800, color: '#0A2347', margin: '12px 0 4px' }}>
              {busy ? 'Uploading…' : 'Choose a .csv, .xlsx or .xls file'}
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748B' }}>Max 5 MB. Normally has Full Name, Email, Phone columns.</div>
            <input type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }} disabled={busy}
              onChange={(e) => handleFile(e.target.files?.[0])} />
          </label>
        )}

        {step === 'map' && uploadInfo && (
          <div style={card}>
            <h3 style={{ margin: '0 0 4px', fontWeight: 800, color: '#0A2347' }}>Map spreadsheet columns</h3>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '0 0 16px' }}>{uploadInfo.totalRows} rows detected in <strong>{uploadInfo.batch.fileName}</strong>.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {APP_FIELDS.map((f) => (
                <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '160px', fontSize: '13.5px', fontWeight: 700, color: '#334155' }}>
                    {f.label}{f.required || (f.key === 'phone' && phoneRequired) ? <span style={{ color: '#DC2626' }}> *</span> : ''}
                  </div>
                  <ArrowRight size={14} style={{ color: '#94A3B8' }} />
                  <select className="admin-select" style={{ maxWidth: '320px' }}
                    value={mapping[f.key]} onChange={(e) => setMapping({ ...mapping, [f.key]: e.target.value })}>
                    <option value="">{f.key === 'phone' ? '— Ignore —' : '— Select column —'}</option>
                    {uploadInfo.headers.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              ))}
              <label style={{ fontSize: '13px', color: '#334155', display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                <input type="checkbox" checked={phoneRequired} onChange={(e) => setPhoneRequired(e.target.checked)} />
                Phone is required
              </label>
            </div>
            <div style={{ marginTop: '18px', overflowX: 'auto' }}>
              <table className="admin-table">
                <thead><tr>{uploadInfo.headers.map((h) => <th key={h}>{h}</th>)}</tr></thead>
                <tbody>
                  {uploadInfo.sampleRows.map((row, i) => (
                    <tr key={i}>{uploadInfo.headers.map((h) => <td key={h} style={{ fontSize: '12.5px' }}>{row[h]}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="button" className="btn-primary-gold" style={{ marginTop: '16px' }} onClick={applyMapping} disabled={busy}>
              {busy ? 'Validating…' : 'Validate & Preview'}
            </button>
          </div>
        )}

        {step === 'review' && review && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              {['READY', 'UNMATCHED', 'INVALID', 'DUPLICATE', 'ALREADY_CERTIFIED', 'EXCLUDED'].map((s) => (
                <div key={s} style={{ ...card, padding: '14px 16px' }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: STATUS_COLORS[s] }}>{counts[s] || 0}</div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'capitalize' }}>{s.replace(/_/g, ' ').toLowerCase()}</div>
                </div>
              ))}
            </div>

            <div style={{ ...card, padding: 0, overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Phone</th><th>Registration</th><th>Status</th><th style={{ textAlign: 'right' }}>Action</th></tr>
                </thead>
                <tbody>
                  {review.participants.map((p) => (
                    <tr key={p.id} style={{ opacity: p.status === 'EXCLUDED' ? 0.5 : 1 }}>
                      <td><input className="admin-input" style={{ minWidth: '140px' }} defaultValue={p.name} onBlur={(e) => e.target.value !== p.name && editField(p, 'name', e.target.value)} /></td>
                      <td><input className="admin-input" style={{ minWidth: '180px' }} defaultValue={p.email} onBlur={(e) => e.target.value !== p.email && editField(p, 'email', e.target.value)} /></td>
                      <td><input className="admin-input" style={{ minWidth: '110px' }} defaultValue={p.phone} onBlur={(e) => e.target.value !== p.phone && editField(p, 'phone', e.target.value)} /></td>
                      <td style={{ fontSize: '12px', color: '#64748B' }}>{p.registrationId || (p.status === 'UNMATCHED' ? 'Not registered' : '—')}</td>
                      <td>
                        <span style={{ fontSize: '11.5px', fontWeight: 800, color: STATUS_COLORS[p.status] }}>{p.status.replace(/_/g, ' ')}</span>
                        {p.validationErrors?.length > 0 && <div style={{ fontSize: '11px', color: '#DC2626' }}>{p.validationErrors.join(', ')}</div>}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button type="button" className="btn-secondary-outline" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => toggleExclude(p)}>
                          {p.status === 'EXCLUDED' ? 'Include' : 'Exclude'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button type="button" className="btn-secondary-outline" onClick={() => setStep('map')}>Back to mapping</button>
              <button type="button" className="btn-primary-gold" disabled={eligibleCount === 0} onClick={() => setShowConfirm(true)}>
                Generate {eligibleCount} Certificates
              </button>
              {eligibleCount === 0 && <span style={{ fontSize: '12.5px', color: '#DC2626' }}>No eligible participants found.</span>}
            </div>
          </>
        )}
      </div>

      {showConfirm && (
        <div onClick={() => !busy && setShowConfirm(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(8,35,73,0.6)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '28px', maxWidth: '460px', width: '100%' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#CA8A38', marginBottom: '10px' }}>
              <CheckCircle2 size={24} /><h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0A2347' }}>Confirm generation</h3>
            </div>
            <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>
              You are about to generate certificates for <strong>{eligibleCount} participants</strong>.<br />
              Event: <strong>{uploadInfo?.event?.title}</strong>
            </p>
            <p style={{ fontSize: '12.5px', color: '#64748B' }}>
              Certificates already issued to a participant will not be duplicated. This runs in the background.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button type="button" className="btn-secondary-outline" onClick={() => setShowConfirm(false)} disabled={busy}>Cancel</button>
              <button type="button" className="btn-primary-gold" onClick={generate} disabled={busy}>
                {busy ? 'Starting…' : `Generate ${eligibleCount} Certificates`}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
