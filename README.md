# Drunken Dragon

## Setup and Running

### Prerequisites

Make sure you have the following installed:

- [.NET 10 SDK](https://dotnet.microsoft.com/)
- [Node.js](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine
- npm

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Drunken-Dragon
```

### 2. Configure the Database

Copy the example environment file:

```bash
cp .env.example .env
```

The `.env` file should contain:

```env
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=DrunkenDragonDb
```

Make sure the database password matches the connection string used by the server.

### 3. Start PostgreSQL

From the root folder, run:

```bash
docker compose up -d
```

This starts a PostgreSQL database on port `5432`.

### 4. Configure Server Secrets

From the `Server` folder, set the local connection string and JWT settings:

```bash
cd Server

dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Database=DrunkenDragonDb;Username=postgres;Password=password"
dotnet user-secrets set "JWT:Key" "A_Very_Long_And_Secure_Secret_Key_123456789"
dotnet user-secrets set "JWT:Issuer" "DrunkenDragonApi"
dotnet user-secrets set "JWT:Audience" "DrunkenDragonReact"
```

### 5. Run the Server

From the `Server` folder:

```bash
dotnet run
```

The API should run at:

```txt
http://localhost:5195
```

Database migrations are applied automatically when the server starts.

### 6. Run the Client

Open a second terminal and go to the `Client` folder:

```bash
cd Client
npm install
npm run dev
```

The React app should run at:

```txt
http://localhost:5173
```

### Optional: Configure the Client API URL

If the API is running somewhere other than `http://localhost:5195`, create a `.env` file inside the `Client` folder:

```env
VITE_API_URL=http://localhost:5195
```

Then restart the client dev server.

## Useful Commands

Run the client:

```bash
cd Client
npm run dev
```

Build the client:

```bash
cd Client
npm run build
```

Lint the client:

```bash
cd Client
npm run lint
```

Run the server:

```bash
cd Server
dotnet run
```

Start the database:

```bash
docker compose up -d
```

Stop the database:

```bash
docker compose down
```
