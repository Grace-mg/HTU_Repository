# AI Agent Master Build Plan

## University Project and Thesis Repository System

## 1. Project Instruction

Build a complete, production-ready **University Project and Thesis Repository System** using **Next.js, TypeScript, Tailwind CSS, shadcn/ui, and Supabase**.
the project name is PROJECT-HUB

The application must be developed in phases. Follow the phases in this plan in order and use this document as the main implementation reference throughout the project.

Supabase will eventually provide:

* Authentication
* PostgreSQL database access
* File storage
* Session management
* Row Level Security

However, the Supabase database schema, table names, relationships, policies, and storage configuration will be provided separately later.

Until the schema is supplied:

* Do not create database tables.
* Do not create SQL migrations.
* Do not invent table names beyond temporary interface terminology.
* Do not create Row Level Security policies.
* Do not create storage buckets.
* Do not assume database relationships.
* Do not hardcode unfinished Supabase queries.
* Do not create mock application data.
* Do not create fake users, projects, theses, faculties, departments, statistics, reports, or bookmarks.
* Do not simulate authentication.
* Do not use local storage as a temporary database.
* Do not use hardcoded arrays as a data source.
* Do not display fake success messages for operations that were not completed.

Build the user interface, application architecture, types, validation, service contracts, responsive layouts, empty states, loading states, error handling, and integration boundaries first.

When the Supabase schema is later supplied, connect the existing service layer to the real backend without redesigning the interface.

---

# 2. Product Goal

The system will serve as a centralized academic repository where a university can store, manage, organize, search, and present student projects and theses.

The platform must allow members of the public to discover academic work while providing additional features for registered users and administrators.

The system must prioritize:

* Simplicity
* Clean user interface
* Minimal visual clutter
* Strong information hierarchy
* Minimal border radius
* Professional academic styling
* Responsive design
* Accessibility
* Secure access
* Maintainable code
* Fast navigation
* Search performance
* Clear future Supabase integration

---

# 3. Functional Scope

## Public Features

Public visitors must be able to:

* View the landing page.
* View repository statistics when real data is available.
* Browse all published repository records.
* Browse projects separately.
* Browse theses separately.
* Search by title.
* Search by student name.
* Search by supervisor.
* Search by keyword.
* Search abstract content.
* Filter by faculty.
* Filter by department.
* Filter by academic year.
* Filter by category.
* Filter by record type.
* View project or thesis details.
* Read abstracts and metadata.
* Access files according to repository access rules.

## Authentication Features

The system must support:

* Login.
* Registration.
* Logout.
* Forgot-password flow.
* Password-reset flow.
* Email verification where enabled.
* Secure session management.
* Role-based redirection.
* Protected routes.

New accounts must always receive the normal User role.

The registration form must never include a role selector.

## Registered User Features

Registered users must be able to:

* Access a user dashboard.
* Browse projects.
* Browse theses.
* Search and filter records.
* Save records.
* Remove saved records.
* View saved records.
* Manage profile information.
* Change password.
* Log out.

## Administrator Features

Administrators must be able to:

* Access an admin dashboard.
* View repository statistics.
* Manage faculties.
* Manage departments.
* Manage categories.
* View registered users.
* Add projects.
* Add theses.
* Edit repository records.
* Publish or archive records.
* Delete records where permitted.
* Upload repository documents.
* Generate reports.
* Export filtered data.
* Update repository settings.
* Manage their profile.
* Change password.
* Review audit logs where implemented.

---

# 4. Explicitly Out of Scope

Do not implement:

* Plagiarism detection.
* Online viva management.
* Student assessment.
* Student grading.
* Research-topic approval workflows.
* Integration with external university systems.
* Integration with student information systems.
* AI-generated project evaluation.
* Cloud-based long-term digital preservation infrastructure.
* Online supervision workflows.

Do not expand the scope without explicit instruction.

---

# 5. Required Technology Stack

Use the following technologies.

## Core Application

* Next.js
* App Router
* React
* TypeScript
* React Server Components by default
* Server Actions where appropriate
* Route Handlers where appropriate

## Styling and Components

* Tailwind CSS
* shadcn/ui where useful
* Lucide icons
* CSS variables for design tokens

## Backend Platform

* Supabase client libraries
* Supabase Auth when connected
* Supabase PostgreSQL when the schema is supplied
* Supabase Storage when storage rules are supplied
* Supabase Row Level Security when policies are supplied

## Forms and Validation

* Zod
* React Hook Form for complex interactive forms
* Server-side validation for all mutations

## Tables and Reports

* TanStack Table where complex tables are needed
* Recharts or another lightweight chart library

## Testing

* Vitest
* React Testing Library where appropriate
* Playwright for end-to-end testing

## Deployment

* Vercel for the Next.js application
* Supabase for authentication, data, and file storage

---

# 6. Design Direction

The visual design must be clean, simple, and professional without appearing unfinished.

The application should feel:

* Academic
* Reliable
* Calm
* Structured
* Modern
* Lightweight
* Easy to navigate

Avoid:

* Large rounded cards.
* Oversized statistic boxes.
* Heavy shadows.
* Excessive gradients.
* Decorative backgrounds.
* Excessive animation.
* Large illustrations.
* Overly playful styling.
* Pill-shaped buttons everywhere.
* Too many dashboard cards.
* Dense pages without spacing.
* Generic unmodified template styling.

