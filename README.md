# Campus Compass

Campus Compass is a simple university student portal prototype with a static frontend and a small Node.js file server. It includes a landing/auth preview screen and quick access to student tools for elective reviews, CGPA planning, placement resources, and campus events.

## Features

- Dummy login, sign-in, and sign-up preview flow
- Main portal menu for student services
- Elective reviews page
- CGPA calculator page
- Placement resources page
- Event tracker page

## Project Structure

```text
.
├── public/
│   ├── app.js
│   ├── cgpa.html
│   ├── electives.html
│   ├── events.html
│   ├── index.html
│   ├── placements.html
│   └── styles.css
├── Book 7.xlsx
├── package.json
└── server.js
```

## Run Locally

Install Node.js, then start the local server:

```bash
npm start
```

The app runs at:

```text
http://127.0.0.1:3000/
```

To start the server and open the browser automatically:

```bash
npm run dev
```

## Notes

This is a frontend prototype. Authentication is currently a placeholder flow for previewing the portal experience.
