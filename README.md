# TECHTRAIN - Online Learning Platform

TECHTRAIN is a comprehensive online learning platform built with HTML, CSS (Tailwind), and JavaScript. This platform offers a complete learning experience with course browsing, enrollment, video lessons, testing, and certification.

## Features

### User Management
- User registration and login system
- Student dashboard with personalized content
- Profile management

### Course Management
- Browse courses by category
- Course details with descriptions and ratings
- Add courses to cart and checkout
- Bookmark favorite courses

### Learning Experience
- Video-based lessons with progress tracking
- Interactive tests for each course
- Certificate generation upon course completion
- Learning notes for each video lesson
- Study timer/Pomodoro technique

### Progress Tracking
- Visual progress indicators
- Learning history
- Statistics dashboard with detailed analytics
- Achievements and badges system

### Additional Features
- Dark mode support
- Responsive design for all devices
- Search functionality with Fuse.js
- Social sharing of certificates

## New Statistics Feature

The statistics page provides detailed insights into learning progress and achievements:

- Summary cards showing total courses, completed courses, learning time, and certificates earned
- Progress over time visualization
- Course category distribution charts
- Weekly activity tracking
- Top courses by progress

## File Structure

```
├── index.html              # Homepage
├── courses.html            # Course listing
├── course.html             # Course details
├── student.html            # Student dashboard
├── learning.html           # Course learning page
├── statistics.html         # Learning statistics
├── bookmarks.html          # Saved courses
├── history.html            # Learning history
├── timer.html              # Study timer
├── contact.html            # Contact page
├── login.html              # User login
├── register.html           # User registration
├── cart.html               # Shopping cart
├── checkout.html           # Checkout process
├── data/
│   └── cursos.json         # Course data
├── css/
│   └── style.css           # Custom styles
└── js/
    ├── main.js             # Main JavaScript functions
    ├── courses.js          # Course page functionality
    ├── login.js            # Authentication
    ├── register.js         # Registration
    ├── cart.js             # Cart functionality
    ├── checkout.js         # Checkout process
    ├── learning.js         # Learning page functionality
    ├── statistics.js       # Statistics page
    ├── bookmarks.js        # Bookmarks functionality
    ├── history.js          # Learning history
    └── timer.js            # Study timer
```

## Getting Started

1. Clone the repository
2. Open `index.html` in a web browser
3. Register a new account or login with existing credentials
4. Browse courses and add to cart
5. Complete checkout process
6. Access courses through the student dashboard
7. View learning statistics in the Statistics section

## Technologies Used

- HTML5
- CSS3 with Tailwind CSS
- JavaScript (ES6+)
- localStorage for data persistence
- Chart.js for data visualization
- Fuse.js for search functionality

## Deployment

This is a static website that can be deployed on any web server or hosting platform that supports static files, including GitHub Pages.

## License

This project is for educational purposes and demonstrates a complete frontend application for an online learning platform.