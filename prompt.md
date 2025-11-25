# Analytics SaaS Platform - MVP Development Prompt

## Project Overview
Build a white-label analytics dashboard SaaS platform where marketing agencies can provide clients with professional Google Analytics reports. Clients connect their GA4 accounts and view beautifully designed reports created by the agency admin.

## Core Features for MVP

### 1. Authentication System
- **Google OAuth integration** via Supabase Auth
- **Role-based access**: System Admin (agency) vs Client User
- **No manual registration** - Gmail login only
- **Protected routes** based on user roles

### 2. Landing Page
- **Professional marketing website** with modern design
- **Hero section**: "Transform Your Analytics Into Beautiful, Actionable Reports"
- **Features showcase**: Professional reports, instant setup, real-time data, growth insights
- **Pricing tiers display** (4 tiers: Starter $29, Professional $79, Agency $199, Enterprise Custom)
- **Call-to-action**: "Start Free Trial" button leading to Google OAuth
- **Responsive design** with smooth animations

### 3. Client Dashboard
- **Clean, modern interface** showing connected GA4 properties
- **Report gallery** displaying available report templates
- **Individual report views** with charts, tables, and insights
- **Date range selector** for all reports
- **PDF export functionality** for reports
- **GA4 connection status** and re-connection options

### 4. System Admin Panel
- **Report template builder** with drag-and-drop interface
- **User management**: View all connected clients
- **Template management**: Create, edit, delete report templates
- **Client analytics**: See which clients are using which reports
- **System overview**: Total users, connections, report generations

### 5. Google Analytics Integration
- **OAuth 2.0 flow** for secure GA4 connection
- **Property selection**: Let clients choose which GA4 property to connect
- **Data fetching**: Use Google Analytics Data API v1 for reporting data
- **Real-time sync**: Refresh data automatically
- **Error handling**: Graceful handling of API limits and errors

## Technical Stack

### Frontend & Backend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Hook Form** for form management
- **Zustand** for state management
- **React Query (TanStack)** for API data fetching

### Database & Authentication
- **Supabase** for PostgreSQL database, auth, and storage
- **Supabase Auth** with Google OAuth provider
- **Row Level Security (RLS)** for multi-tenant data isolation

### External APIs
- **Google Analytics Data API v1** for report data
- **Google Analytics Admin API v1** for property management
- **Google OAuth 2.0** for authentication and GA4 access

### Deployment
- **Netlify** for frontend deployment
- **Supabase Cloud** for backend services
- **Environment variables** for API keys and secrets

## Database Schema (Supabase)

### Tables Structure
```sql
-- Users table (managed by Supabase Auth)
-- Extended with profiles table

-- User profiles
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  role TEXT CHECK (role IN ('admin', 'client')) NOT NULL,
  company_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- GA4 connections
CREATE TABLE ga4_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  property_id TEXT NOT NULL,
  property_name TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expires_at TIMESTAMP,
  connected_at TIMESTAMP DEFAULT NOW(),
  last_synced_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- Report templates (created by admins)
CREATE TABLE report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  template_config JSONB NOT NULL, -- Store chart configs, metrics, etc.
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Generated reports cache
CREATE TABLE generated_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  template_id UUID REFERENCES report_templates NOT NULL,
  property_id TEXT NOT NULL,
  report_data JSONB NOT NULL,
  date_range_start DATE NOT NULL,
  date_range_end DATE NOT NULL,
  generated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '1 hour')
);
```

### Row Level Security Policies
```sql
-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can only see their own GA4 connections
CREATE POLICY "Users can view own connections" ON ga4_connections
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can see all, clients can see active templates only
CREATE POLICY "Template visibility" ON report_templates
  FOR SELECT USING (
    is_active = TRUE OR 
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Users can only see their own generated reports
CREATE POLICY "Users can view own reports" ON generated_reports
  FOR SELECT USING (auth.uid() = user_id);
```

## Key Components to Build

### 1. Landing Page Components
- `Hero.tsx` - Main hero section with CTA
- `Features.tsx` - Feature showcase with icons
- `Pricing.tsx` - Pricing tiers display
- `Testimonials.tsx` - Customer testimonials
- `Footer.tsx` - Contact and links
- `Navbar.tsx` - Navigation with login button

### 2. Authentication Components
- `GoogleAuthButton.tsx` - Sign in with Google
- `ProtectedRoute.tsx` - Route protection wrapper
- `AuthProvider.tsx` - Auth context provider

