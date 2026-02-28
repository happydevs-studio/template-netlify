# Architecture

Architecture structure and boundaries overview for this static Netlify app.

Notation: C4 (Context + Container).

## Scope

- Static HTML/CSS/JS pages served in production by Netlify.
- Local development and DAST use `server.js`.
- Security headers are defined in `netlify.toml` and applied both in Netlify and local server behavior.

## C4 – Level 1 (System Context)

```mermaid
flowchart LR
    U[User Browser]
    A[template-netlify site]
    N[Netlify Platform]
    G[GitHub Repository]

    U -->|HTTPS| A
    A -->|Hosted on| N
    G -->|Deploy pipeline updates site| N
```

## C4 – Level 2 (Container)

```mermaid
flowchart LR
    B[Browser]
    CDN[Netlify CDN + Static Hosting]
    APP[Static Assets\napp/index.html, app/features.html, app/tools.html, CSS, compiled JS]
    TOML[netlify.toml\nheaders + routing config]
    DEV[Local Node Server\nserver.js]

    B -->|Prod HTTPS requests| CDN
    CDN --> APP
    TOML -->|configures| CDN

    B -->|Local HTTP requests| DEV
    DEV --> APP
    TOML -->|header rules parsed by| DEV
```

## Request Flow (Minimal)

1. Browser requests a page.
2. In production, Netlify serves static files and applies configured headers.
3. In local/dev scanning, `server.js` serves static files and applies header rules parsed from `netlify.toml`.
