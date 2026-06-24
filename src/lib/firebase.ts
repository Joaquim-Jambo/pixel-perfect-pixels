import { initializeApp, FirebaseApp } from "firebase/app"
import { getMessaging, Messaging, getToken, onMessage } from "firebase/messaging"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

console.log("[FCM] Firebase config loaded:", {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? "present" : "missing",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? "present" : "missing",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? "present" : "missing",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ? "present" : "missing",
  vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY ? "present" : "missing",
})

let app: FirebaseApp | null = null
let messaging: Messaging | null = null

export function initFirebase(): boolean {
  console.log("[FCM] initFirebase called, app exists:", !!app)
  if (app) return true
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn("[FCM] Firebase config not found — skipping FCM initialization")
    return false
  }
  try {
    app = initializeApp(firebaseConfig)
    console.log("[FCM] Firebase app initialized")
    messaging = getMessaging(app)
    console.log("[FCM] Messaging instance obtained")
    return true
  } catch (error) {
    console.error("[FCM] Failed to initialize Firebase:", error)
    return false
  }
}

export function getFcmMessaging(): Messaging | null {
  return messaging
}

export async function requestFcmToken(): Promise<string | null> {
  console.log("[FCM] requestFcmToken called, messaging exists:", !!messaging)
  if (!messaging) {
    const ok = initFirebase()
    if (!ok) {
      console.warn("[FCM] Could not init Firebase, returning null")
      return null
    }
  }
  if (!messaging) {
    console.warn("[FCM] Messaging still null after init, returning null")
    return null
  }

  try {
    console.log("[FCM] Requesting notification permission...")
    const permission = await Notification.requestPermission()
    console.log("[FCM] Notification permission result:", permission)
    if (permission !== "granted") {
      console.warn("[FCM] Notification permission denied")
      return null
    }

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY
    console.log("[FCM] Calling getToken with vapidKey:", vapidKey ? "present" : "MISSING")
    const currentToken = await getToken(messaging, { vapidKey })
    console.log("[FCM] getToken result:", currentToken ? "got token (length=" + currentToken.length + ")" : "null")
    if (currentToken) {
      return currentToken
    }
    console.warn("[FCM] No FCM token available")
    return null
  } catch (error) {
    console.error("[FCM] Error getting FCM token:", error)
    if (error instanceof Error) {
      console.error("[FCM] Error name:", error.name)
      console.error("[FCM] Error message:", error.message)
      console.error("[FCM] Error stack:", error.stack)
    }
    return null
  }
}

export function onForegroundMessage(callback: (payload: unknown) => void): void {
  if (!messaging) return
  onMessage(messaging, callback)
}
