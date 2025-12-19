# Resume Builder

A professional resume builder application built with React, TypeScript, Vite, and Electron. Create, manage, and export multiple resume profiles with ease.

## Features

### 🎯 Multiple Profiles
- Create and manage multiple resume profiles (e.g., "Senior Engineer", "Manager Role")
- Quick profile switching with dropdown selector
- Duplicate existing profiles to save time
- Each profile remembers its own template preference

### 📝 Comprehensive Resume Builder
- **Personal Information**: Name, contact details, social links (LinkedIn, GitHub, website)
- **Professional Summary**: Highlight your career objectives
- **Work Experience**: Company, role, duration, description, and project highlights
- **Education**: Degrees, institutions, GPA, and dates
- **Skills**: Organized by categories:
  - Programming Languages
  - Frameworks & Libraries
  - Tools
  - AIML Models
  - Product Skills
  - Agile & Delivery
  - Analytics & Business
  - Soft Skills
  - Languages
  - Other
- **Personal Details**: Optional section for additional information

### 🎨 Professional Templates
- **Modern**: Clean and contemporary design
- **Classic**: Traditional professional layout
- **Minimal**: Simple and elegant style
- **Creative**: Eye-catching format

### 💾 Export Options
- **PDF Export**: Professional PDF output with proper formatting
- **DOCX Export**: Editable Microsoft Word documents
- Customizable filename based on your name

### 🔒 Data Persistence
- **Desktop (Electron)**: SQLite database for reliable local storage
- **Web Mode**: localStorage fallback for browser-based usage
- Auto-save functionality with debouncing (500ms)
- Automatic migration from single-profile to multi-profile system

### 👁️ Section Visibility
- Toggle visibility of any resume section
- Hide/show sections without deleting data
- Customize what appears in your final resume

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd resume_builder
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Desktop App (Electron - Recommended)

Start the Electron application in development mode:

```bash
npm run electron:dev
```

This will:
- Start the Vite development server
- Launch the Electron app with hot-reload
- Open DevTools for debugging
- Store data in SQLite database

### Web App (Browser)

Start the web version for browser-based usage:

```bash
npm run dev
```

Then open `http://localhost:5173` in your browser.

> **Note**: In web mode, data is stored in browser localStorage instead of SQLite.

## How to Use

### 1. Profile Management

#### Creating Your First Profile
- When you first launch the app, a "Default Profile" is automatically created
- Click the profile selector in the header to manage profiles

#### Creating Additional Profiles
1. Click the profile selector in the header
2. Select "Create New Profile"
3. Enter a descriptive name (e.g., "Senior Engineer", "Manager Role")
4. Click "Create"

#### Duplicating Profiles
1. Load the profile you want to duplicate
2. Click the profile selector
3. Select "Duplicate Current"
4. Enter a new name for the copy
5. All data (resume content + template) will be copied

#### Switching Between Profiles
1. Click the profile selector in the header
2. Select the profile you want to edit
3. The app will load all data for that profile

#### Renaming Profiles
1. Click the profile selector
2. Select "Rename Current"
3. Enter the new name

#### Deleting Profiles
1. Click the profile selector
2. Select "Delete Current"
3. Confirm the deletion
> **Note**: You cannot delete the last remaining profile

### 2. Building Your Resume

#### Personal Information
Fill in:
- Full Name
- Email Address
- Phone Number
- Location (optional)
- LinkedIn URL (optional)
- GitHub URL (optional)
- Website URL (optional)

#### Professional Summary
Write a brief summary (2-4 sentences) highlighting your experience and career goals.

#### Skills
1. Enter a skill name
2. Select a category from the dropdown
3. Click "Add" or press Enter
4. Skills are automatically grouped by category
5. Click the trash icon to remove a skill

#### Work Experience
1. Click "Add Work Experience"
2. Fill in:
   - Company name
   - Role/Position
   - Start date (YYYY-MM format)
   - End date or check "Currently working here"
   - Job description (optional)
   - Project highlights/responsibilities (add multiple)
3. Click "Add Project" to add bullet points
4. Use the visibility toggle to show/hide this section

#### Education
1. Click "Add Education"
2. Fill in:
   - Institution name
   - Degree type
   - Field of study
   - Start and end dates
   - GPA (optional)
3. Use the visibility toggle to show/hide this section

#### Personal Details (Optional)
Fill in any relevant personal information:
- Father's Name
- Date of Birth
- Gender
- Marital Status
- Languages Known
- Nationality

Use the visibility toggle if you don't want this section in your resume.

### 3. Choosing a Template

1. Scroll to the preview section on the right
2. Click one of the template buttons:
   - **Modern**: Contemporary design with blue accents
   - **Classic**: Traditional layout with serif fonts
   - **Minimal**: Clean and simple design
   - **Creative**: Bold and eye-catching

The template preference is saved per-profile.

### 4. Exporting Your Resume

#### Export as PDF
1. Click the green "Export PDF" button
2. Your resume will download as `YourName_resume.pdf`

#### Export as DOCX
1. Click the blue "Export DOCX" button
2. Your resume will download as `YourName_resume.docx`
3. You can further edit the document in Microsoft Word

### 5. Section Visibility

Each section has an eye icon:
- 👁️ **Visible**: Section will appear in exported resume
- 👁️‍🗨️ **Hidden**: Section is hidden but data is preserved

Use this to:
- Hide personal details for certain applications
- Temporarily remove sections without deleting data
- Customize resume content for different roles

### 6. Tips for Multiple Profiles

**Use Case: Senior Engineer vs. Manager Roles**

1. Create your main profile with all details
2. Duplicate it as "Manager Role"
3. In the Manager profile:
   - Update the professional summary to focus on leadership
   - Modify work experience descriptions to highlight management achievements
   - Adjust skills to emphasize product/business skills
   - Choose a different template if desired
4. Switch between profiles as needed when applying for different positions

## Building for Production

### Build Web App
```bash
npm run build
```

### Build Electron App

**For macOS:**
```bash
npm run electron:build:mac
```

**For Windows:**
```bash
npm run electron:build:win
```

**For Linux:**
```bash
npm run electron:build:linux
```

**For all platforms:**
```bash
npm run electron:build
```

Built applications will be in the `release/` directory.

## Data Storage

### Desktop App (Electron)
- Database location: `~/Library/Application Support/resume-app/resume.db` (macOS)
- Windows: `%APPDATA%/resume-app/resume.db`
- Linux: `~/.config/resume-app/resume.db`

### Web App
- Data stored in browser localStorage
- Key: `resume_builder_profile_*` and `resume_builder_profiles_list`

## Technology Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 7
- **Desktop**: Electron 39
- **Database**: better-sqlite3 (for Electron)
- **PDF Export**: @react-pdf/renderer
- **DOCX Export**: docx
- **Styling**: Tailwind CSS 3
- **Icons**: lucide-react
- **Routing**: react-router-dom

## Troubleshooting

### Electron app not starting
- Ensure all dependencies are installed: `npm install`
- Try rebuilding native modules: `npm run rebuild` or `npx electron-rebuild`

### Data not saving
- Check console for errors
- In Electron mode, ensure write permissions to app data directory
- In web mode, check browser localStorage is enabled

### Template not showing correctly
- Hard refresh the app (Cmd+Shift+R or Ctrl+Shift+R)
- Check browser console for errors

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
