[README (1).md](https://github.com/user-attachments/files/31884491/README.1.md)
# AMCET Alumni Network

## Annai Mira College of Engineering & Technology

A centralized digital alumni ecosystem designed to connect the institution, alumni, and students through a secure, structured, and professionally managed platform.

---

## Table of Contents

- [Overview](#overview)
- [Objectives](#objectives)
- [Key Features](#key-features)
- [User Roles](#user-roles)
- [System Workflow](#system-workflow)
- [Public Website](#public-website)
- [Alumni Registration](#alumni-registration)
- [Alumni Authentication](#alumni-authentication)
- [Alumni Dashboard](#alumni-dashboard)
- [Profile Management](#profile-management)
- [Admin Portal](#admin-portal)
- [Notification System](#notification-system)
- [Alumni Data Management](#alumni-data-management)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Database Architecture](#database-architecture)
- [Database Tables](#database-tables)
- [Security Architecture](#security-architecture)
- [Design System](#design-system)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [GitHub Workflow](#github-workflow)
- [Branch Strategy](#branch-strategy)
- [Development Roadmap](#development-roadmap)
- [Testing](#testing)
- [Environment Configuration](#environment-configuration)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Project Status](#project-status)
- [Future Improvements](#future-improvements)
- [Project Principles](#project-principles)
- [License](#license)

---

# Overview

The AMCET Alumni Network is a centralized platform for managing and presenting the college's alumni ecosystem.

The platform provides a public-facing alumni directory while giving verified alumni access to a secure personal dashboard and giving administrators complete control over alumni data, verification, profile changes, and platform management.

The system is designed around three major areas:

1. Public Alumni Website
2. Alumni Platform
3. Administration Portal

---

# Objectives

The main objectives of the platform are:

- Build a centralized alumni database for AMCET.
- Digitally preserve the institution's alumni legacy.
- Provide a searchable alumni directory.
- Help students discover alumni based on career, company, department, batch, and industry.
- Allow students to contact alumni through approved external channels.
- Provide secure alumni registration and verification.
- Allow verified alumni to maintain their professional information.
- Ensure profile changes are reviewed by administrators.
- Provide administrators with centralized alumni management.
- Maintain strict access control over official alumni records.
- Establish a scalable foundation for future alumni initiatives.

---

# Key Features

## Public Features

- Institutional homepage
- College introduction
- Alumni legacy section
- Alumni statistics
- Distinguished alumni showcase
- Alumni directory
- Search functionality
- Department filtering
- Batch filtering
- Company filtering
- Industry filtering
- Public alumni profiles
- LinkedIn contact
- Optional email contact
- Alumni registration CTA

## Alumni Features

- Alumni registration
- Register number verification
- College email verification
- OTP verification
- Secure authentication
- Alumni dashboard
- Personal profile
- Career information
- Career journey
- Achievements
- LinkedIn profile
- Email visibility controls
- Profile update requests
- Notification center

## Admin Features

- Admin authentication
- Alumni management
- Alumni verification
- Alumni profile management
- Profile update approval
- Profile update rejection
- Rejection reason
- Department management
- Company management
- Industry management
- Distinguished alumni management
- Public visibility management
- Notification management
- Dashboard analytics
- Alumni statistics

---

# User Roles

The platform contains three primary user categories.

## 1. Public User

Public users do not require an account.

They can:

- Browse the website.
- Explore alumni.
- Search alumni.
- Filter alumni.
- View public profiles.
- View distinguished alumni.
- Contact alumni through approved external links.

Students do not require alumni accounts.

There is no internal student-to-alumni messaging system.

---

## 2. Alumni

Verified alumni can:

- Register using official college information.
- Verify their identity through OTP.
- Create an authenticated account.
- Access their dashboard.
- View their profile.
- Submit profile changes.
- Manage approved contact visibility.
- View notifications.

Alumni cannot directly modify official profile records.

---

## 3. Admin

Administrators have privileged access to the administration portal.

Admins can:

- Manage alumni.
- Verify alumni.
- Review profile changes.
- Approve profile changes.
- Reject profile changes.
- Manage master data.
- Manage departments.
- Manage companies.
- Manage distinguished alumni.
- Control public visibility.
- Monitor platform statistics.
- Manage notifications.

Admin accounts are provisioned separately and cannot be self-created through public registration.

---

# System Workflow

```text
                         AMCET ALUMNI NETWORK
                                  |
              +-------------------+-------------------+
              |                   |                   |
              v                   v                   v
        PUBLIC USERS            ALUMNI              ADMIN
              |                   |                   |
              v                   v                   v
        Public Website       Registration        Admin Portal
              |                   |                   |
              v                   v                   v
       Alumni Directory     Verification        Management
              |                   |                   |
              v                   v                   v
        Alumni Profile       Dashboard          Database
              |                   |                   |
              v                   +-------------------+
       LinkedIn / Email
```

---

# Public Website

The public website provides the institutional identity and alumni discovery experience.

## Homepage Structure

```text
Homepage
│
├── Hero
│
├── College Introduction
│
├── Alumni Legacy
│
├── Alumni Statistics
│
├── Distinguished Alumni
│
├── Career & Industry
│
├── Directory Preview
│
├── Alumni Registration CTA
│
└── Footer
```

## Alumni Directory

The directory allows public users to discover alumni without requiring authentication.

### Search

Users can search alumni based on:

- Name
- Company
- Designation
- Industry

### Filters

Available filters include:

- Department
- Batch
- Company
- Industry

### Directory Flow

```text
Public Website
      |
      v
Alumni Directory
      |
      v
Search / Filters
      |
      v
Alumni Results
      |
      v
Alumni Profile
      |
      +------> LinkedIn
      |
      +------> Email
```

## Alumni Profiles

Public profiles display only approved and publicly visible information.

### Profile Information

- Name
- Profile photo
- Department
- Batch
- Graduation year
- Current company
- Current designation
- Industry
- Location
- Career journey
- Achievements
- LinkedIn
- Email when enabled

### Privacy Defaults

```text
Email       -> Hidden by default
LinkedIn    -> Visible by default
Profile     -> Public by default
```

Alumni control the visibility of supported contact information through their profile settings.

## Distinguished Alumni

The platform provides a dedicated section for distinguished alumni.

Distinguished alumni may be selected and managed by administrators.

Information can include:

- Name
- Photograph
- Department
- Batch
- Current organization
- Designation
- Career highlights
- Achievements
- Professional links

---

# Alumni Registration

Alumni registration uses official college records as the verification source.

## Registration Flow

```text
ALUMNI
   |
   v
REGISTER
   |
   v
REGISTER NUMBER
+
COLLEGE EMAIL
   |
   v
SECURE MASTER CHECK
   |
   +-------------------+
   |                   |
   v                   v
 INVALID          ALREADY CLAIMED
   |                   |
   v                   v
 REJECT              REJECT
   |
   |
   v
 VALID
   |
   v
 OTP VERIFICATION
   |
   v
 CREATE PASSWORD
   |
   v
 SUPABASE AUTH ACCOUNT
   |
   v
 ATOMIC REGISTRATION
   |
   v
 CREATE / LINK PROFILE
   |
   v
 MARK MASTER RECORD CLAIMED
   |
   v
 VERIFIED ALUMNI
   |
   v
 DASHBOARD
```

## Alumni Verification

The college-provided alumni master data acts as the official verification source.

The public application must never expose the complete master dataset.

The verification process returns only the required status.

Possible states:

- `VALID`
- `INVALID`
- `ALREADY_CLAIMED`

The system does not expose unnecessary master-record information to the client.

---

# Alumni Authentication

Supabase Authentication is used for normal alumni login.

## Registration

Registration requires:

- Register Number
- Registered College Email
- OTP verification
- Password creation

## Login

After successful registration:

```text
Email
+
Password
      |
      v
Supabase Auth
      |
      v
Authenticated Session
      |
      v
Alumni Dashboard
```

The register number is used during registration verification and is not required for every login.

---

# Alumni Dashboard

The alumni dashboard provides authenticated alumni with access to their account and profile information.

## Dashboard Sections

```text
Dashboard
│
├── Profile Overview
├── Personal Information
├── Academic Information
├── Career Information
├── Career Journey
├── Achievements
├── Contact Visibility
├── Profile Update Requests
└── Notifications
```

---

# Profile Management

Alumni do not directly modify the official alumni profile record.

Instead, changes are submitted as requests.

## Profile Update Workflow

```text
ALUMNI LOGIN
     |
     v
MY PROFILE
     |
     v
REQUEST PROFILE CHANGE
     |
     v
PROFILE UPDATE REQUEST
     |
     v
ADMIN REVIEW
     |
     +------------------+
     |                  |
     v                  v
 APPROVE             REJECT
     |                  |
     v                  v
UPDATE PROFILE      REJECTION REASON
     |                  |
     +---------+--------+
               |
               v
          NOTIFICATION
```

## Approval

When an administrator approves a request:

- Official profile is updated.
- Request status becomes approved.
- Alumni is notified.
- Notification is created.
- Email notification may be sent.

## Rejection

When an administrator rejects a request:

- Request status becomes rejected.
- Rejection reason is stored.
- Alumni is notified.
- Alumni can review the reason.

---

# Admin Portal

The admin portal provides centralized platform management.

## Admin Dashboard

Key metrics include:

- Total Alumni
- Verified Alumni
- Pending Requests
- Companies
- Departments

## Admin Modules

```text
Admin Portal
│
├── Dashboard
├── Alumni
│   ├── View Alumni
│   ├── Verify Alumni
│   └── Manage Visibility
│
├── Profile Requests
│   ├── Pending
│   ├── Approved
│   └── Rejected
│
├── Departments
├── Companies
├── Distinguished Alumni
├── Notifications
└── Settings
```

---

# Notification System

The platform includes an in-app notification system.

## Notification Events

### Alumni Registration

Alumni receive a registration confirmation.

### Profile Update Request

Admins receive a notification when an alumni submits a profile update.

### Profile Update Approved

Alumni receive:

- Dashboard notification
- Email notification

### Profile Update Rejected

Alumni receive:

- Dashboard notification
- Email notification
- Rejection reason

### Manual Verification

When an administrator manually verifies an account, the alumni receives an email notification.

---

# Alumni Data Management

The platform creates a centralized alumni database using official college-provided information.

The Placement Cell / college administration is the source for initial alumni records.

## Expected Data

- Register Number
- Name
- Department
- Batch
- Graduation Year
- Registered College Email
- Current Company
- Current Designation

The collected data must be:

- Obtained from the authorized college source.
- Verified.
- Cleaned.
- Structured.
- Imported into the alumni master table.

The system must not invent official alumni records.

---

# Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

## UI / Animation

- GSAP
- ScrollTrigger
- Lenis

## Backend / Platform

- Supabase

## Database

- PostgreSQL

## Authentication

- Supabase Auth

## Storage

- Supabase Storage

## Security

- PostgreSQL Row Level Security
- Supabase RLS
- Secure PostgreSQL RPC functions
- Database constraints
- Transactional operations

## Version Control

- Git
- GitHub

## Deployment

- Vercel

---

# System Architecture

```text
                        CLIENT
                          |
                          v
                React + TypeScript
                          |
                          v
                    React Router
                          |
             +------------+------------+
             |                         |
             v                         v
       Public Pages             Authenticated Pages
             |                         |
             |                 +-------+-------+
             |                 |               |
             v                 v               v
        Directory           Alumni          Admin
        Profiles           Dashboard       Dashboard
             |                 |               |
             +-----------------+---------------+
                               |
                               v
                         Supabase Client
                               |
              +----------------+----------------+
              |                |                |
              v                v                v
          PostgreSQL       Supabase Auth    Supabase Storage
              |
              v
             RLS
              |
              v
       Secure Database Layer
```

---

# Database Architecture

The platform uses PostgreSQL through Supabase.

The database is divided into:

```text
Official Master Data
        |
        v
alumni_master
        |
        v
Verification
        |
        v
Authenticated User
        |
        v
user_profiles
        |
        v
alumni_profiles
        |
        +-------- career_experiences
        |
        +-------- achievements
        |
        +-------- notifications
        |
        +-------- profile_update_requests
```

---

# Database Tables

## 1. alumni_master

Official college-provided verification records.

```text
register_number     PRIMARY KEY
name
department
batch
graduation_year
registered_email    UNIQUE
is_claimed
claimed_at
```

This table must not be publicly readable.

## 2. departments

Stores department master data.

```text
id
name
code
```

## 3. companies

Stores company information.

```text
id
name
industry
logo_url
website
```

## 4. user_profiles

Stores authenticated application users.

```text
id
email
role
register_number
is_verified
created_at
updated_at
```

Roles:

- `admin`
- `alumni`

## 5. alumni_profiles

Stores public and professional alumni information.

```text
id
user_id
register_number
name
photo_url
department_id
department_name
batch
graduation_year
company_id
current_company
current_designation
industry
location
bio
linkedin_url
email
show_email
show_linkedin
is_public
is_distinguished
created_at
updated_at
```

## 6. career_experiences

Stores career history.

```text
id
alumni_id
company_name
designation
start_date
end_date
is_current
description
```

## 7. achievements

Stores alumni achievements.

```text
id
alumni_id
title
description
year
organization
```

## 8. profile_update_requests

Stores requested profile changes.

```text
id
alumni_id
requested_changes
current_snapshot
status
rejection_reason
reviewed_by
created_at
updated_at
```

Possible statuses:

- `pending`
- `approved`
- `rejected`

## 9. notifications

Stores user notifications.

```text
id
user_id
title
message
type
is_read
created_at
```

Notification types include:

- `registration`
- `update_request`
- `update_approved`
- `update_rejected`
- `verification`

## Database Relationships

```text
alumni_master
      |
      | register_number
      v
user_profiles
      |
      | user_id
      v
alumni_profiles
      |
      +------------------+
      |                  |
      v                  v
career_experiences   achievements
      |
      |
      +----------------------+
                             |
                             v
                  profile_update_requests
                             |
                             v
                        notifications
```

---

# Security Architecture

Security is a core requirement of the platform.

## Master Data Protection

The `alumni_master` table must never be exposed through public SELECT access.

The client cannot directly query the complete alumni master dataset.

Instead, a secure verification function is used.

```text
Client
  |
  v
verify_alumni_master()
  |
  v
VALID / INVALID / ALREADY_CLAIMED
```

## Secure Registration

The registration process uses an atomic database operation.

The system must:

- Validate the master record.
- Lock the relevant master row.
- Prevent duplicate claims.
- Create/link the user profile.
- Create/link the alumni profile.
- Mark the master record as claimed.

The registration operation must be transactional.

This prevents race conditions where multiple registration attempts could claim the same alumni record.

## Row Level Security

RLS is enabled on protected database tables.

The access model follows the principle:

```text
Public
   |
   +---- Public alumni profiles only

Alumni
   |
   +---- Own profile
   +---- Own requests
   +---- Own notifications

Admin
   |
   +---- Authorized management operations
```

## Admin Security

Admin access must not be based on a client-controlled role value.

Admin accounts are provisioned through a controlled administrative process.

Users cannot make themselves administrators through registration or client-side requests.

## Contact Privacy

Email is hidden by default.

```text
show_email = FALSE
show_linkedin = TRUE
```

Only approved public information is displayed on public profiles.

---

# Design System

The platform follows a premium institutional and editorial design direction.

The visual identity is inspired by high-end editorial and institutional websites rather than generic SaaS dashboards.

## Color Palette

| Name | Hex |
|---|---|
| Deep Ebony | `#0D0D0D` |
| Rich Off-Black | `#161616` |
| Deep Charcoal | `#1E1A1B` |
| Deep Burgundy | `#3A111C` |
| Burgundy | `#6E1F32` |
| Warm Ivory | `#F4EFE7` |
| Muted Gold | `#B89B5E` |
| Soft Gray | `#A7A29B` |

## Typography

### Display

- Playfair Display
- Cinzel

### Body

- Inter
- Plus Jakarta Sans

## Design Principles

The interface should maintain:

- Premium institutional appearance
- Editorial composition
- Strong typography
- Large imagery
- Spacious layouts
- Fine borders
- Controlled shadows
- Minimal excessive rounding
- Minimal glassmorphism
- Minimal generic dashboard styling
- Responsive layouts
- Accessible interaction patterns

The design should feel like a prestigious institutional platform rather than a commercial SaaS product.

## Motion Design

The interface uses subtle motion to improve the experience.

### Technologies

- GSAP
- ScrollTrigger
- Lenis

### Motion Examples

- Page transitions
- Scroll-based reveals
- Image movement
- Section reveals
- Hover transitions
- Subtle vertical movement
- Navigation transitions

Animations should remain restrained and should not interfere with usability.

Reduced-motion preferences should be respected.

---

# Project Structure

```text
src/
│
├── assets/
│
├── components/
│   ├── common/
│   ├── layout/
│   ├── alumni/
│   └── admin/
│
├── pages/
│   ├── public/
│   ├── alumni/
│   └── admin/
│
├── layouts/
│
├── hooks/
│
├── contexts/
│
├── services/
│
├── lib/
│   └── supabase/
│
├── types/
│
├── styles/
│
└── App.tsx
```

---

# Development Workflow

Development follows a feature-based workflow.

```text
Issue
  |
  v
Feature Branch
  |
  v
Implementation
  |
  v
Local Testing
  |
  v
Pull Request
  |
  v
Code Review
  |
  v
Development
  |
  v
Integration Testing
  |
  v
Main
  |
  v
Production
```

---

# GitHub Workflow

GitHub Issues are used to track development work.

GitHub Projects are used to organize the backlog and development progress.

## Project Board

Typical workflow:

```text
Backlog
   |
   v
Ready
   |
   v
In Progress
   |
   v
Review
   |
   v
Testing
   |
   v
Done
```

## GitHub Issue Structure

Each issue should contain:

- Title
- Objective
- Tasks
- Acceptance Criteria
- Definition of Done

Issues should remain focused on one feature or development responsibility.

---

# Branch Strategy

The repository follows:

```text
feature branch
      |
      v
development
      |
      v
testing
      |
      v
main
```

## Example

```text
feature/alumni-directory
        |
        v
development
        |
        v
main
```

## Branch Naming Convention

### Features

```text
feature/<feature-name>
```

Example:

- `feature/alumni-directory`
- `feature/alumni-profile`
- `feature/alumni-authentication`

### Fixes

```text
fix/<issue-name>
```

Example:

- `fix/profile-validation`
- `fix/mobile-navigation`

### Chores

```text
chore/<task-name>
```

Example:

- `chore/supabase-schema`
- `chore/update-dependencies`

## Pull Request Guidelines

Every Pull Request should:

- Have a clear title.
- Reference the related GitHub issue.
- Explain the implementation.
- Include screenshots for UI changes.
- Include testing information.
- Pass the production build.
- Avoid unrelated changes.
- Be reviewed before merging.

---

# Development Roadmap

## Phase 1 — Foundation

- Project configuration
- Repository setup
- Design system
- Typography
- Tailwind configuration
- Animation foundation
- Routing architecture

## Phase 2 — Alumni Database

- Collect official alumni data.
- Create alumni_master.
- Clean and validate records.
- Import verified records.
- Create department master data.
- Create company master data.

## Phase 3 — Database Architecture

- Create database schema.
- Configure relationships.
- Add foreign keys.
- Add unique constraints.
- Add indexes.
- Configure timestamps.

## Phase 4 — Database Security

- Configure RLS.
- Restrict alumni_master.
- Create secure verification RPC.
- Configure role-based access.
- Prevent unauthorized profile updates.
- Protect admin operations.

## Phase 5 — Public Website

- Homepage
- College introduction
- Alumni legacy
- Statistics
- Distinguished alumni
- Career and industry
- Directory preview
- Registration CTA
- Footer

## Phase 6 — Alumni Directory

- Directory listing
- Search
- Department filtering
- Batch filtering
- Company filtering
- Industry filtering
- Pagination / loading strategy
- Public profile navigation

## Phase 7 — Alumni Profiles

- Public profile
- Career information
- Career journey
- Achievements
- LinkedIn
- Email visibility
- Distinguished alumni support

## Phase 8 — Alumni Registration

- Register number verification
- College email verification
- Secure master validation
- OTP
- Password creation
- Supabase Auth account
- Atomic registration
- Profile creation

## Phase 9 — Alumni Authentication

- Login
- Logout
- Session management
- Protected routes
- Role validation
- Authentication state

## Phase 10 — Alumni Dashboard

- Dashboard
- Profile overview
- Career information
- Achievements
- Contact visibility
- Notifications
- Update requests

## Phase 11 — Profile Update Workflow

- Update request creation
- Request status
- Admin notification
- Admin review
- Side-by-side comparison
- Approval
- Rejection
- Rejection reason
- Alumni notification

## Phase 12 — Admin Portal

- Admin authentication
- Dashboard
- Alumni management
- Verification
- Departments
- Companies
- Distinguished alumni
- Profile requests
- Visibility management
- Analytics

## Phase 13 — Notifications

- Notification database
- Registration notifications
- Update request notifications
- Approval notifications
- Rejection notifications
- Verification notifications
- Read/unread state
- Email integration

## Phase 14 — Testing & Security

- Authentication testing
- Authorization testing
- RLS testing
- Registration race-condition testing
- Input validation
- Profile privacy testing
- Admin access testing
- Mobile testing
- Browser testing
- Accessibility testing

## Phase 15 — Performance & Deployment

- Bundle optimization
- Image optimization
- Lazy loading
- Animation optimization
- Database query optimization
- Production build
- Vercel deployment
- Production verification

---

# Testing

Testing should cover the following areas.

## Authentication

- Valid login
- Invalid login
- OTP verification
- Invalid OTP
- Session persistence
- Logout
- Protected routes

## Registration

- Valid register number
- Invalid register number
- Invalid college email
- Already claimed record
- Duplicate registration
- Concurrent registration attempts

## Authorization

- Public access
- Alumni access
- Admin access
- Unauthorized route access
- Role escalation prevention

## Profile

- Public profile visibility
- Email privacy
- LinkedIn visibility
- Profile update submission
- Approval
- Rejection
- Rejection reason

## Admin

- Admin authentication
- Alumni management
- Request review
- Master data management
- Distinguished alumni management

## Responsive Testing

Test on:

- Desktop
- Laptop
- Tablet
- Mobile

## Browser Testing

Test on:

- Chrome
- Edge
- Firefox
- Safari

---

# Environment Configuration

Create a local `.env` file.

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Never commit private credentials or service-role keys to GitHub.

---

# Local Development

## Clone Repository

```bash
git clone https://github.com/Amcet-Digital-Innovation-Cell/ADIC-alumni-network-site.git
```

## Enter Project

```bash
cd ADIC-alumni-network-site
```

## Install Dependencies

```bash
npm install
```

## Configure Environment

Create:

```text
.env
```

Add:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Start Development Server

```bash
npm run dev
```

## Build Project

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

---

# Deployment

The project is deployed using Vercel.

## Production

https://amcet-alumni-ecosystem.vercel.app/

## Deployment Flow

```text
GitHub
   |
   v
Development
   |
   v
Main
   |
   v
Vercel
   |
   v
Production
```

---

# Project Status

## Current Status

**Active Development**

The project is currently being developed in parallel across frontend and backend workstreams.

## Current Development Areas

### Frontend

- Institutional design system
- Homepage
- Alumni directory
- Alumni profiles
- Alumni dashboard
- Admin dashboard

### Backend

- Supabase database
- Alumni master data
- Database relationships
- RLS
- Secure verification
- Atomic registration
- Authentication
- Profile update workflow
- Notifications

## Current Development Backlog

### Foundation

- Project foundation
- Design system

### Database

- Alumni master database
- Supabase schema
- Database relationships
- RLS
- Secure verification RPC
- Atomic registration

### Public Website

- Homepage
- Alumni directory
- Alumni profiles
- Distinguished alumni

### Alumni Platform

- Registration
- Authentication
- Dashboard
- Profile management

### Administration

- Admin portal
- Verification
- Profile approval workflow
- Master data management
- Notifications

### Quality

- Security testing
- Responsive testing
- Performance optimization
- Production deployment

---

# Future Improvements

Potential future extensions include:

- Alumni events
- Alumni reunions
- Mentorship programs
- Internship opportunities
- Job opportunities
- Alumni contributions
- Alumni success stories
- Event registration
- Alumni analytics
- Advanced search
- Alumni community initiatives
- Institutional announcements

These features are outside the initial implementation scope and can be added after the core platform is stable.

---

# Project Principles

## Security First

Sensitive alumni and authentication data must never be unnecessarily exposed.

## College Data as Source of Truth

Official alumni verification records must originate from authorized college data.

## Verified Alumni

Only verified alumni should receive authenticated alumni access.

## Controlled Profile Changes

Official alumni information must not be directly modified by users.

## Privacy by Default

Sensitive contact information should remain private unless explicitly enabled.

## External Communication

Students and alumni communicate through approved external platforms such as LinkedIn or Email.

The platform does not implement internal student-to-alumni messaging.

## Maintainable Architecture

The codebase should remain modular, readable, testable, and scalable.

## Responsive Design

The platform must work across desktop, tablet, and mobile devices.

## Institutional Identity

The interface should maintain a professional, premium, and prestigious AMCET identity.

---

# Repository

GitHub: https://github.com/Amcet-Digital-Innovation-Cell/ADIC-alumni-network-site

# Production

Live Website: https://amcet-alumni-ecosystem.vercel.app/

---

# Team Development

The project is developed collaboratively using:

- GitHub Issues
- GitHub Projects
- Feature branches
- Pull Requests
- Code reviews
- Development branch

Each team member works on assigned issues and submits changes through Pull Requests.

## Contribution Guidelines

Before starting development:

1. Check the GitHub Project.
2. Select an assigned issue.
3. Create a feature branch.
4. Implement the feature.
5. Test locally.
6. Commit the changes.
7. Push the branch.
8. Create a Pull Request.
9. Request review.
10. Resolve review comments.
11. Merge after approval.

## Commit Convention

Recommended commit format:

```text
feat: add alumni directory
fix: resolve profile visibility issue
chore: update supabase configuration
refactor: improve alumni service
docs: update README
test: add authentication tests
```

---

# Final Architecture Summary

```text
                         AMCET
                           |
                           v
                  ALUMNI NETWORK
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
       PUBLIC            ALUMNI           ADMIN
       WEBSITE          PLATFORM         PORTAL
          |                |                |
          v                v                v
     DIRECTORY        AUTHENTICATION    MANAGEMENT
          |                |                |
          v                v                v
      PROFILES         DASHBOARD        APPROVALS
          |                |                |
          +----------------+----------------+
                           |
                           v
                        SUPABASE
                           |
        +------------------+------------------+
        |                  |                  |
        v                  v                  v
    PostgreSQL         Supabase Auth       Storage
        |
        v
       RLS
        |
        v
 Official Alumni Data
```

---

## License

This project is developed for the Annai Mira College of Engineering & Technology alumni ecosystem.

**Status:** Active Development
**Institution:** Annai Mira College of Engineering & Technology
**Platform:** AMCET Alumni Network
