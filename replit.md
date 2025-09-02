# ReRank - AI-Powered Resume Rating & Global Ranking Platform

## Overview

ReRank is a futuristic AI-powered platform that evaluates and ranks resumes globally using a sophisticated scoring system. The platform analyzes resumes across multiple dimensions (skills, certifications, experience, and industry alignment) to generate comprehensive scores ranging from 900-3500+ points. It features real-time leaderboards, recruiter dashboards, and interactive data visualizations to create a competitive environment for job seekers while providing valuable insights for recruiters.

## User Preferences

Preferred communication style: Simple, everyday language.
Design direction: Professional LinkedIn-inspired interface with light mode as default, replacing the futuristic dark theme.
Ranking system: Multi-layer with skills, experience, and industry rankings using 900-3500+ score range with tier badges (Bronze → Diamond).
Color palette: Trust blue (#2563EB), positive green (#10B981), warning amber (#F59E0B), muted gray (#6B7280).

## System Architecture

### Frontend Architecture
The client-side is built as a modern React single-page application using TypeScript and Vite for development tooling. The UI leverages shadcn/ui components built on Radix UI primitives with TailwindCSS for styling, creating a futuristic dark theme with neon accents. Framer Motion provides smooth animations and micro-interactions throughout the interface. The application uses Wouter for lightweight client-side routing and TanStack Query for server state management and caching.

Key architectural decisions:
- **Component-based architecture**: Modular UI components with clear separation of concerns
- **Type-safe development**: Full TypeScript integration across the application
- **Responsive design**: Mobile-first approach with glassmorphism and dark theme aesthetics
- **Real-time updates**: Query invalidation and refetching for live leaderboard updates

### Backend Architecture
The server is an Express.js application that serves both API endpoints and static assets. The backend implements a RESTful API structure with endpoints for resume uploads, candidate management, leaderboards, and search functionality. File uploads are handled via Multer with memory storage and size limitations.

Core backend features:
- **Resume processing**: File upload handling with AI-powered scoring simulation
- **Ranking system**: Global, regional, and industry-specific leaderboards
- **Search and filtering**: Advanced candidate discovery with multiple criteria
- **Data export**: CSV export functionality for recruiter use cases

### Data Storage Solutions
The application uses Drizzle ORM with PostgreSQL as the primary database, configured for both development and production environments. The schema defines candidates and resumes tables with comprehensive scoring fields and ranking metadata. For development, an in-memory storage implementation provides mock data and functionality.

Database design considerations:
- **Scalable schema**: Designed to handle large volumes of candidates and resumes
- **Denormalized rankings**: Pre-calculated rank fields for performance
- **Array fields**: Native PostgreSQL array support for skills storage
- **UUID primary keys**: Globally unique identifiers for distributed systems

### Authentication and Authorization
The current implementation uses a session-based approach with connect-pg-simple for PostgreSQL session storage. The system is designed to be extensible for future authentication methods and role-based access control.

### External Dependencies
- **Neon Database**: PostgreSQL hosting service via @neondatabase/serverless
- **Shadcn/ui**: Component library built on Radix UI primitives
- **TailwindCSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for smooth transitions
- **Recharts**: Data visualization library for score analytics
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL
- **TanStack Query**: Server state management and caching
- **Multer**: File upload middleware for Express
- **React Hook Form**: Form handling with validation

The architecture emphasizes type safety, performance, and user experience while maintaining scalability for future AI integration and advanced features.