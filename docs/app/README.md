# App

What the site does and how its pages are organised.

## Pages

The site is a three-page static app with shared navigation. Each page has its own HTML, CSS, and JS file.

| Page | File | Title | Interactive Element |
| ---- | ---- | ----- | ------------------- |
| Home | `index.html` | Hello World | **Click Me** button — displays "Hello from Page 1!" |
| Page 2 | `page2.html` | Page 2 | **Text input + Submit** — greets the user by name |
| Page 3 | `page3.html` | Page 3 | **Counter** — increment, decrement, and reset buttons |

Every page includes a `<nav>` bar linking to all three pages.

## File Map

```
index.html   ← Home page
page1.css    ← Home styles
page1.js     ← Home interaction (click → message)

page2.html   ← Name-greeting page
page2.css    ← Page 2 styles
page2.js     ← Page 2 interaction (submit → greeting)

page3.html   ← Counter page
page3.css    ← Page 3 styles
page3.js     ← Page 3 interaction (increment/decrement/reset)

server.js    ← Local dev server (reads headers from netlify.toml)
netlify.toml ← Netlify config: headers, routing, build settings
```

## Interaction Details

### Home — Click Me

Clicking the button sets the `#message` element's text to "Hello from Page 1!".

### Page 2 — Name Greeting

1. User types a name into the text input.
2. Clicking **Submit** displays "Hello, {name}! Welcome to Page 2!".
3. If the input is blank, it prompts "Please enter your name."

### Page 3 — Counter

- **+** increments the counter.
- **−** decrements the counter.
- **Reset** sets the counter back to 0.

The counter value is held in a JS variable and rendered into the `#counter` element.
