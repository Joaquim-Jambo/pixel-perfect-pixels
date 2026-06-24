importScripts("https://www.gstatic.com/firebasejs/12.15.0/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging-compat.js")

firebase.initializeApp({
  apiKey: "AIzaSyDwc9An18tiB3IIJaHYW4zt2dsC29ipQzs",
  projectId: "onze-f7632",
  messagingSenderId: "475374722802",
  appId: "1:475374722802:web:d332bfcfb21d8e5569fa6b",
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "Onze"
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/logo.png",
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const urlToOpen = new URL("/app/notifications", self.location.origin)
  event.waitUntil(clients.openWindow(urlToOpen.toString()))
})
