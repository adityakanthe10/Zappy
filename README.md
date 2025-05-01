# Zappy – Quick Commerce & Delivery Tracking System

## Table of Contents

- [Overview](#overview)
- [Live](#live_links)
- [Demo](#demo)
- [Features](#features)
- [Project Strucuter](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)

## Overview

Zappy is a full-stack web application that simulates a **Quick Commerce Order & Delivery Tracking System**, built using **Next.js**, **Node.js**, **PostgreSQL**, and **Socket.io**. It enables two roles:

- **Customers** can place orders and track their status in real time.
- **Delivery Partners** can view pending orders, accept them, and update delivery statuses live.

    The project emphasizes **real-time communication**, **secure authentication**, and **scalable backend APIs**.


## Live_Links

- **WebSocket Backend** (Server): [https://zappy-2hxn.onrender.com](https://zappy-2hxn.onrender.com)
- **Frontend + API Backend** (Next.js Monorepo): [https://zappy-frontend.onrender.com](https://zappy-frontend.onrender.com)

## Demo

- You can check out a [demo of the project here](https://drive.google.com/file/d/1WDpEGv4RkccCU3yoPFtnFuL5Nny04_sI/view?usp=sharing).


## Features

- **JWT Authentication:** Secure login system for both Customers and Delivery Partners.
- **Order Placement:** Customers can place orders by specifying product ID, quantity, and delivery location.
- **Live Order Tracking:** Orders move through status stages: `Pending` → `Accepted` → `Out for Delivery` → `Delivered`.
- **Real-Time Updates:** Instant delivery status updates using WebSockets (Socket.io).
- **Delivery Partner Dashboard:** Accept and update orders from a centralized dashboard.

## Project-Structure

```bash
Zappy/
├── apps/
│   ├── frontend/                   # Next.js app (UI + API routes)
│   │       ├── public/             # Static files (e.g. images)
│   │       ├── .env                # Frontend-specific env variables
│   │       ├──src 
|   |           ├── app/                # App routes and API handlers
│   │           ├── components/         # Reusable UI components
│   │           ├── lib/                # Utility functions and shared logic
│   │           ├── styles/             # Global styles
│   │           └── next.config.js      # Next.js config
│   │
│   └── server/                 # WebSocket backend (Node.js + Socket.io)
│       ├── services/
│       │   └── socket.ts       # Socket initialization and handlers
│       ├── index.ts            # WebSocket server entry point
│       └── .env                # Server-specific env variables
│
├── .env                        # Root environment variables
├── package.json                # Root package definition for monorepo
├── packages                    # packages
│       ├── auth
│       ├── db                  # database postgresqsl
│       ├── ui                  # ui 
├── README.md                   # Project documentation
└── .gitignore                  # Git ignore rules
```


## Installation
### Local Setup Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adityakanthe10/Zappy
   cd Zappy 
   ```

2. **Install dependencies for all apps**
    ```
    npm install
    ```

3. **Set up environment variables**

    ###  Root .env
    - Create a .env file in the root directory:
    ```
    JWT_SECRET="mysecretkey"
    NEXT_PUBLIC_API_URL=http://localhost:3000/api
    NEXT_PUBLIC_WS_URL=ws://localhost:8000
    DATABASE_URL="postgresql://neondb_owner:npg_9cZ5jHzKwuda@ep-polished-silence-a1utw3yy-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
    ```

    ###  Inside apps/frontend/.env
    ```
    JWT_SECRET="mysecretkey"
    NEXT_PUBLIC_API_URL=http://localhost:3000
    NEXT_PUBLIC_WS_URL=ws://localhost:8000
    ```

    ### Inside apps/server/.env

    ```
    PORT=8000
    FRONTEND_URL=http://localhost:3000
    ```
4. Run apps

    - Root repository :- 
    ```
    npm run dev
    ```
## Usage

### Placing Orders (Customer Flow)

1. Register or log in as a **Customer** from the homepage.
2. It will route to place order page.
3. Place an order and redirect to the "My Orders" section.
4. You will receive **real-time updates** on your order status via WebSockets.

### Managing Orders (Delivery Flow)

1. Log in as an **Delivery** via the  login page.
2. View all incoming orders in the Admin Dashboard.
3. Change the status of an order (e.g., `"Preparing"`, `"Accepted"`).
4. The corresponding customer will receive **live notifications** as soon as the status is updated.

###  Real-time Updates (Socket.io)

- Real-time communication is handled via a dedicated WebSocket server.
- Customers automatically join a unique room based on their user ID.
- Delivery status updates are instantly pushed to the respective customer.


## Technologies Used

- Frontend: Next.js, CSS
- Backend: Node.js, Next.js, websockets
- Database: Postgresql
