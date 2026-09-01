import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import HeaderOne from '../components/layout/HeaderOne';
import FooterOne from '../components/layout/FooterOne';
import PageHeader from '../components/common/PageHeader';
import Preloader from '../components/layout/Preloader';
import CustomCursor from '../components/layout/CustomCursor';
import MobileNav from '../components/layout/MobileNav';
import SearchPopup from '../components/layout/SearchPopup';
import ScrollToTop from '../components/layout/ScrollToTop';
import { useUterpyPlugins } from '../hooks/useUterpyPlugins';
import SEO from '../seo/SEO';
import { certificateVerifyService } from '../admin/services/certificateService';
import { ShieldCheck, ShieldAlert, ShieldX, Search } from 'lucide-react';

const box = { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '36px', border: '1px solid #ECE7DE', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' };
const row = { display: 'flex', justifyContent: 'space-between', gap: '16px', fontSize: '14px', color: '#334155', padding: '8px 0', borderBottom: '1px solid #F1F5F9' };

function Result({ result }) {
  if (!result) return null;
  if (result.status === 'NOT_FOUND') {
    return (
      <div style={{ ...box, marginTop: '24px', textAlign: 'center' }}>
        <ShieldX size={40} style={{ color: '#DC2626' }} />
        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F231B', margin: '12px 0 4px' }}>Certificate Not Found</h3>
        <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>No certificate matches that ID. Check the ID and try again.</p>
      </div>
    );
  }
  const revoked = result.status === 'REVOKED';
  return (
    <div style={{ ...box, marginTop: '24px', borderColor: revoked ? '#FCA5A5' : '#A7F3D0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: revoked ? '#DC2626' : '#059669', marginBottom: '18px' }}>
        {revoked ? <ShieldAlert size={26} /> : <ShieldCheck size={26} />}
        <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>{revoked ? 'Certificate Revoked' : 'Valid Certificate'}</h3>
      </div>
      <div style={row}><span>Participant Name</span><strong>{result.participantName}</strong></div>
      <div style={row}><span>Event</span><strong>{result.eventName}</strong></div>
      <div style={row}><span>Event Date</span><strong>{result.eventDateText}</strong></div>
      <div style={row}><span>Certificate ID</span><strong style={{ fontFamily: 'monospace' }}>{result.certificateId}</strong></div>
      <div style={{ ...row, borderBottom: 'none' }}><span>Issued By</span><strong>{result.issuedBy}</strong></div>
      {revoked && result.revocationReason && (
        <p style={{ marginTop: '14px', fontSize: '13px', color: '#DC2626' }}>Reason: {result.revocationReason}</p>
      )}
    </div>
  );
}

export default function VerifyCertificate() {
  useUterpyPlugins();
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const [certId, setCertId] = useState(searchParams.get('id') || '');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const lookupByNumber = useCallback(async (number) => {
    setError(''); setResult(null); setLoading(true);
    try { setResult(await certificateVerifyService.byNumber(number.trim())); }
    catch (e) { setError(e.message); }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      setLoading(true);
      certificateVerifyService.byToken(token)
        .then(setResult).catch((e) => setError(e.message)).finally(() => setLoading(false));
    } else if (searchParams.get('id')) {
      lookupByNumber(searchParams.get('id'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <>
      <CustomCursor />
      <Preloader />
      <div className="page-wrapper">
        <SEO title="Verify a Certificate | Ellangala’s Academy" canonical="/verify-certificate" noindex={true} />
        <HeaderOne />
        <PageHeader title="Certificate Verification" breadcrumb="Verify Certificate" />

        <section style={{ paddingTop: '60px', paddingBottom: '90px', backgroundColor: '#FAF8F5' }}>
          <div className="container" style={{ maxWidth: '640px' }}>
            {!token && (
              <div style={box}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#FAF5EC', color: '#CA8A38', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <ShieldCheck size={26} />
                  </div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F231B', marginBottom: '6px' }}>Verify a Certificate</h2>
                  <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>Enter the Certificate ID printed on the certificate, or scan its QR code.</p>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); lookupByNumber(certId); }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <input
                    type="text" required placeholder="e.g. ELA-BML-2026-000147"
                    value={certId} onChange={(e) => setCertId(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14.5px', outline: 'none' }}
                  />
                  {error && <p style={{ color: '#DC2626', fontSize: '13.5px', margin: 0 }}>{error}</p>}
                  <button type="submit" disabled={loading} className="thm-btn" style={{ padding: '14px 20px', fontSize: '14.5px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Search size={16} /><span>{loading ? 'Verifying…' : 'Verify Certificate'}</span>
                  </button>
                </form>
              </div>
            )}

            {token && loading && <div style={{ ...box, textAlign: 'center', color: '#64748B' }}>Verifying certificate…</div>}
            {token && error && <div style={{ ...box, textAlign: 'center', color: '#DC2626' }}>{error}</div>}
            <Result result={result} />
          </div>
        </section>

        <FooterOne hideSubscribe={true} />
      </div>
      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
