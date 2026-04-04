# 🚌 **HIAST Transportation Tracker**
> _A comprehensive admin dashboard for managing drivers, buses, routes, and subscriptions, built with advanced real-time interactivity and strict role-based access control._

<div align="center">
  <img src="https://img.shields.io/badge/Language-English-blue?style=flat-square" alt="English">
  <a href="#">English Version</a> |
  <img src="https://img.shields.io/badge/Language-Arabic-green?style=flat-square" alt="Arabic">
  <a href="../README.md">Arabic Version</a>
</div>

---

## 📖 **Overview**
> _This project aims to digitize and automate transportation management through full control over fleets and routes. The application features real-time communications and advanced role-based access protection (RBAC)._

---

## 📋 **Table of Contents** <a id="toc"></a>
1. [✨ Key Features](#features)
2. [💻 Tech Stack](#tech-stack)
3. [🚀 Getting Started](#getting-started)
4. [📁 Project Structure](#project-structure)
5. [📜 License](#license)

---

## ✨ **Key Features** <a id="features"></a>
- **📡 Instant Notifications**: Integrated with SignalR for live data updates without page reloads.
- **🔐 Advanced Security**: Complete Role-Based Access system preventing unauthorized data modifications.
- **🛣️ Smart Fleet Management**: Full control over drivers, routes, stops, and subscriptions through a modern UI.
- **🛠️ Dynamic Error Handling**: Unified API helper intercepting HTTP errors and validation exceptions inherently.

<div align="center">
  <a href="#toc">🔝 Back to Top</a>
</div>

---

## 💻 **Tech Stack** <a id="tech-stack"></a>
- **React.js & TypeScript**: To develop the interactive and robust frontend architecture.
- **ReactQuery**: For robust caching, fetching, and data mutation management.
- **SignalR (WebSockets)**: Delivering seamless live alerts and bi-directional communications.
- **TailwindCSS & Shadcn**: Providing an esthetically pleasing and modern component library.
- **Vite**: Serving incredibly fast HMR and optimized builds.

<div align="center">
  <a href="#toc">🔝 Back to Top</a>
</div>

---

## 🚀 **Getting Started** <a id="getting-started"></a>

### Prerequisites
- [x] **Node.js (v18+)**
- [x] **pnpm** (Installed globally)

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Ahmad-J-Bary/hiast-transportation-ui.git
   cd HIAST.Transportation.UI
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start development mode:
   ```bash
   pnpm dev
   ```

<div align="center">
  <a href="#toc">🔝 Back to Top</a>
</div>

---

## 📁 **Project Structure** <a id="project-structure"></a>
 ```bash
 HIAST.Transportation.UI/
 ├── src/
 │   ├── components/       # Reusable graphical components
 │   ├── contexts/         # Access control & state context (AuthContext)
 │   ├── hooks/            # Custom Hooks for APIs
 │   ├── locales/          # Application translation catalogs
 │   ├── pages/            # Core feature dashboards
 │   ├── services/         # External communicators (signalRService, apiHelper)
 │   └── store/            # Local state persistence
 └── locales/              # English version of the README documentation
 ```

<div align="center">
  <a href="#toc">🔝 Back to Top</a>
</div>

---

## 📜 **License** <a id="license"></a>
This project is licensed under the MIT License. See the `LICENSE` file for details.

<div align="center">
  <a href="#toc">🔝 Back to Top</a>
</div>

<p align="center"> Developed with ❤️ by <a href="https://github.com/Ahmad-J-Bary">@Ahmad Abdelbary</a> </p>
