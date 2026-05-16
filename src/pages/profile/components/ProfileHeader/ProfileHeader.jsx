import { useMemo } from "react";
import FrontShim from "../../../../features/frontPage/FrontShim.jsx";

function Chip({ children, variant = "neutral" }) {
  return (
    <span className={`fp-profile-chip fp-profile-chip--${variant}`}>
      {children}
    </span>
  );
}

export default function ProfileHeader({
  t,
  profile,
  avatarUrl,
  initials,
  membershipLabel,
  onAvatarChange,
}) {
  const heroBrandPillIcon = useMemo(() => "द", []);

  return (
    <div className="fp-profile">
      <div className="fp-profile-heroCard">
        <div className="fp-profile-heroHeader">
          <div className="fp-profile-brandPill">
            <span className="fp-profile-brandPill-icon">
              {heroBrandPillIcon}
            </span>
            {t.heroBrand}
          </div>
        </div>

        <div className="fp-profile-heroBody">
          <label
            className="fp-profile-avatarUpload fp-profile-heroAvatarUpload"
            title="Upload profile image"
          >
            <div className="fp-profile-heroAvatar">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile avatar"
                  className="fp-profile-avatarImg"
                />
              ) : (
                <span className="fp-profile-heroAvatarText">{initials}</span>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={onAvatarChange}
              style={{ display: "none" }}
            />

            <div className="fp-profile-avatarUploadText">{t.upload}</div>
          </label>

          <div>
            <div className="fp-profile-name">{profile.shopkeeperName}</div>
            <div className="fp-profile-sub">{profile.mobile}</div>
          </div>

          <div className="fp-profile-chips">
            <Chip variant="gold">{t.girviShop}</Chip>
            <Chip variant="green">{t.verified}</Chip>
            <Chip variant="neutral">{membershipLabel}</Chip>
          </div>
        </div>
      </div>
    </div>
  );
}
