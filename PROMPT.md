
You are an expert frontend developer specializing in creating beautiful, modern, and interactive user interfaces with React and Next.js.

Your task is to create the code for the main dashboard page of "Disha Portal," an AI-powered career guidance platform for students in India. The name "Disha" means "direction" in Hindi, so the design should feel encouraging, clear, and focused on guiding students.

**Technology Stack (Strictly use only these):**
*   **Framework:** Next.js 14+ (using the App Router)
*   **Language:** TypeScript
*   **UI Library:** shadcn/ui. You must use its components (`Card`, `Button`, `Avatar`, `Progress`, `Badge`, etc.) for all UI elements.
*   **Styling:** Tailwind CSS. Use utility classes for styling and layout.
*   **Icons:** `lucide-react` library for all icons.
*   **Images:** Use placeholder images from `https://picsum.photos/<width>/<height>`.

**File to Create:**
*   `src/app/dashboard/page.tsx`

**Dashboard Page Structure & Key Elements:**

The dashboard should provide a personalized and welcoming overview for the logged-in student. It should be visually engaging and guide them to the key features of the platform.

1.  **Header Section:**
    *   A welcoming message, e.g., "Welcome back, [Student's Name]!"
    *   A motivational subheading, e.g., "Let's continue charting your path to success."
    *   Display the student's profile picture using the `Avatar` component.

2.  **Main Call-to-Action (CTA): The Quiz Card**
    *   This should be the most prominent element on the page.
    *   Create a large, visually appealing `Card` component.
    *   **If the student has NOT taken the quiz:**
        *   Title: "Find Your True Calling"
        *   Description: "Take our comprehensive AI-powered assessment to discover your perfect career path."
        *   Icon: A large `Lightbulb` icon from `lucide-react`.
        *   Button: A primary `Button` that says "Start Your Assessment" and links to `/quiz`.
    *   **If the student HAS taken the quiz:**
        *   Title: "Your Personalized Report is Ready!"
        *   Description: "Revisit your detailed career recommendations, college suggestions, and more."
        *   Icon: A large `Compass` icon from `lucide-react`.
        *   Button: A secondary `Button` that says "View My Report" and links to `/quiz`.

3.  **"Your Journey" Progress Tracker:**
    *   Create a section with the heading "Your Journey So Far."
    *   Visually represent the key steps a user should take on the platform. This could be a horizontal layout of cards or a timeline-like component.
    *   **Step 1: Complete Profile.** Show a `Progress` bar indicating profile completion percentage.
    *   **Step 2: Take the Quiz.** Show a checkmark or an "Incomplete" status.
    *   **Step 3: Explore Careers.** Encourage users to visit the `/courses` page.
    *   **Step 4: Find Colleges.** Encourage users to visit the `/colleges` page.

4.  **Quick Links / Feature Grid:**
    *   A grid of `Card` components that act as quick links to the most important features of the portal. Each card should have a `lucide-react` icon, a title, a brief description, and a link.
    *   **College Explorer:** Icon: `School`. Link to `/colleges`.
    *   **Career & Course Map:** Icon: `BookOpen`. Link to `/courses`.
    *   **Scholarship Finder:** Icon: `Award`. Link to `/scholarships`.
    *   **Important Timelines:** Icon: `Calendar`. Link to `/timeline`.

5.  **"Did You Know?" or "Resource Spotlight" Section:**
    *   A small, dynamic section to keep the dashboard engaging.
    *   Feature a single `Card` that could highlight a new study resource, an upcoming exam, or an interesting career fact.
    *   Title: "Resource Spotlight"
    *   Content: Display a featured resource with an image, description, and a "Learn More" button.

**Code Requirements:**
*   The entire page should be a single server or client component in `src/app/dashboard/page.tsx`.
*   The code must be well-structured, readable, and use modern React (functional components, hooks).
*   The page must be fully responsive and look great on both desktop and mobile devices.
*   Ensure all necessary components from `shadcn/ui` and icons from `lucide-react` are imported.
*   The code should be self-contained within the `page.tsx` file and should not require creating new components, but should be wrapped in the existing `AppLayout` component for consistent navigation.

Example of wrapping the page in `AppLayout`:
```tsx
import AppLayout from "@/components/layout/AppLayout";
// ... other imports

export default function DashboardPage() {
  return (
    <AppLayout>
      <main>
        {/* All your dashboard content goes here */}
      </main>
    </AppLayout>
  );
}
```

Please generate the complete, final code for the `src/app/dashboard/page.tsx` file based on these detailed requirements.
