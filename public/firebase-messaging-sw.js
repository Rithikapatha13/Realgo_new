// Dynamic Firebase Service Worker
const urlParams = new URL(location).searchParams;
const apiKey = urlParams.get("apiKey");
const projectId = urlParams.get("projectId");
const messagingSenderId = urlParams.get("messagingSenderId");
const appId = urlParams.get("appId");

importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

if (apiKey && projectId && messagingSenderId && appId) {
  firebase.initializeApp({
    apiKey,
    authDomain: `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket: `${projectId}.appspot.com`,
    messagingSenderId,
    appId
  });

  const messaging = firebase.messaging();

  // Handle background notifications
  messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Background message received:", payload);

    const notificationTitle = payload.notification?.title || "RealGo Update";
    const notificationOptions = {
      body: payload.notification?.body || "",
      icon: "/favicon.ico",
      data: payload.data || {}
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} else {
  console.warn("[firebase-messaging-sw.js] Firebase credentials missing from SW URL query. Service worker initialized in idle mode.");
}
