# Full-Stack Developer Capstone Project — Best Cars Dealership

A full-stack national car dealership web application built with **React**, **Django**, **Express/Node.js**, **MongoDB**, **SQLite**, and a **Flask NLTK Sentiment Analyzer** microservice, with CI/CD linting via GitHub Actions.

## Key Features
- Static informational pages (`Home`, `About Us`, `Contact Us`) styled with Bootstrap
- User Authentication (`Login`, `Logout`, `Register`) backed by Django Auth
- Car Make & Car Model management in Django Admin and REST endpoints (`/djangoapp/get_cars`)
- Dealership and Review REST microservice (`Express` + `MongoDB` / JSON seed data)
- Real-time Review Sentiment Analysis microservice (`Flask` + NLTK VADER)
- Interactive React UI to browse dealerships, filter by U.S. state, view dealer details & sentiment-tagged reviews, and submit new reviews
- Automated CI/CD linting workflow via GitHub Actions (`flake8` & `jshint`)
