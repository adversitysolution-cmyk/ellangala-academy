import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { certificateService } from '../services/certificateService';
import { ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';

const card = { backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '24px' };

export default function CertificateBatchPage() {
  const { id, batchId } = useParams();
  const [state, setState] = useState(null);
  const [error, setError] = useState('');
  const timer = useRef(null);
  const failures = useRef(0);

  const stopPolling = () => {
    if (timer.current) { clearInterval(timer.current); timer.current = null; }
  };

  const poll = async () => {
    try {
      const res = await certificateService.getBatchProgress(batchId);
      failures.current = 0;
      setError('');
      setState(res);
      const { generated, failed, total } = res.progress;
      // total === 0: generation never queued any job (e.g. everyone already certified), nothing to wait for.
      if (total === 0 || generated + failed >= total) stopPolling();
    } catch (e) {
      setError(e.message || 'Could not load batch progress.');
      if (++failures.current >= 3) stopPolling(); // give up after 3 consecutive failures; user can reload
    }
  };

  useEffect(() => {
    poll();
    timer.current = setInterval(poll, 2500);
    return () => timer.current && clearInterval(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId]);

  const retry = async () => {
    try {
      await certificateService.retryBatch(batchId);
      failures.current = 0;
      if (!timer.current) timer.current = setInterval(poll, 2500);
      poll();
    } catch (e) { setError(e.message || 'Retry failed.'); }
  };

  const p = state?.progress || { generated: 0, processing: 0, failed: 0, total: 0 };
  const done = p.generated + p.failed;
  const pct = p.total ? Math.round((done / p.total) * 100) : 0;
  const complete = p.total > 0 && done >= p.total;
  const empty = state && p.total === 0;

  return (
    <AdminLayout title="Certificate Batch" subtitle={`Batch ${batchId}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '720px' }}>
        <Link to={`/admin/events/${id}/certificates`} style={{ color: '#64748B', fontWeight: 700, fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={16} /> Back to Certificate Dashboard
        </Link>

        {error && <div style={{ ...card, color: '#DC2626', padding: '12px 20px' }}>{error}</div>}

        <div style={card}>
          {empty
            ? <div style={{ fontWeight: 800, color: '#0A2347', marginBottom: '12px' }}>No new certificates were generated for this batch. Everyone in the sheet already had one.</div>
            : complete
            ? <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: '#059669', fontWeight: 800, marginBottom: '12px' }}><CheckCircle2 size={22} /> Batch processing complete</div>
            : <div style={{ fontWeight: 800, color: '#0A2347', marginBottom: '12px' }}>Processing certificates…</div>}

          <div style={{ height: '14px', borderRadius: '999px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', backgroundColor: p.failed && complete ? '#CA8A38' : '#059669', transition: 'width .4s' }} />
          </div>
          <div style={{ fontSize: '13px', color: '#64748B', marginTop: '8px' }}>
            {p.generated} / {p.total} generated{p.failed ? ` • ${p.failed} failed` : ''}{p.processing ? ` • ${p.processing} in queue` : ''} ({pct}%)
          </div>

          {p.failed > 0 && (
            <button type="button" className="btn-secondary-outline" style={{ marginTop: '16px' }} onClick={retry}>
              <RefreshCw size={15} /> Retry {p.failed} Failed
            </button>
          )}
          {complete && (
            <Link to={`/admin/events/${id}/certificates`} className="btn-primary-gold" style={{ marginTop: '16px', display: 'inline-flex' }}>
              View Certificates
            </Link>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
