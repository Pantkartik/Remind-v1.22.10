// app/layout.js
import "./globals.css";

export const metadata = {
  title: "RemindKaro — Smart AI Deadline & Reminders Dashboard",
  description: "Intelligent AI-powered deadline scheduler and reminder assistant. Track coding tests, assignments, interviews, and hackathons with native voice entry and smart urgency escalation.",
  keywords: ["remindkaro", "reminder", "deadline tracker", "ai scheduler", "assignment reminder", "hackathon submission tracker"],
  authors: [{ name: "RemindKaro Team" }]
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