### 3. Dashboard Components
- `DashboardLayout.tsx` - Main layout with sidebar
- `Sidebar.tsx` - Navigation sidebar
- `ReportCard.tsx` - Individual report preview
- `ReportGrid.tsx` - Grid of available reports
- `ConnectionStatus.tsx` - GA4 connection indicator

### 4. Report Components
- `ReportViewer.tsx` - Full report display
- `ChartContainer.tsx` - Wrapper for charts
- `MetricCard.tsx` - KPI display cards
- `DateRangePicker.tsx` - Date selection
- `ExportButton.tsx` - PDF export functionality

### 5. Admin Components
- `AdminLayout.tsx` - Admin dashboard layout
- `TemplateBuilder.tsx` - Report template creator
- `UsersList.tsx` - Client management
- `TemplatesList.tsx` - Template management
- `SystemStats.tsx` - Platform analytics

### 6. Google Analytics Components
- `GA4Connector.tsx` - OAuth flow handler
- `PropertySelector.tsx` - GA4 property picker
- `DataFetcher.tsx` - API data management
- `SyncStatus.tsx` - Data sync indicator

## API Routes to Implement

### Authentication Routes
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/profile` - Update user profile
- `GET /api/auth/check-admin` - Verify admin role

### Google Analytics Routes
- `POST /api/ga4/connect` - Initiate OAuth flow
- `GET /api/ga4/callback` - Handle OAuth callback
- `GET /api/ga4/properties` - List user's GA4 properties
- `POST /api/ga4/select-property` - Connect specific property
- `DELETE /api/ga4/disconnect` - Disconnect GA4

### Reports Routes
- `GET /api/reports/templates` - List available templates
- `GET /api/reports/generate/:templateId` - Generate report
- `POST /api/reports/export/:reportId` - Export to PDF
- `GET /api/reports/history` - User's report history

### Admin Routes
- `GET /api/admin/users` - List all users (admin only)
- `GET /api/admin/templates` - Manage templates
- `POST /api/admin/templates` - Create new template
- `PUT /api/admin/templates/:id` - Update template
- `DELETE /api/admin/templates/:id` - Delete template
- `GET /api/admin/stats` - System statistics

## Google Analytics Integration Details

### Required OAuth Scopes
```javascript
const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
];
```

### GA4 Data API Integration
```typescript
// Example API call structure
interface GA4ReportRequest {
  property: string; // properties/GA4_PROPERTY_ID
  dateRanges: [{ startDate: string; endDate: string }];
  metrics: [{ name: string }]; // e.g., 'sessions', 'users'
  dimensions: [{ name: string }]; // e.g., 'date', 'source'
}

// Common metrics to fetch
const STANDARD_METRICS = [
  'sessions',
  'users',
  'newUsers',
  'bounceRate',
  'sessionDuration',
  'conversions',
  'pageviews'
];

// Common dimensions
const STANDARD_DIMENSIONS = [
  'date',
  'source',
  'medium',
  'pagePath',
  'deviceCategory',
  'country'
];
```

### Report Templates Structure
```typescript
interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  charts: ChartConfig[];
  metrics: MetricConfig[];
  timeframe: 'last_7_days' | 'last_30_days' | 'last_90_days';
}

interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'table';
  title: string;
  metrics: string[];
  dimensions: string[];
  filters?: FilterConfig[];
}
```

## Default Report Templates

### 1. Website Performance Overview
- Sessions over time (line chart)
- Users vs New Users (metric cards)
- Bounce rate trend (line chart)
- Top pages table
- Device breakdown (pie chart)

### 2. Traffic Sources Analysis
- Sessions by source/medium (bar chart)
- Organic vs Paid traffic (pie chart)
- Top referral sources (table)
- Social media performance (bar chart)

### 3. Content Performance Report
- Top performing pages (table)
- Page views over time (line chart)
- Exit rate by page (table)
- Content engagement metrics

### 4. Mobile vs Desktop Analysis
- Sessions by device type (pie chart)
- Device performance comparison (table)
- Mobile conversion rates
- Screen resolution data

### 5. Monthly Executive Summary
- Key metrics overview (metric cards)
- Month-over-month growth (percentage changes)
- Top insights and recommendations
- Goals and conversions summary

## Styling and Design Requirements

### Design System
- **Modern, clean aesthetic** with plenty of whitespace
- **Professional color scheme**: Primary blue (#3B82F6), secondary gray (#64748B)
- **Typography**: Inter font family throughout
- **Responsive breakpoints**: Mobile-first design
- **Dark mode support** for dashboard areas

### UI Components
- **Consistent spacing** using Tailwind's spacing scale
- **Subtle animations** for interactions (hover effects, loading states)
- **Professional icons** from Lucide React
- **Consistent button styles** with proper loading states
- **Form validation** with clear error messages

### Dashboard Layout
- **Sidebar navigation** with collapsible menu
- **Top header** with user avatar and notifications
- **Card-based layout** for reports and metrics
- **Responsive grid** for different screen sizes
- **Loading skeletons** for better UX

## Security Considerations

### Data Protection
- **Encrypt sensitive tokens** in database
- **Use HTTPS everywhere** in production
- **Implement rate limiting** on API endpoints
- **Validate all user inputs** server-side
- **Secure cookie settings** for authentication

### Google Analytics Access
- **Minimal required scopes** for GA4 access
- **Token refresh handling** for expired access tokens
- **Graceful error handling** for API failures
- **User consent tracking** for data access

### Multi-tenant Security
- **Row Level Security** in Supabase
- **User isolation** - clients can't see other clients' data
- **Admin role verification** for sensitive operations
- **Audit logging** for admin actions

## Error Handling and UX

### Loading States
- **Skeleton loaders** for report generation
- **Progress indicators** for GA4 connection
- **Loading spinners** for data fetching
- **Optimistic updates** where appropriate

### Error Messages
- **Clear, actionable error messages** for users
- **Fallback UI** for failed data loads
- **Retry mechanisms** for API failures
- **Support contact** for unresolvable issues

### Offline Handling
- **Cached report data** when possible
- **Offline indicators** when connection lost
- **Graceful degradation** for limited connectivity

## Development Workflow

### Initial Setup
1. Create Next.js project with TypeScript
2. Set up Supabase project and configure auth
3. Install and configure required dependencies
4. Set up Google Analytics API credentials
5. Configure environment variables
6. Set up database schema and RLS policies

### Development Phases
**Phase 1: Authentication & Basic Layout**
- Implement Google OAuth with Supabase
- Create basic routing and layout components
- Set up role-based access control

**Phase 2: Landing Page**
- Design and implement marketing website
- Add pricing tiers and feature showcase
- Implement responsive design

**Phase 3: GA4 Integration**
- Set up Google Analytics API integration
- Implement OAuth flow for GA4 access
- Create property selection interface

**Phase 4: Report System**
- Build report template system
- Implement data fetching and display
- Add PDF export functionality

**Phase 5: Admin Panel**
- Create admin dashboard
- Implement template builder
- Add user management features

### Testing Strategy
- **Unit tests** for utility functions
- **Integration tests** for API routes
- **E2E tests** for critical user flows
- **Manual testing** for GA4 integration

## Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google OAuth & Analytics API
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_ANALYTICS_API_KEY=your_analytics_api_key

# Application URLs
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Other
NODE_ENV=development
```

## Deployment Instructions

### Netlify Deployment
1. Connect GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Add environment variables in Netlify dashboard
4. Enable Netlify Functions for API routes
5. Configure custom domain and SSL

### Supabase Setup
1. Create new Supabase project
2. Configure Google OAuth provider in Auth settings
3. Run database migrations for schema
4. Set up RLS policies
5. Configure storage buckets for file uploads

## Success Metrics for MVP

### User Engagement
- **User registration rate** from landing page
- **GA4 connection completion rate**
- **Report generation frequency** per user
- **Session duration** in dashboard

### Technical Performance
- **Page load times** under 2 seconds
- **API response times** under 500ms
- **Uptime** above 99.5%
- **Error rates** below 1%

### Business Metrics
- **Conversion rate** from landing to signup
- **User retention** after 7 days
- **Feature adoption** rates
- **Support ticket volume**

## Future Enhancements (Post-MVP)

### Additional Integrations
- Google Search Console
- Facebook/Meta Ads
- Google Ads
- Instagram Business

### Advanced Features
- Custom report builder for clients
- Automated report scheduling
- Email notifications and alerts
- Team collaboration features
- API access for advanced users
- Mobile app companion

### Business Features
- Payment processing integration
- Subscription management
- Usage analytics and billing
- White-label customization
- Multi-language support

---

This prompt provides a comprehensive foundation for building your analytics SaaS MVP. Focus on implementing the core features first, then iterate based on user feedback and business needs.