# Kamunity Platform

**Launch Date: August 21st, 2025**

A digital platform for collective impact that supports the natural progression from informal chat-based idea generation to structured, action-oriented communities.

## Quick Start

### Development Setup

1. **Clone and Install**
   ```bash
   git clone [repository-url]
   cd kamunity-final
   npm install
   ```

2. **Database Setup**
   ```bash
   docker-compose up -d db
   npx prisma db push
   ```

3. **Start Development Server**
   ```bash
   docker-compose up app
   # OR locally:
   npm run dev
   ```

4. **Access Application**
   - Platform: http://localhost:3000
   - Database Admin: http://localhost:5555 (if running Prisma Studio)

### Environment Variables

Copy `.env.example` to `.env` and configure:
```
DATABASE_URL="postgresql://kamunity_user:kamunity_password@localhost:5432/kamunity_db?schema=public"
```

## Project Structure

```
src/
├── app/                 # Next.js 14 App Router pages
│   ├── api/            # API endpoints
│   ├── news/           # News aggregation page
│   ├── chat/           # Chat hub
│   ├── rooms/          # Focus rooms
│   ├── clubs/          # Club pages (prototype)
│   └── communities/    # Community pages (prototype)
├── components/         # React components
│   ├── ui/            # Design system components
│   ├── summaries/     # Manual summary components
│   └── [feature]/     # Feature-specific components
├── lib/               # Business logic and utilities
├── types/             # TypeScript type definitions
└── prisma/            # Database schema and migrations
```

## Launch Strategy

### Phase 1: Foundation (August 21st Launch)
- ✅ **Working**: Manual summaries, database, design system, homepage, news
- 🚧 **Implementing**: Chat system, action detection, room generator, safety systems
- 📋 **Prototype**: Clubs and communities (UI ready, functionality post-launch)

### Phase 2: Community Seeding
- Seed with foundational questions and partner content
- Manual curation with community involvement
- Test governance models through actual use

### Phase 3: Progressive AI Integration
- Replace manual processes with community-generated solutions
- Transparent AI systems with community oversight

## Key Features

### Hierarchical Organization
- **Chat** → Spark discussions and identify opportunities
- **Focus Rooms** → Collaborative spaces for small teams
- **Clubs** → Formal collaboration between 5+ rooms
- **Communities** → Federation of 2+ clubs with advanced governance

### Community-Driven Development
- Platform development challenges become community focus areas
- "Wizard of Oz" manual processes until community builds solutions
- Democratic governance and cooperative ownership models

### Cooperative Economics
- "Pay what you feel" membership ($1 minimum)
- Profit redistribution to grants, direct transfers, debt forgiveness
- Transparent cost+ approach for all services

## Development Guidelines

### Safety First
- Always err on safety vs. ease
- Follow established best practices
- Robust privacy protections
- Community involvement in safety systems

### Accessibility
- WCAG 2.1 AA compliance throughout
- Comprehensive design system with accessibility built-in
- Mobile-first responsive design

### Code Standards
- TypeScript throughout
- Comprehensive error handling
- Component-based architecture
- Performance optimization with caching

## Launch Checklist

### Critical for August 21st
- [ ] Chat system with room promotion features
- [ ] Manual action detection workflow
- [ ] Room specification generator
- [ ] Community formation assistance workflow
- [ ] Safety and moderation systems
- [ ] Content seeding with partner organizations

### Content Strategy
- [ ] Foundational questions prepared
- [ ] Partner content integration (Pack Music, NGOs, etc.)
- [ ] Attribution and value exchange systems
- [ ] Pre-seeded chats and initial rooms

## Documentation

- **`requirements.md`** - Complete launch plan and strategy
- **`prisma/schema.prisma`** - Database schema
- **`src/types/`** - TypeScript definitions
- **API Documentation** - Available at `/api` endpoints

## Contributing

This platform is built using a community-driven approach. The community itself will help solve the complex challenges of governance, economics, and algorithmic fairness through collaborative focus rooms and clubs.

### Partner Organizations
- Pack Music (https://www.packmusic.au/)
- NGOs, support groups, book clubs, hiking sites
- Kamunity.org and kamunityconsulting.com

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL
- **Deployment**: Docker containerization
- **Design**: Custom design system inspired by kamunity.org

## Support

For development questions or community involvement, engage through the platform's own chat and room systems once launched. This dogfooding approach ensures the platform serves its intended purpose.

---

**"Community begins with one spark"** - Let's build this together.