---

# 7. Border Radius Rules

Use restrained border radius throughout the application.

Recommended values:

* Inputs: 4px to 6px
* Buttons: 4px to 6px
* Cards: 4px to 6px
* Tables: approximately 4px
* Dialogs: 6px to 8px
* Dropdowns: 4px to 6px
* Panels: 4px to 6px

Pill shapes may only be used for:

* Keywords
* Status badges
* Small labels
* Active filters
* Compact tags

Do not use heavily rounded cards or large rounded containers.

---

# 8. Surface and Card Rules

Do not place every section inside a card.

Prefer:

* Flat page sections
* Thin borders
* Dividers
* Structured lists
* Compact panels
* Data tables
* Subtle background differences
* Clear spacing
* Clear section headings

Use shadows mainly for:

* Dialogs
* Popovers
* Dropdown menus
* Temporary overlays

Primary content panels should usually use borders rather than shadows.

---

# 9. Typography and Color

Use a readable sans-serif font.

Typography must provide:

* Clear page titles
* Consistent heading levels
* Moderate heading sizes
* Readable body text
* Muted supporting text
* Comfortable line height for abstracts
* Compact but readable tables
* Clear metadata labels

Use a restrained color system:

* Neutral page background
* White or near-white content surfaces
* Dark neutral text
* Muted gray supporting text
* One primary university brand color
* Red for destructive actions
* Green for successful actions
* Amber for warnings

All colors must meet accessible contrast requirements.

---

# 10. Interaction Design

Use subtle interactions only.

Include:

* Clear hover states
* Visible keyboard focus states
* Short transitions
* Inline loading indicators
* Skeleton states where appropriate
* Toast notifications
* Confirmation dialogs
* Clear validation messages

Avoid:

* Large page animations
* Animated backgrounds
* Decorative transitions
* Unnecessary motion
* Long loading animations

Respect reduced-motion preferences.

---

# 11. Application Architecture

Use a clean folder structure similar to:

```text
src/
  app/
    (public)/
      page.tsx
      browse/
        page.tsx
      projects/
        page.tsx
      theses/
        page.tsx
      repository/
        [slug]/
          page.tsx

    (auth)/
      login/
        page.tsx
      register/
        page.tsx
      forgot-password/
        page.tsx
      reset-password/
        page.tsx
      verify-email/
        page.tsx

    dashboard/
      layout.tsx
      page.tsx
      projects/
        page.tsx
      theses/
        page.tsx
      saved/
        page.tsx
      profile/
        page.tsx
      security/
        page.tsx

    admin/
      layout.tsx
      page.tsx
      records/
        page.tsx
        new/
          page.tsx
        [id]/
          page.tsx
          edit/
            page.tsx
      faculties/
        page.tsx
      departments/
        page.tsx
      categories/
        page.tsx
      users/
        page.tsx
      reports/
        page.tsx
      settings/
        page.tsx
      audit-logs/
        page.tsx
      profile/
        page.tsx
      security/
        page.tsx

    auth/
      callback/
        route.ts

    api/
      exports/
      files/

  components/
    ui/
    layout/
    navigation/
    forms/
    repository/
    filters/
    tables/
    charts/
    feedback/

  services/
    contracts/
      auth-service.ts
      repository-service.ts
      faculty-service.ts
      department-service.ts
      category-service.ts
      bookmark-service.ts
      user-service.ts
      report-service.ts
      settings-service.ts
      file-service.ts

    supabase/
      auth-service.ts
      repository-service.ts
      faculty-service.ts
      department-service.ts
      category-service.ts
      bookmark-service.ts
      user-service.ts
      report-service.ts
      settings-service.ts
      file-service.ts

  lib/
    supabase/
      client.ts
      server.ts
      middleware.ts
      admin.ts
    auth/
    permissions/
    validation/
    search/
    reports/
    storage/
    errors/
    utils/

  types/
    auth.ts
    repository.ts
    faculty.ts
    department.ts
    category.ts
    user.ts
    reports.ts
    settings.ts
    pagination.ts

  hooks/
  actions/
  tests/
```

Keep business logic out of page components.

Separate:

* Rendering
* Validation
* Authentication
* Authorization
* Data access
* Search logic
* File handling
* Reports
* Formatting
* Error handling

---

# 12. No Mock Data Rule

Do not create application mock data.

Do not create:

* Fake users
* Fake administrators
* Example projects
* Example theses
* Fake faculties
* Fake departments
* Fake categories
* Hardcoded bookmarks
* Fake statistics
* Random chart values
* Sample reports
* Placeholder project counts
* Fabricated contact details

When backend data is unavailable:

* Show an empty state.
* Show an unavailable state.
* Show a loading state.
* Show a configuration message.
* Display `—` for unavailable numeric values.
* Disable actions that require a configured backend.
* Do not pretend that a record was created.
* Do not show success notifications unless an operation succeeds.

Acceptable neutral fallback text includes:

* “University Repository”
* “Repository information has not been configured.”
* “No records are currently available.”
* “Statistics will appear when the data source is connected.”
* “This feature will become available after Supabase configuration.”

---

# 13. Service Contract Requirement

All backend-dependent features must use typed service contracts.

Do not query Supabase directly from random page components.

Example repository contract:

