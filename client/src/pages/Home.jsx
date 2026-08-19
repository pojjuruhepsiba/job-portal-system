import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />

      <main>
        <section className="hero">
          <div className="hero-glow glow-one"></div>
          <div className="hero-glow glow-two"></div>

          <div className="hero-content">
            <div className="eyebrow">✦ SMART CAREER PLATFORM</div>
            <h1>Find work that feels <span>worth it.</span></h1>
            <p>
              Discover verified opportunities, apply in seconds, and build
              your next career chapter with CareerNest.
            </p>

            <div className="hero-actions">
              <Link className="primary-btn" to="/jobs">Explore Jobs →</Link>
              <Link className="secondary-btn" to="/register">Join CareerNest</Link>
            </div>

            <div className="hero-trust">
              <span>✓ Curated opportunities</span>
              <span>✓ Simple applications</span>
              <span>✓ Role-based portal</span>
            </div>
          </div>

          <div className="hero-panel">
            <div className="floating-badge">LIVE OPPORTUNITIES</div>
            <div className="mock-search">
              <span>⌕</span>
              <div>
                <small>SEARCH ROLE</small>
                <strong>React Frontend Developer</strong>
              </div>
            </div>
            <div className="mock-job">
              <div className="mock-logo">T</div>
              <div>
                <strong>React Frontend Developer</strong>
                <p>Tech Solutions · Vijayawada</p>
              </div>
              <span className="approved-pill">OPEN</span>
            </div>
            <div className="mock-job">
              <div className="mock-logo purple">N</div>
              <div>
                <strong>Node.js Backend Developer</strong>
                <p>Product Team · Hyderabad</p>
              </div>
              <span className="approved-pill">OPEN</span>
            </div>
          </div>
        </section>

        <section className="stats-strip">
          <div><strong>3</strong><span>Career Roles</span></div>
          <div><strong>24/7</strong><span>Access</span></div>
          <div><strong>1</strong><span>Smart Platform</span></div>
          <div><strong>∞</strong><span>Possibilities</span></div>
        </section>

        <section className="feature-section">
          <div className="section-heading">
            <div className="eyebrow">WHY CAREERNEST</div>
            <h2>Everything you need to move forward.</h2>
          </div>

          <div className="feature-grid">
            <div className="feature-card"><span>⚡</span><h3>Fast Applications</h3><p>Find an opportunity and apply without unnecessary steps.</p></div>
            <div className="feature-card"><span>🛡️</span><h3>Organized Hiring</h3><p>Recruiters manage jobs and applicants from one dashboard.</p></div>
            <div className="feature-card"><span>📊</span><h3>Clear Tracking</h3><p>Job seekers can track application progress in one place.</p></div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
