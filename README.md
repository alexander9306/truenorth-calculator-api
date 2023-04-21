# BackEnd Calculator API

This calculator is a backend application built with NestJS that can perform a variety of mathematical operations, including addition, subtraction, multiplication, and division. It follows best practices for application design and utilizes modern software engineering techniques to ensure efficient and reliable performance.

[Demo](https://react-calculator-with-records.vercel.app/)

## Routes

The following API routes are available:

```bash
- POST /v1/auth/login
- POST /v1/auth/signup
- GET /v1/operations
- POST /v1/operations
- GET /v1/operations/balance
- GET /v1/records
- GET /v1/records/:id
- DELETE /v1/records/:id
- GET /v1/users
- GET /v1/users/info
- PATCH /v1/users/activate/:id
- PATCH /v1/users/deactivate/:id
- PUT /v1/users/password

```

## Environment Variables

The following environment variables are required to run the application:

```diff
- PG_CONNECTION_STRING
# You need a developer account in random.org for this.
- RANDOM_ORG_API_KEY
```

The following environment variables are optional:

```diff
- JWT_SECRET
- JWT_EXPIRATION_TIME
- DEFAULT_BALANCE
- NODE_ENV
- PORT
```

To add environment variables, create a `.env` file at the root of the project.

## Installation and Usage

To install the application, run:

```bash
npm install
```

To run the application in development mode, run:

```bash
npm run start:dev
```

Or, for webpack hot reload feature:

```bash
npm run start:hot
```

To build the application for a serverless environment, run:

```bash
npm run build:sls
```

By default, the application starts at port 3000. You can change this by setting the PORT environment variable.

This application is developed to use Postgres as the database, so you need an active Postgres server running to use it. After you add the environment variable `PG_CONNECTION_STRING` with your connection string (in this format: `postgres[ql]://[username[:password]@][host[:port],]/database[?parameter_list]`), run `npm run schema:sync` to sync the database schema and later `npm run migration:run` to seed the database information.

All endpoints are versioned, and the current version is v1. So, for example, if you're running the app from `http://localhost:3000`, the endpoint for login will be `http://localhost:3000/v1/auth/login`.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
