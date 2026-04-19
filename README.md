# AviaTek Mobile 🚀

AviaTek is a premium Learning Management System (LMS) specifically designed for the aviation industry. Built with a focus on high-performance, scalability, and an exceptional user experience, it caters to Flight Academies, Instructors, and Pilots.

## 🌟 Project Overview

The project provides a unified mobile platform to manage the entire lifecycle of pilot training. From ground school courses to flight tracking and academy administrative tasks, AviaTek streamlines complex aviation workflows into a modern, intuitive interface.

### Key Features
- **Multi-Role Dashboards**: Tailored experiences for Academies, Instructors, and Pilots.
- **Advanced Course Management**: Interactive lessons, progress tracking, and multimedia content.
- **Real-time Analytics**: Performance metrics for pilots and operational stats for academies.
- **Secure Authentication**: Robust session management and role-based access control.
- **Media Integration**: Seamless document and video handling via Cloudinary/Appwrite.

---

## 🏗 Architecture

AviaTek follows a modern, decoupled architecture designed for speed and reliability.

### 🎨 Frontend (Mobile)
- **Framework**: [React Native](https://reactnative.dev/) via [Expo](https://expo.dev/).
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) for file-based routing.
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native) for rapid, consistent UI development.
- **State Management**: React Context API for global UI state and authentication.
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest) for server state management and caching.

### ⚙️ Backend & Infrastructure
- **BaaS**: [Appwrite](https://appwrite.io/) handling Authentication, NoSQL Database, and File Storage.
- **Media Hosting**: Cloudinary for high-performance image and video delivery.
- **Logic Layer**: Modular controller-based approach on the backend (Node.js) for handling complex business logic.

---

## 📂 Project Structure

```text
AviaTek/
├── app/                  # Expo Router directory (Routing)
│   ├── (academy)/        # Academy-specific screens
│   ├── (pilot)/          # Pilot-specific screens
│   ├── (auth)/           # Authentication flow
│   ├── (admin)/          # Administrative controls
│   └── _layout.tsx       # Root layout & providers
├── components/           # Reusable UI components (Atomic design)
├── context/              # React Context (Auth, Theme, etc.)
├── lib/                  # Services & API Clients
│   ├── appwrite.ts       # Appwrite SDK configuration
│   ├── api/              # API wrapper functions
│   └── types.ts          # Global TypeScript definitions
├── constant/             # App constants (Colors, Icons, Config)
└── assets/               # Static resources (Images, Fonts)
```

---

## ❓ Why this Architecture?

### 1. File-Based Route Grouping (Expo Router)
We use route groups (e.g., `(pilot)`) to enforce **Role-Based Access Control (RBAC)** at the navigation level. This ensures that a user logged in as a pilot cannot accidentally access academy administrative routes, while keeping the code organized by business domain.

### 2. Server State vs. Client State
By using **TanStack Query**, we decouple server data from UI state. This provides:
- Automatic caching and background refetching.
- Simplified error and loading states across the app.
- Out-of-the-box performance optimizations.

### 3. NativeWind for Styling
Utility-first styling allows us to build complex, responsive layouts with minimal boilerplate. It ensures that our design tokens (colors, spacing, typography) are consistent across both iOS and Android platforms without writing thousands of lines of CSS-in-JS.

### 4. Appwrite for Rapid Development
Appwrite allows the team to focus on building features rather than managing database infrastructure. It provides built-in security, real-time events, and easy-to-manage storage buckets that fit perfectly with the aviation industry's data requirements.

---

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the root and add your Appwrite and Cloudinary credentials.

3. **Run the App**:
   ```bash
   npx expo start
   ```

---

## 🛠 Tech Stack Summary

| Layer | Technology |
|---|---|
| **Language** | TypeScript |
| **Mobile Framework** | React Native (Expo) |
| **Styling** | NativeWind (Tailwind CSS) |
| **Database/Auth** | Appwrite |
| **Server State** | TanStack Query |
| **Animation** | React Native Reanimated |
| **Media** | Cloudinary |

---

Developed with ✈️ for the next generation of aviators.
