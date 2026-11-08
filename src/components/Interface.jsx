export function Icon({ name, size = 20, ...props }) {
  const paths = {
    results: (
      <>
        <path d="M7 3h10v5a5 5 0 0 1-10 0V3Z" />
        <path d="M7 5H4v3a4 4 0 0 0 4 4m9-7h3v3a4 4 0 0 1-4 4m-4 1v5m-4 3h8m-8 0v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" />
      </>
    ),
    standings: (
      <>
        <path d="M3 20V11h6v9m0 0V4h6v16m0 0v-6h6v6M2 20h20" />
      </>
    ),
    schedule: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4m10-4v4M3 11h18m-14 4h3m4 0h3" />
      </>
    ),
    drivers: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
      </>
    ),
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    flag: (
      <>
        <path d="M5 22V3m0 1c5-4 9 4 15 0v10c-6 4-10-4-15 0" />
        <path d="M10 4v10m5-9v10M5 9h15" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name] || paths.results}
    </svg>
  );
}

export function PageHeader({ title, description }) {
  return (
    <header className="page-header">
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </header>
  );
}

export function ReportCard({
  label,
  context,
  title,
  subtitle,
  tags = [],
  className = "",
  titleClassName,
}) {
  return (
    <section className={`race-hero ${className}`.trim()}>
      <div className="hero-content">
        <span className="eyebrow">
          {label}
          {context && (
            <>
              <span className="hero-separator">/</span>
              {context}
            </>
          )}
        </span>
        <h2 className={titleClassName}>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
        {tags.length > 0 && (
          <div className="hero-tags">
            {tags.map((tag) => (
              <span key={tag.label}>
                {tag.icon && <Icon name={tag.icon} size={14} />}
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function Panel({ title, subtitle, aside, children, className = "" }) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-header">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function Stat({ label, value, detail }) {
  return (
    <div className="stat">
      <span className="stat-label">{label}</span>
      <strong>{value ?? "—"}</strong>
      {detail && <span className="stat-detail">{detail}</span>}
    </div>
  );
}

export function Position({ value }) {
  return (
    <span
      className={`position ${["gold", "silver", "bronze"][Number(value) - 1] || ""}`}
    >
      {value}
    </span>
  );
}

export function EmptyState({ title = "Ready when you are", children }) {
  return (
    <div className="empty-state">
      <Icon name="flag" size={36} />
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}
