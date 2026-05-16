export default function AppSettings({
  t,
  isEditMode,
  language,
  LANG,
  appSettings,
  setAppSettings,
  toggleLanguage,
}) {
  return (
    <div>
      <div className="fp-profile-sectionHead">{t.settingsTitle}</div>

      <div className="fp-profile-card fp-profile-card--list">
        <div className="fp-profile-listRow">
          <div className="fp-profile-listIcon" aria-hidden="true">
            ⏰
          </div>

          <div className="fp-profile-listBody">
            <div className="fp-profile-listTitle">
              {t.defaultBayarDaarTitle}
            </div>

            {isEditMode ? (
              <input
                className="fp-profile-input"
                style={{ marginTop: 8, width: "100%" }}
                value={appSettings.defaultBayarDaarRate}
                onChange={(e) =>
                  setAppSettings((s) => ({
                    ...s,
                    defaultBayarDaarRate: e.target.value,
                  }))
                }
                placeholder="2%"
              />
            ) : (
              <div className="fp-profile-listSub">{t.defaultBayarDaarSub}</div>
            )}
          </div>

          <div className="fp-profile-listRight fp-profile-listRight--muted">
            {isEditMode ? (
              <>
                {appSettings.defaultBayarDaarRate}{" "}
                <span aria-hidden="true">/ maand</span>
              </>
            ) : (
              <>
                {appSettings.defaultBayarDaarRate}{" "}
                <span aria-hidden="true">/ maand</span>{" "}
                <span className="fp-profile-row-arrow" aria-hidden="true">
                  ›
                </span>
              </>
            )}
          </div>
        </div>

        <div className="fp-profile-listDivider" />

        <div className="fp-profile-listRow">
          <div className="fp-profile-listIcon" aria-hidden="true">
            🔔
          </div>

          <div className="fp-profile-listBody">
            <div className="fp-profile-listTitle">{t.reminderTitle}</div>
            <div className="fp-profile-listSub">{t.reminderSub}</div>
          </div>

          <div className="fp-profile-listRight">
            <span className="fp-profile-pill fp-profile-pill--green">
              {t.chalu}
            </span>
            <span className="fp-profile-row-arrow" aria-hidden="true">
              ›
            </span>
          </div>
        </div>

        <div className="fp-profile-listDivider" />

        <div className="fp-profile-listRow">
          <div className="fp-profile-listIcon" aria-hidden="true">
            🌐
          </div>

          <div className="fp-profile-listBody">
            <div className="fp-profile-listTitle">{t.bhashaTitle}</div>
            <div className="fp-profile-listSub">{t.appLanguageSub}</div>
          </div>

          <div className="fp-profile-listRight">
            <button
              type="button"
              className="fp-profile-editBtn"
              style={{ padding: "8px 12px", boxShadow: "none" }}
              onClick={toggleLanguage}
            >
              {language === LANG.HI ? "Hindi" : "English"}
            </button>
            <span className="fp-profile-row-arrow" aria-hidden="true">
              ›
            </span>
          </div>
        </div>

        <div className="fp-profile-listDivider" />

        <div className="fp-profile-listRow">
          <div className="fp-profile-listIcon" aria-hidden="true">
            💾
          </div>

          <div className="fp-profile-listBody">
            <div className="fp-profile-listTitle">{t.dataBackupTitle}</div>
            <div className="fp-profile-listSub">{t.dataBackupSub}</div>
          </div>

          <div className="fp-profile-listRight">
            <span className="fp-profile-pill fp-profile-pill--neutral">
              {t.auto}
            </span>
            <span className="fp-profile-row-arrow" aria-hidden="true">
              ›
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
