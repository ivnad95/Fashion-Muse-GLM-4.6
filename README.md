# 🎨 Fashion Muse Studio - AI-Powered Fashion Photography

Transform your photos into professional fashion art with AI. Create stunning photoshoots in 8 different styles using Gemini 2.5 Flash Image Preview.

> **📋 Looking to improve this project?** Check out the comprehensive improvement plan in [`IMPROVEMENT_PLAN.md`](./IMPROVEMENT_PLAN.md)

## ✨ Technology Stack

This scaffold provides a robust foundation built with:

### 🎯 Core Framework
- **⚡ Next.js 15** - The React framework for production with App Router
- **📘 TypeScript 5** - Type-safe JavaScript for better developer experience
- **🎨 Tailwind CSS 4** - Utility-first CSS framework for rapid UI development

### 🧩 UI Components & Styling
- **🧩 shadcn/ui** - High-quality, accessible components built on Radix UI
- **🎯 Lucide React** - Beautiful & consistent icon library
- **🌈 Framer Motion** - Production-ready motion library for React
- **🎨 Next Themes** - Perfect dark mode in 2 lines of code

### 📋 Forms & Validation
- **🎣 React Hook Form** - Performant forms with easy validation
- **✅ Zod** - TypeScript-first schema validation

### 🔄 State Management & Data Fetching
- **🐻 Zustand** - Simple, scalable state management
- **🔄 TanStack Query** - Powerful data synchronization for React
- **🌐 Axios** - Promise-based HTTP client

### 🗄️ Database & Backend
- **🗄️ Prisma** - Next-generation Node.js and TypeScript ORM
- **🔐 NextAuth.js** - Complete open-source authentication solution

### 🎨 Advanced UI Features
- **📊 TanStack Table** - Headless UI for building tables and datagrids
- **🖱️ DND Kit** - Modern drag and drop toolkit for React
- **📊 Recharts** - Redefined chart library built with React and D3
- **🖼️ Sharp** - High performance image processing

### 🌍 Internationalization & Utilities
- **🌍 Next Intl** - Internationalization library for Next.js
- **📅 Date-fns** - Modern JavaScript date utility library
- **🪝 ReactUse** - Collection of essential React hooks for modern development

## 🎯 Features

### AI-Powered Generation
- **8 Professional Camera Angles** - Hero low angle, beauty close-up, editorial side glance, and more
- **Multiple Lighting Setups** - Rembrandt, butterfly, split, loop, clamshell, and rim lighting
- **Studio Backgrounds** - Seamless white, light gray, and professional cyclorama options
- **Batch Generation** - Create 1-8 images simultaneously with different variations
- **Gemini 2.5 Flash** - Powered by Google's latest image generation model

### User Experience
- **Glassmorphism UI** - Beautiful, modern interface with 3D glass effects
- **Mobile-First Design** - Fully responsive on all devices
- **Google Sign-In** - Seamless authentication with your Google account
- **Manual API Key Option** - Use your own Gemini API key without signing in
- **Real-time Progress** - Live updates during image generation (Socket.IO ready)

### Technical Features
- **Type-Safe** - Full TypeScript with Zod validation
- **Database Persistence** - SQLite (dev) / PostgreSQL (prod) with Prisma ORM
- **Component Library** - Complete shadcn/ui components
- **Custom Server** - Next.js + Socket.IO integration
- **Docker Ready** - Containerized deployment configuration
- **Production Optimized** - Performance-focused build configuration

## 📚 Improvement Documentation

This project includes comprehensive improvement documentation:

- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Start here! High-level overview of all improvements
- **[IMPROVEMENT_PLAN.md](./IMPROVEMENT_PLAN.md)** - Complete roadmap with 8 implementation phases
- **[QUICK_START.md](./QUICK_START.md)** - Day-by-day implementation guide
- **[PROGRESS_TRACKER.md](./PROGRESS_TRACKER.md)** - Track your implementation progress
- **[TECHNICAL_SPECS.md](./TECHNICAL_SPECS.md)** - Detailed technical specifications
- **[env.template](./env.template)** - Environment variable configuration template

## 🚀 Quick Start

### Basic Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp env.template .env.local
# Edit .env.local and add required values

# Set up database
npx prisma generate
npx prisma db push

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see your application running.

### Environment Configuration

See [`env.template`](./env.template) for all required environment variables. At minimum, you need:

- `DATABASE_URL` - Database connection string
- `NEXTAUTH_URL` - Your application URL
- `NEXTAUTH_SECRET` - Secret for JWT encryption (generate with `openssl rand -base64 32`)

For full functionality:
- Google OAuth credentials (see [`GOOGLE_SIGNIN_SETUP.md`](./GOOGLE_SIGNIN_SETUP.md))
- Gemini API key (see [`GEMINI_SETUP.md`](./GEMINI_SETUP.md))

## 🤖 Powered by Z.ai

