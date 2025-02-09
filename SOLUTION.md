# event-ticket-booking-api

# Tech Stack
- Backend: Node.js using TypeScript
- Framework: Express
- Database: PostgreSQL
- Cache/Lock: Redis
- Migration: Knex
- Infrastructure: Docker
- Captcha: Google Recaptcha


# Features
- User should be able to see the available tickets for each ticket type
- User should be able to choose an event, ticket type, quantity, seat number and purchase tickets
- User should be able to see the ticket details after purchase


# Project Overview
- Booking a ticket is divided into 3 steps: `GET /api/initial-call/:id`, `POST /api/reserve` and `POST /api/checkout`

- The `GET http://localhost:3000/api/initial-call/:id` endpoint is used to get the available tickets for supplied event id

- The `POST http://localhost:3000/api/reserve` endpoint reserves tickets for the user to select ticket type, quantity, and seat number. The reservation is valid for 10 minutes. If not completed within that time, the reservation is cancelled and tickets are made available for others.

Request Body
{
  userId: 1,
  eventId: 1,
  seatDetails: [
    {
      ticketTypeId: 1,
      metaData: {
        rowNumbers: [1, 1],
        seatNumbers: [2, 3],
      },
    },......
  ],
}


- The `PUT http://localhost:3000/api/checkout` endpoint completes the checkout process. The user must provide a valid recaptcha token to verify they are not a bot and complete the purchase within 10 minutes.

Request Body
{
  userId: 1,
  eventId: 1,
  seatDetails: [
    {
      ticketTypeId: 1,
      metaData: {
        rowNumbers: [1, 1],
        seatNumbers: [2, 3],
      },
    },......
  ],
}


# Tables:

## Event
- id: UUID (Primary Key)
- event_id: Number
- name: String
- date: Date
- venue: String

## Ticket
- id: UUID (Primary Key)
- event_id: Number (Foreign Key)
- ticket_type_id: Number (1, 2)
- ticket_type: Enum (General, VIP)
- price: Number
- quantity: Number
- available_count: Number

## Seat
- id: UUID (Primary Key)
- event_id: Number (Foreign Key)
- ticket_type_id: Number (1, 2)
- row_number: Number
- seat_number: Number
- status: String (Available, Reserved, Booked)

## purchase
- id: UUID (Primary Key)
- user_id: Number
- event_id: Number (Foreign Key)
- total_amount: Number
- purchase_at: Date

## purchase_detail
- id: UUID (Primary Key)
- purchase_id: Number (Foreign Key)
- ticket_type_id: Number (1, 2)
- ticket_type: Enum (General, VIP)
- row_number: Number
- seat_number: Number
- amount: Number


# To run project in development mode
-  `npm run docker:dev`

# To run project in production mode
-  `npm run docker:prod`


# Considerations
1.	Concurrency Management and Redis Locks - Redis locks ensure safe ticket purchases and prevent double-booking, with a lock validity of 10 minutes. However, in a distributed system, if Redis goes down, multiple users might reach the checkout stage, resulting in a poor user experience despite PostgreSQL ensuring transactional integrity.

2.	Load Handling with Virtual Waiting Queue
A Redis-based virtual queue manages high traffic during major events, currently supporting up to 5000 users (scalable as needed). While it ensures fairness, indefinite waiting times may impact user satisfaction.

3.	Rate Limiting and Bot Detection
Google reCAPTCHA (in production), rate limiting, behavioral analysis, IP blocking, and device fingerprinting mitigate bot activity. Although effective, CAPTCHAs may disrupt the experience for legitimate users.

4.	Scalability - A microservices architecture supports independent scaling for services like search, CRUD operations, bookings, and notifications. PostgreSQL sharding (event or location-based) improves database scalability. However, managing distributed services adds complexity.

5.	Database Design - PostgreSQL ensures strong consistency for ticket purchases, prioritizing accuracy over availability. High availability can be achieved for less critical operations like event searches.

6.	Security - Secure global user data with end-to-end encryption during transmission and storage. Use robust authentication mechanisms like JWT for safe access.

7.	Monitoring and Logging - Centralized tools like Sentry and Datadog monitor system health, detect malicious activities, and provide performance insights.

8.	Caching - Redis caching or database read replicas optimize performance for frequent read-heavy operations, such as fetching event details.

9. Performance Optimization
	•	Search: ElasticSearch enables fast and scalable searches by event name, artist, venue, or date. Top search queries can be cached in Redis for quick retrieval.
	•	CDN: Cache static assets (images etc..) and popular search results to reduce server load.
	•	SSE: For most popular events, the data on UI must get stale very soon. So, we can use Server sent events to keep client up to date with the latest data.
	•	Notifications: Implement email, SMS, and push notifications for personalized alerts about ticket availability or event updates.

10. Feature Enhancements - Add functionality for ticket cancellations and refunds, making canceled tickets available for purchase again.