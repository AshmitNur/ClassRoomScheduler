# Class Scheduler Pro - Codebase Documentation

This document provides a comprehensive guide to the **Class Scheduler Pro** codebase, designed to help you navigate and explain the application during your faculty demonstration.

## 1. Project Overview
**Class Scheduler Pro** is a modern web application for managing academic schedules. It allows users to manage courses, instructors, rooms, and automatically or manually generate class schedules while checking for conflicts.

**Tech Stack:**
- **Frontend Framework:** React (with TypeScript)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **Routing:** React Router DOM

---

## 2. Quick Start (How to Run)
To start the application for your demo:
1.  Navigate to the project folder.
2.  Double-click **`run-app.bat`**.
    *   *This script forces the installation of dependencies (if missing) and starts the development server.*
3.  Alternatively, open a terminal and run `npm run dev`.

---

## 3. Key Files & Logic Guide
Here is a breakdown of "Which file does what" to help you answer questions during the demo.

### **Core Application Logic**
*   **`src/context/ScheduleContext.tsx`** (CRITICAL)
    *   **What it does:** This is the "brain" of the application. It holds the global state for Courses, Instructors, Rooms, and the Schedule itself.
    *   **Key Logic:** It contains the functions to `add`, `update`, `delete` items and, most importantly, `validateScheduleEntry` which checks for conflicts (e.g., Double booking an instructor or room).
*   **`src/App.tsx`**
    *   **What it does:** The main entry point that sets up the **Router** (navigation between pages) and wraps the app in the `ScheduleProvider` so data is accessible everywhere.

### **Pages (Views)**
Located in `src/pages/`:
*   **`Dashboard.tsx`**: The home page showing stats (Total Courses, Instructors, etc.) and quick updates.
*   **`Courses.tsx`**: Interface to list, add, and edit Courses.
*   **`Instructors.tsx`**: Interface to manage Instructors.
*   **`Rooms.tsx`**: Interface to manage Rooms and their capacities.
*   **`CreateSchedule.tsx`**: The main workspace where you actually build the schedule (assigning courses to timeslots/rooms).
*   **`Timetable.tsx`**: A visual grid view of the finalized schedule.
*   **`Search.tsx`**: Functionality to filter and find specific classes or schedules.

### **Components (Building Blocks)**
Located in `src/components/`:
*   **`src/components/layout/MainLayout.tsx`**: Defines the common structure (Sidebar + Content Area) used on every page.
*   **`src/components/layout/Sidebar.tsx`**: The navigation menu on the left.
*   **`src/components/ui/`**: Reusable UI elements (Buttons, Inputs, Cards, Dialogs) ensuring a consistent design.

### **Data & Types**
*   **`src/data/initialData.ts`**: Contains dummy data (e.g., "Introduction to CS", "Professor Smith") so the app isn't empty when you first load it.
*   **`src/types/schedule.ts`**: Defines what a "Course" or "Instructor" looks like in code (e.g., A Course must have a `code`, `name`, and `credits`).

---

## 4. Common Demo Scenarios
If the faculty asks **"Where is the code for X?"**, use this cheat sheet:

| Feature | File Location |
| :--- | :--- |
| **Logic for detecting Conflicts** | `src/context/ScheduleContext.tsx` (Look for `validateScheduleEntry`) |
| **The Visual Schedule Grid** | `src/pages/Timetable.tsx` |
| **The Sidebar Menu** | `src/components/layout/Sidebar.tsx` |
| **Where data is stored** | In-memory (State) inside `ScheduleContext.tsx` |
| **Where initial data comes from** | `src/data/initialData.ts` |

---

## 5. System Architecture Diagrams
Included in the repository are markdown files describing the architecture:
- `HighLevelArchitecture.md`
- `ActivityDiagram.md`
- `UseCaseDiagram.md`