This scaffold is optimized for use with [Z.ai](https://chat.z.ai) - your AI assistant for:

- **💻 Code Generation** - Generate components, pages, and features instantly
- **🎨 UI Development** - Create beautiful interfaces with AI assistance  
- **🔧 Bug Fixing** - Identify and resolve issues with intelligent suggestions
- **📝 Documentation** - Auto-generate comprehensive documentation
- **🚀 Optimization** - Performance improvements and best practices

Ready to build something amazing? Start chatting with Z.ai at [chat.z.ai](https://chat.z.ai) and experience the future of AI-powered development!

## 📁 Project Structure

```
Fashion Muse Studio/
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/         # NextAuth endpoints
│   │   │   ├── generate/     # Image generation endpoint
│   │   │   └── health/       # Health check
│   │   ├── layout.tsx        # Root layout with providers
│   │   ├── page.tsx          # Main application UI
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── providers/        # React context providers
│   │   └── ui/              # shadcn/ui components (48 components)
│   ├── hooks/               # Custom React hooks
│   └── lib/
│       ├── auth.ts          # NextAuth configuration
│       ├── db.ts            # Prisma client
│       ├── socket.ts        # Socket.IO setup
│       └── utils.ts         # Utility functions
├── prisma/
│   └── schema.prisma        # Database schema
├── public/                  # Static assets
├── server.ts               # Custom server (Next.js + Socket.IO)
├── docker-compose.yml      # Docker configuration
├── deploy.sh              # Deployment script
└── Documentation/
    ├── IMPROVEMENT_PLAN.md
    ├── QUICK_START.md
    ├── PROGRESS_TRACKER.md
    ├── TECHNICAL_SPECS.md
    ├── IMPLEMENTATION_SUMMARY.md
    ├── GEMINI_SETUP.md
    ├── GOOGLE_SIGNIN_SETUP.md
    ├── DEPLOYMENT.md
    └── AGENTS.md
```

## 🎨 Available Features & Components

This scaffold includes a comprehensive set of modern web development tools:

### 🧩 UI Components (shadcn/ui)
- **Layout**: Card, Separator, Aspect Ratio, Resizable Panels
- **Forms**: Input, Textarea, Select, Checkbox, Radio Group, Switch
- **Feedback**: Alert, Toast (Sonner), Progress, Skeleton
- **Navigation**: Breadcrumb, Menubar, Navigation Menu, Pagination
- **Overlay**: Dialog, Sheet, Popover, Tooltip, Hover Card
- **Data Display**: Badge, Avatar, Calendar

### 📊 Advanced Data Features
- **Tables**: Powerful data tables with sorting, filtering, pagination (TanStack Table)
- **Charts**: Beautiful visualizations with Recharts
- **Forms**: Type-safe forms with React Hook Form + Zod validation

### 🎨 Interactive Features
- **Animations**: Smooth micro-interactions with Framer Motion
- **Drag & Drop**: Modern drag-and-drop functionality with DND Kit
- **Theme Switching**: Built-in dark/light mode support

### 🔐 Backend Integration
- **Authentication**: Ready-to-use auth flows with NextAuth.js
- **Database**: Type-safe database operations with Prisma
- **API Client**: HTTP requests with Axios + TanStack Query
- **State Management**: Simple and scalable with Zustand

### 🌍 Production Features
- **Internationalization**: Multi-language support with Next Intl
- **Image Optimization**: Automatic image processing with Sharp
- **Type Safety**: End-to-end TypeScript with Zod validation
- **Essential Hooks**: 100+ useful React hooks with ReactUse for common patterns

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or use the deployment script
./deploy.sh
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for detailed deployment instructions.

## 📖 Additional Documentation

- **[GEMINI_SETUP.md](./GEMINI_SETUP.md)** - Set up Gemini API for image generation
- **[GOOGLE_SIGNIN_SETUP.md](./GOOGLE_SIGNIN_SETUP.md)** - Configure Google OAuth
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Comprehensive deployment guide
- **[AGENTS.md](./AGENTS.md)** - Project guidelines and coding standards

## 🤝 Contributing

Contributions are welcome! Please follow the guidelines in [`AGENTS.md`](./AGENTS.md) when making changes.

### Before Contributing
1. Read [`IMPROVEMENT_PLAN.md`](./IMPROVEMENT_PLAN.md) to understand the roadmap
2. Check [`PROGRESS_TRACKER.md`](./PROGRESS_TRACKER.md) to see what's being worked on
3. Follow the coding standards in [`AGENTS.md`](./AGENTS.md)
4. Test your changes thoroughly

## 📝 License

This project is built with open-source technologies. Please respect the licenses of all dependencies.

---

**Fashion Muse Studio** - Transform your photos into professional fashion art with AI  
Built with ❤️ for the creative community | Powered by [Gemini 2.5 Flash](https://ai.google.dev/) 🚀
