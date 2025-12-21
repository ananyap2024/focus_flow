# FocusFlow Frontend-Backend Integration Guide

This guide explains how to connect your Web or Android frontend to the FocusFlow backend.

## 1. Backend Base URLs

The URL you use depends on where your frontend is running.

| Frontend Environment | Base URL to Use |
| :--- | :--- |
| **Local Web Browser** | `http://127.0.0.1:8000` |
| **Android Emulator** | `http://10.0.2.2:8000` |
| **Real Android Device** | `http://<YOUR_PC_LOCAL_IP>:8000` (e.g., `192.168.1.5:8000`) |

> **Note:** Do not use `localhost` inside the Android Emulator; use `10.0.2.2` instead.

---

## 2. API Endpoints

### A. Send Notification / Check Priority
**Endpoint:** `POST /api/notify`

**Query Parameters:**
- `focus_mode` (boolean): `true` or `false`

**Request Body (JSON):**
> **Important:** The key is `app_name`, NOT `app`.

```json
{
  "app_name": "instagram",
  "title": "New Like",
  "message": "User123 liked your photo",
  "timestamp": "2023-10-27T10:00:00Z"
}
```

**Response (JSON):**
```json
{
  "app_name": "instagram",
  "title": "New Like",
  "message": "User123 liked your photo",
  "timestamp": "2023-10-27T10:00:00Z",
  "decision": "QUEUE",
  "reason": "Focus mode is active and app is not urgent."
}
```

### B. Get Summary (End Session)
**Endpoint:** `GET /api/summary`

**Response (JSON):**
```json
{
  "summary": "You missed 5 notifications. Instagram: 2 likes. Slack: 1 message from Boss. ..."
}
```

---

## 3. Code Examples

### JavaScript / TypeScript (Web)

Using `fetch`:

```javascript
const BASE_URL = "http://127.0.0.1:8000";

// 1. Send Notification
async function sendNotification(notification, isFocusMode) {
  const url = `${BASE_URL}/api/notify?focus_mode=${isFocusMode}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      app_name: notification.appName, // Ensure this maps to app_name
      title: notification.title,
      message: notification.message,
      timestamp: new Date().toISOString()
    })
  });

  const data = await response.json();
  console.log("Decision:", data.decision); // "ALLOW" or "QUEUE"
  return data.decision;
}

// 2. Get Summary
async function getSummary() {
  const response = await fetch(`${BASE_URL}/api/summary`);
  const data = await response.json();
  console.log("Summary:", data.summary);
  return data.summary;
}
```

### Kotlin (Android)

Using `Retrofit`:

**Service Interface:**
```kotlin
interface FocusFlowApi {
    @POST("/api/notify")
    suspend fun sendNotification(
        @Query("focus_mode") focusMode: Boolean,
        @Body notification: NotificationRequest
    ): NotificationResponse

    @GET("/api/summary")
    suspend fun getSummary(): SummaryResponse
}

data class NotificationRequest(
    @SerializedName("app_name") val appName: String, // Maps 'appName' to 'app_name' JSON key
    val title: String,
    val message: String,
    val timestamp: String? = null
)

data class NotificationResponse(
    val decision: String, // "ALLOW" or "QUEUE"
    val reason: String
)
```

**Retrofit Client Setup:**
```kotlin
val retrofit = Retrofit.Builder()
    .baseUrl("http://10.0.2.2:8000/") // Special alias for host loopback
    .addConverterFactory(GsonConverterFactory.create())
    .build()

val api = retrofit.create(FocusFlowApi::class.java)
```

---

## 4. Common Troubleshooting

1.  **CORS Errors (Web):**
    -   We have updated the backend to allow all origins (`*`). If you see CORS errors, ensure you restarted the backend:
        `uvicorn focusflow.main:app --reload`

2.  **Connection Refused (Android):**
    -   Did you use `localhost`? Change it to `10.0.2.2`.
    -   Is the backend running? Check your terminal.

3.  **Validation Error (422 Unprocessable Entity):**
    -   Check your JSON keys. The backend expects `app_name`, not `app`.
    -   Check `focus_mode` query param. It should be `?focus_mode=true` or `false`.
