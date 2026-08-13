# OS Process Scheduler

> A modern, interactive web application for visualizing and simulating CPU process scheduling algorithms.

---

📖 Introduction

**OS Process Scheduler** is an educational web application that demonstrates how various CPU scheduling algorithms work in an operating system. It allows users to simulate process execution, visualize scheduling timelines, and compare algorithm performance based on key metrics such as waiting time, turnaround time, and CPU utilization.

The project is designed to help students, educators, and operating system enthusiasts understand process scheduling concepts through an intuitive and interactive interface instead of relying solely on theoretical explanations.

---

🎯 Objectives

* Visualize CPU scheduling algorithms in real time.
* Compare the performance of different scheduling techniques.
* Help students understand process management concepts in operating systems.
* Provide an interactive learning experience through simulation.
* Demonstrate scheduling results using easy-to-understand visualizations.

---

 ✨ Features

* Interactive CPU scheduling simulation
* Support for multiple scheduling algorithms
* Process creation with Arrival Time, Burst Time, and Priority
* Gantt Chart visualization
* Automatic calculation of:

  * Waiting Time
  * Turnaround Time
  * Completion Time
  * Response Time
  * Average Waiting Time
  * Average Turnaround Time
* Responsive design for desktop, tablet, and mobile devices
* Fast performance powered by Vite
* Modern and intuitive user interface
* Reusable React components
* Type-safe development using TypeScript
* Utility-first styling with Tailwind CSS

---
⚙️ Supported Scheduling Algorithms

* First Come First Serve (FCFS)
* Shortest Job First (SJF)
* Shortest Remaining Time First (SRTF)
* Round Robin (RR)
* Priority Scheduling (Non-Preemptive)
* Priority Scheduling (Preemptive)

> *Update this list according to the algorithms implemented in your project.*

---

🛠️ Tech Stack

| Technology   | Purpose                         |
| ------------ | ------------------------------- |
| React        | Frontend Framework              |
| TypeScript   | Type Safety                     |
| Vite         | Build Tool & Development Server |
| Tailwind CSS | Styling                         |
| shadcn/ui    | UI Components                   |

---

📂 Project Structure

```text
project-root/
│
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, icons, fonts
│   ├── components/      # Reusable UI components
│   ├── pages/           # Application pages
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── styles/          # Global styles
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

🚀 Getting Started

### Prerequisites

Before running the project, ensure you have:

* Node.js (v18 or later recommended)
* npm or another compatible package manager

---

Installation

Clone the repository:

```bash
git clone https://github.com/your-username/your-repository.git
```

Navigate into the project directory:

```bash
cd your-repository
```

Install project dependencies:

```bash
npm install
```

---

▶️ Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available locally at:

```text
http://localhost:5173
```

---

📦 Build for Production

Generate an optimized production build:

```bash
npm run build
```

---

👀 Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

---

🧹 Available Scripts

| Command           | Description                |
| ----------------- | -------------------------- |
| `npm install`     | Install dependencies       |
| `npm run dev`     | Start development server   |
| `npm run build`   | Create production build    |
| `npm run preview` | Preview production build   |
| `npm run lint`    | Run linter (if configured) |

---

📱 Responsive Design

The application is fully responsive and optimized for:

* Desktop
* Laptop
* Tablet
* Mobile Devices

---

🔮 Future Improvements

* Additional scheduling algorithms
* Process import/export functionality
* Dark mode support
* Performance analytics dashboard
* Interactive algorithm comparison
* Animation controls
* Accessibility enhancements
* Unit and integration testing

---

🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your branch.
5. Submit a Pull Request.

---

📄 License

This project is licensed under the MIT License.

---


