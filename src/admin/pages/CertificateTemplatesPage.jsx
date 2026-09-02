import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import EmptyState from '../components/EmptyState';
import { certificateService } from '../services/certificateService';
import { uploadService } from '../services/uploadService';
import { Plus, Save, FileText } from 'lucide-react';

const card = { backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px' };
const PLACEHOLDERS = ['{{participant_name}}', '{{event_name}}', '{{event_date_text}}', '{{start_date}}', '{{end_date}}',
  '{{organization_name}}', '{{venue}}', '{{certificate_id}}', '{{issue_date}}', '{{verification_url}}'];

const EMPTY = {
  name: '', organizationName: 'Ellangala’s Academy', signatoryName: 'Dr. Naveen Ellangala', signatoryTitle: 'Founder',
  address: '', headingText: 'Certificate of Completion',
  bodyText: 'This is to certify that {{participant_name}} has successfully completed the "{{event_name}}" course at {{organization_name}}, {{event_date_text}}.',
  logoUrl: '', signatureUrl: '', sealUrl: '', backgroundUrl: '',
  renderMode: 'classic', overlayConfig: null, isActive: true
};

// Overlay-mode position knobs (top-left PDF points). Blank = built-in default.
const OVERLAY_FIELDS = [
  ['name.x', 'Name X', 300], ['name.y', 'Name Y', 450], ['name.size', 'Name size', 17],
  ['body.x', 'Body X', 78], ['body.y', 'Body Y', 506], ['body.size', 'Body size', 16], ['body.width', 'Body box width', 440],
  ['qr.x', 'QR X', 275], ['qr.y', 'QR Y', 600], ['qr.size', 'QR size', 52],
  ['certId.x', 'Cert-No X', 219], ['certId.y', 'Cert-No Y', 664], ['certId.size', 'Cert-No size', 8]
];
// Only needed when the uploaded design still has the old body text baked in.
const ERASE_FIELDS = [
  ['erase.x', 'Erase X', ''], ['erase.y', 'Erase Y', ''],
  ['erase.width', 'Erase W', ''], ['erase.height', 'Erase H', '']
];
const getPath = (o, p) => p.split('.').reduce((x, k) => (x == null ? undefined : x[k]), o);
const setPath = (o, p, v) => {
  const ks = p.split('.'); const out = JSON.parse(JSON.stringify(o || {})); let cur = out;
  ks.slice(0, -1).forEach((k) => { cur[k] = cur[k] || {}; cur = cur[k]; });
  if (v === '' || v == null || Number.isNaN(v)) delete cur[ks[ks.length - 1]];
  else cur[ks[ks.length - 1]] = v;
  return out;
};

export default function CertificateTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => certificateService.getTemplates().then(setTemplates).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const uploadAsset = async (k, file) => {
    if (!file) return;
    try { const { url } = await uploadService.uploadImage(file); set(k, url); }
    catch (e) { setError(e.message); }
  };

  const save = async () => {
    if (!form.name.trim()) return setError('Template name is required.');
    setSaving(true); setError('');
    try {
      if (form.id) await certificateService.updateTemplate(form.id, form);
      else await certificateService.createTemplate(form);
      setForm(null);
      load();
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  return (
    <AdminLayout
      title="Certificate Templates"
      subtitle="Reusable certificate design + content. Event name and dates are filled in automatically at generation."
      action={!form && <button type="button" className="btn-primary-gold" onClick={() => setForm({ ...EMPTY })}><Plus size={16} /> New Template</button>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '820px' }}>
        {error && <div style={{ ...card, color: '#DC2626', padding: '12px 20px' }}>{error}</div>}

        {form ? (
          <div style={card}>
            <h3 style={{ margin: '0 0 16px', fontWeight: 800, color: '#0A2347' }}>{form.id ? 'Edit' : 'New'} Template</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {[
                ['name', 'Template Name'], ['organizationName', 'Organization / Academy Name'],
                ['signatoryName', 'Signatory Name'], ['signatoryTitle', 'Signatory Title'],
                ['address', 'Address'], ['headingText', 'Certificate Heading']
              ].map(([k, label]) => (
                <label key={k} style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                  {label}
                  <input className="admin-input" style={{ marginTop: '4px' }} value={form[k] || ''} onChange={(e) => set(k, e.target.value)} />
                </label>
              ))}
            </div>

            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginTop: '14px' }}>
              Body Text
              <textarea className="admin-textarea" rows={4} style={{ marginTop: '4px' }} value={form.bodyText} onChange={(e) => set('bodyText', e.target.value)} />
            </label>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '6px' }}>
              Placeholders: {PLACEHOLDERS.map((p) => <code key={p} style={{ background: '#F1F5F9', padding: '1px 5px', borderRadius: '4px', marginRight: '4px' }}>{p}</code>)}
            </div>

            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginTop: '16px' }}>
              Render mode
              <select className="admin-select" style={{ marginTop: '4px' }} value={form.renderMode || 'classic'} onChange={(e) => set('renderMode', e.target.value)}>
                <option value="classic">Classic — generate the layout (uses the fields above)</option>
                <option value="overlay">Overlay — stamp onto an uploaded blank design</option>
              </select>
            </label>
            {form.renderMode === 'overlay' && (
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '6px' }}>
                Upload a <strong>blank</strong> version of your certificate as the <strong>Background</strong>
                (PNG/JPG, A4 portrait) — frame, logos, headings, the “Mr./Ms.” line and signature, but
                <strong> no participant name, programme name or dates</strong>. Those are stamped on per event:
                participant name, the body sentence (below), a QR code and the certificate number. Tune
                positions in PDF points (blank = default); generate one test and adjust.
              </div>
            )}
            {form.renderMode === 'overlay' && (
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Body lines (overlay) — stacked &amp; centred; the 2nd line prints in gold
                </div>
                {[
                  ['body.pre', 'has successfully completed the'],
                  ['body.title', '“{{event_name}}”'],
                  ['body.mid', 'course at {{organization_name}},'],
                  ['body.post', '{{event_date_text}}.']
                ].map(([path, ph]) => (
                  <input
                    key={path} className="admin-input" style={{ marginBottom: '6px' }}
                    placeholder={ph}
                    value={getPath(form.overlayConfig, path) ?? ''}
                    onChange={(e) => set('overlayConfig', setPath(form.overlayConfig, path, e.target.value || ''))}
                  />
                ))}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '16px' }}>
              {[['logoUrl', 'Logo'], ['signatureUrl', 'Signature'], ['sealUrl', 'Seal'], ['backgroundUrl', form.renderMode === 'overlay' ? 'Background (blank design — PDF or PNG)' : 'Background']].map(([k, label]) => {
                const isBg = k === 'backgroundUrl' && form.renderMode === 'overlay';
                return (
                  <div key={k}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>{label}</div>
                    {form[k] && !/\.pdf($|\?)/i.test(form[k])
                      ? <img src={form[k]} alt={label} style={{ maxHeight: '48px', display: 'block', marginBottom: '4px' }} />
                      : (form[k] ? <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>PDF: {form[k].split('/').pop()}</div> : null)}
                    <input type="file" accept={isBg ? 'image/*,application/pdf' : 'image/*'} onChange={(e) => uploadAsset(k, e.target.files?.[0])} style={{ fontSize: '12px' }} />
                  </div>
                );
              })}
            </div>

            {form.renderMode === 'overlay' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginTop: '14px' }}>
                {OVERLAY_FIELDS.map(([path, label, def]) => (
                  <label key={path} style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                    {label}
                    <input
                      className="admin-input" type="number" step="any" style={{ marginTop: '3px' }}
                      placeholder={String(def)}
                      value={getPath(form.overlayConfig, path) ?? ''}
                      onChange={(e) => set('overlayConfig', setPath(form.overlayConfig, path, e.target.value === '' ? '' : Number(e.target.value)))}
                    />
                  </label>
                ))}
              </div>
            )}
            {form.renderMode === 'overlay' && (
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '6px' }}>
                  <strong>Erase box</strong> — only if the uploaded design still has old body text baked in.
                  Set X/Y/W/H (points) to cover it, and a paper colour to match. Leave blank for a truly blank design.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
                  {ERASE_FIELDS.map(([path, label]) => (
                    <label key={path} style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                      {label}
                      <input
                        className="admin-input" type="number" step="any" style={{ marginTop: '3px' }}
                        value={getPath(form.overlayConfig, path) ?? ''}
                        onChange={(e) => set('overlayConfig', setPath(form.overlayConfig, path, e.target.value === '' ? '' : Number(e.target.value)))}
                      />
                    </label>
                  ))}
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                    Erase colour
                    <input
                      className="admin-input" style={{ marginTop: '3px' }} placeholder="#FBFCFB"
                      value={getPath(form.overlayConfig, 'erase.color') ?? ''}
                      onChange={(e) => set('overlayConfig', setPath(form.overlayConfig, 'erase.color', e.target.value || ''))}
                    />
                  </label>
                </div>
              </div>
            )}

            <label style={{ fontSize: '13px', color: '#334155', display: 'flex', gap: '8px', alignItems: 'center', marginTop: '14px' }}>
              <input type="checkbox" checked={!!form.isActive} onChange={(e) => set('isActive', e.target.checked)} /> Active (available for events)
            </label>

            <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
              <button type="button" className="btn-primary-gold" onClick={save} disabled={saving}><Save size={15} /> {saving ? 'Saving…' : 'Save Template'}</button>
              <button type="button" className="btn-secondary-outline" onClick={() => setForm(null)}>Cancel</button>
            </div>
          </div>
        ) : templates.length === 0 ? (
          <EmptyState title="No certificate template configured." description="Create a template to enable certificate generation for your events." />
        ) : (
          <div style={{ ...card, padding: 0, overflowX: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th>Template</th><th>Organization</th><th>Active</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
              <tbody>
                {templates.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 700, color: '#0A2347', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={15} /> {t.name}</td>
                    <td style={{ color: '#475569' }}>{t.organizationName}</td>
                    <td>{t.isActive ? 'Yes' : 'No'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button type="button" className="btn-secondary-outline" style={{ padding: '4px 12px', fontSize: '12.5px' }} onClick={() => setForm(t)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
