# PointNow Admin System - Feature Analysis

## Overview
This document analyzes the codebase to recommend features for a super admin system at `pointnow.io/admin` for developers and management to track the entire platform.

---

## 1. REVENUE DASHBOARD

### Current API Support
- ✅ `GET /subscription/products` - List subscription products (with pagination, is_trial filter)
- ✅ `GET /subscription/types/{typeId}` - Get subscription type details
- ✅ `GET /subscriptions/active/business` - Get active subscription for a business

### Recommended Features

#### 1.1 Revenue Overview (Main Dashboard)
**Metrics to Display:**
- **Total Revenue (MRR/ARR)**
  - Monthly Recurring Revenue (MRR)
  - Annual Recurring Revenue (ARR)
  - Revenue growth % (month-over-month, year-over-year)
  
- **Active Subscriptions**
  - Total active subscriptions
  - Trial subscriptions count
  - Paid subscriptions count
  - Churn rate (cancelled subscriptions)
  
- **Revenue by Plan**
  - Breakdown by subscription type (MONTHLY vs YEARLY)
  - Average revenue per business (ARPB)
  - Revenue distribution chart

**API Endpoints Needed:**
```
GET /admin/revenue/overview?start_date={date}&end_date={date}
Response: {
  total_mrr: number,
  total_arr: number,
  active_subscriptions: number,
  trial_subscriptions: number,
  paid_subscriptions: number,
  churn_rate: number,
  revenue_by_plan: [
    { plan_type: "MONTHLY" | "YEARLY", revenue: number, count: number }
  ],
  growth: {
    mrr_growth: number,
    arr_growth: number
  }
}
```

#### 1.2 Revenue History
**Features:**
- Revenue timeline chart (daily/weekly/monthly)
- Revenue by date range filter
- Export revenue data (CSV/Excel)

**API Endpoints Needed:**
```
GET /admin/revenue/history?start_date={date}&end_date={date}&group_by={day|week|month}
Response: {
  revenue_data: [
    { date: string, revenue: number, subscriptions: number }
  ]
}
```

#### 1.3 Subscription Management
**Features:**
- List all subscriptions (active, cancelled, expired)
- Filter by status, plan type, date range
- View subscription details (business, start/end dates, amount)
- Manual subscription management (activate/deactivate)

**API Endpoints Needed:**
```
GET /admin/subscriptions?page={n}&limit={n}&status={active|cancelled|expired}&plan_type={MONTHLY|YEARLY}
Response: {
  subscriptions: Subscription[],
  metadata: PaginationMetadata
}

GET /admin/subscriptions/{subscription_id}
Response: {
  subscription: Subscription,
  business: Business,
  payment_history: Payment[]
}
```

---

## 2. CUSTOMERS (System-Wide)

### Current API Support
- ✅ `GET /customers?business_id={id}` - Get customers by business
- ✅ `GET /customers/search?query={query}` - Search customers across system
- ✅ `GET /customers/leaderboard?business_id={id}` - Leaderboard for a business
- ✅ `GET /users/profile/{userId}` - Get user profile with customer data

### Recommended Features

#### 2.1 All Customers Overview
**Metrics to Display:**
- **Total Customers** - System-wide customer count
- **Active Customers** - Customers with activity in last 30 days
- **New Customers** - Customers registered in selected period
- **Total Points Issued** - System-wide points distribution

**API Endpoints Needed:**
```
GET /admin/customers/overview?start_date={date}&end_date={date}
Response: {
  total_customers: number,
  active_customers: number,
  new_customers: number,
  total_points_issued: number,
  average_points_per_customer: number,
  customers_by_business: [
    { business_id: string, business_name: string, customer_count: number }
  ]
}
```

#### 2.2 Customer List & Search
**Features:**
- List all customers across all businesses
- Search by name, email, phone number
- Filter by business, registration date, activity status
- View customer details:
  - Profile information
  - All businesses they're registered with
  - Total points across all businesses
  - Transaction history
  - Last activity date

