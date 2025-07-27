# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CRM-DESIGN is a modern Customer Relationship Management (CRM) application built with React and TypeScript. It provides a scalable foundation for managing leads, contacts, sales, and communications.

## Key Technologies

- React 18.2.0 with TypeScript
- Chart.js for data visualization
- Lucide React for icons
- Create React App for build tooling

## Common Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm start

# Build for production
npm run build

# Run tests
npm test

# Check TypeScript types
npx tsc --noEmit

# Lint check (ESLint is configured through react-scripts)
npm run lint  # Note: This command needs to be added to package.json if not present
```

## Architecture Overview

### Component Structure

The application follows a component-based architecture with the main entry point at `src/App.tsx`:

1. **App.tsx** (2231 lines) - Main application component containing:
   - Sidebar navigation with collapsible menu
   - Dashboard with charts and metrics
   - Leads management section
   - Modal system for creating/editing entities
   - Routing logic (handled via state, not React Router)

2. **LeadsTable.tsx** - Reusable table component for displaying leads with:
   - Sorting capabilities
   - Row selection
   - Action menus for each row
   - Status badges

3. **LeadDetails.tsx** - Detailed view for individual leads with:
   - Comprehensive lead information display
   - Edit capabilities
   - Activity tracking
   - Note-taking functionality

### State Management

The application uses React's built-in useState hooks for state management. Key state includes:
- `activeSection` - Controls which section is displayed
- `sidebarCollapsed` - Sidebar visibility state
- `leads` - Array of lead objects
- Various modal and form states

### Styling Approach

The application uses inline styles defined as JavaScript objects within components. This approach provides:
- Type safety for styles
- Dynamic styling based on state
- No external CSS dependencies

### Data Flow

1. Sample data is hardcoded in the App component
2. Forms update local state
3. New entities are added to arrays in state
4. No backend integration currently exists

## Key Features

- **Dashboard**: Revenue analytics, lead status distribution, pipeline overview
- **Leads Management**: Create, view, edit, filter, sort, and search leads
- **Responsive Design**: Collapsible sidebar, adaptive layouts
- **Interactive Charts**: Bar, pie, and line charts using Chart.js

## Development Guidelines

When developing in this codebase:

1. Follow the existing inline styling pattern - use style objects rather than CSS files
2. Maintain TypeScript strict mode compliance
3. Use functional components with hooks
4. Keep components in the `src/components/` directory
5. Icons should use the Lucide React library
6. For new features, follow the existing pattern of state management in App.tsx

## Future Considerations

The codebase is prepared for:
- Backend API integration (currently uses hardcoded data)
- Additional CRM modules (Accounts, Contacts, Deals, etc.)
- Enhanced routing (could benefit from React Router)
- State management library (Redux/Zustand) if complexity grows
- Testing implementation (Jest is configured but no tests exist)