export default function DetailRow({ icon, title, children }) {
  return (
    <div className="fp-profile-row">
      <div className="fp-profile-row-icon" aria-hidden="true">
        {icon}
      </div>

      <div className="fp-profile-row-body">
        <div className="fp-profile-row-title">{title}</div>
        {children}
      </div>
    </div>
  );
}
