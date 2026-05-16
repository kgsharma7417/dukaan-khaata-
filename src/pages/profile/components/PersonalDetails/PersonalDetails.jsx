import DetailRow from "./detail/DetailRow.jsx";

export default function PersonalDetails({
  t,
  isEditMode,
  profile,
  onChangeField,
  membershipJoinDate,
  setMembershipJoinDate,
  membershipDateText,
}) {
  return (
    <div className="fp-profile-detailsCard" style={{ padding: 12 }}>
      <DetailRow icon="👤" title={t.malikNaam}>
        {isEditMode ? (
          <input
            className="fp-profile-input"
            value={profile.shopkeeperName}
            onChange={onChangeField("shopkeeperName")}
            placeholder="Enter owner name"
          />
        ) : (
          <div className="fp-profile-row-value fp-profile-row-value--link">
            {profile.shopkeeperName}
            <span className="fp-profile-row-arrow" aria-hidden="true">
              ›
            </span>
          </div>
        )}
      </DetailRow>

      <DetailRow icon="📱" title={t.mobile}>
        {isEditMode ? (
          <input
            className="fp-profile-input"
            value={profile.mobile}
            onChange={onChangeField("mobile")}
            placeholder="Enter mobile number"
          />
        ) : (
          <div className="fp-profile-row-value fp-profile-row-value--link">
            {profile.mobile || "—"}
            <span className="fp-profile-row-arrow" aria-hidden="true">
              ›
            </span>
          </div>
        )}
      </DetailRow>

      <DetailRow icon="📍" title={t.address}>
        {isEditMode ? (
          <textarea
            className="fp-profile-textarea"
            value={profile.address}
            onChange={onChangeField("address")}
            placeholder="Enter shop address"
            rows={2}
          />
        ) : (
          <div className="fp-profile-row-value fp-profile-row-value--link">
            {profile.address}
            <span className="fp-profile-row-arrow" aria-hidden="true">
              ›
            </span>
          </div>
        )}
      </DetailRow>

      <DetailRow icon="🧾" title={t.gstOrLicense}>
        {isEditMode ? (
          <input
            className="fp-profile-input"
            value={profile.gstOrLicense}
            onChange={onChangeField("gstOrLicense")}
            placeholder={t.optional}
          />
        ) : (
          <div className="fp-profile-row-value fp-profile-row-value--muted">
            {profile.gstOrLicense ? profile.gstOrLicense : t.optional}
            <span className="fp-profile-row-arrow" aria-hidden="true">
              ›
            </span>
          </div>
        )}
      </DetailRow>

      <DetailRow icon="🗓️" title={t.membershipJoinDate}>
        {isEditMode ? (
          <input
            className="fp-profile-input"
            type="date"
            value={membershipJoinDate}
            onChange={(e) => setMembershipJoinDate(e.target.value)}
            style={{ height: 44 }}
          />
        ) : (
          <div className="fp-profile-row-value fp-profile-row-value--link">
            {membershipDateText}
            <span className="fp-profile-row-arrow" aria-hidden="true">
              ›
            </span>
          </div>
        )}
      </DetailRow>

      <DetailRow icon="✉️" title={t.email}>
        {isEditMode ? (
          <input
            className="fp-profile-input"
            value={profile.email}
            onChange={onChangeField("email")}
            placeholder="Enter email"
          />
        ) : (
          <div className="fp-profile-row-value fp-profile-row-value--link">
            {profile.email || "—"}
            <span className="fp-profile-row-arrow" aria-hidden="true">
              ›
            </span>
          </div>
        )}
      </DetailRow>
    </div>
  );
}
