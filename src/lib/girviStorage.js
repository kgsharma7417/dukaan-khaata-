import { STORAGE_KEY } from "./girviUtils";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const auth = getAuth();

function getUid() {
  return auth.currentUser?.uid || null;
}

function userStorageKey() {
  const uid = getUid();
  // If user is not logged in, fall back to old key (pre-existing behavior).
  return uid ? `${STORAGE_KEY}::uid:${uid}` : STORAGE_KEY;
}

export async function cloudLoad() {
  const uid = getUid();

  // If logged in, load per-user ledger.
  if (uid) {
    try {
      const docRef = doc(db, "users", uid, "ledger", "data");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().items || [];
      }
    } catch (error) {
      console.error("Error loading from Firestore (user ledger):", error);
      // continue to fallback below
    }
  }

  // Fallback to localStorage (per-user if possible).
  try {
    const raw = window.localStorage?.getItem(userStorageKey());
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function cloudSave(data) {
  const uid = getUid();

  // If logged in, save per-user ledger.
  if (uid) {
    try {
      const docRef = doc(db, "users", uid, "ledger", "data");
      await setDoc(docRef, { items: data });
      return;
    } catch (error) {
      console.error("Error saving to Firestore (user ledger):", error);
      // continue to fallback below
    }
  }

  // Fallback to localStorage (per-user if possible).
  try {
    const json = JSON.stringify(data);
    window.localStorage?.setItem(userStorageKey(), json);
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}
