# Domis Gym

Domis Gym is a React Native Expo app for logging workouts to a cloud SQL database, supporting both single users and collaborative multi-user mentoring sessions.[web:28]

## Overview

Domis Gym helps users track workouts in real time and securely stores all data in a cloud-hosted SQL database for long-term progress tracking.[web:37] The app is built with **Expo** and React Native, making it easy to run on both iOS and Android devices from a single codebase.[web:11][web:14]

## Features

- Workout logging: Capture exercises, sets, reps, weights, notes, and timestamps for each workout session.[web:28]  
- Cloud SQL storage: Persist all workout data in a remote SQL database so data is safe across reinstalls and devices.[web:33]  
- Multi-user support: Allow multiple users to be logged in simultaneously for mentoring, coaching, or co-op workouts in the same environment.[web:30]  
- Single-user mode: Use the app as a personal workout tracker with your own account and private history.[web:7]  
- Cross-platform: Run the same codebase on iOS and Android using Expo tooling and workflows.[web:11]  

## Tech Stack

- **Frontend**: React Native with Expo for building and running the mobile app.[web:11][web:14]  
- Backend API: Node.js or similar REST/GraphQL service to communicate between the app and the database.[web:10]  
- Database: Cloud-hosted SQL database (e.g., PostgreSQL, MySQL, or similar) for relational data modeling of users, workouts, and sessions.[web:33]  
- Authentication: Token-based authentication (such as JWT) to manage multiple logged-in users securely.[web:10]  

## Getting Started

Clone the repository and install dependencies in your terminal.[web:28]  

git clone https://github.com/your-username/domis-gym.git  
cd domis-gym  
npm install  
# or  
yarn install  
npx expo start  

Open the Expo Go app on your device and scan the QR code to run Domis Gym.[web:8]  

## Use Cases

- Mentoring: Coaches or mentors log in alongside trainees to monitor workouts, suggest changes, and track progress together.[web:30]  
- Co-op workouts: Friends share a session, each tracking their own sets and reps while viewing shared workout context.[web:30]  
- Solo training: A single user logs workouts over time and uses historical data to adjust programs and goals.[web:7][web:10]  
