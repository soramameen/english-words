# EngVocab - Engineering Vocabulary Flashcard App

A modern, mobile-responsive flashcard application built for mastering engineering vocabulary (English <-> Japanese). Designed for efficiency and persistence.

## 🚀 Features

### 🧠 Intelligent Study System
*   **3-Stage Learning Process**:
    *   🔵 **Learning**: New words you haven't memorized yet.
    *   🟡 **Reviewing**: Words you marked as "Got it" but need reinforcement.
    *   🟢 **Mastered**: Words you have completely memorized.
*   **Smart Navigation**:
    *   **Got it!**: Promotes word to the next stage.
    *   **Needs Work**: Demotes word to the previous stage.
    *   **Next / Skip**: Moves to the next word without changing status.

### 💾 Robust Persistence
*   **Auto-Save**: All progress is saved automatically to LocalStorage.
*   **Resume Capability**: Remembers exactly which card (index) you were looking at in each mode, so you can pick up right where you left off.
*   **Data Reset**: "Reset All Progress" available in Settings.

### 📱 User Experience (UX)
*   **3D Flip Animation**: Smooth CSS-based card flipping.
*   **Onboarding**: Pulsing "Help" button guide for first-time users.
*   **Responsive Design**: Optimized layout for both desktop and mobile screens.
*   **Help Modal**: Integrated guide explaining how to use the app.

## 🛠 Tech Stack

*   **Frontend**: React 19
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS v4 (PostCSS)
*   **Icons**: Lucide React
*   **Data Persistence**: Browser LocalStorage

## 📂 Project Structure

```
English/
├── src/
│   ├── components/
│   │   └── Flashcard.jsx    # Card component with 3D flip logic
│   ├── data/
│   │   └── vocabulary.json  # Converted vocabulary data
│   ├── App.jsx              # Main application logic & state management
│   └── index.css            # Tailwind v4 configuration & custom utilities
├── convert_data.py          # Script to convert raw text to JSON
├── package.json             # Project dependencies
└── README.md                # Project documentation
```

## 🔧 Setup & Running

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## 📝 Data Management

To update the vocabulary list:

1.  Edit `../raw_words.txt` (or the source text file).
2.  Run the conversion script:
    ```bash
    python3 convert_data.py
    ```
3.  The app will automatically reload with the new data.

## 🎨 Key Implementation Details

### State Architecture
The app uses a map-based state for efficiency:
*   `wordStatus`: Object `{ [id]: 'learning' | 'reviewing' | 'mastered' }`
*   `indices`: Object `{ learning: 5, reviewing: 2, mastered: 10 }` (Stores current position per mode)
*   `hasSeenHelp`: Boolean flag for the first-time user tutorial.

### 3D Flip Animation (CSS)
Used Tailwind v4 `@utility` directives to create smooth 3D transformations:
```css
@utility perspective-1000 {
  perspective: 1000px;
}
@utility rotate-y-180 {
  transform: rotateY(180deg);
}
```
