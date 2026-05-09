# Drunken Dragon
## Setup Configuration

1. **Environment Variables**: Copy `.env.example` to a new file named `.env` and fill in your local database credentials.
2. **User Secrets**: For local development, we use .NET User Secrets. Run the following commands:
   ```bash
   dotnet user-secrets set "JWT:Key" "your-secret-key-here"
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Database=DrunkenDragonDb;Username=postgres;Password=password"