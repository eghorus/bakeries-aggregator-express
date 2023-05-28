# 🚀 Bakeries-Aggregator-Express

A REST API for online baking ordering.

## 📝 Description

### Guests Can Do The Following:

- View all bakeries, their details, and their product menus.
- Create a new user account.

### Members Can Do The Following:

- Sign in to their accounts.
- Select baking products from a bakery menu and place an order.
- Mark their orders as completed and give them a rating.
- Cancel their active orders.

## 💎 Technologies

1. Nodejs / Express
2. MongoDB / Mongoose
3. TypeScript
4. `jsonwebtoken` for user authentication
5. Packages used for security: `helmet`, `express-rate-limit`, `bcryptjs`, `validator`.
6. Images are hosted on Cloudinary

## ⚙️ Installation

**Step 1:** Install dependencies.

```shell
npm install
```

**Step 2:** [Create MongoDB Atlas account](https://www.mongodb.com/docs/atlas/tutorial/create-atlas-account/).

**Step 3:** Create a `.env` file in the root folder and add the required environment variables. Check `.env.sample` file to find all the required environment variables.

**Step 4:** Import the required datasets from `/data/exportedData/` into the database.

You can use:

- GUI application [MongoDB Compass](https://www.mongodb.com/products/compass)
- Command Line Tool [mongoimport](https://www.mongodb.com/docs/database-tools/mongoimport/)

**Step 5:** Start the server.

```shell
# In a development environment.
npm run dev
# In a production environment.
npm start
```

## 🚥 Routes

### Public Routes (no authentication header is required)

| #   | HTTP Method | URL                          |
| --- | ----------- | ---------------------------- |
| 1   | `POST`      | `/api/v1/users/signup`       |
| 2   | `POST`      | `/api/v1/users/signin`       |
| 3   | `GET`       | `/api/v1/bakeries`           |
| 4   | `GET`       | `/api/v1/bakeries/:bakeryId` |

### Protected Routes (authentication header is required)

| #   | HTTP Method | URL                       |
| --- | ----------- | ------------------------- |
| 1   | `GET`       | `/api/v1/users/account`   |
| 2   | `POST`      | `/api/v1/orders`          |
| 3   | `PATCH`     | `/api/v1/orders/:orderId` |
| 4   | `DELETE`    | `/api/v1/orders/:orderId` |
