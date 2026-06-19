import '../styles/pages.css';

export default function PageHeader({ icon, title, description }) {
  return (
    <div className="page-header">
      <h2 className="page-header-title">
        <span className="page-header-icon">{icon}</span>
        {title}
      </h2>
      {description && <p className="page-header-desc">{description}</p>}
    </div>
  );
}
