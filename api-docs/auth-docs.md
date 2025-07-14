# Authentication API Documentation

All endpoints are prefixed with `/auth`.

## 1. Signup
- **POST** `/auth/signup`
- **Description:** Register a new user with mobile number and optional info.
- **Request Body:**
  ```json
  {
    "mobile": "123456789",
    "name": "Test User",
    "password": "testpass"
  }
  ```
- **Response:**
  ```json
  { "success": true, "message": "User registered successfully" }
  ```

---

## 2. Send OTP
- **POST** `/auth/send-otp`
- **Description:** Sends a mocked OTP to the user's mobile (returned in response).
- **Request Body:**
  ```json
  { "mobile": "123456789" }
  ```
- **Response:**
  ```json
  { "success": true, "otp": "123456", "message": "OTP sent (mocked)" }
  ```

---

## 3. Verify OTP
- **POST** `/auth/verify-otp`
- **Description:** Verifies the OTP and returns a JWT token for the session.
- **Request Body:**
  ```json
  { "mobile": "123456789", "otp": "123456" }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "token": "<jwt_token>",
    "user": { "id": 1, "mobile": "123456789", "tier": "Basic" }
  }
  ```

---

## 4. Forgot Password
- **POST** `/auth/forgot-password`
- **Description:** Sends OTP for password reset (mocked, returned in response).
- **Request Body:**
  ```json
  { "mobile": "123456789" }
  ```
- **Response:**
  ```json
  { "success": true, "otp": "123456", "message": "OTP for password reset sent (mocked)" }
  ```

---

## 5. Change Password
- **POST** `/auth/change-password`
- **Auth Required:** Yes (Bearer JWT)
- **Description:** Allows the user to change password while logged in.
- **Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Request Body:**
  ```json
  { "password": "newpassword" }
  ```
- **Response:**
  ```json
  { "success": true, "message": "Password changed successfully" }
  ```

---

## 6. Get Current User
- **GET** `/user/me`
- **Auth Required:** Yes (Bearer JWT)
- **Description:** Returns details about the currently authenticated user.
- **Headers:**
  - `Authorization: Bearer <jwt_token>`
- **Response:**
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "mobile": "123456789",
      "name": "Test User",
      "tier": "Basic"
    }
  }
  ```

---

## Notes
- All endpoints return JSON with a `success` boolean and a `message`.
- OTPs are **mocked** and returned in the API response (not sent via SMS).
- Use the JWT token from `/auth/verify-otp` for protected endpoints.
- For testing, use Postman or curl as shown in the README. 