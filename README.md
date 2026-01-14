<div align="center">

# 🏢 RoomReserve

**A Modern Room Reservation Management System**

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Mantine](https://img.shields.io/badge/Mantine-8.3.11-339AF0?logo=mantine&logoColor=white)](https://mantine.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

*Full-stack CRUD application for managing room reservations with role-based access control*

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Contributing](#-contributing)

</div>

---

##  About The Project

RoomReserve is a comprehensive room booking system designed for educational institutions, co-working spaces, or any organization that needs to manage shared room resources efficiently. Built with modern web technologies, it provides an intuitive and seamless experience for students, staff, and administrators to coordinate room reservations.

### Why RoomReserve?

-  **Fast & Modern** - Built with React 19, TypeScript, and Vite for optimal performance
-  **Secure** - Powered by Supabase with built-in authentication and authorization
-  **Responsive** - Mobile-friendly design that works on all devices
-  **Beautiful UI** - Clean and intuitive interface using Mantine UI components
-  **Real-time** - Live updates and synchronization across users

##  Features

###  Student Features
-  **Browse Rooms** - View all available rooms with details (capacity, location, amenities)
-  **Interactive Calendar** - Visual calendar interface to check room availability
-  **Create Reservations** - Book rooms with custom title, time slot, and notes
-  **My Bookings** - View and manage all your reservations
-  **Cancel Reservations** - Cancel your own bookings when needed

###  Staff Features
-  **View All Reservations** - Monitor all room bookings across the system
-  **Approve Requests** - Review and approve pending reservations
-  **Reject Requests** - Deny reservations with optional reasons
-  **Email Notifications** - Automated status update emails to users

###  Admin Features
-  **Room Management** - Complete CRUD operations for rooms
-  **User Management** - Assign and modify user roles and permissions
-  **Dashboard Analytics** - View system statistics and key metrics
-  **Full Access Control** - Complete administrative privileges

###  Core Functionality
-  **Secure Authentication** - User authentication powered by Supabase
-  **Role-Based Access** - Three-tier permission system (Student, Staff, Admin)
-  **Email Integration** - Automated notifications via Supabase Edge Functions
-  **Real-time Updates** - Live data synchronization
-  **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

##  Tech Stack

### Frontend
- **Framework:** [React 19.2.0](https://react.dev/) - Modern UI library
- **Language:** [TypeScript 5.9.3](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Build Tool:** [Vite 7.2.4](https://vitejs.dev/) - Lightning-fast build tool
- **UI Library:** [Mantine 8.3.11](https://mantine.dev/) - Feature-rich component library
- **Routing:** [React Router 7.12.0](https://reactrouter.com/) - Client-side routing
- **Calendar:** [FullCalendar 6.1.20](https://fullcalendar.io/) - Interactive calendar
- **Icons:** [Tabler Icons 3.36.1](https://tabler-icons.io/) - Beautiful icon set

### Backend & Infrastructure
- **Database:** [Supabase](https://supabase.com/) - PostgreSQL database
- **Authentication:** Supabase Auth - Secure user authentication
- **Edge Functions:** Supabase Functions - Serverless functions for email
- **Real-time:** Supabase Realtime - Live data subscriptions

### Development Tools
- **Linting:** ESLint 9 with TypeScript support
- **Package Manager:** npm
- **Version Control:** Git

##  Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v9.0.0 or higher) - Comes with Node.js
- **Supabase Account** - [Sign up here](https://supabase.com/)
- **Git** - [Download here](https://git-scm.com/)

##  Installation

### 1 Clone the Repository

```bash
git clone https://github.com/yourusername/reservation-project.git
cd reservation-project
```

### 2️ Install Dependencies

```bash
npm install
```

### 3️ Configure Supabase

#### Create Supabase Project
1. Go to [Supabase](https://supabase.com/) and create a new project
2. Wait for the database to be set up

#### Create Database Tables

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'staff', 'student')) DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rooms table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  location TEXT,
  amenities TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reservations table
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_reservations_room_id ON reservations(room_id);
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_start_time ON reservations(start_time);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Rooms are viewable by everyone" ON rooms FOR SELECT USING (true);
CREATE POLICY "Reservations are viewable by everyone" ON reservations FOR SELECT USING (true);
CREATE POLICY "Users can insert own reservations" ON reservations FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 4️ Set Up Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**To find your Supabase credentials:**
1. Go to your Supabase project dashboard
2. Click on **Settings** → **API**
3. Copy the **Project URL** and **anon/public key**

### 5️ Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to see the application.

##  Usage

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint to check code quality
npm run lint
```

### User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Student** | Create reservations • View own bookings • Cancel own reservations |
| **Staff** | All student permissions • View all reservations • Approve/reject requests |
| **Admin** | Full system access • Room management • User management • System analytics |

### Getting Started as a User

1. **Sign Up** - Create an account (defaults to "student" role)
2. **Browse Rooms** - Navigate to the Rooms page to see available spaces
3. **Create Reservation** - Use the calendar or form to book a room
4. **Manage Bookings** - View and manage your reservations in "My Reservations"

### Setting Up Admin Access

To promote a user to admin:

1. Go to your Supabase project dashboard
2. Open the **SQL Editor**
3. Run this query:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
   ```

##  Project Structure

```
reservation-project/
├── public/                   # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.tsx       # Main layout wrapper
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── ProtectedRoute.tsx    # Authentication guard
│   │   ├── RoleRoute.tsx    # Role-based route protection
│   │   ├── ReservationForm.tsx   # Booking form component
│   │   ├── ReservationStatusBadge.tsx
│   │   └── ReservationActions.tsx
│   ├── context/             # React Context providers
│   │   ├── AuthContext.tsx  # Authentication context
│   │   └── useAuth.ts       # Auth hook
│   ├── features/            # Feature-specific logic
│   │   └── reservations/
│   │       └── useCancelReservation.ts
│   ├── hooks/               # Custom React hooks
│   │   └── useRole.ts       # Role management hook
│   ├── pages/               # Page components
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── Reservations.tsx # Reservations list
│   │   ├── CreateReservation.tsx
│   │   ├── ReservationCalendar.tsx
│   │   ├── Rooms.tsx        # Rooms management
│   │   ├── AdminPage.tsx    # Admin control panel
│   │   ├── StaffPage.tsx    # Staff management panel
│   │   └── AuthPage.tsx     # Login/signup page
│   ├── services/            # API service layer
│   │   └── profileService.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── reservation.ts
│   │   ├── roles.ts
│   │   └── rooms.ts
│   ├── utils/               # Helper functions
│   │   └── reservations.ts
│   ├── App.tsx              # Main App component
│   ├── main.tsx             # Application entry point
│   ├── supabase.ts          # Supabase client config
│   ├── theme.tsx            # Mantine theme config
│   └── index.css            # Global styles
├── supabase/
│   └── functions/           # Supabase Edge Functions
│       └── reservation-status-email/
├── .env                     # Environment variables (create this)
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md                # This file
```

##  Authentication & Security

- **Secure Authentication** - Powered by Supabase Auth
- **Password Requirements** - Enforced by Supabase (minimum 6 characters)
- **Row Level Security** - Database-level security policies
- **Protected Routes** - Client-side route guards
- **Role-Based Access Control** - Three-tier permission system
- **Environment Variables** - Sensitive data stored securely

##  Email Notifications

Automated email notifications are sent when reservation status changes:

| Status | Notification |
|--------|-------------|
|  Approved | Confirmation email with booking details |
|  Rejected | Rejection notice with optional reason |
|  Cancelled | Cancellation confirmation |

*Powered by Supabase Edge Functions*

##  Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to Netlify
3. Add environment variables in Netlify dashboard

### Deploy Supabase Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Deploy functions
supabase functions deploy reservation-status-email
```

## 🛣️ Roadmap

- [ ] Recurring reservations support
- [ ] Real-time conflict detection UI
- [ ] Advanced search and filters
- [ ] Export reservations to CSV/PDF
- [ ] Integration with Google Calendar
- [ ] Mobile app (React Native)
- [ ] Email reminders before reservations
- [ ] Notification preferences
- [ ] Room images and galleries
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

##  Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write clean, readable code
- Comment complex logic
- Test your changes thoroughly
- Update documentation as needed

##  License

Distributed under the MIT License. See `LICENSE` file for more information.

## 👨 Author

**Your Name**
- GitHub: [@VinceSevilla](https://github.com/VinceSevilla)
- Email: sevillavinceanold@gmail.com
- LinkedIn: [Vince Sevilla](https://www.linkedin.com/in/vince-sevilla-87a048380/)

##  Acknowledgments

Special thanks to the following projects and resources:

- [Supabase](https://supabase.com/) - For the incredible backend platform
- [Mantine](https://mantine.dev/) - For the beautiful and accessible UI components
- [FullCalendar](https://fullcalendar.io/) - For the powerful calendar functionality
- [React](https://react.dev/) - For the amazing UI library
- [Vite](https://vitejs.dev/) - For the blazing-fast build tool
- [TypeScript](https://www.typescriptlang.org/) - For type safety
- All the open-source contributors who made this possible

##  Issues & Bug Reports

Found a bug? Have a feature request? Please [open an issue](https://github.com/VinceSevilla/reservation-project/issues) on GitHub.

##  Support

If you have any questions or need help getting started:

- 📧 Email: sevillavincearnold@gmail.com
- 💬 Open an issue on GitHub
- 📖 Check the documentation

---

<div align="center">

**If you find this project useful, please consider giving it a ⭐ on GitHub!**


[⬆ Back to Top](#-roomreserve)

</div>
