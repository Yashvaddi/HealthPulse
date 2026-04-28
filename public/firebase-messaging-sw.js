importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAgVsTUrmC7DiL1w0SNyDp3H1FKQfoTmiM",
  authDomain: "vehicle-telemetry-dashboard.firebaseapp.com",
  projectId: "vehicle-telemetry-dashboard",
  storageBucket: "vehicle-telemetry-dashboard.firebasestorage.app",
  messagingSenderId: "536167985267",
  appId: "1:536167985267:web:6b567ff6aa50268a557a06"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.svg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