**API Endpoints Needed:**
```
GET /admin/customers?page={n}&limit={n}&query={search}&business_id={id}&is_active={bool}
Response: {
  customers: Customer[],
  metadata: PaginationMetadata
}

GET /admin/customers/{customer_id}
Response: {
  customer: Customer,
  businesses: [
    {
      business: Business,
      total_points: number,
      total_visits: number,
      last_visit_at: string,
      joined_at: string
    }
  ],
  total_points_all_businesses: number,
  transaction_count: number
}
```

#### 2.3 Customer Analytics
**Features:**
- Customer growth chart (new registrations over time)
- Customer distribution by business
- Top customers across all businesses
- Customer engagement metrics

**API Endpoints Needed:**
```
GET /admin/customers/analytics?start_date={date}&end_date={date}
Response: {
  growth_data: [
    { date: string, new_customers: number }
  ],
  distribution_by_business: [
    { business_id: string, business_name: string, customer_count: number }
  ],
  top_customers: Customer[],
  engagement_metrics: {
    average_points: number,
    average_visits: number,
    retention_rate: number
  }
}
```

---

## 3. BUSINESSES

### Current API Support
- ✅ `GET /business` - List all businesses (with pagination, search)
- ✅ `GET /business/{id}` - Get business details (includes admins, staffs)
- ✅ `PATCH /business/{id}` - Update business
- ✅ `DELETE /business/{id}` - Delete business

### Recommended Features

#### 3.1 Business Overview
**Metrics to Display:**
- **Total Businesses** - System-wide count
- **Active Businesses** - Businesses with active subscriptions
- **New Businesses** - Businesses registered in period
- **Business Growth** - Growth rate over time

**API Endpoints Needed:**
```
GET /admin/businesses/overview?start_date={date}&end_date={date}
Response: {
  total_businesses: number,
  active_businesses: number,
  new_businesses: number,
  businesses_with_subscription: number,
  businesses_without_subscription: number,
  growth_rate: number
}
```

#### 3.2 Business List & Management
**Features:**
- List all businesses with key metrics:
  - Business name, registration number
  - Subscription status (active/trial/expired/none)
  - Customer count
  - Total points issued
  - Total transactions
  - Registration date
  - Status (active/inactive)
- Search and filter:
  - By name, registration number
  - By subscription status
  - By activity status
  - By registration date
- Business actions:
  - View full details
  - Edit business information
  - Activate/Deactivate business
  - View business analytics
  - View business customers
  - View business transactions

**API Endpoints Needed:**
```
GET /admin/businesses?page={n}&limit={n}&query={search}&subscription_status={active|trial|expired|none}&is_active={bool}
Response: {
  businesses: [
    {
      business: Business,
      subscription: Subscription | null,
      customer_count: number,
      total_points_issued: number,
      total_transactions: number,
      last_activity: string
    }
  ],
  metadata: PaginationMetadata
}

PATCH /admin/businesses/{business_id}/status
Body: { is_active: boolean }
Response: { message: string, business: Business }
```

#### 3.3 Business Analytics
**Features:**
- Business performance metrics:
  - Customer acquisition rate
  - Points issued/redeemed ratio
  - Transaction volume
  - Engagement metrics
- Compare businesses side-by-side
- Business health score

**API Endpoints Needed:**
```
GET /admin/businesses/{business_id}/analytics?start_date={date}&end_date={date}
Response: {
  business: Business,
  metrics: {
    customer_count: number,
    new_customers: number,
    total_points_issued: number,
    total_points_redeemed: number,
    transaction_count: number,
    average_transaction_value: number,
    engagement_score: number
  },
  trends: {
    customer_growth: number,
    points_growth: number,
    transaction_growth: number
  }
}
```

