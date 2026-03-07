import React from 'react';
import { ArrowLeft, Calendar, Clock, Tag, User, BookOpen } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

const ArticleDetail: React.FC = () => {
  const articles = [
    {
      id: "1",
      title: "Mastering React Hooks in Real Projects",
      content: `
        <div class="article-content">
          <p class="paragraph">React Hooks let us build cleaner and more maintainable components. In real projects, Hooks are especially useful when we separate state, side effects, and reusable logic.</p>
          <h2 class="heading-primary">Why Hooks Matter</h2>
          <p class="paragraph">Hooks reduce boilerplate and make components easier to reason about. Instead of splitting logic across lifecycle methods, we can group related behavior in one place.</p>
          <h2 class="heading-primary">Practical Tips</h2>
          <ul class="list-content">
            <li>Keep each useEffect focused on one responsibility.</li>
            <li>Extract repeated logic into custom hooks.</li>
            <li>Use dependency arrays carefully to avoid stale state.</li>
          </ul>
          <div class="next-steps-box">
            <h3 class="next-steps-title">Next Steps</h3>
            <p class="next-steps-content">Try applying useMemo and useCallback only after identifying real performance bottlenecks.</p>
          </div>
        </div>
      `,
      date: "2025-09-15",
      readTime: "8 min read",
      tags: ["React", "JavaScript", "Frontend"],
      category: "Frontend Development",
      author: "Muhammad Daffa Ramadhan"
    },
    {
      id: "2",
      title: "Building RESTful APIs with Node.js and Express",
      content: `
        <div class="article-content">
          <p class="paragraph">A strong REST API starts with clear resource naming, consistent responses, and proper status codes. Express gives enough flexibility to organize routes and middleware cleanly.</p>
          <h2 class="heading-primary">Core Foundation</h2>
          <p class="paragraph">Use middleware for validation, auth, and error handling. Keep business logic outside route handlers so your service layer stays testable.</p>
          <h2 class="heading-primary">Production Checklist</h2>
          <ul class="list-content">
            <li>Input validation and sanitization</li>
            <li>Centralized error handling</li>
            <li>Structured logging and monitoring</li>
          </ul>
          <div class="next-steps-box">
            <h3 class="next-steps-title">Next Steps</h3>
            <p class="next-steps-content">Add JWT auth, request rate limiting, and API docs to make your service production-ready.</p>
          </div>
        </div>
      `,
      date: "2025-09-10",
      readTime: "12 min read",
      tags: ["Node.js", "Express", "API"],
      category: "Backend Development",
      author: "Muhammad Daffa Ramadhan"
    },
    {
      id: "3",
      title: "Fixing Docker Desktop Startup and PostgreSQL Connection Issues on Windows",
      content: `
        <div class="article-content">
          <p class="paragraph">Docker startup issues on Windows are often related to WSL2 service state, conflicting network settings, or stale containers. A structured checklist helps fix these quickly.</p>
          <h2 class="heading-primary">Quick Checks</h2>
          <ul class="list-content">
            <li>Restart Docker Desktop and WSL services.</li>
            <li>Verify container health and exposed ports.</li>
            <li>Ensure PostgreSQL credentials and host mapping are correct.</li>
          </ul>
          <h2 class="heading-primary">Stabilizing Development</h2>
          <p class="paragraph">Use compose health checks and clear startup logs. This makes issue diagnosis faster and avoids random connection failures.</p>
          <div class="next-steps-box">
            <h3 class="next-steps-title">Next Steps</h3>
            <p class="next-steps-content">Create a small local runbook so your environment setup can be reproduced consistently across machines.</p>
          </div>
        </div>
      `,
      date: "2025-11-09",
      readTime: "15 min read",
      tags: ["Docker", "Windows", "PostgreSQL"],
      category: "DevOps",
      author: "Muhammad Daffa Ramadhan"
    },
  ];

  const { id } = useParams<{ id: string }>();
  const article = articles.find(a => a.id === id);

  if (!article) {
    return (
      <div className="article-not-found">
        <div className="not-found-container">
          <div className="not-found-icon-container">
            <BookOpen className="not-found-icon" />
          </div>
          <h3 className="not-found-title">Article not found</h3>
          <p className="not-found-description">
            The article you are looking for does not exist or has been removed.
          </p>
          <Link to="/articles" className="not-found-link">
            <ArrowLeft className="not-found-link-icon" />
            Back to articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail-page">
      <div className="article-detail-container">
        <Link to="/articles" className="back-to-articles">
          <ArrowLeft className="back-icon" />
          Back to articles
        </Link>

        <article className="article-container">
          <div className="article-header">
            <div className="article-meta">
              <span className="article-category">
                {article.category}
              </span>
              <div className="article-info">
                <div className="info-item">
                  <Clock className="info-icon" />
                  {article.readTime}
                </div>
                <div className="info-item">
                  <Calendar className="info-icon" />
                  <time dateTime={article.date}>{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                </div>
              </div>
            </div>

            <h1 className="article-title">
              {article.title}
            </h1>

            <div className="author-info">
              <User className="author-icon" />
              <span>{article.author}</span>
            </div>

            <div className="divider"></div>
          </div>

          <div className="article-body">
            <div
              className="article-content-wrapper"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          <div className="article-footer">
            <div className="tags-section">
              {article.tags.map((tag, index) => (
                <span key={index} className="tag-item">
                  <Tag className="tag-icon" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="footer-divider"></div>

            <div className="footer-content">
              <div className="author-credit">
                <User className="author-credit-icon" />
                <span className="author-name">Written by {article.author}</span>
              </div>
              <Link to="/articles" className="all-articles-link">
                View all articles
                <ArrowLeft className="all-articles-icon" />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetail;
