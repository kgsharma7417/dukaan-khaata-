import { useEffect, useMemo, useState } from "react";
import FrontShim from "../features/frontPage/FrontShim.jsx";
import { STORAGE_KEY } from "../lib/girviUtils.js";

function Stat({ value, label }) {
  return (
    <div className="fp-profile-stat">
      <div className="fp-profile-stat-value">{value}</div>
      <div className="fp-profile-stat-label">{label}</div>
    </div>
  );
}

function Chip({ children, variant = "neutral" }) {
  return (
    <span className={`fp-profile-chip fp-profile-chip--${variant}`}>
      {children}
    </span>
  );
}

function DetailRow({ icon, title, children }) {
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

const PROFILE_STORAGE_KEY = "dukkan_khaata_profile_v1";
const AVATAR_STORAGE_KEY = "dukkan_khaata_profile_avatar_v1";
const BILL_STORAGE_KEY = "dukkan_khaata_saved_bills_v1";
const MEMBERSHIP_JOIN_DATE_KEY = "dukkan_khaata_membership_join_date_v1";

function safeParseJson(raw) {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function formatCount(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value >= 1000) {
      const k = value / 1000;
      const str = k.toFixed(value % 1000 === 0 ? 0 : 1);
      return `${str}k`.replace(".0k", "k");
    }
    return String(value);
  }
  return String(value ?? "0");
}

function readLocalJson(key, fallback) {
  try {
    const raw = window.localStorage?.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function formatDateInputValue(dateValue) {
  // dateValue: "YYYY-MM-DD" or ""
  if (!dateValue) return "";
  try {
    const [y, m, d] = String(dateValue).split("-");
    if (!y || !m || !d) return "";
    return `${d}/${m}/${y}`;
  } catch {
    return "";
  }
}

export default function ProfilePage({
  onNavHome,
  onNavGirvi,
  onNavBills,
  onNavReports,
  onNavProfile,
}) {
  const defaultProfile = {
    shopkeeperName: "Rajesh Kumar Gupta",
    mobile: "+91 98765 43210",
    email: "rajesh@dukankanata.in",
    address: "Sadar Bazar, Agra — 282001",
  };

  const [profile, setProfile] = useState(() => {
    const rawProfile = window.localStorage?.getItem(PROFILE_STORAGE_KEY);
    const parsedProfile = rawProfile ? safeParseJson(rawProfile) : null;
    return parsedProfile
      ? { ...defaultProfile, ...parsedProfile }
      : defaultProfile;
  });

  const [avatarUrl, setAvatarUrl] = useState(() => {
    const rawAvatar = window.localStorage?.getItem(AVATAR_STORAGE_KEY);
    return rawAvatar || "";
  });

  const [membershipJoinDate, setMembershipJoinDate] = useState(() => {
    const raw = window.localStorage?.getItem(MEMBERSHIP_JOIN_DATE_KEY);
    return typeof raw === "string" ? raw : "";
  });

  const initials = useMemo(() => {
    const s = (profile.shopkeeperName || "").trim();
    if (!s) return "RK";
    const parts = s.split(/\s+/).filter(Boolean);
    const a = (parts[0] || "R")[0] || "R";
    const b = (parts[1] || parts[0] || "K")[0] || "K";
    return `${a}${b}`.toUpperCase();
  }, [profile.shopkeeperName]);

  const activeGirviCount = useMemo(() => {
    const parsedLedger = readLocalJson(STORAGE_KEY, []);
    if (!Array.isArray(parsedLedger)) return 0;
    return parsedLedger.filter((c) => !c?.wapas).length;
  }, []);

  const totalBillsCount = useMemo(() => {
    const parsedBills = readLocalJson(BILL_STORAGE_KEY, []);
    return Array.isArray(parsedBills) ? parsedBills.length : 0;
  }, []);

  const membershipLabel = useMemo(() => {
    if (!membershipJoinDate) return "Since —";
    const parts = String(membershipJoinDate).split("-");
    const y = parts[0] || "";
    return y ? `Since ${y}` : "Since —";
  }, [membershipJoinDate]);

  const membershipDateText = useMemo(() => {
    if (!membershipJoinDate) return "Not set";
    return formatDateInputValue(membershipJoinDate) || "Not set";
  }, [membershipJoinDate]);

  useEffect(() => {
    try {
      window.localStorage?.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(profile),
      );
    } catch {
      // ignore
    }
  }, [profile]);

  useEffect(() => {
    try {
      window.localStorage?.setItem(
        MEMBERSHIP_JOIN_DATE_KEY,
        membershipJoinDate || "",
      );
    } catch {
      // ignore
    }
  }, [membershipJoinDate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setAvatarUrl(result);
      try {
        window.localStorage?.setItem(AVATAR_STORAGE_KEY, result);
      } catch {
        // ignore
      }
    };
    reader.readAsDataURL(file);
  };

  const onChangeField = (key) => (e) => {
    setProfile((p) => ({ ...p, [key]: e.target.value }));
  };

  return (
    <FrontShim
      pageTitle="Profile"
      active="profile"
      onNavHome={onNavHome}
      onNavGirvi={onNavGirvi}
      onNavBills={onNavBills}
      onNavReports={onNavReports}
      onNavProfile={onNavProfile}
    >
      <div className="fp-profile">
        {/* Top avatar (hero area remove, just card ke upar) */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          <label
            className="fp-profile-avatarUpload"
            title="Upload profile image"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                border: "3px solid rgba(200,168,75,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                background: "rgba(0,0,0,0.05)",
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <span className="fp-profile-idText">{initials}</span>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
            <div className="fp-profile-avatarUploadText">Upload</div>
          </label>
        </div>

        <div className="fp-profile-card">
          <div className="fp-profile-name">Mera Profile</div>

          <div className="fp-profile-chips">
            <Chip variant="gold">Girvi Shop</Chip>
            <Chip variant="green">Verified</Chip>
            <Chip variant="neutral">{membershipLabel}</Chip>
          </div>

          <div className="fp-profile-stats">
            <Stat value={formatCount(activeGirviCount)} label="Active Girvi" />
            <Stat value={formatCount(totalBillsCount)} label="Total Bills" />
            <Stat value={membershipDateText} label="Membership" />
          </div>
        </div>

        <div className="fp-profile-sectionHead">Personal Details</div>

        <div className="fp-profile-detailsCard">
          <DetailRow icon="👤" title="Poora naam">
            <input
              className="fp-profile-input"
              value={profile.shopkeeperName}
              onChange={onChangeField("shopkeeperName")}
              placeholder="Enter your full name"
            />
          </DetailRow>

          <DetailRow icon="📱" title="Mobile number">
            <input
              className="fp-profile-input"
              value={profile.mobile}
              onChange={onChangeField("mobile")}
              placeholder="Enter mobile number"
            />
          </DetailRow>

          <DetailRow icon="✉️" title="Email">
            <input
              className="fp-profile-input"
              value={profile.email}
              onChange={onChangeField("email")}
              placeholder="Enter email"
            />
          </DetailRow>

          <DetailRow icon="📍" title="Pata">
            <textarea
              className="fp-profile-textarea"
              value={profile.address}
              onChange={onChangeField("address")}
              placeholder="Enter address"
              rows={2}
            />
          </DetailRow>

          <DetailRow icon="🗓️" title="Membership Join Date">
            <input
              className="fp-profile-input"
              type="date"
              value={membershipJoinDate}
              onChange={(e) => setMembershipJoinDate(e.target.value)}
              style={{ height: 44 }}
            />
          </DetailRow>
        </div>
      </div>
    </FrontShim>
  );
}
