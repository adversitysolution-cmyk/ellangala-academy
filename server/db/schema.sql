CREATE TABLE IF NOT EXISTS events (
  pk INT AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(191) UNIQUE,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  shortDescription TEXT,
  description TEXT,
  image VARCHAR(500),
  date VARCHAR(20),
  startTime VARCHAR(20),
  endTime VARCHAR(20),
  timezone VARCHAR(50),
  mode VARCHAR(100),
  venue VARCHAR(255),
  address VARCHAR(500),
  city VARCHAR(100),
  googleMeetLink VARCHAR(500),
  meetingLink VARCHAR(500),
  organizer VARCHAR(255),
  speaker VARCHAR(255),
  registrationOpen BOOLEAN DEFAULT TRUE,
  capacity INT,
  availableSeats INT,
  priceType VARCHAR(20),
  price VARCHAR(50),
  razorpayLink VARCHAR(500),
  paymentLink VARCHAR(500),
  status VARCHAR(20) DEFAULT 'published',
  featured BOOLEAN DEFAULT FALSE,
  seo JSON,
  createdAt DATETIME,
  updatedAt DATETIME,
  publishedAt DATETIME NULL
);

CREATE TABLE IF NOT EXISTS blogs (
  pk INT AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(191) UNIQUE,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content LONGTEXT,
  category VARCHAR(100),
  image VARCHAR(500),
  author VARCHAR(255),
  status VARCHAR(20) DEFAULT 'published',
  readTime VARCHAR(50),
  details JSON,
  seo JSON,
  createdAt DATETIME,
  updatedAt DATETIME,
  publishedAt DATETIME NULL
);

CREATE TABLE IF NOT EXISTS orders (
  pk INT AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(191) UNIQUE,
  customerName VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  address VARCHAR(500),
  city VARCHAR(100),
  state VARCHAR(100),
  zipcode VARCHAR(20),
  country VARCHAR(100),
  items JSON,
  subtotal DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  totalAmount DECIMAL(10,2) DEFAULT 0,
  paymentMethod VARCHAR(20),
  paymentStatus VARCHAR(20),
  paymentRef VARCHAR(120),
  couponCode VARCHAR(60),
  status VARCHAR(20) DEFAULT 'New',
  internalNotes TEXT,
  createdAt DATETIME,
  updatedAt DATETIME
);

CREATE TABLE IF NOT EXISTS enrollments (
  pk INT AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(191) UNIQUE,
  fullName VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  city VARCHAR(100),
  interest VARCHAR(255),
  type VARCHAR(50),
  sourceType VARCHAR(50),
  eventId VARCHAR(191),
  eventTitle VARCHAR(255),
  message TEXT,
  status VARCHAR(20) DEFAULT 'New',
  internalNotes TEXT,
  submittedAt DATETIME,
  updatedAt DATETIME
);

CREATE TABLE IF NOT EXISTS products (
  pk INT AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(191) UNIQUE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  author VARCHAR(255),
  type VARCHAR(100),
  theme VARCHAR(255),
  price VARCHAR(50),
  discount VARCHAR(50),
  image VARCHAR(500),
  alt VARCHAR(500),
  description TEXT,
  highlights JSON,
  sale BOOLEAN DEFAULT FALSE,
  stock INT DEFAULT NULL,
  status VARCHAR(20) DEFAULT 'published',
  createdAt DATETIME,
  updatedAt DATETIME
);

CREATE TABLE IF NOT EXISTS coupons (
  pk INT AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(191) UNIQUE,
  code VARCHAR(60) UNIQUE NOT NULL,
  type VARCHAR(10) DEFAULT 'percent',
  value DECIMAL(10,2) DEFAULT 0,
  minSubtotal DECIMAL(10,2) DEFAULT 0,
  maxDiscount DECIMAL(10,2) DEFAULT 0,
  usageLimit INT DEFAULT 0,
  usedCount INT DEFAULT 0,
  expiresAt DATE,
  active BOOLEAN DEFAULT TRUE,
  description VARCHAR(255),
  createdAt DATETIME,
  updatedAt DATETIME
);

CREATE TABLE IF NOT EXISTS messages (
  pk INT AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(191) UNIQUE,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT,
  status VARCHAR(20) DEFAULT 'New',
  submittedAt DATETIME
);

-- ============================================================================
-- Certificate Generation & Distribution Module
-- ============================================================================

-- Reusable certificate design/content. Static elements live here and
-- event-specific values are injected at generation time via {{placeholders}}.
CREATE TABLE IF NOT EXISTS certificate_templates (
  pk INT AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(191) UNIQUE,
  name VARCHAR(255) NOT NULL,
  organizationName VARCHAR(255),
  signatoryName VARCHAR(255),
  signatoryTitle VARCHAR(255),
  address VARCHAR(500),
  headingText VARCHAR(255),
  bodyText TEXT,
  logoUrl VARCHAR(500),
  signatureUrl VARCHAR(500),
  sealUrl VARCHAR(500),
  backgroundUrl VARCHAR(500),
  isActive BOOLEAN DEFAULT TRUE,
  createdAt DATETIME,
  updatedAt DATETIME
);

