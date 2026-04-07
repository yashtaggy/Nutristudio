# **App Name**: NutriNudge

## Core Features:

- Google Authenticated Access: Secure user registration and login using Firebase Authentication with Google integration, and allows user profile creation (name, age, dietary preference, health goal).
- AI-Powered Contextual Meal Recommender: A rule-based and contextual engine that uses generative AI to recommend personalized meals based on inputs (time, budget, goal, ingredients, hunger level), providing nutritional reasoning and 2-3 alternatives as a decision-support tool.
- Budget-Optimized Daily Meal Planning: Generates a nutritionally balanced, full-day meal plan (breakfast, lunch, dinner) that strictly adheres to the user's specified budget and health goals.
- Gamified User Dashboard: Displays daily meal recommendations, health score with progress bars, historical choices, and budget tracking, integrated with a vibrant, card-based UI featuring friendly microcopy and animated transitions.
- Nearby Healthy Eatery Finder: Utilizes the Google Maps API to help users discover healthy food options available in their current vicinity.
- User Profile and Preference Management: Stores and manages user profile details and dietary preferences in Firestore, enabling personalized recommendations.
- Meal History and Progress Tracking: Keeps a record of previous meal choices and user progress toward health goals, with data persistently stored in Firestore.

## Style Guidelines:

- Primary color: A sophisticated, vibrant green (#26D95F) to evoke health and vitality, suitable for accents and calls to action.
- Background color: A light, subtly greenish off-white (#ECF6EF), providing a clean and fresh base for the interface.
- Accent color: A lively yellowish-green (#85E619) for complementary highlights and engaging UI elements.
- Headline font: 'Space Grotesk' (sans-serif) for a modern, tech-inspired, and impactful aesthetic. Body font: 'Inter' (sans-serif) for high readability and a clean, objective feel across all textual content.
- Utilize a consistent set of friendly, outline-style icons to enhance clarity and visual appeal without clutter.
- Emphasize card-based layouts for recommendations and data display, promoting a clear hierarchy and engaging visual separation of content. Ensure responsive design for seamless experience across devices.
- Implement subtle, fast-paced animated transitions for navigation and state changes, contributing to a smooth and highly responsive user experience. Use micro-animations for gamified elements like progress bars and badge achievements.