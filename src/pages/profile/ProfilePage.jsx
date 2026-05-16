import { useEffect, useMemo, useState } from "react";
import FrontShim from "../../features/frontPage/FrontShim.jsx";
import { STORAGE_KEY } from "../../lib/girviUtils.js";

import ProfileHeader from "./components/ProfileHeader/ProfileHeader.jsx";

import PersonalDetails from "../Profile/components/PersonalDetails/PersonalDetails.jsx";
import AppSettings from "../Profile/components/AppSettings/AppSettings.jsx";
import Support from "../Profile/components/Support/Support.jsx";

import { LANG, STRINGS } from "../Profile/Profile.strings.js";

const PROFILE_STORAGE_KEY = "dukkan_khaata_profile_v1";
const AVATAR_STORAGE_KEY = "dukkan_khaata_profile_avatar_v1";
const BILL_STORAGE_KEY = "dukkan_khaata_saved_bills_v1";
const MEMBERSHIP_JOIN_DATE_KEY = "dukkan_khaata_membership_join_date_v1";

const PROFILE_LANGUAGE_KEY = "dukkan_khaata_profile_language_v1";
const APP_SETTINGS_KEY = "dukkan_khaata_app_settings_v1";

function Stat({ value, label }) {
  return (
    <div className="fp-profile-stat">
      <div className="fp-profile-stat-value">{value}</div>
      <div className="fp-profile-stat-label">{label}</div>
    </div>
  );
}

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
  if (!dateValue) return "";
  try {
    const [y, m, d] = String(dateValue).split("-");
    if (!y || !m || !d) return "";
    return `${d}/${m}/${y}`;
  } catch {
    return "";
  }
}

function clampText(value, maxLen) {
  const s = String(value ?? "").trim();
  if (s.length <= maxLen) return s;
  return `${s.slice(0, maxLen - 1)}…`;
}

function getInitialLanguage() {
  try {
    const raw = window.localStorage?.getItem(PROFILE_LANGUAGE_KEY);
    if (raw === LANG.HI || raw === LANG.EN) return raw;
    return LANG.EN;
  } catch {
    return LANG.EN;
  }
}

export default function ProfilePage({
  onNavHome,
  onNavGirvi,
  onNavBills,
  onNavReports,
  onNavProfile,
  onAboutDeveloper,
}) {
  const defaultProfile = {
    shopkeeperName: "Apna Naam Yahan Bharein",
    mobile: "+91 xxxxxxxxxx",
    email: "krish@example.in",
    address: "Sadar Bazar, Agra — 282001",
    gstOrLicense: "",
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

  const [isEditMode, setIsEditMode] = useState(false);

  const [language, setLanguage] = useState(() => getInitialLanguage());

  const [appSettings, setAppSettings] = useState(() => {
    const stored = readLocalJson(APP_SETTINGS_KEY, null);
    return stored && typeof stored === "object"
      ? {
          defaultBayarDaarRate: stored.defaultBayarDaarRate ?? "2%",
          defaultBayarDaarTitleSub:
            stored.defaultBayarDaarTitleSub ?? "Naye sirvi live",
          reminderStatus: stored.reminderStatus ?? "Chalu",
        }
      : {
          defaultBayarDaarRate: "2%",
          defaultBayarDaarTitleSub: "Naye sirvi live",
          reminderStatus: "Chalu",
        };
  });

  const t = useMemo(() => STRINGS[language], [language]);

  const initials = useMemo(() => {
    const s = (profile.shopkeeperName || "").trim();
    if (!s) return "RK";
    const parts = s.split(/\s+/).filter(Boolean);
    const a = (parts[0] || "R")[0] || "R";
    const b = (parts[1] || parts[0] || "K")[0] || "K";
    return `${a}${b}`.toUpperCase();
  }, [profile.shopkeeperName]);

  function isWapasValue(v) {
    if (typeof v === "boolean") return v;
    if (typeof v === "number") return v === 1;
    if (typeof v === "string") {
      const s = v.trim().toLowerCase();
      if (s === "true" || s === "1" || s === "yes" || s === "y") return true;
      if (s === "false" || s === "0" || s === "no" || s === "n") return false;
    }
    return false;
  }

  const totalBillsCount = useMemo(() => {
    const parsedBills = readLocalJson(BILL_STORAGE_KEY, []);
    return Array.isArray(parsedBills) ? parsedBills.length : 0;
  }, []);

  const membershipLabel = useMemo(() => {
    if (!membershipJoinDate) return `${t.membershipSincePrefix} —`;
    const parts = String(membershipJoinDate).split("-");
    const y = parts[0] || "";
    return y
      ? `${t.membershipSincePrefix} ${y}`
      : `${t.membershipSincePrefix} —`;
  }, [membershipJoinDate, t]);

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

  useEffect(() => {
    try {
      window.localStorage?.setItem(PROFILE_LANGUAGE_KEY, language);
    } catch {
      // ignore
    }
  }, [language]);

  useEffect(() => {
    try {
      window.localStorage?.setItem(
        APP_SETTINGS_KEY,
        JSON.stringify(appSettings),
      );
    } catch {
      // ignore
    }
  }, [appSettings]);

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

  const toggleEditMode = () => setIsEditMode((v) => !v);

  const toggleLanguage = () =>
    setLanguage((v) => (v === LANG.HI ? LANG.EN : LANG.HI));

  const displayProfileForStats = useMemo(
    () => ({
      shopkeeperName: clampText(profile.shopkeeperName, 42),
      mobile: profile.mobile,
    }),
    [profile.shopkeeperName, profile.mobile],
  );

  return (
    <FrontShim
      pageTitle={t.pageTitle}
      active="profile"
      onNavHome={onNavHome}
      onNavGirvi={onNavGirvi}
      onNavBills={onNavBills}
      onNavReports={onNavReports}
      onNavProfile={onNavProfile}
      onAboutDeveloper={onAboutDeveloper}
    >
      <div className="fp-profile">
        <ProfileHeader
          t={t}
          profile={displayProfileForStats}
          avatarUrl={avatarUrl}
          initials={initials}
          membershipLabel={membershipLabel}
          onAvatarChange={handleAvatarChange}
        />

        <div className="fp-profile-statsCard">
          <div className="fp-profile-stats" style={{ gap: 10 }}>
            <Stat
              value={formatCount(totalBillsCount)}
              label={t.labelTotalBills}
            />

            <Stat value={membershipDateText} label={t.labelMembership} />
          </div>
        </div>

        <div className="fp-profile-sectionHead" style={{ marginTop: 14 }}>
          <div className="fp-profile-sectionHeadLeft">{t.personalTitle}</div>

          <button
            type="button"
            className="fp-profile-editBtn"
            onClick={toggleEditMode}
            aria-pressed={isEditMode}
          >
            {isEditMode ? t.done : t.edit}
          </button>
        </div>

        <PersonalDetails
          t={t}
          isEditMode={isEditMode}
          profile={profile}
          onChangeField={onChangeField}
          membershipJoinDate={membershipJoinDate}
          setMembershipJoinDate={setMembershipJoinDate}
          membershipDateText={membershipDateText}
        />

        <AppSettings
          t={t}
          isEditMode={isEditMode}
          language={language}
          LANG={LANG}
          appSettings={{
            defaultBayarDaarRate: appSettings.defaultBayarDaarRate,
            defaultBayarDaarTitleSub: appSettings.defaultBayarDaarTitleSub,
          }}
          setAppSettings={setAppSettings}
          toggleLanguage={toggleLanguage}
        />

        <Support t={t} />
      </div>
    </FrontShim>
  );
}
