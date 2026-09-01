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
  logoUrl: '', signatureUrl: '', sealUrl: '', backgroundUrl: '', isActive: true
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '16px' }}>
              {[['logoUrl', 'Logo'], ['signatureUrl', 'Signature'], ['sealUrl', 'Seal'], ['backgroundUrl', 'Background']].map(([k, label]) => (
                <div key={k}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>{label}</div>
                  {form[k] ? <img src={form[k]} alt={label} style={{ maxHeight: '48px', display: 'block', marginBottom: '4px' }} /> : null}
                  <input type="file" accept="image/*" onChange={(e) => uploadAsset(k, e.target.files?.[0])} style={{ fontSize: '12px' }} />
                </div>
              ))}
            </div>

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
