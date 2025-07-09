# Immo - Real Estate Application

This is a monorepo project for a real estate application with a Quarkus backend and Angular frontend.

## Project Structure

- `backend/`: Quarkus backend application
- `frontend/`: Angular frontend application
- `mysql-flyway/`: MySQL with Flyway for database migrations

## Running the Application with Docker

### Using Docker Compose

The easiest way to run the entire application stack is using Docker Compose:

```shell
docker-compose up -d
```

This will start:
- MySQL database
- Flyway migrations
- Quarkus backend
- Angular frontend

Access the application at:
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080/api

### Using MySQL-Flyway Docker Image

If you want to run only the MySQL database with Flyway migrations:

```shell
cd mysql-flyway
docker build -t immo-mysql-flyway .
docker run -d -p 3306:3306 --name immo-mysql-flyway immo-mysql-flyway
```

## Development

### Backend (Quarkus)

To run the backend in development mode:

```shell
cd backend
./mvnw quarkus:dev
```

The backend will be available at http://localhost:8080 with dev UI at http://localhost:8080/q/dev/

### Frontend (Angular)

To run the frontend in development mode:

```shell
cd frontend
npm install
npm start
```

The frontend will be available at http://localhost:4200

## Adding New Flyway Migrations

1. Create a new SQL file in `backend/src/main/resources/db/migration/` following the naming convention `V{number}__{description}.sql`
2. Copy the same file to `mysql-flyway/migrations/` to ensure it's applied when using the MySQL-Flyway Docker image

## API Endpoints

### Bien (Property) Endpoints

- `GET /api/biens`: Get all properties
- `GET /api/biens/{id}`: Get a property by ID
- `POST /api/biens`: Create a new property
- `PUT /api/biens/{id}`: Update a property
- `DELETE /api/biens/{id}`: Delete a property

## Building for Production

### Backend

```shell
cd backend
./mvnw package
```

### Frontend

```shell
cd frontend
npm run build --prod
```
