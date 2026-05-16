import FrontShim from "../features/frontPage/FrontShim.jsx";

export default function AboutDeveloperPage({
  onNavHome,
  onNavGirvi,
  onNavBills,
  onNavReports,
  onNavProfile,
}) {
  return (
    <FrontShim
      pageTitle="About Developer"
      active=""
      onNavHome={onNavHome}
      onNavGirvi={onNavGirvi}
      onNavBills={onNavBills}
      onNavReports={onNavReports}
      onNavProfile={onNavProfile}
      onAboutDeveloper={() => {}}
    >
      <div className="fp-profile">
        <div className="fp-profile-card">
          <div className="fp-profile-idRow">
            <div className="fp-profile-idCircle">
              <div className="fp-profile-idText">DD</div>
            </div>
            <div>
              <div className="fp-profile-name">Devansh Dubey</div>
              <div className="fp-profile-sub">
                Full-stack developer • React / Node.js
              </div>
            </div>
          </div>

          <div className="fp-profile-chips">
            <span className="fp-profile-chip fp-profile-chip--green">
              React
            </span>
            <span className="fp-profile-chip fp-profile-chip--gold">
              Node.js
            </span>
            <span className="fp-profile-chip fp-profile-chip--neutral">
              Firebase
            </span>
            <span className="fp-profile-chip fp-profile-chip--neutral">
              JavaScript
            </span>
          </div>

          <div className="fp-profile-sectionHead">
            <div className="fp-section-title">Developer Info</div>
          </div>

          <div className="fp-profile-detailsCard">
            <div className="fp-profile-row">
              <div className="fp-profile-row-icon" aria-hidden="true">
                📍
              </div>
              <div className="fp-profile-row-body">
                <div className="fp-profile-row-title">Location</div>
                <div className="fp-profile-row-value">Agra, India</div>
              </div>
            </div>
            <div className="fp-profile-row">
              <div className="fp-profile-row-icon" aria-hidden="true">
                💼
              </div>
              <div className="fp-profile-row-body">
                <div className="fp-profile-row-title">Experience</div>
                <div className="fp-profile-row-value">
                  3+ years building web apps
                </div>
              </div>
            </div>
            <div className="fp-profile-row">
              <div className="fp-profile-row-icon" aria-hidden="true">
                ✉️
              </div>
              <div className="fp-profile-row-body">
                <div className="fp-profile-row-title">Email</div>
                <div className="fp-profile-row-value">dev@example.com</div>
              </div>
            </div>
          </div>

          <div className="fp-profile-sectionHead">
            <div className="fp-section-title">Social Links</div>
          </div>

          <div className="fp-profile-card fp-social-links">
            <a
              href="https://github.com/"
              className="fp-social-link"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/"
              className="fp-social-link"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://twitter.com/"
              className="fp-social-link"
              target="_blank"
              rel="noreferrer"
            >
              Twitter
            </a>
            <a
              href="https://portfolio.example.com"
              className="fp-social-link"
              target="_blank"
              rel="noreferrer"
            >
              Portfolio
            </a>
          </div>

          <div className="fp-profile-card">
            <div className="fp-profile-hero-title">About this demo</div>
            <p>
              Yeh demo page dikhata hai kaise developer profile card, skills,
              location, experience, email aur social links ek saath dikhaye ja
              sakte hain.
            </p>
            <ul className="fp-info-list">
              <li>Avatar — naam ke initials se bana circle</li>
              <li>
                Skills badges — React, Node.js, Firebase, JavaScript, etc.
              </li>
              <li>Info section — location, experience, email</li>
              <li>Social links — GitHub, LinkedIn, Twitter, Portfolio</li>
            </ul>
          </div>
        </div>
      </div>
    </FrontShim>
  );
}
