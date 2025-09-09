# Vaya Admin Dashboard - Development Tasks

### Deployed URL
https://api.vaya-luyten.com

### Swagger Docs
https://api.vaya-luyten.com/api-docs

### Open API Docs
https://api.vaya-luyten.com/api-docs.json

## Overview

This document outlines all the tasks and user stories for building the Vaya Admin Dashboard. The dashboard will provide comprehensive administrative control over the Vaya transportation platform.

### User Stories

- **As an admin**, I want to securely log into the dashboard so I can access administrative functions
- **As an admin**, I want my session to be maintained so I don't have to re-login frequently
- **As an admin**, I want to be automatically logged out if my session expires so security is maintained

---

## Driver Management

### Tasks

- [ ] Create driver management page layout
- [ ] Build pending drivers list component
- [ ] Create driver approval/rejection interface
- [ ] Add driver profile view modal
- [ ] Implement driver performance metrics dashboard
- [ ] Create driver analytics by period view
- [ ] Add driver earnings summary component
- [ ] Build driver search and filtering
- [ ] Add driver status indicators
- [ ] Create driver document viewer

### User Stories

- **As an admin**, I want to view all pending driver applications so I can review their documentation and credentials
- **As an admin**, I want to approve driver applications so qualified drivers can start operating
- **As an admin**, I want to reject driver applications with a reason so drivers understand why they were declined
- **As an admin**, I want to view driver performance metrics so I can monitor service quality
- **As an admin**, I want to access driver analytics by time period so I can track trends and performance

### API Endpoints

- `GET /admin/drivers/pending` - View pending driver approvals
- `PUT /admin/drivers/{driverProfileId}/approve` - Approve driver profiles
- `PUT /admin/drivers/{driverProfileId}/reject` - Reject driver profiles with reason
- `GET /api/trips/performance/driver/{driverId}` - View driver performance metrics
- `GET /api/trips/earnings/driver/{driverId}` - View driver earnings analytics
- `GET /api/trips/analytics/driver/{driverId}/period/{period}` - View driver analytics by period

---

## Route Management

### Tasks

- [ ] Create route management page layout
- [ ] Build routes list component with status indicators
- [ ] Create route toggle functionality (activate/deactivate)
- [ ] Add route details view
- [ ] Implement route performance monitoring
- [ ] Create route usage analytics
- [ ] Add route search and filtering
- [ ] Build route status bulk operations

### User Stories

- **As an admin**, I want to view all routes (active and inactive) so I can manage the transportation network
- **As an admin**, I want to activate/deactivate routes so I can control service availability
- **As an admin**, I want to monitor route performance so I can optimize the network

### API Endpoints

- `GET /admin/routes` - View all routes for management
- `PUT /admin/routes/{routeId}/toggle` - Toggle route active status

### Available Routes

Block_8_Route_1-4, Broadhurst_Route_1-2, Broadhurst_Route_5-6, G_West, Kgale_View_Route_1-3, Metsimotlhabe, Mmopane_BBS_Ledumang, Mmopane_Gaborone, Tlokweng_Route_1-6

---

## User Management

### Tasks

- [ ] Create user management page layout
- [ ] Build users list component
- [ ] Create user role update interface
- [ ] Add user profile view modal
- [ ] Implement user search and filtering
- [ ] Create user activity monitoring
- [ ] Add user status indicators
- [ ] Build user role change history

### User Stories

- **As an admin**, I want to update user roles so I can manage permissions and access levels
- **As an admin**, I want to promote users to different roles (RIDER, DRIVER, FLEET_MANAGER, ADMIN) so I can delegate responsibilities

### API Endpoints

- `PUT /admin/users/{userId}/role` - Update user roles

### Available Roles

RIDER, DRIVER, FLEET_MANAGER, ADMIN

---

## Wallet & Financial Management

### Tasks

- [ ] Create wallet management page layout
- [ ] Build pending deposits list component
- [ ] Create deposit approval/rejection interface
- [ ] Build pending withdrawals list component
- [ ] Create withdrawal approval/rejection interface
- [ ] Add transaction debug viewer
- [ ] Implement financial analytics dashboard
- [ ] Create payment method management
- [ ] Add financial reporting tools
- [ ] Build transaction search and filtering

### User Stories

- **As an admin**, I want to view pending deposit requests so I can verify and approve user wallet top-ups
- **As an admin**, I want to approve deposit requests so users can use their wallet funds
- **As an admin**, I want to reject deposit requests with notes so users understand why their deposit was declined
- **As an admin**, I want to view pending withdrawal requests so I can process user payouts
- **As an admin**, I want to approve withdrawal requests so users can receive their earnings
- **As an admin**, I want to reject withdrawal requests with notes so users understand the reason
- **As an admin**, I want to debug all transactions so I can troubleshoot financial issues

### API Endpoints

- `GET /api/wallet/admin/deposits/pending` - View pending deposits
- `PUT /api/wallet/admin/deposits/{depositId}/approve` - Approve deposits
- `PUT /api/wallet/admin/deposits/{depositId}/reject` - Reject deposits
- `GET /api/wallet/admin/withdrawals/pending` - View pending withdrawals
- `PUT /api/wallet/admin/withdrawals/{withdrawalId}/approve` - Approve withdrawals
- `PUT /api/wallet/admin/withdrawals/{withdrawalId}/reject` - Reject withdrawals
- `GET /api/wallet/debug/transactions` - Debug all transactions

