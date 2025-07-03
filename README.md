# 🛫 Airport Transport System – Priority Pass + Global Taxi App Integration

## Architecture Overview

This system integrates the **Priority Pass** and a **Global Taxi App** to enhance the end-to-end airport journey for travelers by embedding a shared, smart journey planning module into both apps.

The architecture emphasizes **separation of concerns**, **modular integration** and **extensibility**, while delivering a **consistent, intuitive user experience** across both platforms.

### Objectives

- Provide a simple and intuitive interface to manage transportation to the airport
- Display **recommended departure times** (from origin) and **estimated arrival times** (at the airport) based on flight data
- Enable **inventory sharing** between platforms so each app can surface relevant content from the other (e.g., lounges in the Taxi app, transport suggestions in Priority Pass)

---

## Assumptions

- Clarify display estimated arrival times and recommended departure times based on flight details: 
  - **Estimated Arrival Time** refers to the time the user is expected to **arrive at the airport**, not the flight’s arrival at its destination.
  - **Recommended Departure Time** refers to the time the user should **leave their current location (e.g., home or hotel)** in order to reach the airport on time for their flight, taking into account:
    - The scheduled flight departure time
    - Recommended arrival window before a flight (e.g., 2–3 hours for international flights)
    - Estimated travel time to the airport
    - Possible traffic or transit delays
- The **Priority Pass app** does not have access to users’ booked flights — users will **manually enter flight details**.
- The system is **read-only** — no transport bookings or transactions are performed - although it should be extensible to support this.
- External flight data providers will be integrated in the future. For now, **mocked data** is used.
- Both apps require an **authorised user** or provide a **unique user identifier**, which will be used by the Journey Transport System.  
  - Although the high-level requirements don’t explicitly mention authentication, it is  best practice to authorise service requests to prevent misuse. It is also likely that this project will be extended to support fully authenticated and authorised users in the near future.
- There is a stated requirement to enable **inventory sharing**, though the nature of this inventory is not defined. It is assumed that:
  - The **Priority Pass app** provides lounge information.
  - The **Taxi app** provides estimated journey times and transport options.
- Each app is assumed to have:
  - A **client-side UI component** and
  - A **server-side platform component** (API/backend logic).

---

## Key Technical Choices

- **Microservice Architecture**  
  Core services are independently deployable and scalable.

- **Shared UI Component (Micro Frontend)**  
  A self-contained journey planner UI is embedded in both host apps using either:
  - An iframe (for fast deployment), or  
  - A packaged React SDK (for tighter integration).

- **Shared API Gateway**  
  A centralized gateway handles:
  - OAuth2/JWT-based authentication
  - Request routing and rate limiting
  - Observability and telemetry

- **REST APIs for Service Communication**  
  Services communicate via lightweight RESTful APIs to keep integration straightforward.

- **Keep It Simple**  
  The architecture avoids premature optimization. No Redis, message queues, CDN or orchestration layers or logging are included. They could be included where required.
  - Note a database has been included in the architecture as it will likely store journey plans and results etc. however the demo does not make use of it.

- **Cloud Agnostic**
  Can be run on cloud based serverless infrastructure or on prem servers depending on the preference.
---

## Omissions & Trade-Offs

### ❌ Skipped Features

- Full user authentication (stubbed JWT used)
- Taxi booking and dispatch logic
- Redis cache layer
  - While not essential for the prototype, Redis could be added later to cache flight lookups or temporarily store journey state for session continuity.
- Content Delivery Network
  - A CDN such as Cloudflair or Cloufront, Akamai could be used in front of the API gateway
- The demo does not shae any data however the architecture allows data from each app to be surfaced in the shared component and, through the api gateway shared inventory could be made available to the other app.

### ⚠️ Shortcuts

- All data is mocked. No external systems are accessed by the demo.
- Only basic error handling and loading states in frontend
- The demo is http rather than https. In production https must be used.
- The demo has very limited styling/formatting to show functionality and genrally shows the interaction of the components rather than full functionality.
- The demo shows what is possible with the architecture. Its not targetted at end users.
- System variables are hard coded
---

## User Journey

1. User opens either the **Priority Pass** app or the **Global Taxi App**
2. They access the **"Plan Airport Transport"** feature (shared journey planner)
3. The user enters their **address, flight date and flight number**
4. The system:
   - Fetches flight details from a 3rd-party or mock data source
   - Estimates **recommended departure time** from origin
   - Estimates **arrival time** at the airport
   - Displays lounge availability at airport

---

## 📁 Deliverables

| Path            | Description                                 |
|-----------------|---------------------------------------------|
| `/diagrams/`    | C4 diagrams (Context, Container, Component) |
| `/apps/`        | Prototype front end application             |
| `/README.md`    | This documentation                          |

---

## Running Locally

The prototype system is fully containerized and can be run locally using Docker Compose. This provides a **consistent development environment**, ensures **isolation between services** and avoids "it works on my machine" issues — regardless of OS or toolchain.

### ✅ Benefits of Using Docker Compose

- Run the full stack (APIs + frontend) with one command
- All services use the correct dependencies and Node versions
- Hot-reloading is supported in development mode
- Clean teardown of containers avoids leftover state
- Scales easily to multiple environments (dev, test, CI)

---

### ▶️ To Start the System

```bash
make up
```

This runs the `Makefile` target below:

```Makefile
up:
	docker-compose up --build
```

You can also stop everything cleanly:

```bash
make down
```

```Makefile
down:
	docker-compose down
```

---

### Services Started

| Service       | Port  | Description                      |
|---------------|-------|----------------------------------|
| `shared-ui`   | 3000  | Frontend UI (Vite dev server)    |
| `api-gateway` | 4000  | Entry point for API requests     |
| `main-api`    | 4001  | Internal microservice (mocked)   |

Once running, you can visit [http://localhost:3000](http://localhost:3000) in your browser to view the shared UI.

## How AI Has Been Used in This Project

AI (primarilty ChatGPT) has played an important role throughout the development of this project. From the initial stages, AI was instrumental in understanding the original requirements and clarifying the task objectives. By leveraging AI-driven insights, the Proof of Concept (POC) was efficiently structured and developed.

Key contributions of AI include:

- **Requirement Analysis:** AI helped interpret the user’s needs and translated them into actionable development goals.
- **Code Generation:** The majority of the codebase, including frontend components and backend APIs, was generated or scaffolded using AI assistance, speeding up development time.
- **Debugging and Problem Solving:** AI was used to identify and suggest fixes for issues encountered during development, such as type errors, token handling and API integration.
- **Documentation:** AI helped produce clear, structured documentation and README updates to ensure the project is easy to understand and maintain.

Overall, AI served as a collaborative partner, enhancing productivity, ensuring code quality and enabling rapid prototyping for this project.