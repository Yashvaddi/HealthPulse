# HealthPulse - Enterprise B2B Healthcare SaaS

HealthPulse is a high-performance, clinical-grade management platform engineered for scalability, maintainability, and cinematic user experience. This project demonstrates a **Modern Modular Architecture** (Micro-frontend ready) designed to handle complex healthcare workflows while ensuring high code quality and performance.

---

## 🏗️ Architectural Philosophy: Modular & Scalable

Unlike traditional monolithic React apps, HealthPulse is built using a **Feature-First (Domain-Driven) Architecture**. This approach treats the codebase as a collection of independent modules, significantly reducing cognitive load and making the system "Micro-frontend ready."

### 📂 Directory Breakdown
- **`src/features/`**: The core of the application. Each directory (Auth, Patients, Dashboard, Analytics) is a self-contained module containing its own pages, components, and logic.
- **`src/shared/`**: Contains truly reusable infrastructure.
    - **`components/ui/`**: A library of primitive, presentational UI components (Atomic Design).
    - **`hooks/`**: Shared side-effect logic (Theme, Notifications, Data fetching).
    - **`store/`**: Global state management using Zustand with persistent middleware.
    - **`services/`**: Low-level integrations (Firebase, Audit Logs, Service Workers).
    - **`config/`**: Centralized source of truth for routes, constants, and clinical thresholds.

---

## 🛠️ Technical Implementation & Rationale

### 1. Performance Engineering (Optimization)
- **Route-Level Code Splitting**: Implemented using `React.lazy` and `Suspense`. This ensures users only download the code they need for the current view, dramatically reducing initial bundle size and improving "Time to Interactive."
- **Strategic Memoization**: Components are wrapped in `React.memo` and expensive callbacks use `useCallback`. This prevents unnecessary re-renders in data-heavy views like the Dashboard and Patient Registry.
- **Stable References**: Chart configurations and static data arrays are defined outside component bodies to prevent memory churn and re-calculation on every render cycle.

### 2. State Management Strategy
- **Zustand with Persistence**: We use a lightweight, hook-based state manager. Crucial user preferences (Theme, ViewMode) and patient records are synced with `localStorage` using the `persist` middleware, ensuring data integrity across page refreshes.
- **Slice-like Organization**: Although stored in a single store, logic is grouped into logical "slices" (Auth, UI, Patients) for better readability.

### 3. Reusable UI Primitive System
- To ensure visual consistency and reduce "CSS debt," we extracted common UI patterns into a set of primitives. 
- **The "Why":** Instead of repeating complex Tailwind strings for a "Badge" or "StatCard," we use a single source of truth. This makes global UI updates (like changing a primary color or border radius) a single-line change.

### 4. HIPAA Compliance & Security (Simulated)
- **Audit Logging**: Every critical action (Login, Patient View/Delete) is tracked via a dedicated `Audit Service` that logs events to Firebase Firestore.
- **Auto-Logout (Idle Timer)**: A custom `useIdleTimer` hook monitors user activity. If the session is idle for 15 minutes (configurable), the user is automatically logged out to protect sensitive clinical data.

---

## 🚀 Key Features

- **Clinical Command Center**: High-density medical dashboard with real-time telemetry.
- **Intelligent Patient Registry**: Advanced filtering system with Grid/List view toggles.
- **Clinical Analytics**: Specialty distribution charts and institutional success velocity tracking.
- **Real-time Notifications**: Background service worker integration for system-wide clinical alerts.
- **Dynamic Theming**: Cinematic dark/light mode transition with persistent state.

---

## ⚙️ Development & Setup

1. **Environment Config**:
   Rename `.env.example` to `.env` and provide your Firebase credentials.

2. **Installation**:
   ```bash
   npm install
   ```

3. **Development**:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   ```

---

### 👨‍💻 Engineering Standards
- **TypeScript**: Strict typing for all data models and component props.
- **Clean Code**: SOLID principles followed across hooks and services.
- **Premium UX**: Framer Motion for micro-interactions and cinematic transitions.
