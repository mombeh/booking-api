#  Appointment Booking API

A production-ready RESTful API built with Node.js, Express, and PostgreSQL for managing service appointments between clients and providers.

Designed to prevent double bookings, support real-time updates, and serve as a scalable backend foundation for service-based platforms (clinics, salons, tutors, consultants, etc.).

---

##  The Problem

Many small service-based businesses still manage appointments manually — leading to:

- Double bookings  
- Scheduling conflicts  
- Poor customer experience  
- Inefficient communication  

This API provides a structured, scalable backend solution that automates scheduling and ensures time-slot integrity.

---

##  What This API Solves

- Secure user and provider registration  
- Structured time-slot management  
- Automatic double-booking prevention  
- Real-time booking notifications  
---

## 🛠 Tech Stack

**Backend:** Node.js, Express  
**Database:** PostgreSQL  
**Authentication:** JSON Web Tokens (JWT)  
**Real-Time Communication:** Socket.IO  
**Logging:** Winston  
**Documentation:** Swagger (OpenAPI 3.0)  

---

##  Architecture Overview

### API Flow

1. Client sends JSON request  
2. JWT middleware validates authentication  
3. Controllers execute business logic  
4. PostgreSQL handles persistence  
5. JSON response returned  
6. Socket.IO emits real-time updates when applicable  

---

##  Core Features

-  JWT-based authentication  
-  Role-based access (Client & Provider)  
-  Time-slot creation & availability management  
-  Double-booking prevention using SQL validation  
-  Real-time appointment updates via Socket.IO  
-  Input validation middleware  
-  Centralized error handling  
-  Auto-generated Swagger documentation  
-  Environment-based configuration  

---

##  Project Structure

```
booking-api
│
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── sockets/
├── .env.example
├── swagger.config.js
├── package.json
└── server.js
```

---

##  Installation & Local Setup

```bash
git clone https://github.com/mombeh/booking-api.git
cd booking-api
npm install
cp .env.example .env
npm run dev
```

Make sure PostgreSQL is running and your `.env` file is properly configured.


---

##  Challenges Faced

### Authentication & Route Protection
Structuring JWT middleware to cleanly separate public and protected routes required careful architecture decisions.

### WebSocket Integration
Integrating Socket.IO while maintaining separation of concerns required refactoring parts of the server initialization.

---

##  What I Learned

- Designing scalable RESTful APIs  
- Writing efficient SQL for time-range validation  
- Structuring middleware for authentication and validation  
- Integrating WebSockets into an Express backend  
- Organizing backend architecture for maintainability  

---

##  Future Improvements

- Email notifications after booking  
- Rate limiting for enhanced security  
- Calendar integrations (Google / Outlook)  
- Pagination for large data sets  
- Docker containerization for production deployment  

