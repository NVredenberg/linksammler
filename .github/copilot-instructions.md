# AI Agent Instructions for Linksammler

## Project Overview
Linksammler is a web-based link collection application containerized with Docker. The application allows users to save and manage links with titles and preview images.

## Architecture
- Frontend: Simple single-page application in vanilla HTML/CSS/JavaScript
- Docker containerization for deployment (exposed on port 1810)
- Static file serving through container

### Key Files
- `app/index.html`: Main application interface with form for link submission
- `app/script.js`: Frontend JavaScript handling form submissions
- `app/style.css`: Application styling with clean, minimal design
- `docker-compose.yml`: Container orchestration with auto-restart policy

## Development Workflow
1. Local development:
   - Serve the `app` directory using any static file server
   - No build process required - direct HTML/CSS/JS editing

2. Docker deployment:
   ```bash
   docker-compose up --build
   ```
   - Access application at http://localhost:1810

## Conventions
- CSS: Uses flexbox for form layout
- JavaScript: Vanilla JS with event listeners
- Form validation: Native HTML5 validation (type="url" for links)

## Integration Points
- Container exposes port 1810 for web access
- No external API dependencies currently implemented
- Static file serving only

## Note
This is a basic implementation focused on frontend functionality. When adding features, maintain the current minimal approach using vanilla JavaScript and avoid introducing complex dependencies unless specifically requested.