```ts
export interface RepositoryService {
  getRecords(
    filters: RepositoryFilters
  ): Promise<PaginatedResult<RepositoryRecord>>;

  getRecordBySlug(
    slug: string
  ): Promise<RepositoryRecord | null>;

  createRecord(
    input: CreateRepositoryRecordInput
  ): Promise<RepositoryRecord>;

  updateRecord(
    id: string,
    input: UpdateRepositoryRecordInput
  ): Promise<RepositoryRecord>;

  deleteRecord(id: string): Promise<void>;
}
```

Create similar contracts for:

* Authentication
* Faculties
* Departments
* Categories
* Bookmarks
* Users
* Reports
* Settings
* Files

Until Supabase is connected, backend-dependent service implementations may throw a controlled error.

Example:

```ts
export class DataSourceNotConfiguredError extends Error {
  constructor() {
    super("The application data source has not been configured.");
    this.name = "DataSourceNotConfiguredError";
  }
}
```

The UI must catch this error and render an appropriate state without crashing.

---

# 14. Development Rules for Every Phase

At the end of every phase:

1. Run linting.
2. Run TypeScript checking.
3. Run relevant tests.
4. Run a production build.
5. Fix critical errors.
6. Confirm responsive behaviour.
7. Confirm accessibility basics.
8. Document completed work.
9. Document unresolved issues.
10. Continue to the next phase.

Do not stop after Phase 1.

Do not claim a phase is complete when required work is missing.

Do not replace required functionality with mock data.

---

# Phase 1: Project Foundation

## Objective

Create the application foundation and development environment.

## Tasks

* Initialize the Next.js project with App Router.
* Configure TypeScript strict mode.
* Configure Tailwind CSS.
* Configure shadcn/ui.
* Install Lucide icons.
* Configure ESLint.
* Configure formatting.
* Configure path aliases.
* Create the project folder structure.
* Add environment-variable validation.
* Add Supabase client placeholders.
* Create shared error classes.
* Configure Vitest.
* Configure Playwright.
* Add global loading state.
* Add global error page.
* Add route-level error boundaries.
* Add not-found page.
* Add toast notification system.

## Acceptance Criteria

* The application runs locally.
* TypeScript passes.
* Linting passes.
* Production build passes.
* Environment configuration is validated.
* Supabase client boundaries exist.
* No database schema is created.
* No mock data is added.

---

# Phase 2: Design System and Shared Components

## Objective

Create the reusable visual foundation.

## Tasks

Define design tokens for:

* Colors
* Typography
* Border radius
* Spacing
* Borders
* Shadows
* Focus states
* Content widths

Create reusable components for:

* Button
* Input
* Textarea
* Select
* Checkbox
* Radio group
* Badge
* Dialog
* Alert dialog
* Dropdown menu
* Popover
* Tooltip
* Table wrapper
* Pagination
* Search field
* Page header
* Section header
* Breadcrumbs
* Empty state
* Error state
* Loading state
* Skeleton
* Confirmation dialog
* Form error summary
* Status badge
* Responsive page container

## Acceptance Criteria

* Components follow minimal-radius rules.
* No oversized rounded cards exist.
* Focus states are visible.
* Components work with keyboard navigation.
* Components are responsive.
* Empty and unavailable states are reusable.

---

# Phase 3: Public and Dashboard Layouts

## Objective

Build the main application shells.

## Tasks

Create:

* Public layout
* Authentication layout
* User dashboard layout
* Admin dashboard layout
* Public header
* Public footer
* Desktop dashboard sidebar
* Mobile navigation drawer
* Dashboard top bar
* Account menu
* Breadcrumb system
* Responsive main-content container

## Public Navigation

Include:

* Home
* Browse
* Projects
* Theses
* Login
* Register

## User Navigation

Include:

* Overview
* Browse Projects
* Browse Theses
* Saved Records
* Profile
* Security

## Admin Navigation

Include:

* Overview
* Records
* Add Record
* Faculties
* Departments
* Categories
* Users
* Reports
* Settings
* Audit Logs
* Profile
* Security

## Acceptance Criteria

* Navigation works at common screen widths.
* Active routes are visible.
* Mobile navigation works.
* Dashboard layouts do not overflow.
* Sidebars remain compact and simple.
* No authentication is simulated.

---

# Phase 4: Domain Types and Service Contracts

## Objective

Define the application’s backend-independent domain layer.

## Tasks

Create TypeScript types for:

* User
* User role
* Authentication session
* Repository record
* Record type
* Record status
* Faculty
* Department
* Category
* Keyword
* Bookmark
* Repository settings
* Report data
* File metadata
* Pagination
* Search filters
* Sort options

Create Zod schemas for:

* Login
* Registration
* Forgot password
* Reset password
* Profile update
* Password update
* Repository record form
* Faculty form
* Department form
* Category form
* Settings form
* Search parameters
* Export filters
* File validation

Create service contracts for all backend features.

## Acceptance Criteria

* Types compile without `any`.
* Forms use shared validation schemas.
* Page components do not define duplicate domain models.
* Services are not tied to an unfinished schema.
* No fake service implementation is created.

---

# Phase 5: Public Landing Page

## Objective

Build the public repository introduction page.

## Sections

Create:

* Compact hero section
* Main repository search
* Repository statistics area
* Browse Projects link
* Browse Theses link
* Faculty overview area
* Recently added records area
* Repository explanation
* Footer contact area

