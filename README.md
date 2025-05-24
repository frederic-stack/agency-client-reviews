# ClientScore

A secure, scalable, and anonymous platform for agencies and vendors to review their client experiences. Built with enterprise-grade security and strict anonymization protocols.

## 🚀 Features

- **Complete Anonymity**: Advanced anonymization protocols protect reviewer identity
- **Verified Members Only**: Strict verification process for agencies and vendors
- **Comprehensive Ratings**: Rate clients on payment, communication, scope adherence, creative freedom, and timeliness
- **Advanced Search**: Filter by industry, rating, project size, and location
- **Real-time Moderation**: Automated and manual content moderation
- **Enterprise Security**: JWT authentication, OWASP security standards, rate limiting
- **Scalable Architecture**: Docker, Kubernetes, AWS-ready infrastructure

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- Next.js 15 with App Router
- React Query for state management
- Tailwind CSS for styling
- TypeScript for type safety

**Backend:**
- Node.js with Express.js
- PostgreSQL with Prisma ORM
- Redis for caching and sessions
- JWT & OAuth 2.0 authentication

**Security:**
- bcrypt for password hashing
- Helmet for security headers
- CORS protection
- Rate limiting
- Akismet spam detection

**Infrastructure:**
- Docker & Docker Compose
- Kubernetes ready
- AWS deployment scripts
- CI/CD with GitHub Actions

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agency-client-reviews
   ```

2. **Environment Configuration**
   ```bash
   # Server environment
   cd server
   cp env.example .env
   # Edit .env with your configuration
   
   # Client environment  
   cd ../client
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Using Docker (Recommended)**
   ```bash
   # Start all services
   docker-compose up -d
   
   # Initialize database
   docker-compose exec api npx prisma migrate dev
   docker-compose exec api npx prisma db seed
   ```

4. **Manual Setup**
   ```bash
   # Install server dependencies
   cd server
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   npm run dev
   
   # Install client dependencies
   cd ../client
   npm install
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api/docs

## 📁 Project Structure

```
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/          # Utilities and configurations
│   │   ├── services/     # API services
│   │   └── types/        # TypeScript definitions
│   ├── public/           # Static assets
│   └── Dockerfile        # Client container configuration
├── server/                # Express.js backend API
│   ├── src/
│   │   ├── config/       # Database and app configuration
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utility functions
│   ├── prisma/           # Database schema and migrations
│   └── Dockerfile        # Server container configuration
├── docker/               # Docker configurations
├── scripts/              # Deployment and utility scripts
├── docs/                 # Documentation
└── docker-compose.yml    # Multi-service setup
```

## 🔧 Configuration

### Environment Variables

#### Server (.env)
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/clientscore"
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
SESSION_SECRET="your-session-secret"

# OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Security
CORS_ORIGIN="http://localhost:3000"
AKISMET_API_KEY="your-akismet-key"
```

#### Client (.env.local)
```bash
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_CLIENT_URL="http://localhost:3000"
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="your-ga-id"
```

## 🚀 Deployment

### Railway Deployment (Recommended)

Railway provides the easiest deployment experience for full-stack applications:

```bash
# Generate secure secrets first
node scripts/generate-secrets.js

# Follow the Railway deployment guide
# See RAILWAY_DEPLOYMENT.md for complete instructions
```

**Quick Railway Setup:**
1. Connect GitHub repository to Railway
2. Add PostgreSQL and Redis services
3. Deploy backend with root directory: `server`
4. Deploy frontend with root directory: `client`
5. Configure environment variables from template

📖 **[Complete Railway Guide](RAILWAY_DEPLOYMENT.md)**

### Docker Deployment
```bash
# Production build
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# With SSL and Nginx
docker-compose --profile production up -d
```

### AWS Deployment
```bash
# Build and deploy to AWS
npm run deploy:aws

# Or use the deployment script
./scripts/deploy-aws.sh
```

### Kubernetes
```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/
```

## 🧪 Testing

```bash
# Run server tests
cd server
npm run test

# Run client tests
cd client
npm run test

# Run E2E tests
npm run test:e2e
```

## 📊 Monitoring & Logging

- **Health Checks**: `/api/health` and `/api/health/detailed`
- **Metrics**: Prometheus metrics available at `/metrics`
- **Logging**: Winston with structured logging
- **Error Tracking**: Sentry integration
- **Analytics**: Google Analytics and Hotjar

## 🔒 Security Features

- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control
- **Data Protection**: bcrypt password hashing
- **API Security**: Rate limiting, CORS, Helmet
- **Anonymization**: UUID-based anonymous identifiers
- **Content Moderation**: Automated + manual review
- **Audit Logging**: Complete audit trail

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📋 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh tokens

### Client Endpoints
- `GET /api/clients` - Search clients
- `GET /api/clients/:id` - Get client details
- `POST /api/clients/:id/bookmark` - Bookmark client

### Review Endpoints
- `GET /api/reviews` - Get reviews feed
- `POST /api/reviews` - Submit review
- `GET /api/reviews/:id` - Get review details
- `POST /api/reviews/:id/report` - Report review

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/notifications` - Get notifications

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Email**: support@clientscore.com

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

---

**Note**: This platform is designed exclusively for agencies and vendors. Brands and direct clients are explicitly excluded from using this platform to maintain the integrity of anonymous reviews.
