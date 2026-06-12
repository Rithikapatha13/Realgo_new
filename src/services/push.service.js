import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { registerPushToken, deregisterPushToken } from "./common.service";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;
const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

/**
 * Initializes Firebase, requests notification permissions,
 * registers the service worker, and uploads the client token.
 */
export async function initializePushNotifications() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
    console.warn("[FCM] Browser does not support push notifications.");
    return;
  }

  if (!apiKey || !projectId || !messagingSenderId || !appId) {
    console.warn("[FCM] Firebase configuration variables are missing. Push notifications skipped.");
    return;
  }

  try {
    const firebaseApp = initializeApp({
      apiKey,
      authDomain: `${projectId}.firebaseapp.com`,
      projectId,
      storageBucket: `${projectId}.appspot.com`,
      messagingSenderId,
      appId
    });

    const messaging = getMessaging(firebaseApp);

    const swUrl = `/firebase-messaging-sw.js?apiKey=${apiKey}&projectId=${projectId}&messagingSenderId=${messagingSenderId}&appId=${appId}`;
    const registration = await navigator.serviceWorker.register(swUrl);
    
    console.log("[FCM] Service worker registered.");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("[FCM] Notification permission denied.");
      return;
    }

    const token = await getToken(messaging, {
      serviceWorkerRegistration: registration,
      vapidKey
    });

    if (token) {
      await registerPushToken(token);
      localStorage.setItem("fcm_token", token);
      console.log("[FCM] Device token registered with server.");
    } else {
      console.warn("[FCM] No token retrieved.");
    }
  } catch (error) {
    console.error("[FCM] Initialization failed:", error);
  }
}

/**
 * Cleans up the token from server and local storage on logout.
 */
export async function cleanupPushNotifications() {
  const token = localStorage.getItem("fcm_token");
  if (!token) return;

  try {
    await deregisterPushToken(token);
    localStorage.removeItem("fcm_token");
    console.log("[FCM] Push token deregistered.");
  } catch (error) {
    console.error("[FCM] Token cleanup failed:", error);
  }
}
