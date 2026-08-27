import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import StatusBadge from '../components/StatusBadge';
import { enrollmentService } from '../services/enrollmentService';
import { ArrowLeft, Save, User, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return dateStr;
  }
}

export default function EnrollmentDetailPage() {
  const { id } = useParams();
  const [enrollment, setEnrollment] = useState(null);
  const [status, setStatus] = useState('New');
  const [internalNotes, setInternalNotes] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    enrollmentService.getEnrollmentById(id).then((item) => {
      if (item) {
        setEnrollment(item);
        setStatus(item.status || 'New');
        setInternalNotes(item.internalNotes || '');
      }
    }).catch(() => {});
  }, [id]);

  if (!enrollment) {
    return (
      <AdminLayout title="Enrollment Details" subtitle="Record not found">
        <div className="admin-card" style={{ padding: '40px', textAlign: 'center' }}>
          <h3>Enrollment Record Not Found</h3>
          <p style={{ color: '#667085', margin: '12px 0 20px' }}>The requested enrollment ID could not be found.</p>
          <Link to="/admin/enrollments" className="btn-primary-gold">Back to Enrollments</Link>
        </div>
      </AdminLayout>
    );
  }

  const handleSave = async () => {
    await enrollmentService.updateEnrollmentStatus(enrollment.id, status, internalNotes);
    setToastMessage('Enrollment record updated successfully.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <AdminLayout
      title={`Enrollment: ${enrollment.id}`}
      subtitle={`Submitted ${formatDate(enrollment.submittedAt)}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px' }}>
        {/* Toast Notification */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              top: '84px',
              right: '32px',
              backgroundColor: '#047857',
              color: '#FFFFFF',
              padding: '12px 20px',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '700',
              fontSize: '14px'
            }}
          >
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/admin/enrollments" className="btn-secondary-outline">
            <ArrowLeft size={16} />
            <span>Back to All Enrollments</span>
          </Link>
          <StatusBadge status={status} />
        </div>

        <div className="row gy-4">
          {/* Contact Information Card */}
          <div className="col-md-6">
            <div className="admin-card" style={{ height: '100%' }}>
              <div className="admin-card__header">
                <h3 className="admin-card__title">Contact Information</h3>
              </div>
              <div className="admin-card__body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <User size={18} style={{ color: '#CA8A38' }} />
                  <div>
                    <div style={{ fontSize: '12px', color: '#667085', fontWeight: '700' }}>FULL NAME</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A2347' }}>{enrollment.fullName}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Phone size={18} style={{ color: '#CA8A38' }} />
                  <div>
                    <div style={{ fontSize: '12px', color: '#667085', fontWeight: '700' }}>PHONE NUMBER</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A2347' }}>{enrollment.phone}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Mail size={18} style={{ color: '#CA8A38' }} />
                  <div>
                    <div style={{ fontSize: '12px', color: '#667085', fontWeight: '700' }}>EMAIL ADDRESS</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A2347' }}>{enrollment.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MapPin size={18} style={{ color: '#CA8A38' }} />
                  <div>
                    <div style={{ fontSize: '12px', color: '#667085', fontWeight: '700' }}>CITY / LOCATION</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A2347' }}>{enrollment.city || '-'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interested Program & Message */}
          <div className="col-md-6">
            <div className="admin-card" style={{ height: '100%' }}>
              <div className="admin-card__header">
                <h3 className="admin-card__title">Interested Program / Service</h3>
              </div>
              <div className="admin-card__body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#667085', fontWeight: '700' }}>PROGRAM / EVENT</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#0A2347', marginTop: '4px' }}>
                    {enrollment.interest || enrollment.program}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: '#667085', fontWeight: '700' }}>ENQUIRY TYPE</div>
                  <span style={{ backgroundColor: '#FAF8F3', color: '#0A2347', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', border: '1px solid #E5E7EB', display: 'inline-block', marginTop: '4px' }}>
                    {enrollment.type || enrollment.sourceType || 'Workshop'}
                  </span>
                </div>

                {enrollment.message && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#667085', fontWeight: '700' }}>CUSTOMER MESSAGE</div>
                    <div style={{ backgroundColor: '#FAF8F3', padding: '14px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', color: '#334155', marginTop: '4px', fontStyle: 'italic' }}>
                      "{enrollment.message}"
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status & Internal Notes Card */}
        <div className="admin-card">
          <div className="admin-card__header">
            <h3 className="admin-card__title">Status &amp; Internal Notes</h3>
          </div>
          <div className="admin-card__body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="admin-form-group" style={{ maxWidth: '300px' }}>
              <label className="admin-label">Update Enquiry Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="admin-select"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Follow-Up">Follow-Up</option>
                <option value="Enrolled">Enrolled</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Internal Notes (Visible only to Admin)</label>
              <textarea
                rows={4}
                placeholder="Add notes about calls, email responses, follow-up dates..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="admin-textarea"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-primary-gold"
                onClick={handleSave}
              >
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