## Data Behaviour

Until real data is connected:

* Statistics display `—`.
* Faculty overview displays an empty state.
* Recently added records display an empty state.
* Repository branding uses neutral fallbacks.
* Contact details display a not-configured state.

## Design Requirements

* Keep the hero compact.
* Make search the primary action.
* Avoid oversized statistic cards.
* Use simple bordered sections.
* Avoid unnecessary imagery.
* Keep mobile layout clear.

## Acceptance Criteria

* Search routes to the browse page.
* Sections support loading, empty, error, and populated states.
* No fake statistics are displayed.
* No university information is invented.
* The page is responsive.

---

# Phase 6: Public Browse and Search Interface

## Objective

Build the repository discovery experience.

## Routes

Create:

```text
/browse
/projects
/theses
```

## Search Fields

Support searching by:

* Title
* Student name
* Supervisor name
* Keyword
* Abstract content

## Filters

Support:

* Record type
* Faculty
* Department
* Academic year
* Category
* Keyword

## Sorting

Support:

* Relevance
* Newest
* Oldest
* Title ascending
* Title descending
* Academic year

## Interface Behaviour

* Store filters in URL search parameters.
* Parse and validate URL parameters.
* Preserve filters during pagination.
* Display active filters.
* Allow individual filters to be removed.
* Include clear-all filters.
* Include result count.
* Include pagination.
* Include mobile filter drawer.
* Include loading state.
* Include empty state.
* Include error state.
* Include data-source-not-configured state.

## Result Item

Each result component must support:

* Title
* Record type
* Student
* Supervisor
* Faculty
* Department
* Academic year
* Category
* Abstract preview
* Keywords

Do not populate results without real data.

## Acceptance Criteria

* URL filter handling works.
* Project route fixes type to Project.
* Thesis route fixes type to Thesis.
* Empty result pages render cleanly.
* Mobile filters are usable.
* No fake results are generated.

---

# Phase 7: Repository Detail Page

## Objective

Create readable project and thesis detail pages.

## Route

```text
/repository/[slug]
```

## Display Structure

Support:

* Title
* Record type
* Student name
* Student identifier where permitted
* Supervisor
* Faculty
* Department
* Academic year
* Category
* Full abstract
* Keywords
* Date added
* File information
* Related records

## Layout Rules

Use:

* One readable main content area
* Compact metadata section
* Thin dividers
* Strong heading hierarchy
* Comfortable abstract typography
* Simple related-record list

Do not place every metadata value inside a separate card.

## States

Support:

* Loading
* Not found
* Error
* Data source not configured
* File unavailable
* No related records

## Acceptance Criteria

* Route structure is complete.
* Components accept typed real-data props.
* No fake record is displayed.
* File actions use the file-service contract.
* The page works on mobile.

---

# Phase 8: Authentication Screens

## Objective

Build all authentication interfaces.

## Routes

Create:

```text
/login
/register
/forgot-password
/reset-password
/verify-email
```

## Registration Form

Include:

* Full name
* Email
* Password
* Confirm password
* Terms confirmation where required

Never include a role selector.

## Login Form

Include:

* Email
* Password
* Forgot-password link

## Forgot Password

Include:

* Email field
* Generic confirmation message
* Loading state
* Error state

Do not reveal whether an email exists.

## Reset Password

Include:

* New password
* Confirm password
* Expired-link state
* Invalid-link state
* Success state

## Current Integration Behaviour

Until Supabase Auth is connected:

* Forms must still validate.
* Forms must not simulate login.
* Forms must not create fake sessions.
* Forms must not store auth state locally.
* Submissions should display a controlled configuration message.
* Protected routes should remain inaccessible.

## Acceptance Criteria

* All forms validate with Zod.
* Forms are accessible.
* Loading and error states exist.
* No authentication simulation exists.
* No role selection exists.

---

# Phase 9: Authentication and Route Protection Integration

## Objective

Connect real Supabase Auth after authentication configuration is supplied.

## Tasks

Implement:

* Registration
* Login
* Logout
* Email verification
* Forgot password
* Password reset
* Session refresh
* Auth callback
* Server-side session reading
* User route guard
* Admin route guard
* Guest-only route guard
* Role-based redirection
* Permission helpers

## Security Rules

* Never trust client-supplied role values.
* Never expose privileged Supabase keys.
* Do not rely only on hidden links.
* Protect server mutations.
* Use secure cookies.
* Use generic authentication errors.
* Prevent open redirects.

## Acceptance Criteria

* Real users can register.
* Real users can log in.
* Sessions persist correctly.
* Users cannot access admin routes.
* Admins can access admin routes.
* Password reset works.
* Authentication is not simulated.

---

# Phase 10: User Dashboard

## Objective

Build the registered user experience.

## Routes

Create:

```text
/dashboard
/dashboard/projects
/dashboard/theses
/dashboard/saved
/dashboard/profile
/dashboard/security
```

## Dashboard Overview

Support:

* Welcome message
* Quick browse links
* Recently saved records
* Repository summary
* Suggested search links

Avoid unnecessary charts.

## Saved Records Page

Support:

* Search saved records
* Filter saved records
* Sort saved records
* Pagination
* Remove bookmark
* Open record details

## Profile Page

Support:

* Full-name update
* Avatar update where enabled
* Secure email change
* Account information

## Security Page

Support:

