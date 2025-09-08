# Social Crypto Watchlist

A social crypto watchlist web application built with **React**, **Node.js**, **Express**, and **PostgreSQL**.  
Users can track cryptocurrency prices, manage their watchlist, and interact socially by following other users.

> This project uses the **CoinGecko API** for cryptocurrency data.  
> Data sourced from [CoinGecko](https://www.coingecko.com/en/api).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [API Routes](#api-routes)
- [Front-End Pages](#front-end-pages)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User registration and authentication (JWT)
- Add/remove cryptocurrencies to a personal watchlist
- Search cryptocurrencies via CoinGecko API
- Follow/unfollow other users
- View followers and following lists
- Protected routes for authenticated users
- Responsive UI with React and context-based state management

---

## Tech Stack

- **Front-end:** React, React Router, Context API
- **Back-end:** Node.js, Express
- **Database:** PostgreSQL
- **Authentication:** JWT
- **Styling:** CSS
- **API:** CoinGecko API

---

## Setup and Installation

1. Clone the repository:

```bash
git clone https://github.com/KTenpa/Social-Crypto-Watchlist.git
cd social-crypto-watchlist
```
2. Install backend dependencies:

```bash
cd backend/
npm install
```
3. Install frontend dependencies:

```bash
cd frontend/
npm install
```
4. Start the backend server:

```bash
npm start
```
5. Start the frontend development server:

```bash
npm run dev
```
---
### Environment Variables
Create a .env file in the root of the backend project with the following variables:

```bash
PORT=5000
DATABASE_URL=postgres://username:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=1d
```
---
### Database
Tables
- **users**
  - `id`: SERIAL PRIMARY KEY  
  - `name`: VARCHAR(255)  
  - `email`: VARCHAR(255) UNIQUE  
  - `password`: VARCHAR(255)  
  - `created_at`: TIMESTAMP  

- **coins**
  - `id`: TEXT PRIMARY KEY  
  - `symbol`: VARCHAR(20)  
  - `name`: VARCHAR(100)  
  - `image_url`: TEXT  

- **watchlist**
  - `user_id`: REFERENCES users(id)  
  - `coin_id`: REFERENCES coins(id)  
  - PRIMARY KEY (user_id, coin_id)  

- **followers**
  - `follower_id`: REFERENCES users(id)  
  - `following_id`: REFERENCES users(id)  
  - PRIMARY KEY (follower_id, following_id)  

### API Routes
- **Auth**
  - `POST /api/v1/auth/register` - Register a new user  
  - `POST /api/v1/auth/login` - Login  
  - `GET /api/v1/auth/me` - Get current user (protected)  

- **Coins**
  - `GET /api/v1/coins` - Get all coins  
  - `GET /api/v1/coins/:id` - Get a specific coin  
  - `POST /api/v1/coins` - Add a coin (protected)  
  - `GET /api/v1/coins/search/:query` - Search coins via CoinGecko API  

- **Watchlist**
  - `GET /api/v1/watchlist` - Get user's watchlist (protected)  
  - `POST /api/v1/watchlist` - Add coin to watchlist (protected)  
  - `DELETE /api/v1/watchlist/:coin_id` - Remove coin from watchlist (protected)  

- **Followers**
  - `POST /api/v1/follow/:userId` - Follow a user (protected)  
  - `DELETE /api/v1/follow/:userId` - Unfollow a user (protected)  
  - `GET /api/v1/follow/followers/:userId` - Get followers (protected)  
  - `GET /api/v1/follow/following/:userId` - Get following (protected)  
  - `GET /api/v1/follow/search/:query` - Search users (protected)  
  - `DELETE /api/v1/follow/follower/:userId` - Remove follower (protected)  

### Front-End Pages
- **Dashboard:** Displays user's watchlist  
- **Search:** Search for coins and add to watchlist  
- **Followers:** View followers and following, search users, and toggle follow/unfollow  
- **Profile:** View user's profile and watchlist  
- **Login/Register:** Authentication pages  

### Authentication
- **JWT:** Stored in `localStorage` for client-side authentication  
- **Protected routes:** Redirect unauthenticated users to `/login`  
- **Logout:** Clears token and resets user state  
