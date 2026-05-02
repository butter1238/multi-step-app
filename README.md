# Multi-Step Flow Mobile App

A comprehensive React Native Expo application that implements a guided multi-step user onboarding flow with backend integration and resume capability.

## 🎯 What I Built

I created a complete mobile application that guides users through a 5-step process to collect their preferences and settings. The app features conditional flows, data persistence, and a clean, modern UI.

### Key Features Implemented

#### ✅ Multi-Step Flow (4 Steps)

- **Step 1**: Age range selection (Under 18, 18-29, 30-45, 46+)
- **Step 2**: Main goal selection (Improve fitness, Advance career, Build better habits, Learn a skill)
- **Step 3**: Conditional focus area (shows only if "Improve fitness" or "Advance career" goal selected)
- **Step 4**: Preferences & notifications (app style, push notifications toggle, optional notes)

### ✅ Final Summary Screen (Step 5)

- Displays all user inputs in a clean summary view
- Shows:
  - Age range
  - Selected goal
  - Focus area (if applicable)
  - Preferences and notification settings
  - Optional notes
- Allows users to review their selections before completion
- Provides option to go back and edit responses
- Ensures final data is saved successfully

#### ✅ Progress Indicator

- Visual progress bar showing current step (e.g., "Step 2 of 4")
- Step titles that change based on current step
- Clear navigation with Next/Back buttons

#### ✅ Conditional Flow Logic

- Dynamic step count based on user choices
- If user selects "Improve fitness" or "Advance career" → extra focus step appears (4 steps total)
- If user selects other goals → skips to preferences step (3 steps total)
- Smart validation prevents proceeding without required inputs

#### ✅ Backend Integration

- **POST /progress**: Saves user progress to server
- **GET /progress**: Retrieves saved progress on app restart
- Express.js server with CORS support
- Automatic sync between local and server data

#### ✅ Resume Capability

- App automatically loads saved progress on restart
- Users can continue exactly where they left off
- "Loaded saved progress" message confirms successful resume

#### ✅ Error Handling & Offline Support

- Graceful handling of network failures
- "Retry sync" option when backend is unavailable
- Local storage ensures data never gets lost
- Clear error messages and success notifications

## 🛠 Tech Stack

- **Frontend**: React Native with Expo
- **Language**: TypeScript for type safety
- **Backend**: Node.js with Express.js
- **Storage**: AsyncStorage for local persistence
- **Styling**: React Native StyleSheet with platform-specific adjustments
- **State Management**: React hooks (useState, useEffect, useMemo)

## 🚀 How to Run

### Prerequisites

- Node.js installed
- Expo CLI: `npm install -g @expo/cli`
- Mobile device or emulator

### Backend Setup

```bash
# Start the backend server
npm run backend
```

This starts the Express server on port 3000 with API endpoints for progress management.

### App Setup

```bash
# Install dependencies
npm install

# Start the Expo development server
npx expo start
```

### Testing the App

1. Scan the QR code with Expo Go app on your phone
2. Or run on iOS Simulator/Android Emulator
3. Backend runs on `http://localhost:3000`

## 📱 App Flow

1. **Launch**: App checks for saved progress and loads it if available
2. **Step Navigation**: Users move through steps with validation
3. **Conditional Logic**: Extra steps appear based on selections
   - If "Improve fitness" or "Advance career" selected → 4 total steps
   - Otherwise → 3 total steps
4. **Data Persistence**: Every change saves to both local storage and backend
5. **Completion**: Success message confirms final save

## 🔧 API Endpoints

### POST /progress

Saves user progress data to the server.

```json
{
  "stepIndex": 2,
  "ageRange": "18-29",
  "goal": "Improve fitness",
  "extraFocus": "Cardio",
  "appStyle": "Light",
  "notifications": true,
  "notes": "Optional user notes",
  "updatedAt": "2026-05-03T10:30:00.000Z"
}
```

### GET /progress

Retrieves the most recent saved progress from the server.

## 📁 Project Structure

```
multi-step-app/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Main app logic and UI
│   │   └── _layout.tsx        # Tab navigation setup
│   ├── components/
│   │   ├── step-indicator.tsx # Progress indicator
│   │   └── option-button.tsx  # Reusable button component
│   └── lib/
│       └── progress.ts        # Backend API and local storage logic
├── server.js                  # Express backend server
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🎨 UI Design Decisions

- **Clean Cards**: Semi-transparent white cards with subtle shadows
- **Consistent Spacing**: 20px padding with proper margins
- **Platform Aware**: Different styling for iOS vs Android
- **Accessibility**: Proper contrast ratios and touch targets
- **Visual Feedback**: Green success messages, red error boxes
- **Modern Buttons**: Rounded corners with proper shadows and colors

## 🔄 State Management

- **Progress State**: Single source of truth for all user data
- **Step Logic**: Computed values for current step, total steps, validation
- **Persistence**: Automatic save on every state change
- **Error States**: Separate state for API errors and user messages
- **Loading States**: Proper loading indicators during async operations

## 🚨 Error Handling

- **Network Failures**: Shows retry option with clear error messages
- **Validation**: Prevents navigation without required inputs
- **Offline Mode**: App works without internet using local storage
- **User Feedback**: Clear success/error messages for all actions

## 📈 What I Learned

This project helped me master several key mobile development concepts:

1. **State Management**: Handling complex state with multiple dependencies
2. **Conditional Rendering**: Dynamic UI based on user choices
3. **API Integration**: Building and consuming REST APIs
4. **Data Persistence**: Local storage + server synchronization
5. **Error Boundaries**: Graceful failure handling
6. **Platform Differences**: iOS vs Android specific implementations
7. **User Experience**: Creating intuitive multi-step flows
8. **TypeScript**: Type-safe development practices

## 🎯 Assignment Requirements Met

- ✅ Multi-step flow with 3-4 steps (dynamic based on user choices)
- ✅ Progress indicator and visual feedback
- ✅ Conditional flows based on user input
- ✅ Backend API integration (POST/GET)
- ✅ Resume capability on app restart
- ✅ Error handling and retry mechanisms
- ✅ Local persistence for offline support
- ✅ Clean state management
- ✅ Modern, responsive UI
- ✅ React Native with Expo
- ✅ TypeScript implementation

## 🔮 Future Enhancements

If I had more time, I would add:

- User authentication
- Multiple language support
- Dark mode toggle
- Push notification implementation
- Data export functionality
- Advanced animations
- Unit tests
- CI/CD pipeline

---

**Built with ❤️ using React Native & Expo**

_Submission Date: May 3, 2026_

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
