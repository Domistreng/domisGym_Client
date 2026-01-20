# Domis Gym

Domis Gym is a React Native Expo app for logging workouts to a cloud SQL database, supporting both single users and collaborative multi-user mentoring sessions.

## Overview

Domis Gym helps users track workouts in real time and securely stores all data in a cloud-hosted SQL database for long-term progress tracking. The app is built with **Expo** and React Native, making it easy to run on both iOS and Android devices from a single codebase.

## Features

- Workout logging: Capture exercises, sets, reps, weights, notes, and timestamps for each workout session.  
- Cloud SQL storage: Persist all workout data in a remote SQL database so data is safe across reinstalls and devices.  
- Multi-user support: Allow multiple users to be logged in simultaneously for mentoring, coaching, or co-op workouts in the same environment.  
- Single-user mode: Use the app as a personal workout tracker with your own account and private history.  
- Cross-platform: Run the same codebase on iOS and Android using Expo tooling and workflows.  

## Tech Stack

- **Frontend**: React Native with Expo for building and running the mobile app.  
- Backend API: Node.js or similar REST/GraphQL service to communicate between the app and the database.  
- Database: Cloud-hosted SQL database (e.g., PostgreSQL, MySQL, or similar) for relational data modeling of users, workouts, and sessions.  
- Authentication: Token-based authentication (such as JWT) to manage multiple logged-in users securely.  

## Getting Started

Clone the repository and install dependencies in your terminal:

```bash
git clone https://github.com/Domistreng/domisGym_Client
cd domis-gym-client
npm install
# or
yarn install
npx expo start
