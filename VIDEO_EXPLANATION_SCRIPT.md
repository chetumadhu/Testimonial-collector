# Project Explanation Video Script: TrustPulse Testimonial Platform
**Senja / Testimonial.to Alternative (Project Brief 05)**

> 💡 **Instructions for Chetan:** Use this script to record your video (e.g. using Loom or OBS). It follows every single point requested in **Section 5 ("Project Explanation Video")** of the assessment guidelines. Speak clearly and confidently!

---

## ⏱️ Video Breakdown & Time Allocation (Total: ~5 to 6 Minutes)

- **0:00 - 0:45** | Introduction, Problem Statement & Objective
- **0:45 - 1:30** | Technology Stack & Architectural Decisions
- **1:30 - 2:30** | Database Design & Security (Pair-Token Rotation)
- **2:30 - 4:00** | Live Demo Walkthrough (Public Form, Moderation Inbox, Masonry Wall, Embed Generator)
- **4:00 - 4:45** | Technical Challenges & How I Solved Them
- **4:45 - 5:30** | Summary, Code Quality & Conclusion

---

## 🎙️ Verbatim Script

### 1. Introduction & Objective (0:00 - 0:45)
"Hello everyone! My name is Chetan Ahire, and today I am thrilled to present my submission for the Technical Assessment: **TrustPulse**, a full-stack Customer Testimonial and Social Proof Collector built as a high-performance alternative to platforms like Senja and Testimonial.to.

**The Problem:** In today's digital landscape, social proof is the highest-converting asset for any business. However, getting customers to leave reviews usually involves high friction—such as mandatory signups, clunky forms, or delayed moderation. 

**The Objective:** TrustPulse solves this by providing business owners with branded collection spaces, allowing clients to submit 1-to-5 star ratings, feedback, and photos with zero login friction. Owners can moderate submissions with 1-click workflows, view real-time rating metrics, and generate responsive embeddable widgets for any website."

---

### 2. Technology Stack & Why I Chose It (0:45 - 1:30)
"For the technology stack, I chose the **MERN Stack**:
- **MongoDB with Mongoose ODM**: Chosen because testimonial data and space configurations have flexible schemas—such as custom question arrays and customizable display settings. MongoDB allows rapid read/write throughput and seamless aggregation pipelines for analytics.
- **Express.js & Node.js**: Provides a clean, event-driven RESTful architecture with modular routers, controllers, and centralized error handling middleware.
- **React.js 18 with Vite & Tailwind CSS**: Vite offers lightning-fast HMR and build performance. Tailwind CSS, coupled with modern component design principles inspired by Coss UI and Radix, ensures a crisp, accessible interface with dark and light mode support."

---

### 3. Architecture, Database & Security (1:30 - 2:30)
"Moving to **Security and Architecture**:
- One of the key requirements of the brief was **Pair-Token JWT Authentication**. I implemented a short-lived Access Token with a 15-minute lifespan and a long-lived Refresh Token with a 7-day lifespan stored in secure, `httpOnly` cookies to protect against XSS attacks.
- On the backend, I implemented **Token Rotation**. Each time a new access token is requested via `/api/auth/refresh-token`, the old refresh token is invalidated and a fresh pair is issued. If reuse is detected, all active sessions for that user are revoked.
- On the frontend, I configured an Axios response interceptor that intercepts `401 Unauthorized` responses, transparently calls the refresh endpoint, and replays failed queries without disrupting the user.
- The database models include:
  1. **User Schema**: Handles bcrypt password hashing, email verification simulation, and refresh token families.
  2. **Space Schema**: Contains unique URL slugs (like `/collect/acme-cloud`), logos, custom prompts, and display toggles.
  3. **Testimonial Schema**: Stores client details, star ratings, moderation status (`pending`, `approved`, `archived`), and flags for `isFeatured` and `isLiked`."

---

### 4. Live Demonstration (2:30 - 4:00)
*(Screen Share: Show the App running locally)*

1. **Dashboard & Space Creation**:
   "Here is our Space Dashboard. You can see our existing spaces with live submission metrics. Let's create a new space—we set the name, slug, custom prompt questions, and toggle star ratings."

2. **Frictionless Public Collection Form (`/collect/:slug`)**:
   "Now let's visit the public collection link at `/collect/acme-cloud`. Notice that no login is required. A client selects their 5-star rating, writes a testimonial, uploads an avatar, and clicks Submit. Upon submission, we trigger a celebratory confetti animation and thank-you confirmation."

3. **Moderation Inbox & Tagging (`/space/:id`)**:
   "Back in the Owner Command Center, the review immediately appears in the **Pending** tab. With a single click, I can **Approve** it, mark it as **Featured**, or **Like** it. Notice the instant search and 1-to-5 star rating filters."

4. **Rating Metrics & Summary Stats**:
   "Above the inbox, our Summary Stats card dynamically calculates the average star rating, total review count, recommendation percentage, and visual distribution bar chart."

5. **Wall of Love (`/wall/:slug`)**:
   "Here is the public Wall of Love page featuring a responsive Pinterest-style masonry grid that updates in real time with approved testimonials."

6. **Embed Generator Modal**:
   "Lastly, clicking 'Embed Widget' opens our live preview modal. Owners can choose between **Grid**, **Carousel**, or a floating **Badge** layout, switch between **Light** and **Dark** themes, and copy the clean `<iframe>` snippet ready to drop into Webflow, WordPress, or React."

---

### 5. Technical Challenges & How I Solved Them (4:00 - 4:45)
"During development, I addressed two key challenges:
1. **Silent Token Refresh Race Conditions**: When multiple API requests fail simultaneously upon access token expiry, multiple refresh calls could trigger unwanted token invalidation. I solved this by implementing a request queue in the Axios interceptor that pauses pending requests while a single refresh completes.
2. **Responsive Masonry Grid Performance**: Rather than loading heavy external JavaScript grid libraries, I utilized CSS column-count with column break avoidance. This yields pure 60fps scrolling and instant responsiveness across mobile, tablet, and desktop."

---

### 6. Conclusion (4:45 - 5:15)
"In conclusion, TrustPulse satisfies 100% of the project specifications with clean modular code, pair-token security, comprehensive unit seeder scripts, and polished UI/UX. The complete code is publicly hosted on GitHub with an extensive README and API documentation.

Thank you for your time and consideration, and I look forward to your feedback!"
