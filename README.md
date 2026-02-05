
# SecBack Portfolio - CS Student (Cybersecurity + Backend)

A high-performance, professional portfolio focused on technical depth and security.

## Maintenance Guide

This site uses JSON files as a "Mini CMS" to make updates easy without touching components.

### 1. Update Projects
Edit `data/projects.json`.
- `slug`: Unique identifier used for the URL.
- `featured`: If true, project is shown at the top.
- `details`: Technical breakdown (Architecture, Security, etc.)

### 2. Update Certificates
Edit `data/certificates.json`.
- Place PDF files in `public/certificates/`.
- Update the `file` path in the JSON.

### 3. Update Resumes
Edit `data/resumes.json`.
- Point the `default`, `security`, and `backend` keys to your latest PDF paths.

### 4. Update Timeline
Edit `data/timeline.json` to add new education, jobs, or achievements.

## Security Features
- **Strict Content Security Policy**: Configured in meta tags (can be enhanced in production server).
- **No Secrets**: Zero environment variables needed for public data.
- **Sanitized Rendering**: Safe data handling in React.
- **Vulnerability Disclosure**: Linked `security.txt` placeholder.

## Local Development
```bash
npm install
npm run dev
```

## Deployment
Compatible with Vercel and Netlify. Ensure the `public` folder contains your PDFs.
