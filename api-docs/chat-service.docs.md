# Chatroom & Messaging API Documentation

All endpoints are prefixed with `/chatroom`.

---

## 1. Create Chatroom
- **POST** `/chatroom`
- **Auth Required:** Yes (Bearer JWT)
- **Description:** Creates a new chatroom for the authenticated user.
- **Request Body:**
  ```json
  { "name": "My Chatroom" }
  ```
- **Response:**
  ```json
  { "success": true, "chatroom": { "id": 1, "userId": 1, "name": "My Chatroom", ... } }
  ```

---

## 2. List Chatrooms
- **GET** `/chatroom`
- **Auth Required:** Yes (Bearer JWT)
- **Description:** Lists all chatrooms for the user (uses Redis caching).
- **Response:**
  ```json
  { "success": true, "chatrooms": [ { "id": 1, "name": "My Chatroom", ... } ] }
  ```

---

## 3. Get Chatroom Details
- **GET** `/chatroom/:id`
- **Auth Required:** Yes (Bearer JWT)
- **Description:** Retrieves detailed information about a specific chatroom.
- **Response:**
  ```json
  { "success": true, "chatroom": { "id": 1, "name": "My Chatroom", ... } }
  ```

---

## 4. Send Message to Chatroom (Async Gemini)
- **POST** `/chatroom/:id/message`
- **Auth Required:** Yes (Bearer JWT)
- **Description:** Sends a message to the chatroom. The message is enqueued for async Gemini processing.
- **Request Body:**
  ```json
  { "content": "Hello Gemini!" }
  ```
- **Response:**
  ```json
  { "success": true, "message": "Message enqueued for processing" }
  ```

---

## Async Gemini Flow
1. User sends a message to `/chatroom/:id/message`.
2. The message is stored and enqueued to RabbitMQ.
3. A background worker consumes the queue, calls the Gemini API, and stores the Gemini response as a new message in the same chatroom.
4. User can fetch all messages (see below).

---

## 5. (Optional) List Messages in Chatroom
- **GET** `/chatroom/:id/messages`
- **Auth Required:** Yes (Bearer JWT)
- **Description:** Lists all messages (user and Gemini) in the chatroom, ordered by time.
- **Response:**
  ```json
  { "success": true, "messages": [ { "id": 1, "sender": "user", "content": "Hi" }, { "id": 2, "sender": "gemini", "content": "Hello!" } ] }
  ```

---

## Notes
- All endpoints return JSON with a `success` boolean and a `message` or data.
- All endpoints require authentication (Bearer JWT).
- Async Gemini responses are stored as messages in the chatroom.
- Use `/chatroom/:id/messages` to fetch the full conversation history. 