* Password change
* Account email display
* Logout

## Pre-Integration Behaviour

Before backend connection:

* Show data-source-not-configured states.
* Do not display fake saved records.
* Do not pretend that profile changes succeeded.
* Do not allow bookmark mutations.

## Acceptance Criteria

* Dashboard structure is complete.
* Pages are protected after auth integration.
* Empty states are polished.
* User data remains private.
* Mobile layout works.

---

# Phase 11: Bookmarking

## Objective

Allow users to save repository records.

## Tasks

Implement:

* Bookmark button
* Save action
* Remove action
* Saved-state display
* Login prompt for guests
* Duplicate-prevention handling
* Saved-list integration
* Loading and error states

## Rules

* Users can access only their own bookmarks.
* Public visitors cannot save records.
* Duplicate bookmarks must be rejected.
* Bookmark activity must remain private.

## Acceptance Criteria

* Real bookmarks can be created.
* Real bookmarks can be removed.
* Duplicate bookmarks are prevented.
* Saved state remains consistent.
* No bookmark data is mocked.

---

# Phase 12: Admin Dashboard Overview

## Objective

Build a clean administrative overview.

## Statistics

Support:

* Total projects
* Total theses
* Total faculties
* Total departments
* Total users

## Visualizations

Support:

* Records by faculty
* Records by type
* Records by academic year
* Recently added records

Use:

* Compact stat panels
* No more than a few useful charts
* A recent-records table
* Clear empty states

## Pre-Integration Behaviour

Until report queries are connected:

* Display `—` for totals.
* Display “No data available” for charts.
* Display empty recent-records state.
* Do not generate random chart values.

## Acceptance Criteria

* Admin overview is responsive.
* Charts accept real typed data.
* Empty states are clear.
* The page is not overcrowded.
* Only administrators can access it after role integration.

---

# Phase 13: Faculty, Department, and Category Management

## Objective

Build academic-structure management interfaces.

## Faculty Features

Support:

* List faculties
* Search faculties
* Add faculty
* Edit faculty
* View department count
* View record count
* Delete unused faculty

## Department Features

Support:

* List departments
* Search departments
* Filter by faculty
* Add department
* Edit department
* View record count
* Delete unused department

## Category Features

Support:

* List categories
* Search categories
* Add category
* Edit category
* View record count
* Delete unused category

## Forms

Create validated forms without assuming database column names beyond domain-level fields.

## Delete Behaviour

Support:

* Confirmation dialog
* Blocked-deletion error
* Clear explanation when a record is still in use
* No dangerous cascade deletion

## Pre-Integration Behaviour

* Tables display empty states.
* Forms display a not-configured message on submission.
* No fake faculties, departments, or categories are created.

## Acceptance Criteria

* All management pages are responsive.
* Form validation works.
* Tables support loading, empty, and error states.
* Destructive actions require confirmation.
* Non-admin access is blocked after integration.

---

# Phase 14: Add and Edit Repository Records

## Objective

Build complete project and thesis forms.

## Form Fields

Support:

* Title
* Student name
* Student identifier, optional
* Supervisor name
* Faculty
* Department
* Academic year
* Record type
* Category
* Abstract
* Keywords
* Record status
* Document upload

## Form Behaviour

* Department selector depends on faculty selection.
* Validate all fields.
* Normalize keywords.
* Validate academic-year format.
* Validate file extension.
* Validate MIME type.
* Validate file size.
* Prevent duplicate submission.
* Preserve values after recoverable errors.
* Show clear field errors.
* Require confirmation for destructive changes.

## Record Types

Support:

* Project
* Thesis

## Record Statuses

Support domain-level statuses such as:

* Draft
* Published
* Archived

Final values must align with the supplied schema.

## File Rules

Prefer PDF as the primary repository format.

Do not store files locally as a temporary solution.

## Pre-Integration Behaviour

* Faculty, department, and category selectors remain empty.
* Submit action must not pretend to save.
* File upload must not pretend to complete.
* Display configuration guidance.

## Acceptance Criteria

* Forms are complete and responsive.
* Validation works.
* No record is fabricated.
* No file is stored without Supabase Storage.
* Forms are ready for service integration.

---

# Phase 15: Admin Record Management

## Objective

Build the complete administrator records interface.

## Records Table

Support columns for:

* Title
* Student
* Supervisor
* Faculty
* Department
* Academic year
* Type
* Category
* Status
* Date added
* Actions

## Features

Support:

* Search
* Filter
* Sort
* Pagination
* View
* Edit
* Publish
* Archive
* Delete

## Delete Requirements

Deletion must:

* Require confirmation.
* Handle bookmarks safely.
* Handle storage files safely.
* Create an audit event where enabled.
* Avoid leaving orphaned files.
* Prefer archival where institutional policy requires preservation.

## Pre-Integration Behaviour

* Display an empty records table.
* Do not generate fake rows.
* Mutations return a configuration error.

## Acceptance Criteria

* Table controls work structurally.
* URL state or table state is well organized.
* Actions use service contracts.
* Destructive actions require confirmation.
* No mock records exist.

---

# Phase 16: User Management

## Objective

Build the administrator user-management interface.

## Features

Support:

* List users
* Search by name
* Search by email
* Filter by role
* Filter by status
* View registration date
* View account details
* Activate account
* Deactivate account
* Promote User to Admin
* Demote Admin to User

