# template.netlify

A simple "Hello World" static website with automated Netlify deployment and feature branch preview support.

The live site is at [https://griff-template.netlify.app/](https://griff-template.netlify.app/).

## Features

- 🌐 Simple static "Hello World" website
- 🚀 Automated deployment to Netlify via GitHub Actions
- 🔄 Feature branch preview deployments for PRs
- 📸 Automated before/after screenshot comparison on PRs
- 🔗 Direct preview links in PR comments
- 💻 Local development server

## Quick Start

### Running Locally

1. Clone the repository:
```bash
git clone https://github.com/dataGriff/template.netlify.git
cd template.netlify
```

2. Start the local development server:
```bash
npm start
```

This will start a local HTTP server on port 8080 and automatically open your browser to view the site.

Alternatively, you can open `index.html` directly in your browser or use any other HTTP server of your choice:
```bash
# Using Python 3
python -m http.server 8080

# Using Python 2
python -m SimpleHTTPServer 8080
```

## Netlify Setup

### Prerequisites

1. A Netlify account (sign up at [netlify.com](https://www.netlify.com))
2. A GitHub repository with this code

### Initial Netlify Site Setup

1. **Create a new site on Netlify:**
   - Log in to your Netlify account
   - Go to "Sites" and click "Add new site"
   - Choose "Import an existing project"
   - Connect to your GitHub repository
   - For build settings:
     - Build command: Leave empty or use `echo 'No build required'`
     - Publish directory: `.` (current directory)
   - Click "Deploy site"

2. **Get your Netlify credentials:**
   - **NETLIFY_SITE_ID**: 
     - Go to Site settings → General → Site details
     - Copy the "Site ID" (also called "API ID")
   
   - **NETLIFY_AUTH_TOKEN**:
     - Go to your Netlify User settings → Applications → Personal access tokens
     - Click "New access token"
     - Give it a descriptive name (e.g., "GitHub Actions Deploy")
     - Copy the generated token (save it securely, you won't see it again!)

3. **Add secrets to your GitHub repository:**
   - Go to your GitHub repository
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret" and add:
     - Name: `NETLIFY_AUTH_TOKEN`, Value: (your Netlify personal access token)
     - Name: `NETLIFY_SITE_ID`, Value: (your Netlify site ID)

## Deployment Workflow

### Production Deployment

The site automatically deploys to production when changes are pushed to the `main` branch:

1. Make your changes locally
2. Commit and push to `main`:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

3. GitHub Actions will automatically deploy to your production Netlify site
4. A commit comment will be added with the deployment URL

### Feature Branch Preview Deployment

When you create a pull request, a preview deployment is automatically created:

1. Create a new feature branch:
```bash
git checkout -b feature/my-new-feature
```

2. Make your changes and push:
```bash
git add .
git commit -m "Add new feature"
git push origin feature/my-new-feature
```

3. Create a Pull Request on GitHub

4. GitHub Actions will automatically:
   - Capture a "before" screenshot of the current main branch
   - Capture an "after" screenshot of your PR changes
   - Deploy a preview version of your site to Netlify
   - Add a comment to the PR with:
     - The preview URL for live testing
     - Side-by-side before/after screenshots for visual comparison
     - Screenshot artifacts available for download
   - Each new commit to the PR will update the preview and screenshots

5. Review the preview deployment before merging
   - Click the preview URL to interact with the live site
   - Compare the before/after screenshots to see visual changes
   - Download screenshot artifacts from the workflow run for detailed inspection

6. Once merged to `main`, the changes will be deployed to production

## Automated Development Lifecycle

This repository includes an automated development lifecycle that ensures quality and visibility for all changes:

### For Pull Requests

When you create or update a pull request, the workflow automatically:

1. **Captures "Before" State**: Takes a screenshot of the current production site (main branch)
2. **Captures "After" State**: Takes a screenshot of your changes (PR branch)
3. **Deploys Preview**: Creates a Netlify preview deployment of your changes
4. **Comments on PR**: Adds/updates a comment with:
   - 🔗 Direct link to the Netlify preview site
   - 📸 Before and after screenshots for visual comparison
   - 📦 Screenshot artifacts for download

This automated process ensures that:
- Visual changes are immediately visible without manual testing
- Reviewers can quickly assess the impact of changes
- Preview environments are always available for testing
- There's a clear visual history of what changed

### For Production Deploys

When changes are merged to `main`, the workflow:
- Deploys directly to production
- Adds a commit comment with the deployment URL

## Project Structure

```
template.netlify/
├── .github/
│   └── workflows/
│       └── netlify-deploy.yml   # GitHub Actions workflow for deployment
├── index.html                   # Main HTML file with "Hello World"
├── netlify.toml                 # Netlify configuration
├── package.json                 # NPM config with local server script
└── README.md                    # This file
```

## Configuration Files

### netlify.toml

Configures Netlify build and deployment settings. The current configuration specifies that the current directory should be published as-is with no build step required.

### .github/workflows/netlify-deploy.yml

GitHub Actions workflow that:
- Triggers on pushes to `main` (production deployment)
- Triggers on pull requests to `main` (preview deployment)
- Uses the `nwtgck/actions-netlify` action for deployment
- Adds deployment URLs as comments on PRs

## Troubleshooting

### Local Server Issues

- **Port already in use**: If port 8080 is already in use, the server will try another port automatically
- **npm not found**: Install Node.js from [nodejs.org](https://nodejs.org/)

### Deployment Issues

- **Deployment fails with "Unauthorized"**: Check that your `NETLIFY_AUTH_TOKEN` is correct
- **Deployment fails with "Site not found"**: Verify your `NETLIFY_SITE_ID` is correct
- **No preview comment on PR**: Ensure the GitHub Actions workflow has write permissions

## License

MIT
