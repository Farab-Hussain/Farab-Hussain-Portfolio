import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2 className="career-heading">
          <span className="career-heading-main">My career &</span>
          <br />
          <span className="career-heading-sub">experience</span>
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {/* <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>CMS Developer</h4>
                <h5>Mindigital</h5>
              </div>
              <h3>Jun 2024 – Sep 2024</h3>
            </div>
            <p>
              Completed a 3-month internship focused on WordPress development. 
              Built and customized WordPress themes and plugins, managed website 
              content, maintained client sites, and collaborated with the team to 
              implement website updates and troubleshoot issues.
            </p>
          </div> */}
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full Stack Developer</h4>
                <h5>Mindigital</h5>
              </div>
              <h3>June 2025 - Present</h3>
            </div>
            <p>
              Working as a Full-Stack Developer building scalable web and mobile
              applications using React, Next.js, Node.js, PostgreSQL, and MongoDB.
              Implementing authentication systems, API integrations, and modern UI
              systems with TailwindCSS and ShadCN. Currently using Prisma ORM for
              database management and contributing to production-level applications and
              internal tools.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Independent Projects & Continuous Learning</h4>
                <h5>Open Source / GitHub</h5>
              </div>
              <h3>2023 - Present</h3>
            </div>
            <p>
              Actively building and publishing full-stack projects including a chat
              application, storage platform similar to Google Drive, and several MERN
              stack applications. Exploring modern backend architectures with NestJS and
              FastAPI while expanding skills in mobile development using Flutter and
              React Native.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
