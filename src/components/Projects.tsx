import { useState, useEffect } from "react";
import { resumeData } from "../data/resumeData";

const GITHUB_USERNAME = "birindersingh24";

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  fork: boolean;
}

const FolderIcon = () => (
  <svg
    className="project-card__icon"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const ExternalIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const GitHubIcon = () => (
  <svg
    className="project-card__icon"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const GitMergeIcon = () => (
  <svg
    className="project-card__icon"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="18" r="3" />
    <circle cx="6" cy="6" r="3" />
    <path d="M6 21V9a9 9 0 0 0 9 9" />
  </svg>
);

const Projects = () => {
  const [tab, setTab] = useState<"featured" | "github" | "opensource">("featured");
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (tab === "github" && repos.length === 0 && !error) {
      setLoading(true);
      fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=9`
      )
        .then((r) => r.json())
        .then((data: GitHubRepo[]) => {
          if (Array.isArray(data)) {
            setRepos(data.filter((r) => !r.fork));
          } else {
            setError(true);
          }
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
  }, [tab, repos.length, error]);

  return (
    <section id="projects">
      <div className="section">
        <p className="section__label">Work</p>
        <h2 className="section__title">Projects</h2>

        <div className="projects-tabs">
          <button
            className={`projects-tabs__btn${tab === "featured" ? " projects-tabs__btn--active" : ""}`}
            onClick={() => setTab("featured")}
          >
            Featured
          </button>
          <button
            className={`projects-tabs__btn${tab === "github" ? " projects-tabs__btn--active" : ""}`}
            onClick={() => setTab("github")}
          >
            GitHub
          </button>
          <button
            className={`projects-tabs__btn${tab === "opensource" ? " projects-tabs__btn--active" : ""}`}
            onClick={() => setTab("opensource")}
          >
            Open Source
          </button>
        </div>

        {tab === "featured" && (
          <div className="projects-grid">
            {resumeData.projects.map((p, i) => (
              <div key={i} className="project-card">
                <div className="project-card__header">
                  <FolderIcon />
                </div>
                <h3 className="project-card__name">{p.name}</h3>
                <p className="project-card__desc">{p.description}</p>
                <div className="project-card__tags">
                  {p.keywords.map((kw, j) => (
                    <span key={j} className="tag">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "github" && (
          <div className="projects-grid">
            {loading && (
              <p className="project-card__desc" style={{ padding: "12px 0" }}>
                Loading repos...
              </p>
            )}
            {error && (
              <p className="project-card__desc" style={{ padding: "12px 0" }}>
                Could not fetch repos from GitHub.
              </p>
            )}
            {repos.map((repo) => (
              <a
                key={repo.id}
                className="project-card"
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <div className="project-card__header">
                  <GitHubIcon />
                  <span className="project-card__ext">
                    <ExternalIcon />
                  </span>
                </div>
                <h3 className="project-card__name">{repo.name}</h3>
                <p className="project-card__desc">
                  {repo.description || "No description provided."}
                </p>

                <div className="project-card__stats">
                  {repo.language && (
                    <span>
                      <span
                        style={{
                          display: "inline-block",
                          width: 9,
                          height: 9,
                          borderRadius: "50%",
                          background: "var(--accent)",
                          marginRight: 5,
                          verticalAlign: "middle",
                        }}
                      />
                      {repo.language}
                    </span>
                  )}
                  <span>★ {repo.stargazers_count}</span>
                  {repo.forks_count > 0 && <span>⑂ {repo.forks_count}</span>}
                </div>

                {repo.topics.length > 0 && (
                  <div className="project-card__tags">
                    {repo.topics.slice(0, 4).map((t, i) => (
                      <span key={i} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </a>
            ))}
          </div>
        )}
        {tab === "opensource" && (
          <div className="projects-grid">
            {resumeData.volunteer.map((v, i) => (
              <a
                key={i}
                className="project-card"
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <div className="project-card__header">
                  <GitMergeIcon />
                  <span className="project-card__ext">
                    <ExternalIcon />
                  </span>
                </div>
                <h3 className="project-card__name">{v.organization}</h3>
                <p
                  className="project-card__desc"
                  style={{ color: "var(--accent)", fontSize: "0.78rem", marginBottom: -4 }}
                >
                  {v.position} · {v.startDate}
                </p>
                <p className="project-card__desc">{v.summary}</p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                  {v.highlights.map((h, j) => (
                    <li
                      key={j}
                      style={{
                        fontSize: "0.83rem",
                        color: "var(--text-muted)",
                        paddingLeft: 16,
                        position: "relative",
                        lineHeight: 1.7,
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          color: "var(--accent)",
                          fontSize: "0.65rem",
                          top: 5,
                        }}
                      >
                        ▸
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
