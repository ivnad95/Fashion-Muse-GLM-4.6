# Detailed Fix Plan for Fashion Muse App

This document outlines the specific steps to address the issues reported by the user.

## 1. Fix Navigation Bar Settings Icon

*   **Issue:** The settings icon on the navigation bar is not working correctly.
*   **File to investigate:** `src/components/fashion-app/ui-elements/BottomNavigation.tsx`
*   **Plan:**
    1.  Inspect the code to understand how the settings icon is rendered and how its click handler is implemented.
    2.  Identify the cause of the issue (e.g., incorrect icon, missing click handler, or a bug in the state management).
    3.  Fix the issue by using the correct icon and ensuring the click handler correctly switches to the settings tab.

## 2. Fix Google Sign-in/up Screens

*   **Issue:** The Google sign-in/up screens are not working correctly.
*   **Files to investigate:** `src/lib/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, and any related UI components.
*   **Plan:**
    1.  Review the NextAuth.js configuration in `src/lib/auth.ts`.
    2.  Examine the API route for authentication.
    3.  Inspect the UI components responsible for the sign-in/up flow.
    4.  Identify and fix any bugs in the authentication logic or UI.

## 3. Improve Settings Page Components

*   **Issue:** The components on the settings page are not logically organized.
*   **File to investigate:** `src/components/fashion-app/screens/SettingsScreen.tsx`
*   **Plan:**
    1.  Analyze the existing layout and components on the settings page.
    2.  Reorganize the components into logical groups (e.g., Profile, API Key, etc.).
    3.  Improve the layout and styling to be more user-friendly, without changing the overall design aesthetic.

## 4. Remove iPhone Mockup Frame from Mobile View

*   **Issue:** The iPhone mockup frame is displayed on mobile devices.
*   **File to investigate:** `src/components/fashion-app/ui-elements/PhoneFrame.tsx`
*   **Plan:**
    1.  Use a CSS media query or a React hook to detect if the app is being viewed on a mobile device.
    2.  Conditionally render the `PhoneFrame` component only on desktop devices.

## 5. Verify and Fix Gemini Nano Integration

*   **Issue:** The Gemini nano integration may not be working correctly.
*   **Files to investigate:** `src/hooks/useImageGeneration.ts`, `src/app/api/generate/route.ts`
*   **Plan:**
    1.  Review the code that calls the Gemini API.
    2.  Ensure that the API key is being correctly and securely handled.
    3.  Verify that the API requests are correctly formatted and that the responses are correctly handled.
    4.  Implement robust error handling for API calls.

## 6. Verify and Fix Prisma Database Setup

*   **Issue:** The Prisma database may not be set up correctly.
*   **File to investigate:** `prisma/schema.prisma`
*   **Plan:**
    1.  Review the Prisma schema and ensure it matches the requirements of the application, as outlined in `IMPROVEMENT_PLAN.md`.
    2.  Verify the database connection and that migrations have been correctly applied.
    3.  Ensure that all necessary data models are present and correctly defined.