#### 3.4 Business Staff & Admins
**Features:**
- View all staff members across all businesses
- View all business admins
- Filter by business
- Manage staff/admin access

**API Endpoints Needed:**
```
GET /admin/staff?page={n}&limit={n}&business_id={id}
Response: {
  staffs: Staff[],
  metadata: PaginationMetadata
}

GET /admin/business-admins?page={n}&limit={n}&business_id={id}
Response: {
  admins: BusinessAdmin[],
  metadata: PaginationMetadata
}
```

---

## 4. SETTINGS

### Recommended Features

#### 4.1 System Configuration
**Features:**
- Platform-wide settings:
  - Point system configuration (default earning rates)
  - Subscription pricing management
  - Feature flags (enable/disable features)
  - Email/SMS notification settings
  - API rate limits
  - Maintenance mode toggle

**API Endpoints Needed:**
```
GET /admin/settings
Response: {
  point_system: {
    default_earning_rate: number,
    point_expiry_days: number | null
  },
  subscription_pricing: SubscriptionProduct[],
  feature_flags: {
    [key: string]: boolean
  },
  notifications: {
    email_enabled: boolean,
    sms_enabled: boolean
  },
  system: {
    maintenance_mode: boolean,
    api_rate_limit: number
  }
}

PATCH /admin/settings
Body: {
  point_system?: {...},
  feature_flags?: {...},
  system?: {...}
}
```

#### 4.2 Subscription Products Management
**Features:**
- Create/edit/delete subscription products
- Set pricing (MONTHLY/YEARLY)
- Configure trial periods
- Manage subscription types

**API Endpoints Needed:**
```
POST /admin/subscription/products
Body: {
  price: number,
  duration: "MONTHLY" | "YEARLY",
  is_trial: boolean,
  subscription_type_id: string,
  link: string,
  price_id: string
}

PATCH /admin/subscription/products/{product_id}
DELETE /admin/subscription/products/{product_id}
```

#### 4.3 User Management
**Features:**
- List all users (customers, business admins, staff)
- Filter by role (ADMIN, STAFF, USER, CUSTOMER)
- View user details
- Activate/Deactivate users
- Reset passwords
- View user activity logs

**API Endpoints Needed:**
```
GET /admin/users?page={n}&limit={n}&role={ADMIN|STAFF|USER|CUSTOMER}&is_active={bool}
Response: {
  users: User[],
  metadata: PaginationMetadata
}

GET /admin/users/{user_id}
Response: {
  user: User,
  roles: UserRole[],
  businesses: Business[],
  activity_logs: ActivityLog[]
}

PATCH /admin/users/{user_id}/status
Body: { is_active: boolean }

POST /admin/users/{user_id}/reset-password
```

#### 4.4 System Logs & Monitoring
**Features:**
- System activity logs
- Error logs
- API usage statistics
- Performance metrics
- Database health

**API Endpoints Needed:**
```
GET /admin/logs?type={activity|error|api}&start_date={date}&end_date={date}&page={n}&limit={n}
Response: {
  logs: Log[],
  metadata: PaginationMetadata
}

GET /admin/monitoring/stats
Response: {
  api_requests: {
    total: number,
    successful: number,
    failed: number,
    average_response_time: number
  },
  database: {
    connection_pool: number,
    query_performance: number
  },
  system: {
    uptime: number,
    memory_usage: number,
    cpu_usage: number
  }
}
```

#### 4.5 Data Export & Backup
**Features:**
- Export data (customers, businesses, transactions)
- Schedule automated backups
- Data retention policies

**API Endpoints Needed:**
```
POST /admin/export?type={customers|businesses|transactions|all}&format={csv|json|excel}
Response: {
  export_id: string,
  download_url: string,
  expires_at: string
}

GET /admin/backups
POST /admin/backups/create
```

---

## 5. ADDITIONAL RECOMMENDED FEATURES