---

## Notification Management

### Tasks

- [ ] Create notification management page layout
- [ ] Build notification composer interface
- [ ] Create maintenance alert sender
- [ ] Build feature update notification sender
- [ ] Create system alert sender
- [ ] Add user targeting functionality
- [ ] Implement notification templates
- [ ] Create notification history viewer
- [ ] Add notification analytics
- [ ] Build notification scheduling

### User Stories

- **As an admin**, I want to send maintenance alerts to users so I can notify them of scheduled downtime
- **As an admin**, I want to send feature update notifications so users know about new functionality
- **As an admin**, I want to send system alerts so I can communicate urgent information to users
- **As an admin**, I want to target specific users for notifications so I can send relevant messages

### API Endpoints

- `POST /admin/notifications/maintenance` - Send maintenance alerts
- `POST /admin/notifications/feature-update` - Send feature update notifications
- `POST /admin/notifications/system-alert` - Send system alerts

### Notification Types

BOOKING_REQUESTED, BOOKING_CONFIRMED, BOOKING_CANCELLED, PAYMENT_SUCCESSFUL, TRIP_STARTED, TRIP_COMPLETED, etc.

### Priority Levels

LOW, NORMAL, HIGH, URGENT

---

## System Monitoring & Analytics

### Tasks

- [ ] Create system monitoring dashboard
- [ ] Build WebSocket health monitoring
- [ ] Create WebSocket statistics viewer
- [ ] Add real-time connection monitoring
- [ ] Implement driver location tracking
- [ ] Create rider activity monitoring
- [ ] Build system performance metrics
- [ ] Add alert system for system issues
- [ ] Create uptime monitoring
- [ ] Build usage analytics

### User Stories

- **As an admin**, I want to monitor WebSocket service health so I can ensure real-time features are working
- **As an admin**, I want to view WebSocket statistics so I can monitor user connections and activity
- **As an admin**, I want to track driver locations and rider activity so I can monitor system usage
- **As an admin**, I want to view trip statistics so I can analyze platform performance

### API Endpoints

- `GET /websocket/health` - Check WebSocket health
- `GET /websocket/stats` - View WebSocket statistics
- `GET /api/trips/stats/driver/{driverId}` - View trip statistics

---

## Analytics & Reporting

### Tasks

- [ ] Create analytics dashboard layout
- [ ] Build driver performance metrics viewer
- [ ] Create earnings analytics by period
- [ ] Add trip completion rate monitoring
- [ ] Implement passenger count tracking
- [ ] Create financial reporting tools
- [ ] Build custom report generator
- [ ] Add data export functionality
- [ ] Create trend analysis tools
- [ ] Build comparative analytics

### User Stories

- **As an admin**, I want to view comprehensive driver performance metrics so I can evaluate driver quality
- **As an admin**, I want to analyze driver earnings by time period so I can understand financial trends
- **As an admin**, I want to track trip completion rates so I can measure service reliability
- **As an admin**, I want to monitor passenger counts so I can optimize capacity planning

### Metrics Available

- Total trips, completed trips, cancelled trips
- Total passengers, total earnings
- Completion rate, average passengers per trip
- Earnings by period (daily, weekly, monthly, yearly, all-time)
- Recent trip history

---

## UI/UX Components

### Tasks

- [ ] Create admin dashboard layout
- [ ] Build navigation sidebar
- [ ] Create header with user info
- [ ] Add responsive design
- [ ] Create loading states
- [ ] Add error handling components
- [ ] Build confirmation modals
- [ ] Create data tables with pagination
- [ ] Add search and filter components
- [ ] Create status indicators
- [ ] Build charts and graphs
- [ ] Add toast notifications
- [ ] Create form components

---

## Technical Implementation

### Tasks

- [ ] Set up Vite + React + TypeScript
- [ ] Configure Tailwind CSS with Vaya colors
- [ ] Set up API client with authentication
- [ ] Create state management (Zustand)
- [ ] Add form validation
- [ ] Implement error boundaries
- [ ] Add internationalization (i18n)
- [ ] Set up testing framework
- [ ] Add accessibility features
- [ ] Implement responsive design
- [ ] Add dark/light theme support
- [ ] Create reusable component library

---

## Development Phases

### Phase 1: Foundation (Current)

- [x] Set up Vite project
- [ ] Implement authentication system
- [ ] Create basic layout and navigation
- [ ] Set up API client and state management

### Phase 2: Core Management

- [ ] Driver management interface
- [ ] Route management interface
- [ ] User management interface

### Phase 3: Financial & Notifications

- [ ] Wallet management interface
- [ ] Notification management system

### Phase 4: Analytics & Monitoring

- [ ] Analytics dashboard
- [ ] System monitoring interface

### Phase 5: Polish & Optimization

- [ ] UI/UX improvements
- [ ] Performance optimization
- [ ] Testing and bug fixes

---

## API Base URL

- Development: `http://localhost:5001/api`
- Production: `https://api.vaya-luyten.com/api`

## Authentication

- All endpoints require JWT authentication (`bearerAuth`)
- Role-based access control (ADMIN role required)
- Secure API communication over HTTPS

---

## Notes

- Use kebab-case for component and page file names
- Follow modular folder structure
- Implement proper error handling and loading states
- Ensure mobile-first responsive design
- Use Vaya brand colors (vaya-orange, vaya-blue)
- Test thoroughly before moving to next phase
- Do not commit code until explicitly instructed
