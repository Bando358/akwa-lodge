/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/11.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBc9emuVxOlaa5XgXzdkRgIrLNK_YSagw8",
  authDomain: "akwa-luxury-lodge.firebaseapp.com",
  projectId: "akwa-luxury-lodge",
  messagingSenderId: "981098503253",
  appId: "1:981098503253:web:bb1b1fa9715a7e596ac8dc",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "Akwa Luxury Lodge";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/logo.png",
    badge: "/logo.png",
    data: {
      url: payload.data?.url || "/",
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