### 5.1 Dashboard Overview
**Main Admin Dashboard should show:**
- Key metrics at a glance:
  - Total revenue (MRR)
  - Total businesses
  - Total customers
  - Active subscriptions
  - System health status
- Recent activity feed:
  - New business registrations
  - New customer signups
  - Subscription changes
  - System alerts
- Quick actions:
  - Create subscription product
  - View system logs
  - Export data

**API Endpoints Needed:**
```
GET /admin/dashboard
Response: {
  metrics: {
    total_revenue: number,
    total_businesses: number,
    total_customers: number,
    active_subscriptions: number,
    system_health: "healthy" | "warning" | "critical"
  },
  recent_activity: Activity[],
  alerts: Alert[]
}
```

### 5.2 Transaction Monitoring (System-Wide)
**Features:**
- View all transactions across all businesses
- Filter by business, date, transaction type
- Transaction analytics
- Fraud detection alerts

**API Endpoints Needed:**
```
GET /admin/transactions?page={n}&limit={n}&business_id={id}&start_date={date}&end_date={date}&type={EARN|REDEEM|ADD|SUBTRACT}
Response: {
  transactions: PointTransaction[],
  metadata: PaginationMetadata
}

GET /admin/transactions/analytics?start_date={date}&end_date={date}
Response: {
  total_transactions: number,
  total_points_issued: number,
  total_points_redeemed: number,
  transactions_by_type: {...},
  transactions_by_business: [...]
}
```

---

## API Response Structure Recommendations

### Standard Response Format
All admin endpoints should follow this structure:
```typescript
{
  message: string,
  status_code: number,
  data: {
    // Response data
  },
  metadata?: {
    // Pagination or additional metadata
  }
}
```

### Error Response Format
```typescript
{
  message: string,
  status_code: number,
  errors?: {
    [field: string]: string[]
  }
}
```

---

## Implementation Priority

### Phase 1 (MVP - Essential Features)
1. **Revenue Dashboard** - Basic revenue overview and subscription list
2. **Businesses Management** - List, view, and basic management
3. **Customers Overview** - System-wide customer list and search
4. **Settings** - Basic system configuration

### Phase 2 (Enhanced Features)
1. **Revenue Analytics** - Detailed revenue history and trends
2. **Business Analytics** - Performance metrics and comparisons
3. **Customer Analytics** - Growth and engagement metrics
4. **User Management** - Full user administration

### Phase 3 (Advanced Features)
1. **System Monitoring** - Logs, performance metrics, health checks
2. **Data Export** - Comprehensive export functionality
3. **Transaction Monitoring** - System-wide transaction tracking
4. **Advanced Analytics** - Predictive analytics, insights

---

## Security Considerations

### Admin Authentication
- Separate admin authentication system
- Role-based access control (Super Admin, Admin, Viewer)
- Two-factor authentication (2FA)
- Session management

### API Security
- Rate limiting for admin endpoints
- IP whitelisting (optional)
- Audit logging for all admin actions
- Data encryption for sensitive information

---

## Notes

1. **Pagination**: All list endpoints should support pagination with `page` and `limit` parameters
2. **Date Filtering**: Most endpoints should support `start_date` and `end_date` for time-based filtering
3. **Search**: List endpoints should support `query` parameter for text search
4. **Filtering**: Use query parameters for filtering (e.g., `is_active`, `status`, `type`)
5. **Response Consistency**: All endpoints should return consistent response structures
6. **Performance**: Consider caching for frequently accessed data (dashboard metrics)
7. **Real-time Updates**: Consider WebSocket support for real-time dashboard updates

---

## Existing API Endpoints That Can Be Reused

- ✅ `/business` - Already supports listing all businesses
- ✅ `/customers/search` - Already supports system-wide customer search
- ✅ `/subscription/products` - Already supports listing subscription products
- ✅ `/subscriptions/active/business` - Can be used to check business subscription status

These can be extended with admin-specific endpoints that aggregate data across all businesses.

