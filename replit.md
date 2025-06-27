# Educational 3D World - Replit Documentation

## Overview

This is a 3D educational world application built with React Three Fiber (R3F) and Express.js. The application provides an immersive 3D environment where students can explore virtual campuses, interact with educational content, and learn through gamified experiences. The system features a comprehensive avatar customization system, dynamic world building, and integrated Python coding capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **3D Engine**: React Three Fiber (R3F) with Three.js
- **State Management**: Zustand with middleware support
- **UI Components**: Radix UI with custom styling
- **Styling**: Tailwind CSS with custom mobile-responsive utilities
- **Build Tool**: Vite with custom configuration for 3D assets

### Backend Architecture  
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based with connect-pg-simple
- **Development**: Hot module replacement via Vite middleware

### Key Design Decisions
- **3D-First Architecture**: Built around Three.js for immersive educational experiences
- **Modular Component System**: Separation of concerns between game logic, UI, and 3D rendering
- **Responsive Design**: Mobile-first approach with adaptive layouts and touch optimizations
- **Real-time Interaction**: Frame-based updates using useFrame hooks for smooth animations

## Key Components

### 3D World System
- **Terrain System**: Dynamic terrain generation with multiple biomes and physics
- **Avatar System**: Fully customizable 3D avatars with animation and movement
- **Campus Buildings**: Interactive educational environments with interior spaces
- **Physics Integration**: Custom physics system for realistic interactions

### Educational Features
- **Python Integration**: In-browser Python execution with Pyodide
- **Creative Engine**: Custom shape and NPC creation system
- **Learning Management**: Progress tracking and unlockable content
- **Interactive Tutorials**: Step-by-step guided learning experiences

### User Interface
- **Adaptive UI**: Responsive design that works across desktop, tablet, and mobile
- **Build Mode**: Visual editor for placing and customizing world objects
- **Minimap System**: Real-time navigation aid with interactive elements
- **Profile Management**: Comprehensive avatar and learning progress customization

## Data Flow

### State Management Architecture
1. **Global State**: Zustand stores handle application-wide state (user, world, environment)
2. **Component State**: Local React state for UI interactions and temporary data
3. **3D State**: Three.js object references managed through useRef hooks
4. **Persistence**: LocalStorage integration for user preferences and progress

### Data Flow Pattern
1. User interactions trigger state updates via Zustand actions
2. State changes propagate to React components via subscriptions
3. 3D components respond to state changes through useFrame and useEffect hooks
4. Database operations occur through Express API endpoints

### Real-time Updates
- **Frame-based Animation**: 60fps updates using R3F's useFrame
- **Physics Simulation**: Custom terrain physics with collision detection
- **Camera System**: Smooth following camera with multiple view modes
- **Environmental Effects**: Dynamic lighting and weather systems

## External Dependencies

### Core 3D Libraries
- `@react-three/fiber`: React renderer for Three.js
- `@react-three/drei`: Useful helpers and abstractions for R3F
- `@react-three/postprocessing`: Post-processing effects
- `three`: Core 3D engine

### UI and Styling
- `@radix-ui/*`: Accessible UI component primitives
- `tailwindcss`: Utility-first CSS framework
- `class-variance-authority`: Type-safe styling variants
- `lucide-react`: Icon library

### Database and Backend
- `drizzle-orm`: Type-safe ORM for PostgreSQL
- `@neondatabase/serverless`: Serverless PostgreSQL driver
- `express`: Web application framework
- `connect-pg-simple`: PostgreSQL session store

### Development Tools
- `vite`: Build tool and development server
- `typescript`: Type checking and development experience
- `vite-plugin-glsl`: GLSL shader support for custom graphics

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: PostgreSQL connection via DATABASE_URL environment variable
- **Asset Handling**: Static assets served from public directory

### Production Build
- **Frontend**: Vite production build with optimized bundles
- **Backend**: ESBuild compilation for Node.js deployment
- **Database**: Drizzle migrations for schema management
- **Deployment**: Configured for Replit's autoscale deployment target

### Performance Optimizations
- **3D Asset Loading**: Lazy loading of GLTF models and textures
- **Mobile Optimization**: Reduced polygon counts and texture sizes
- **Bundle Splitting**: Code splitting for faster initial load times
- **Texture Compression**: Optimized image formats for web delivery

## Changelog
```
Changelog:
- June 27, 2025. Initial setup
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```