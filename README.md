# Admin Dashboard

The admin dashboard for KodraPay provides administrative oversight and management of the platform including:

- User management
- Merchant management and onboarding
- Transaction monitoring
- Platform analytics and reporting
- Compliance and KYC management
- Fraud monitoring and rule management
- Dispute resolution
- Settlement tracking

## Getting Started

### Prerequisites

- Node.js 18+ and npm/bun
- API Gateway running on `http://localhost:8000`

### Installation

```bash
cd admin-dashboard
npm install
# or
bun install
```

### Environment Variables

Create a `.env.local` file:

```
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_TITLE=Admin Dashboard
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` (or the port shown in console)

### Build

```bash
npm run build
```

## Architecture

### Services Used

- **Admin Service** (Port 7003): Admin-specific operations
- **Auth Service** (Port 7001): Authentication and authorization
- **Transaction Service** (Port 7004): Transaction data and search
- **Merchant Service** (Port 7002): Merchant information
- **Compliance Service** (Port 7015): KYC/AML operations
- **Fraud Service** (Port 7012): Fraud detection and rules
- **Dispute Service** (Port 7013): Dispute management
- **Settlement Service** (Port 7008): Settlement tracking
- **Fee Service** (Port 7017): Fee configuration and calculations

### API Integration

All API calls go through the API Gateway at port 7000. See `src/lib/api-client.ts` for endpoint configuration.

## Structure

```
admin-dashboard/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   │   ├── AdminDashboard.tsx
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── lib/             # Utilities and API client
│   │   ├── api-client.ts
│   │   └── utils.ts
│   ├── hooks/           # Custom React hooks
│   ├── App.tsx
│   └── main.tsx
├── .env.local           # Local environment configuration
└── package.json
```

## Available Routes

- `/` - Home page
- `/checkout` - Demo checkout experience
- `/admin/login` - Admin authentication
- `/dashboard` - Admin dashboard (alias of `/admin`)
- `/admin` - Overview dashboard
- `/admin/merchants` - Merchant directory and onboarding queue
- `/admin/transactions` - Platform transactions view
- `/admin/analytics` - Revenue and performance analytics
- `/admin/settings` - Admin settings and credentials
- `*` - 404 Not Found

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** - Component library
- **React Router** - Routing
- **React Query** - Data fetching
- **Zod** - Schema validation

## Development Notes

- Use the API client configuration in `src/lib/api-client.ts` for all API calls
- Ensure auth token is properly stored and sent with requests
- Components use shadcn/ui for consistent styling