## Security Rules

* Role changes require confirmation.
* Status changes require confirmation.
* Changes should be logged.
* Users cannot update their own role.
* Prevent removal or demotion of the final active administrator.
* Do not expose passwords or authentication secrets.

## Pre-Integration Behaviour

* Show an empty user table.
* Do not create fake administrator accounts.
* Do not add role-switch development tools.
* Disable mutations until real integration exists.

## Acceptance Criteria

* User-management interface is complete.
* Filters and search UI are complete.
* Security warnings are clear.
* No fake users are displayed.
* Admin-only access is enforced after integration.

---

# Phase 17: Reports and Exports

## Objective

Build repository reporting and export interfaces.

## Reports

Support:

* Records by academic year
* Records by category
* Records by faculty
* Records by department
* Records by type
* Faculty-by-year breakdown
* Projects versus theses
* Records added over time

## Filters

Support:

* Faculty
* Department
* Academic year
* Category
* Record type
* Record status
* Date range

## Display

Use:

* Summary totals
* Compact charts
* Accessible tables
* Printable layouts
* Clear empty states

Every chart should have an equivalent table or readable summary.

## Export Formats

Support:

* CSV
* Printable report view

PDF may be added later where practical.

## Pre-Integration Behaviour

* Charts show “No data available.”
* Totals show `—`.
* Export actions remain disabled or display a configuration message.
* Do not generate random report data.

## Acceptance Criteria

* Reports accept typed data.
* Filters are ready for service integration.
* Charts are responsive.
* CSV export architecture is server-side.
* Sensitive user data is excluded.

---

# Phase 18: Repository Settings

## Objective

Build repository-wide configuration.

## Settings Fields

Support:

* Repository name
* Institution name
* Contact email
* Contact phone
* Address
* Current academic year
* Public file-download setting
* Footer text
* Primary brand color where permitted

## Behaviour

* Validate all values.
* Display updated settings across layouts.
* Use safe neutral fallbacks.
* Restrict editing to administrators.
* Create an audit event after successful updates.

## Pre-Integration Behaviour

* Render the complete form.
* Do not pretend settings were saved.
* Display neutral fallback branding.
* Do not invent university contact information.

## Acceptance Criteria

* Form validation works.
* Public layout accepts repository settings as data.
* No fake settings are stored.
* Admin-only access is enforced after integration.

---

# Phase 19: Supabase Schema Integration

## Objective

Connect the application after the real Supabase schema is supplied.

## Required Inputs Before Starting

Obtain:

* Actual table names
* Actual column names
* Relationships
* Enum values
* Foreign keys
* Views
* Database functions
* RLS policies
* Storage bucket names
* Storage path rules
* Public and private access rules
* Profile structure
* Role source
* Record status values
* Search implementation
* File-access rules

## Tasks

* Map domain types to real Supabase records.
* Implement Supabase service adapters.
* Replace controlled not-configured errors.
* Connect real queries.
* Connect real mutations.
* Connect pagination.
* Connect filtering.
* Connect sorting.
* Connect settings.
* Connect reports.
* Connect user profiles.
* Connect bookmarks.
* Connect admin operations.

## Rules

* Do not rewrite page components unnecessarily.
* Keep Supabase queries inside service adapters.
* Validate responses.
* Handle database errors safely.
* Never expose service-role credentials.
* Confirm RLS is active.

## Acceptance Criteria

* All data comes from Supabase.
* No application mock data exists.
* Empty states still work.
* Real errors are handled safely.
* Service contracts remain stable.

---

# Phase 20: Supabase Storage Integration

## Objective

Connect project and thesis file handling.

## Tasks

Implement:

* Admin-only upload
* File replacement
* File deletion
* File metadata retrieval
* Signed URL generation where required
* Public access where configured
* Authenticated access where required
* File-not-found handling
* Orphan-file detection
* Safe file naming

## Security Rules

* Validate file extension.
* Validate MIME type.
* Validate file size.
* Sanitize file names.
* Use unique paths.
* Prevent executable uploads.
* Prevent path traversal.
* Do not expose privileged keys.
* Remove previous files only after successful replacement.

## Acceptance Criteria

* Real files upload to Supabase Storage.
* Unauthorized uploads fail.
* Unauthorized deletion fails.
* Signed URLs expire where used.
* Database and storage remain consistent.

---

# Phase 21: Search Integration and Optimization

## Objective

Connect real repository search and maintain performance.

## Search Fields

Search:

* Title
* Student
* Supervisor
* Abstract
* Keywords

## Search Priority

Prefer relevance in this order:

1. Exact title match
2. Partial title match
3. Keyword match
4. Student match
5. Supervisor match
6. Abstract match

## Tasks

* Connect server-side search.
* Connect combined filters.
* Add pagination.
* Add stable sorting.
* Validate search parameters.
* Avoid loading complete datasets.
* Add indexes after schema review.
* Add full-text search where supported.
* Add trigram matching where useful.
* Analyze query plans.
* Select only required fields.

## Acceptance Criteria

* Public search returns only permitted records.
* Combined filters work.
* Pagination is stable.
* Search remains responsive as data grows.
* URL state remains shareable.

---

# Phase 22: Security Hardening

## Objective

Review and secure the entire application.

## Tasks

