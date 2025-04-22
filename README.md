# Primer Project

## Overview
The Primer project is a React-based application designed to showcase a collection of stories. It features a clean and modern user interface, with components for navigation, content display, and styling.

## Project Structure
The project is organized into the following directories and files:

- **public/**: Contains static assets such as logos.
  - `logo-light.png`: Light version of the application logo.
  - `logo-dark.png`: Dark version of the application logo.

- **src/**: Contains the source code for the application.
  - **assets/**: Non-component assets (e.g., decorative images).
  - **components/**: Reusable UI components.
    - `Header.jsx`: Renders the header section of the application.
    - `Footer.jsx`: Renders the footer section of the application.
    - `BorderFrame.jsx`: Optional component for framed sections.
  - **data/**: Contains mock data or data fetching logic.
    - `stories.js`: Exports an array of story objects for use in the application.
  - **pages/**: Page-level components.
    - `HomePage.jsx`: Main landing page of the application.
    - `LibraryPage.jsx`: Displays a collection of stories or resources.
    - `StoryReaderPage.jsx`: Allows users to read individual stories.
    - `AboutPage.jsx`: Provides information about the application or its creators.
  - **styles/**: Global styles and variables.
    - `global.css`: Contains global styles for the application.
  - `App.jsx`: Main application layout and routing logic.
  - `main.jsx`: Entry point of the application.

- **.gitignore**: Specifies files and directories to be ignored by version control.

- `index.html`: Main HTML file for the application.

- `package.json`: Contains metadata about the project, including dependencies and scripts.

- `vite.config.js`: Configuration for Vite, specifying how the application should be built and served.

## Getting Started
To get started with the Primer project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd primer
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to view the application.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.