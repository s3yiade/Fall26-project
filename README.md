# StudyHuddle – INFR3120 Fall 2026 Project (Part 1)

StudyHuddle helps students find and host group study sessions for their courses. Part 1 is the first release: a landing page with the site name and team logo, a button to create a study session, and a table of upcoming sessions stored in MongoDB.

**Live site:** [add your Render URL]
**Team:** TJ Adetunji, [Mario Onouha]

## Features in this release

| Page | Route | What it does |
| --- | --- | --- |
| Landing page | `GET /` | Logo, site name, "Host a Study Session" button, table of upcoming sessions |
| Create session | `GET /create` | Form to host a new study session |
| Save session | `POST /create` | Validates the form, saves to MongoDB, returns to the landing page |

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and paste your MongoDB Atlas connection string into `MONGO_URI`.
3. Start the server:
   ```bash
   npm start
   ```
4. Open http://localhost:3000

## Deploying on Render

- Build command: `npm install`
- Start command: `npm start`
- Environment variable: `MONGO_URI` = your Atlas connection string
- In MongoDB Atlas > Network Access, allow `0.0.0.0/0` so Render can connect.

## Project structure

- `app.js` – Express setup, MongoDB connection, middleware, error handling
- `config/db.js` – connects to MongoDB with Mongoose
- `models/StudySession.js` – study session schema
- `routes/index.js` – landing page and create routes
- `views/` – EJS templates (`partials/` holds the shared header and footer)
- `public/` – CSS and the team logo

## Sources and citations

- Project scaffold: express-generator (https://expressjs.com/en/starter/generator.html)
- Bootstrap 5.3 via jsDelivr CDN (https://getbootstrap.com)
- Font Awesome 6 Free via cdnjs (https://fontawesome.com)
- Mongoose ODM (https://mongoosejs.com)
- INFR3120 lecture code
- Team logo: original design created for this project using logo generator
