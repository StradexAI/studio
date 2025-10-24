# StradexAI Agentforce Studio

Automation platform for Agentforce consultants that reduces implementation time from 600 hours to 150 hours (75% reduction) while maintaining expert positioning with clients.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- PostgreSQL database (Neon recommended)

### Installation

1. **Clone and setup**

   ```bash
   git clone <repository-url>
   cd stradexai-studio
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

3. **Database Setup**

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

## 🏗️ Project Structure

```
stradexai-studio/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Protected routes
│   │   ├── (public)/           # Public routes
│   │   └── api/                # API routes
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── discovery/           # Discovery wizard
│   │   ├── projects/           # Project management
│   │   └── analysis/           # Analysis review
│   ├── lib/                    # Utilities and services
│   │   ├── auth/               # NextAuth configuration
│   │   ├── claude/             # Claude AI integration
│   │   ├── email/              # Email services
│   │   └── validations/        # Zod schemas
│   └── types/                  # TypeScript types
├── prisma/                     # Database schema
└── public/                     # Static assets
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Forms**: React Hook Form + Zod
- **Database**: PostgreSQL (Neon), Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: Anthropic Claude API
- **Email**: Resend
- **Deployment**: Vercel

## 📋 Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="https://studio.stradexai.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Anthropic
ANTHROPIC_API_KEY="sk-ant-..."

# Email (Resend)
RESEND_API_KEY="re_..."

# Vercel Blob (for file storage)
BLOB_READ_WRITE_TOKEN="vercel_blob_..."
```

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Link project**

   ```bash
   vercel link
   ```

3. **Add environment variables** in Vercel dashboard

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Domain Configuration

- **Primary Domain**: studio.stradexai.com
- **Alternative**: discover.stradexai.com

## 📊 Features

### Phase 1: Discovery Module (Current)

- ✅ Consultant creates project → Get unique discovery link
- ✅ Discovery wizard (client-facing, no auth)
- ✅ Client submits discovery → Data saved to database
- ✅ AI analyzes discovery responses (background job)
- ✅ Consultant reviews AI analysis → Can customize
- ✅ Generate proposal document (PDF)
- ✅ Send proposal to client via email

### Future Phases

- **Phase 2**: Code Generation (Weeks 5-8)
- **Phase 3**: Testing Automation (Weeks 9-10)
- **Phase 4**: Deployment Integration (Weeks 11-12)
- **Phase 5**: Client Portal (Weeks 13-16)
- **Phase 6**: Monitoring & Optimization (Weeks 17-20)

## 🎯 Success Metrics

- Discovery completion rate: >80%
- Consultant review time: <60 minutes per project
- Proposal generation: <10 minutes
- Time savings: 75% vs manual process

## 📝 Development

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format with Prettier
```

### Git Workflow

- Use conventional commits
- Create feature branches
- Run tests before committing
- Use Husky pre-commit hooks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

[License information]

## 🆘 Support

For support and questions, contact [support email].

<!-- Force deployment update -->
