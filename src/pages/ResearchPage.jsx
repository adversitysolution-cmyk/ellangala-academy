import React from 'react';
import { Link } from 'react-router-dom';
import { useUterpyPlugins } from '../hooks/useUterpyPlugins';
import HeaderOne from '../components/layout/HeaderOne';
import FooterOne from '../components/layout/FooterOne';
import PageHeader from '../components/common/PageHeader';
import CustomCursor from '../components/layout/CustomCursor';
import Preloader from '../components/layout/Preloader';
import MobileNav from '../components/layout/MobileNav';
import SearchPopup from '../components/layout/SearchPopup';
import ScrollToTop from '../components/layout/ScrollToTop';
import SEO from '../seo/SEO';
import { generateScholarlyArticleSchema, generateBreadcrumbSchema } from '../seo/schemas/schemaGenerators';

export default function ResearchPage() {
  useUterpyPlugins();

  const permaPillars = [
    {
      letter: 'P',
      title: 'Positive Emotion',
      kannada: 'ಸಕಾರಾತ್ಮಕ ಭಾವನೆಗಳು (Santosha & Ananda)',
      concept: 'Cultivating sustainable inner peace, realistic optimism, gratitude, and emotional equanimity.',
      purandaraLink: 'Reflected in keerthanas emphasizing contentment, surrender of toxic envy, and finding joy in simplicity ("Bhaagyada Lakshmi Baaramma", "Enu Maadidarenu").',
      outcome: 'Buffers against anxiety and depression by retraining attention toward gratitude and emotional harmony.'
    },
    {
      letter: 'E',
      title: 'Engagement & Flow',
      kannada: 'ಏಕಾಗ್ರತೆ ಮತ್ತು ಕಾರ್ಯನಿಷ್ಠೆ (Manada Ekagrate)',
      concept: 'Deep immersion, mindful absorption in work, and focus undisturbed by external distractions.',
      purandaraLink: 'Grounded in teachings on mental discipline, mindfulness during daily duties, and unwavering focus on higher goals ("Manava Janma Doddadu", "Kallu Sakkare Kolliro").',
      outcome: 'Enhances cognitive efficiency, reduces mental fatigue, and fosters effortless flow states.'
    },
    {
      letter: 'R',
      title: 'Positive Relationships',
      kannada: 'ಸೌಹಾರ್ದ ಸಂಬಂಧಗಳು (Karuna & Seva)',
      concept: 'Empathetic communication, mutual trust, selfless service, and compassionate community living.',
      purandaraLink: 'Articulated through social critique of hypocrisy, advocacy of universal kindness, and respectful human interactions ("Sakala Graha Bala Neene").',
      outcome: 'Builds secure emotional support systems, harmonious homes, and cooperative professional environments.'
    },
    {
      letter: 'M',
      title: 'Meaning & Purpose',
      kannada: 'ಅರ್ಥಪೂರ್ಣ ಬದುಕು (Artha Poornate)',
      concept: 'Connecting individual actions to a higher purpose, existential clarity, and value-driven living.',
      purandaraLink: 'Core theme across Purandaradasa’s compositions—seeking transcendental meaning beyond superficial ego and material obsession ("Yaare Rangana", "Aparadhi Naanalla").',
      outcome: 'Provides enduring motivation, existential grounding, and resilience during crisis and suffering.'
    },
    {
      letter: 'A',
      title: 'Accomplishment & Mastery',
      kannada: 'ಆತ್ಮಸಾಧನೆ ಮತ್ತು ಗೆಲುವು (Sadhane & Vijaya)',
      concept: 'Setting intrinsic goals, continuous self-improvement, grit, and purposeful achievement.',
      purandaraLink: 'Emphasizes self-sculpting, steady discipline, moral fortitude, and inner mastery over instinctual impulses ("Ninna Nodi Dhanyanadeno").',
      outcome: 'Fosters authentic self-efficacy, constructive ambition, and lasting personal fulfillment.'
    }
  ];

  const brandAssets = [
    {
      title: 'Positive MindGym',
      badge: 'Core Mind Training System',
      description: 'The structured mental gym framework developed by Dr. Naveen Ellangala to condition psychological muscles—focus, emotional regulation, and cognitive agility—through daily experiential routines.',
      link: '/mindgym',
      linkText: 'Explore Positive MindGym'
    },
    {
      title: 'Positive MindGym Center',
      badge: 'Experiential Center',
      description: 'Our physical center in Nayandahalli, Bengaluru, dedicated to immersive psychological conditioning, group workshops, personal mentoring, and holistic mental fitness sessions.',
      link: '/contact',
      linkText: 'Visit the Center'
    },
    {
      title: 'Positive Mind Toolkit',
      badge: 'Practical Resources & Tools',
      description: 'A curated collection of 17 published books, affirmation decks, cognitive reflection sheets, and guided habit logs created for students, parents, and professionals.',
      link: '/shop',
      linkText: 'Discover the Toolkit'
    }
  ];

  return (
    <>
      <CustomCursor />
      <Preloader />

      <div className="page-wrapper">
        <SEO
          title="Doctoral Research on PERMA Model & Saint Purandaradasa | Dr. Naveen Ellangala"
          description="Explore Dr. Naveen Ellangala's doctoral research formulating a PERMA Model of Positive Psychology based on the literary works of Saint Purandaradasa. A groundbreaking synthesis of Indian wisdom and empirical psychological science."
          canonical="/research"
          image="/assets/images/team/naveen-ellangala.png"
          type="article"
          structuredData={[
            generateScholarlyArticleSchema(),
            generateBreadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Research', path: '/research' }
            ])
          ]}
        />

        <HeaderOne />
        <PageHeader title="Doctoral Research" pageName="Original Research & Frameworks" />

        {/* Hero Dissertation Spotlight */}
        <section className="research-hero-section" style={{ padding: '80px 0 60px', backgroundColor: '#F8FAFC' }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div style={{ display: 'inline-block', backgroundColor: '#FEF3C7', color: '#92400E', padding: '6px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '18px' }}>
                  Doctoral Dissertation · Ph.D. in Positive Psychology
                </div>
                <h1 style={{ fontSize: '34px', lineHeight: '1.3', fontWeight: '800', color: '#0F172A', marginBottom: '20px' }}>
                  A Study and Formulation of a PERMA Model of Positive Psychology Based on the Literary Works of Saint Purandaradasa
                </h1>
                <p style={{ fontSize: '18px', lineHeight: '1.7', color: '#475569', marginBottom: '24px' }}>
                  Authored by <strong>Dr. Naveen Ellangala</strong>, this groundbreaking research bridges <strong>Martin Seligman’s Western empirical PERMA framework</strong> with the timeless spiritual, ethical, and psychological philosophy of 16th-century Haridasa saint <strong>Purandaradasa</strong>.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
                  <Link to="/founder" className="thm-btn" style={{ padding: '12px 28px' }}>
                    Meet the Researcher (Dr. Naveen)
                  </Link>
                  <Link to="/shop/purandaradasara-keerthanegalu-mattu-vyaktitva-vikasana" className="thm-btn" style={{ backgroundColor: '#1E293B', padding: '12px 28px' }}>
                    View Research Book (ಕನ್ನಡ ಕೃತಿ)
                  </Link>
                </div>
              </div>

              <div className="col-lg-4 mt-4 mt-lg-0">
                <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A', marginBottom: '16px', borderBottom: '2px solid #CA8A38', paddingBottom: '10px' }}>
                    Research Metadata
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', color: '#334155', lineHeight: '2' }}>
                    <li><strong>Principal Investigator:</strong> Dr. Naveen Ellangala</li>
                    <li><strong>Field:</strong> Positive Psychology & Indian Wisdom</li>
                    <li><strong>Theoretical Core:</strong> PERMA Model of Well-being</li>
                    <li><strong>Cultural Source:</strong> Haridasa Sahitya (Purandaradasa)</li>
                    <li><strong>Published Volume:</strong> <em>Purandaradasara Keerthanegalu mattu Vyaktitva Vikasana</em></li>
                    <li><strong>Signature Application:</strong> Positive MindGym Conditioning</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The 5 Pillars of the PERMA-Purandaradasa Model */}
        <section className="research-pillars-section" style={{ padding: '80px 0', backgroundColor: '#FFFFFF' }}>
          <div className="container">
            <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto 50px' }}>
              <span style={{ color: '#CA8A38', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '14px' }}>
                The Integrated Formulation
              </span>
              <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', marginTop: '8px' }}>
                The 5 Pillars of the PERMA-Purandaradasa Model
              </h2>
              <p style={{ color: '#64748B', fontSize: '16px', marginTop: '12px' }}>
                How Dr. Naveen Ellangala synthesized Western psychological dimensions of flourishing with indigenous Haridasa cognitive-behavioural insights:
              </p>
            </div>

            <div className="row">
              {permaPillars.map((pillar, idx) => (
                <div className="col-lg-12 mb-4" key={idx}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    padding: '28px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                  }}>
                    <div style={{
                      minWidth: '70px',
                      height: '70px',
                      borderRadius: '14px',
                      backgroundColor: '#CA8A38',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      fontWeight: '900',
                      marginRight: '24px',
                      marginBottom: '16px'
                    }}>
                      {pillar.letter}
                    </div>
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'baseline', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                          {pillar.title}
                        </h3>
                        <span style={{ color: '#92400E', fontWeight: '700', fontSize: '14px' }}>
                          {pillar.kannada}
                        </span>
                      </div>
                      <p style={{ color: '#334155', fontSize: '15px', marginBottom: '10px' }}>
                        <strong>Psychological Core:</strong> {pillar.concept}
                      </p>
                      <p style={{ color: '#475569', fontSize: '14px', marginBottom: '10px' }}>
                        <strong>Purandaradasa Synthesis:</strong> {pillar.purandaraLink}
                      </p>
                      <div style={{ backgroundColor: '#FFFFFF', padding: '10px 16px', borderRadius: '8px', borderLeft: '4px solid #CA8A38', fontSize: '13px', color: '#0F172A' }}>
                        <strong>Practical Outcome:</strong> {pillar.outcome}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why This Research Matters / Differentiation */}
        <section className="research-importance-section" style={{ padding: '70px 0', backgroundColor: '#0F172A', color: '#FFFFFF' }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <span style={{ color: '#F59E0B', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '13px' }}>
                  A Truly Unique Academic Asset
                </span>
                <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', margin: '12px 0 20px' }}>
                  Why Cross-Cultural Positive Psychology Matters
                </h2>
                <p style={{ color: '#94A3B8', fontSize: '16px', lineHeight: '1.8' }}>
                  While mainstream positive psychology predominantly stems from Western empirical paradigms, Dr. Naveen Ellangala’s doctoral work demonstrates that the foundational mechanics of flourishing—mindfulness, cognitive reframing, character virtues, and emotional hygiene—were systematically practiced and composed in 16th-century Indian literature.
                </p>
                <p style={{ color: '#94A3B8', fontSize: '16px', lineHeight: '1.8' }}>
                  By uniting <strong>Seligman’s PERMA model</strong> with <strong>Purandaradasa’s Keerthanas</strong>, Ellangala’s Academy provides clients, students, and organizations with an authentically grounded, relatable methodology for human transformation that feels naturally resonant.
                </p>
              </div>

              <div className="col-lg-6 mt-4 mt-lg-0">
                <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <h4 style={{ color: '#F59E0B', fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
                    Key Differentiators
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#E2E8F0', fontSize: '15px', lineHeight: '2' }}>
                    <li>✓ <strong>Academic Rigour:</strong> Genuine doctoral thesis, not improvised life coaching.</li>
                    <li>✓ <strong>Cultural Resonance:</strong> Bridges native Indian philosophical heritage with global evidence-based science.</li>
                    <li>✓ <strong>Actionable Practicality:</strong> Directly translated into daily exercises within the <em>Positive MindGym</em>.</li>
                    <li>✓ <strong>Authoritative Authorship:</strong> Supported by 17 published books in Kannada and English.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Named Signature Assets */}
        <section className="research-brand-assets" style={{ padding: '80px 0', backgroundColor: '#F8FAFC' }}>
          <div className="container">
            <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto 50px' }}>
              <span style={{ color: '#CA8A38', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '14px' }}>
                Signature Proprietary Assets
              </span>
              <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', marginTop: '8px' }}>
                Our 3 Signature Named Frameworks
              </h2>
              <p style={{ color: '#64748B', fontSize: '16px', marginTop: '12px' }}>
                The practical vehicles through which Dr. Ellangala’s academic research is brought into the lives of individuals, students, and organizations:
              </p>
            </div>

            <div className="row">
              {brandAssets.map((asset, index) => (
                <div className="col-lg-4 col-md-6 mb-4" key={index}>
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '32px',
                    border: '1px solid #E2E8F0',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.04)'
                  }}>
                    <div>
                      <span style={{ backgroundColor: '#EFF6FF', color: '#1E40AF', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>
                        {asset.badge}
                      </span>
                      <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', margin: '16px 0 12px' }}>
                        {asset.title}
                      </h3>
                      <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7' }}>
                        {asset.description}
                      </p>
                    </div>
                    <div style={{ marginTop: '24px' }}>
                      <Link to={asset.link} style={{ color: '#CA8A38', fontWeight: '700', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {asset.linkText} →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Explore Related Programs & Books */}
        <section className="research-cta-section" style={{ padding: '70px 0', backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
          <div className="container text-center">
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', marginBottom: '14px' }}>
              Experience Research-Backed Transformation
            </h2>
            <p style={{ color: '#64748B', maxWidth: '650px', margin: '0 auto 28px', fontSize: '16px' }}>
              Whether you are an educational institution seeking student mind-training or an individual looking for positive emotional hygiene, our programs are grounded in genuine academic research.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/positive-workshops" className="thm-btn" style={{ padding: '12px 30px' }}>
                Explore Positive Workshops
              </Link>
              <Link to="/shop" className="thm-btn" style={{ backgroundColor: '#1E293B', padding: '12px 30px' }}>
                Browse 17 Books & Toolkits
              </Link>
              <Link to="/contact" className="thm-btn" style={{ backgroundColor: '#CA8A38', padding: '12px 30px' }}>
                Request Institutional Keynote
              </Link>
            </div>
          </div>
        </section>

        <FooterOne />
      </div>

      <MobileNav />
      <SearchPopup />
      <ScrollToTop />
    </>
  );
}
