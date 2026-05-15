import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,

  // Google
  GoogleAuthProvider,
  signInWithPopup,

  // Phone auth (OTP)
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithCredential,

  // Logout
  signOut,
} from "firebase/auth";
import { app } from "./firebase";

const auth = getAuth(app);

export function authListen(cb) {
  return onAuthStateChanged(auth, (u) => cb(u || null));
}

export async function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

/**
 * Logout current user.
 */
export async function logout() {
  return signOut(auth);
}

/**
 * Google sign-in (popup).
 */
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return signInWithPopup(auth, provider);
}

/**
 * Phone OTP:
 * 1) call sendOtpToPhone(phoneNumber, recaptchaContainerEl)
 * 2) receive confirmationResult + call verifyPhoneOtp(code, confirmationResult)
 *
 * IMPORTANT: caller must provide a real DOM element for Recaptcha.
 */
export async function sendOtpToPhone(phoneNumber, recaptchaContainerEl) {
  if (!recaptchaContainerEl) {
    throw new Error("Recaptcha container missing.");
  }

  // Create verifier bound to a concrete DOM element.
  const verifier = new RecaptchaVerifier(auth, recaptchaContainerEl, {
    size: "normal",
  });

  const phoneProvider = new PhoneAuthProvider(auth);
  const confirmationResult = await phoneProvider.verifyPhoneNumber(
    phoneNumber,
    verifier,
  );

  return confirmationResult;
}

export async function verifyPhoneOtp(otpCode, confirmationResult) {
  if (!confirmationResult) throw new Error("OTP session missing.");
  const credential = PhoneAuthProvider.credential(
    confirmationResult.verificationId,
    otpCode,
  );
  return signInWithCredential(auth, credential);
}
