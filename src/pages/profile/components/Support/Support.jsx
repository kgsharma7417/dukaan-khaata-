const SUPPORT_ITEMS = [
  {
    icon: "📘",
    key: "appHowToTitle",
    subKey: "appHowToSub",
  },
  {
    icon: "💬",
    key: "whatsappTitle",
    subKey: "whatsappSub",
  },
  {
    icon: "💡",
    key: "suggestionTitle",
    subKey: "suggestionSub",
  },
  {
    icon: "🧑‍💻",
    key: "developerTitle",
    subKey: "developerSub",
  },
];

export default function Support({ t }) {
  return (
    <>
      <div className="fp-profile-sectionHead">{t.supportTitle}</div>

      <div className="fp-profile-card fp-profile-card--support">
        {SUPPORT_ITEMS.map((item) => (
          <div key={item.key}>
            <div className="fp-profile-listRow fp-profile-listRow--support">
              <div
                className="fp-profile-listIcon fp-profile-listIcon--soft"
                aria-hidden="true"
              >
                {item.icon}
              </div>

              <div className="fp-profile-listBody">
                <div className="fp-profile-listTitle">{t[item.key]}</div>
                <div className="fp-profile-listSub">{t[item.subKey]}</div>
              </div>

              <div className="fp-profile-listRight">
                <span aria-hidden="true">›</span>
              </div>
            </div>

            <div className="fp-profile-listDivider" />
          </div>
        ))}
      </div>
    </>
  );
}