* Review all server actions.
* Review all route handlers.
* Review RLS policies.
* Verify admin authorization.
* Protect environment variables.
* Review service-role usage.
* Prevent open redirects.
* Prevent user enumeration.
* Validate IDs.
* Validate URL parameters.
* Review XSS risks.
* Review CSRF protections.
* Review file-upload risks.
* Configure security headers.
* Remove sensitive logging.
* Use generic production errors.
* Review session expiration.
* Add rate limiting where practical.
* Test direct unauthorized requests.

## Acceptance Criteria

* Unauthorized mutations fail.
* Privileged keys never reach the browser.
* File-upload attacks are restricted.
* Sensitive database errors are hidden.
* Admin routes and actions are protected.
* RLS checks pass.

---

# Phase 23: Audit Logging

## Objective

Track important administrative actions.

## Log Actions

Support logging for:

* Administrator login
* Record creation
* Record update
* Record publication
* Record archive
* Record deletion
* Faculty changes
* Department changes
* Category changes
* User role changes
* User status changes
* Repository settings changes

## Log Information

Store only permitted metadata such as:

* Actor
* Action
* Entity type
* Entity identifier
* Timestamp
* Relevant non-sensitive metadata

Never log:

* Passwords
* Access tokens
* Refresh tokens
* Recovery tokens
* Secret keys

## Acceptance Criteria

* Important actions produce logs.
* Logs are restricted to authorized administrators.
* Logs cannot be altered by normal users.
* Logs contain no secrets.

---

# Phase 24: Performance Optimization

## Objective

Improve frontend and backend performance.

## Tasks

* Use Server Components by default.
* Reduce unnecessary Client Components.
* Avoid duplicate Supabase queries.
* Select only required columns.
* Add pagination to large datasets.
* Cache safe public statistics.
* Revalidate cached content after mutations.
* Lazy-load charts.
* Review bundle size.
* Add loading boundaries.
* Optimize images and assets.
* Test slow-network behaviour.
* Review dashboard query counts.
* Prevent client-side filtering of full datasets.

## Acceptance Criteria

* Public pages load efficiently.
* Dashboards do not make excessive requests.
* Tables remain usable with large datasets.
* Charts do not block critical content.
* Mobile performance is acceptable.

---

# Phase 25: Responsive Design Review

## Objective

Ensure the complete application works across device sizes.

## Test Sizes

Test:

* Small mobile
* Large mobile
* Tablet portrait
* Tablet landscape
* Laptop
* Desktop
* Wide desktop

## Review

Confirm:

* Public navigation collapses correctly.
* Dashboard sidebar becomes a drawer.
* Tables remain usable.
* Filters work on mobile.
* Forms do not overflow.
* Dialogs fit small screens.
* Abstract text remains readable.
* Action buttons remain accessible.
* Charts resize correctly.
* No horizontal overflow exists.

## Acceptance Criteria

* Core flows work on mobile.
* Tables have responsive behaviour.
* Forms remain usable.
* Navigation works at all supported widths.

---

# Phase 26: Accessibility Review

## Objective

Ensure core workflows are accessible.

## Tasks

* Use semantic HTML.
* Add form labels.
* Add accessible descriptions.
* Add visible focus states.
* Test keyboard navigation.
* Test dialog focus trapping.
* Add screen-reader labels.
* Associate errors with fields.
* Check color contrast.
* Avoid color-only status communication.
* Respect reduced motion.
* Make charts understandable without vision.
* Add descriptive page titles.
* Add skip navigation where useful.

## Acceptance Criteria

* Major workflows work with keyboard navigation.
* Forms are properly labelled.
* Focus is visible.
* Icon-only buttons have labels.
* Automated accessibility checks pass on important pages.

---

# Phase 27: Testing

## Objective

Create reliable automated coverage.

## Unit Tests

Test:

* Validation schemas
* Permission helpers
* Search parameter parsing
* Pagination parsing
* Academic-year validation
* Slug utilities
* Keyword normalization
* File validation
* Report calculations
* Formatting utilities

## Component Tests

Test:

* Empty states
* Error states
* Loading states
* Search controls
* Filter controls
* Form validation
* Confirmation dialogs
* Responsive navigation behaviour

## Integration Tests

After Supabase connection, test:

* Authentication operations
* Profile queries
* Record queries
* Record creation
* Record editing
* Bookmark operations
* Management queries
* Report queries
* Settings updates
* File operations
* RLS behaviour

## End-to-End Tests

Test:

1. Visitor views landing page.
2. Visitor searches for a project.
3. Visitor filters by faculty and year.
4. Visitor opens a record.
5. User registers.
6. User verifies email where required.
7. User logs in.
8. User saves a record.
9. User removes a saved record.
10. User updates profile.
11. User changes password.
12. Admin logs in.
13. Admin creates a faculty.
14. Admin creates a department.
15. Admin creates a category.
16. Admin uploads a project.
17. A published record appears publicly.
18. A draft record remains hidden.
19. Admin edits a record.
20. Admin attempts to delete an in-use department.
21. Admin generates a report.
22. Admin exports filtered data.
23. Normal user attempts to access admin routes.
24. Password reset succeeds.
25. Admin updates repository settings.

## Test Data Rule

Application pages must not use mock data.

Minimal test fixtures may exist only inside tests and must never be shipped as an application data source.

## Acceptance Criteria

