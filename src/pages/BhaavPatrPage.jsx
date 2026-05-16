import { useCallback, useEffect, useMemo, useState } from "react";
import FrontShim from "../features/frontPage/FrontShim.jsx";
import { COLORS } from "../constants/colors.js";

const GOLD_AMBER = "#BA7517";

const GOLD_DARK = "#633806";
const SILVER_GRAY = "#888780";
const CARD_BG = "#fafaf7";
const BORDER = "0.5px solid #e5e3db";

const INR_PER_GRAM_PER_USD_PER_TROY_OZ = 83.5 / 31.1035;

function formatInr(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "—";
  return Math.round(num).toLocaleString("en-IN");
}

function calcOtherGoldRates(rate24k) {
  const r24 = Number(rate24k);
  if (!Number.isFinite(r24) || r24 <= 0) return { rate22k: 0, rate18k: 0 };
  const rate22k = Math.round((r24 * 22) / 24);
  const rate18k = Math.round((r24 * 18) / 24);
  return { rate22k, rate18k };
}

export default function BhaavPatrPage({
  onNavHome,
  onNavGirvi,
  onNavBills,
  onNavReports,
  onNavProfile,
}) {
  const [loading, setLoading] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState("—");

  // Store gold/silver in INR/gram, INR totals are derived.
  const [gold24k, setGold24k] = useState(0);
  const [gold22k, setGold22k] = useState(0);
  const [gold18k, setGold18k] = useState(0);
  const [silverPerGram, setSilverPerGram] = useState(0);

  const [manual24kInput, setManual24kInput] = useState("");
  const [manualSilverInput, setManualSilverInput] = useState("");

  const fallbackRates = useMemo(() => {
    // Hardcoded fallback (approx). Used when API fails.
    // Keep in INR per gram.
    const fallbackGold24k = 6000;
    const fallbackSilverPerGram = 80;
    const { rate22k, rate18k } = calcOtherGoldRates(fallbackGold24k);
    return {
      gold24k: fallbackGold24k,
      gold22k: rate22k,
      gold18k: rate18k,
      silverPerGram: fallbackSilverPerGram,
    };
  }, []);

  const applyRates = useCallback((rates) => {
    const safe24 = Number(rates?.gold24k ?? 0);
    const safeSilver = Number(rates?.silverPerGram ?? 0);
    const { rate22k, rate18k } = calcOtherGoldRates(safe24);

    setGold24k(safe24);
    setGold22k(rate22k);
    setGold18k(rate18k);
    setSilverPerGram(safeSilver);
  }, []);

  const fetchRates = useCallback(async () => {
    setLoading(true);

    try {
      // Live rates: API metals.live (global). If you later provide an Agra-specific source,
      // just change the URL here.
      const resp = await fetch("https://api.metals.live/v1/spot/gold,silver");

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const data = await resp.json();
      const first = Array.isArray(data) ? data.find(Boolean) : null;
      const goldUsdPerOz = Number(first?.gold);
      const silverUsdPerOz = Number(first?.silver);

      if (!Number.isFinite(goldUsdPerOz) || !Number.isFinite(silverUsdPerOz)) {
        throw new Error("Bad API response");
      }

      // Convert USD/troy oz -> INR/gram
      const gold24kInrPerGram = goldUsdPerOz * INR_PER_GRAM_PER_USD_PER_TROY_OZ;
      const silverInrPerGram =
        silverUsdPerOz * INR_PER_GRAM_PER_USD_PER_TROY_OZ;

      applyRates({
        gold24k: gold24kInrPerGram,
        silverPerGram: silverInrPerGram,
      });

      const now = new Date();
      setLastUpdatedAt(now.toLocaleString("hi-IN") + " · Live");
    } catch {
      applyRates(fallbackRates);

      const now = new Date();
      setLastUpdatedAt(`Fallback · ${now.toLocaleString("hi-IN")}`);
    } finally {
      setLoading(false);
    }
  }, [applyRates, fallbackRates]);

  useEffect(() => {
    // Avoid synchronous cascading renders; run async fetch after paint.
    queueMicrotask(() => {
      fetchRates();
    });
  }, [fetchRates]);

  const onDaalo = useCallback(() => {
    const manual = Number(manual24kInput.replace(/,/g, ""));
    if (!Number.isFinite(manual) || manual <= 0) {
      alert("कृपया 24K price (₹/gram) valid number डालें।");
      return;
    }

    const { rate22k, rate18k } = calcOtherGoldRates(manual);
    setGold24k(Math.round(manual));
    setGold22k(rate22k);
    setGold18k(rate18k);
    setLastUpdatedAt(`Manual · ${new Date().toLocaleString("hi-IN")}`);
  }, [manual24kInput]);

  const silver100g = useMemo(
    () => Math.round(silverPerGram * 100),
    [silverPerGram],
  );
  const silver1kg = useMemo(
    () => Math.round(silverPerGram * 1000),
    [silverPerGram],
  );

  const diamondIcon = "💎";
  const goldCardStyle = {
    background: CARD_BG,
    border: BORDER,
    borderRadius: 12,
    padding: 14,
  };

  const btnBase = {
    borderRadius: 999,
    padding: "10px 14px",
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  const sectionTitleStyle = {
    fontSize: 14,
    fontWeight: 500,
    color: GOLD_DARK,
    margin: "2px 0 10px",
  };
  const labelStyle = { fontSize: 11, fontWeight: 400, color: "#6b7280" };
  const valueStyle = { fontSize: 13, fontWeight: 500, color: "#0f172a" };

  const rateCellCommon = {
    background: "rgba(255,255,255,0.55)",
    borderRadius: 8,
    border: "0.5px solid rgba(229,227,219,0.7)",
    padding: 12,
    minHeight: 62,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };

  const goldCellStyle = {
    ...rateCellCommon,
    border: `0.5px solid ${"rgba(186,117,23,0.25)"}`,
  };

  const silverCellStyle = {
    ...rateCellCommon,
    border: `0.5px solid rgba(136,135,128,0.25)`,
  };

  const outlineBtnGreen = {
    ...btnBase,
    background: "transparent",
    border: `2px solid rgba(31, 187, 126, 0.7)`,
    color: "rgba(10, 95, 62, 0.98)",
  };

  const outlineBtnAmber = {
    ...btnBase,
    background: "transparent",
    border: `2px solid rgba(186,117,23,0.55)`,
    color: "rgba(99,56,6,0.95)",
  };

  const solidBtnAmber = {
    ...btnBase,
    background: GOLD_AMBER,
    border: `2px solid rgba(99,56,6,0.35)`,
    color: "#fff",
  };

  const topHeaderBg = {
    background: "transparent",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  };

  return (
    <FrontShim
      pageTitle="Bhaav Patr"
      active="reports"
      onNavHome={onNavHome}
      onNavGirvi={onNavGirvi}
      onNavBills={onNavBills}
      onNavReports={onNavReports}
      onNavProfile={onNavProfile}
    >
      <div style={{ paddingBottom: 14 }}>
        {/* SECTION 1 — TOP HEADER */}
        <div style={topHeaderBg}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>{diamondIcon}</span>
              <div style={{ fontSize: 22, fontWeight: 500, color: GOLD_DARK }}>
                Bhaav patr
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                aria-hidden="true"
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: "#22c55e",
                  boxShadow: "0 0 0 4px rgba(34,197,94,0.15)",
                }}
              />
              <div style={{ fontSize: 13, fontWeight: 400, color: "#1f2937" }}>
                Aaj ka sona-chandi bhav
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            <button type="button" style={outlineBtnGreen} onClick={fetchRates}>
              Bhav refresh karo
            </button>
            <button
              type="button"
              style={outlineBtnAmber}
              onClick={() => window.print()}
              title="Rate board ko print / PDF ke liye"
            >
              PDF nikalo
            </button>
          </div>
        </div>

        {/* SECTION 2 — LIVE RATE BOARD */}
        <div style={{ marginTop: 14 }}>
          <div style={{ ...goldCardStyle, position: "relative" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
                gap: 12,
              }}
            >
              <div style={{ ...sectionTitleStyle, margin: 0 }}>
                Live rate board
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 400,
                  color: SILVER_GRAY,
                  textAlign: "right",
                }}
              >
                Last updated: {lastUpdatedAt}
              </div>
            </div>

            {loading ? (
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  color: "#6b7280",
                  padding: "10px 0",
                }}
              >
                Rate load ho raha hai…
              </div>
            ) : null}

            <div
              style={{
                opacity: loading ? 0.65 : 1,
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 10,
              }}
              aria-label="Gold and silver live rates"
            >
              {/* GOLD ROW */}
              <div style={{ ...goldCellStyle, gridColumn: "span 1" }}>
                <div style={labelStyle}>Sona 24K</div>
                <div
                  style={{ ...valueStyle, color: GOLD_DARK, fontWeight: 500 }}
                >
                  ₹ {formatInr(gold24k)} / ग्राम
                </div>
              </div>
              <div style={goldCellStyle}>
                <div style={labelStyle}>Sona 22K</div>
                <div style={{ ...valueStyle, color: GOLD_DARK }}>
                  ₹ {formatInr(gold22k)} / ग्राम
                </div>
              </div>
              <div style={goldCellStyle}>
                <div style={labelStyle}>Sona 18K</div>
                <div style={{ ...valueStyle, color: GOLD_DARK }}>
                  ₹ {formatInr(gold18k)} / ग्राम
                </div>
              </div>

              {/* SILVER ROW */}
              <div style={{ ...silverCellStyle }}>
                <div style={labelStyle}>Chandi per gram</div>
                <div style={{ ...valueStyle, color: SILVER_GRAY }}>
                  ₹ {formatInr(silverPerGram)} / ग्राम
                </div>
              </div>
              <div style={silverCellStyle}>
                <div style={labelStyle}>Chandi 100g total</div>
                <div style={{ ...valueStyle, color: SILVER_GRAY }}>
                  ₹ {formatInr(silver100g)}
                </div>
              </div>
              <div style={silverCellStyle}>
                <div style={labelStyle}>Chandi 1kg total</div>
                <div style={{ ...valueStyle, color: SILVER_GRAY }}>
                  ₹ {formatInr(silver1kg)}
                </div>
              </div>
            </div>

            {/* Manual override bar */}
            <div
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTop: "0.5px solid rgba(229,227,219,0.9)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              {/* Manual 24K */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  flex: "1 1 220px",
                }}
              >
                <div
                  style={{ fontSize: 11, fontWeight: 400, color: "#6b7280" }}
                >
                  Sona manual (24K)
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input
                    value={manual24kInput}
                    onChange={(e) => setManual24kInput(e.target.value)}
                    placeholder="₹/gram me 24K price"
                    inputMode="decimal"
                    style={{
                      height: 42,
                      borderRadius: 8,
                      border: "0.5px solid rgba(229,227,219,0.95)",
                      background: "rgba(255,255,255,0.65)",
                      padding: "0 12px",
                      fontSize: 13,
                      fontWeight: 500,
                      outline: "none",
                      width: "100%",
                    }}
                  />
                </div>
              </div>

              <button
                type="button"
                style={{
                  ...solidBtnAmber,
                  padding: "10px 18px",
                  minWidth: 110,
                }}
                onClick={onDaalo}
              >
                Enter Karo
              </button>

              {/* Manual Silver */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  flex: "1 1 220px",
                  marginTop: 6,
                }}
              >
                <div
                  style={{ fontSize: 11, fontWeight: 400, color: "#6b7280" }}
                >
                  Chandi manual
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input
                    value={manualSilverInput}
                    onChange={(e) => setManualSilverInput(e.target.value)}
                    placeholder="₹/gram me chandi rate"
                    inputMode="decimal"
                    style={{
                      height: 42,
                      borderRadius: 8,
                      border: "0.5px solid rgba(229,227,219,0.95)",
                      background: "rgba(255,255,255,0.65)",
                      padding: "0 12px",
                      fontSize: 13,
                      fontWeight: 500,
                      outline: "none",
                      width: "100%",
                    }}
                  />
                </div>
              </div>

              <button
                type="button"
                style={{
                  ...solidBtnAmber,
                  padding: "10px 18px",
                  minWidth: 110,
                  background: "#fff2cc",
                  border: "2px solid rgba(186,117,23,0.35)",
                  color: "#633806",
                }}
                onClick={() => {
                  const manual = Number(manualSilverInput.replace(/,/g, ""));
                  if (!Number.isFinite(manual) || manual <= 0) {
                    alert("कृपया Silver rate (₹/gram) valid number डालें।");
                    return;
                  }
                  setSilverPerGram(Math.round(manual));
                  setLastUpdatedAt(
                    `Manual · ${new Date().toLocaleString("hi-IN")}`,
                  );
                }}
              >
                Enter Kro
              </button>
            </div>
          </div>
        </div>

        {/* spacer for bottom nav */}
        <div style={{ height: 8 }} />
      </div>
    </FrontShim>
  );
}
