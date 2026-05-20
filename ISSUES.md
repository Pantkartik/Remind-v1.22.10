# RemindKaro - Project Issues & Enhancements

This document outlines a backlog of features, enhancements, and beginner-friendly issues for **RemindKaro**. If you are looking to contribute to the project, the **Good First Issues** section is a great place to start!

---

## 🟢 Good First Issues
*These are relatively small, self-contained tasks perfect for new contributors or as quick wins.*

### 1. Task Sorting Options
**Description:** Currently, tasks on the dashboard are only sorted by deadline (earliest first). 
**Goal:** Add a dropdown menu to the dashboard that allows users to sort their tasks by:
- Deadline (Default)
- Priority (High -> Low)
- Date Created (Newest first)
- Alphabetical (A-Z)

### 2. "Clear Completed" Button
**Description:** There is no quick way to remove tasks once they are done.
**Goal:** Add a "Clear Completed" button that bulk-deletes or bulk-archives all tasks where the status is set to `Done`.

### 3. Improve Mobile Navigation
**Description:** The top navigation bar in the dashboard might feel cramped on very small mobile screens.
**Goal:** Implement a responsive "hamburger" menu for mobile viewports that hides/shows the navigation links cleanly.

### 4. Accessibility (a11y) Polish on Modals
**Description:** The Add Task and Edit Task modals need better accessibility support.
**Goal:** Ensure all `<input>`, `<select>`, and `<button>` elements have proper `aria-labels`, and ensure the user can close the modal using the `Escape` key.

### 5. Add a "Loading" State to NLP Input
**Description:** When a user types a natural language command (e.g., "Remind me to study tomorrow at 5pm"), the parsing happens on the server.
**Goal:** Show a small loading spinner or visual indicator while the `/api/voice/parse` endpoint is resolving the text into a structured task.

---

## 🚀 Future Enhancements (Core Features)
*These are larger, more complex features that will significantly improve the value of RemindKaro.*

### 1. Google Calendar Integration
**Description:** Users want to see their RemindKaro deadlines in their primary calendar app.
**Goal:** Implement Google OAuth to allow users to link their Google accounts. Automatically sync tasks with deadlines to the user's Google Calendar as events.

### 2. Advanced NLP for Recurring Tasks
**Description:** The current NLP parser uses `chrono-node` to extract dates, but does not fully support complex recurring logic.
**Goal:** Upgrade the parser to accurately interpret phrases like *"Remind me to go to the gym every Monday and Wednesday"* and map them to the database's `recurring` logic. 

### 3. Progressive Web App (PWA) & Push Notifications
**Description:** The escalation engine currently relies on the browser tab being open to play chimes or show browser alerts.
**Goal:** Configure Next.js as a Progressive Web App (PWA) with Service Workers. This will allow RemindKaro to send native push notifications to mobile phones and desktops even when the app is closed.

### 4. Custom Categories and Tags
**Description:** Tasks are currently limited to a few hardcoded categories (General, Work, Personal, etc.).
**Goal:** Create a new `Tag` model in the Prisma schema. Allow users to create custom tags with custom hex colors and assign multiple tags to a single task.

### 5. Task Sharing / Collaboration
**Description:** RemindKaro is strictly single-player.
**Goal:** Allow users to share a specific task or an entire "list" of tasks with another user via email. Add permission levels (View vs. Edit).

### 6. Sub-tasks System
**Description:** Large tasks cannot be broken down.
**Goal:** Allow a Task to have multiple "Sub-tasks" (essentially a checklist). The main task is only marked `Done` when all sub-tasks are checked off.

### 7. User Profile & Settings Page
**Description:** The app lacks a dedicated settings area.
**Goal:** Create a `/dashboard/settings` page where users can:
- Change their Name and Email.
- Change their password.
- Toggle between Light and Dark mode preferences.
- Configure default notification settings (e.g., "Always notify 1 hour before").