-- Per-event certificate settings. Event name/dates are NOT stored here — the
-- event stays the source of truth.
CREATE TABLE IF NOT EXISTS event_certificate_configs (
  pk INT AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(191) UNIQUE,
  eventId VARCHAR(191) NOT NULL UNIQUE,
  templateId VARCHAR(191),
  certificateEnabled BOOLEAN DEFAULT FALSE,
  eligibilityMode VARCHAR(40) DEFAULT 'attendance_sheet',
  requireRegistrationMatch BOOLEAN DEFAULT TRUE,
  autoSendEmail BOOLEAN DEFAULT TRUE,
  idFormat VARCHAR(120) DEFAULT '{org}-{event}-{year}-{seq}',
  orgCode VARCHAR(20) DEFAULT 'ELA',
  eventCode VARCHAR(20),
  createdAt DATETIME,
  updatedAt DATETIME
);

-- One spreadsheet upload / attendance source ingestion.
CREATE TABLE IF NOT EXISTS certificate_import_batches (
  pk INT AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(191) UNIQUE,
  eventId VARCHAR(191) NOT NULL,
  uploadedBy VARCHAR(255),
  attendanceSource VARCHAR(40) DEFAULT 'spreadsheet',
  fileName VARCHAR(500),
  headers JSON,
  columnMapping JSON,
  rawRows JSON,
  phoneRequired BOOLEAN DEFAULT FALSE,
  totalRows INT DEFAULT 0,
  validRows INT DEFAULT 0,
  invalidRows INT DEFAULT 0,
  duplicateRows INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'mapping',
  createdAt DATETIME,
  updatedAt DATETIME
);

-- Rows extracted from a batch, after normalization / validation / matching.
CREATE TABLE IF NOT EXISTS certificate_participant_imports (
  pk INT AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(191) UNIQUE,
  batchId VARCHAR(191) NOT NULL,
  eventId VARCHAR(191) NOT NULL,
  registrationId VARCHAR(191),
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  status VARCHAR(20) DEFAULT 'READY',
  validationErrors JSON,
  eligible BOOLEAN DEFAULT FALSE,
  certificateId VARCHAR(191),
  createdAt DATETIME,
  updatedAt DATETIME,
  INDEX idx_cpi_batch (batchId)
);

-- Issued certificates. One active certificate per (event, participant email).
CREATE TABLE IF NOT EXISTS certificates (
  pk INT AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(191) UNIQUE,
  certificateNumber VARCHAR(120) NOT NULL UNIQUE,
  verificationToken VARCHAR(96) NOT NULL UNIQUE,
  eventId VARCHAR(191) NOT NULL,
  registrationId VARCHAR(191),
  batchId VARCHAR(191),
  participantName VARCHAR(255),
  participantEmail VARCHAR(255),
  participantPhone VARCHAR(50),
  templateId VARCHAR(191),
  pdfPath VARCHAR(500),
  status VARCHAR(20) DEFAULT 'active',
  issuedAt DATETIME,
  revokedAt DATETIME NULL,
  revocationReason VARCHAR(500),
  createdAt DATETIME,
  updatedAt DATETIME,
  UNIQUE KEY uq_event_participant (eventId, participantEmail),
  INDEX idx_cert_event (eventId)
);

-- Background work: PDF generation + email delivery.
CREATE TABLE IF NOT EXISTS certificate_jobs (
  pk INT AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(191) UNIQUE,
  type VARCHAR(20) NOT NULL,
  certificateId VARCHAR(191) NOT NULL,
  batchId VARCHAR(191),
  status VARCHAR(20) DEFAULT 'pending',
  forced BOOLEAN DEFAULT FALSE,
  attempts INT DEFAULT 0,
  lastError VARCHAR(500),
  createdAt DATETIME,
  updatedAt DATETIME,
  INDEX idx_job_status (status),
  INDEX idx_job_cert (certificateId)
);

-- Email delivery status, one row per certificate.
CREATE TABLE IF NOT EXISTS certificate_emails (
  pk INT AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(191) UNIQUE,
  certificateId VARCHAR(191) NOT NULL UNIQUE,
  recipientEmail VARCHAR(255),
  status VARCHAR(20) DEFAULT 'PENDING',
  sentAt DATETIME NULL,
  failureReason VARCHAR(500),
  retryCount INT DEFAULT 0,
  createdAt DATETIME,
  updatedAt DATETIME
);

-- Generic admin audit trail (reused by the certificate module).
CREATE TABLE IF NOT EXISTS audit_logs (
  pk INT AUTO_INCREMENT PRIMARY KEY,
  id VARCHAR(191) UNIQUE,
  actor VARCHAR(255),
  action VARCHAR(80) NOT NULL,
  eventId VARCHAR(191),
  targetType VARCHAR(40),
  targetId VARCHAR(191),
  metadata JSON,
  createdAt DATETIME,
  INDEX idx_audit_event (eventId)
);
