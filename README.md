# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).


# RigAI

[![React Native](https://img.shields.io/badge/React_Native-Expo_Router-blue?logo=react&style=flat-square)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript&style=flat-square)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-green?logo=supabase&style=flat-square)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)](LICENSE)

RigAI is a mobile benchmarking and hardware analysis utility designed to assist PC builders, gamers, and developers in evaluating hardware performance. Built with React Native (Expo), TypeScript, and backed by Supabase, the application calculates synthetic benchmark projections, evaluates game compatibility thresholds, and determines system viability for running quantized local language models directly on mobile.

---

## Core Features

* **Hardware Performance Projections:** Estimates synthetic performance metrics and identifies hardware balance across CPU and GPU pairings.
* **Game Compatibility Assessment:** Evaluates target system configurations against game system requirements to project frame rate and resolution tiers.
* **Local LLM Readiness Engine:** Analyzes VRAM capacity and system memory thresholds to check compatibility with open-source large language models (quantization tiers, context limits, and parameter scales).
* **Cloud Database Integration:** Uses Supabase for storing and retrieving up-to-date component specifications and compatibility data.
* **Modular Mobile Architecture:** Built on Expo Router with strict TypeScript typings and file-based navigation.

---

## Tech Stack

* **Frontend Framework:** React Native, Expo, Expo Router
* **Language:** TypeScript
* **State Management:** Zustand
* **Backend and Database:** Supabase (PostgreSQL)

---

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