* Critical tests pass.
* RLS behaviour is tested.
* No major console errors remain.
* No broken links remain.
* Loading, empty, and error states are tested.
* Production build passes.

---

# Phase 28: Production Deployment

## Objective

Deploy the complete application safely.

## Tasks

* Configure the production Supabase project.
* Apply the supplied database schema.
* Apply RLS policies.
* Configure storage buckets.
* Configure storage policies.
* Configure authentication URLs.
* Configure redirect URLs.
* Configure email templates.
* Add production environment variables.
* Deploy the Next.js application to Vercel.
* Create the initial administrator securely.
* Configure production repository settings.
* Test authentication.
* Test password reset.
* Test file uploads.
* Test public search.
* Test reports.
* Test exports.
* Configure error monitoring.
* Configure application logging.
* Configure database backups.

## Acceptance Criteria

* Production deployment succeeds.
* Authentication works.
* Password reset works.
* Database access works.
* Storage works.
* RLS remains active.
* Admin access works.
* Public search works.
* No privileged keys are exposed.

---

# Phase 29: Documentation and Handover

## Objective

Document the system for developers and university administrators.

## Developer Documentation

Include:

* Project overview
* Technology stack
* Local setup
* Environment variables
* Supabase configuration
* Service architecture
* Authentication flow
* Database integration
* Storage integration
* Search architecture
* Testing commands
* Build commands
* Deployment process
* Troubleshooting guide

## Administrator Documentation

Include:

* Admin login
* Dashboard overview
* Faculty management
* Department management
* Category management
* Adding projects
* Adding theses
* Uploading files
* Editing records
* Publishing records
* Archiving records
* Deleting records
* Managing users
* Generating reports
* Exporting data
* Updating repository settings
* Changing password
* Reviewing audit logs

## Operational Documentation

Include:

* Creating an administrator
* Removing administrator access
* Database backup
* Storage backup
* Database restoration
* Storage restoration
* Handling orphaned files
* Updating academic years
* Reviewing security logs

## Acceptance Criteria

* A new developer can run the application.
* An administrator can operate the system.
* Environment variables are documented.
* Deployment steps are complete.
* Backup and restoration steps are documented.

---

# 15. Core Routes

## Public Routes

```text
/
/browse
/projects
/theses
/repository/[slug]
/login
/register
/forgot-password
/reset-password
/verify-email
```

## User Routes

```text
/dashboard
/dashboard/projects
/dashboard/theses
/dashboard/saved
/dashboard/profile
/dashboard/security
```

## Administrator Routes

```text
/admin
/admin/records
/admin/records/new
/admin/records/[id]
/admin/records/[id]/edit
/admin/faculties
/admin/departments
/admin/categories
/admin/users
/admin/reports
/admin/settings
/admin/audit-logs
/admin/profile
/admin/security
```

---

# 16. Shared Component Requirements

Create reusable components for:

* Public header
* Public footer
* Dashboard sidebar
* Mobile dashboard drawer
* Dashboard top bar
* Breadcrumbs
* Page header
* Section header
* Search field
* Filter panel
* Mobile filter drawer
* Active filters
* Record-type toggle
* Repository result item
* Metadata list
* Keyword list
* Bookmark button
* Data table
* Pagination
* Statistic panel
* Chart wrapper
* Empty state
* Error state
* Data-source-not-configured state
* Loading skeleton
* File uploader
* Faculty selector
* Department selector
* Category selector
* Academic-year selector
* Confirmation dialog
* Status badge
* Form error summary

Avoid oversized components that manage unrelated responsibilities.

---

# 17. Coding Standards

Follow these rules throughout development:

* Use strict TypeScript.
* Avoid `any`.
* Use Server Components by default.
* Use Client Components only when necessary.
* Keep privileged code server-only.
* Validate all external input.
* Do not trust URL parameters.
* Do not trust client-supplied user IDs.
* Do not trust client-supplied roles.
* Keep Supabase queries inside service adapters.
* Avoid duplicate business logic.
* Keep components focused.
* Use descriptive names.
* Handle errors explicitly.
* Use accessible HTML.
* Add pagination to large lists.
* Avoid exposing raw database errors.
* Do not expose service-role keys.
* Use transactions or database functions for multi-step mutations where supported.
* Use safe neutral fallbacks.
* Use minimal border radius.
* Avoid excessive cards.
* Avoid heavy shadows.
* Prefer simple, maintainable solutions over unnecessary abstractions.

---

# 18. Final Completion Definition

The project is complete only when:

* All phases have been addressed.
* The application contains no mock application data.
* Public browsing works with real Supabase data.
* Project and thesis filtering works.
* Authentication works.
* Password reset works.
* Role-based protection works.
* User bookmarks work.
* User profile management works.
* Admin record management works.
* Faculty management works.
* Department management works.
* Category management works.
* User management works.
* Supabase Storage works.
* Reports work.
* Exports work.
* Repository settings work.
* Search is optimized.
* Responsive design is complete.
* Accessibility review is complete.
* Security review is complete.
* Automated tests pass.
* Production build passes.
* Deployment succeeds.
* Developer documentation exists.
* Administrator documentation exists.
* Operational documentation exists.

Do not stop after building layouts.

Do not leave required pages as unstructured placeholders.

Do not display fabricated data to make the interface look complete.

Do not mark incomplete backend operations as successful.

Use empty, loading, error, and not-configured states until real Supabase integration is available.
