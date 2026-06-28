# AI-OPS: AI-Driven Proactive IT Operations Using Intelligent Monitoring, Anomaly Detection and Predictive Analytics

[![React](https://img.shields.io/badge/Frontend-React%2018-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20Express-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Prometheus](https://img.shields.io/badge/Monitoring-Prometheus-orange?style=for-the-badge&logo=prometheus)](https://prometheus.io/)
[![Grafana](https://img.shields.io/badge/Visualization-Grafana-orange?style=for-the-badge&logo=grafana)](https://grafana.com/)
[![Docker](https://img.shields.io/badge/Orchestration-Docker%20Compose-blue?style=for-the-badge&logo=docker)](https://www.docker.com/)

AI-OPS is a comprehensive, production-grade simulator and demonstration platform for intelligent IT operations. The system integrates industry-standard observability tools (Prometheus and Grafana) with a custom React-based intelligent dashboard and a stateful Node.js metrics generator. It implements real-time anomaly detection, multi-metric event correlation, and natural language root cause analysis to reduce alert noise and accelerate incident resolution.

---

## 🚀 Key Features

1. **Futuristic Landing Page (`LandingPage.jsx`):** A sleek, modern entrance page with glowing animations and detailed academic project team information.
2. **Security Gateway (`LoginPage.jsx`):** A glassmorphic login gate securing the dashboard. Requires operator credentials to access the command center.
3. **Stateful Metrics Generation (`metricsGen.js`):** Simulates realistic application metrics (CPU, Memory, Latency, Error Rate, System Load, etc.) with normal Gaussian variation using the Box-Muller transform.
4. **Real Host Workstation Telemetry (`useMetricsPoller.js`):** Queries the Dockerized `node-exporter` running on the host machine using parallel PromQL queries to display actual hardware metrics. Includes automatic local emulation fallback if Prometheus is offline.
5. **Dual-Mode SVG Topology Map (`TopologyMap.jsx`):** 
   * **Application Server:** Visualizes the microservice network flow (`API Gateway` -> `Core Service` -> `Database` / `Downstream API`) with pulsing nodes showing failure propagation.
   * **Host Workstation:** Visualizes the physical monitoring ingestion pipeline (`Host Workstation` -> `Docker Engine` -> `Node Exporter` -> `Prometheus TSDB`).
6. **Smart Terminal Log (`AlertPanel.jsx`):** Displays live operational logs. Intelligently pauses auto-scrolling if the user scrolls up to inspect previous logs, and automatically resumes once the user scrolls back to the bottom.
7. **Incident Simulation & Recovery:** Inject 5 different incident profiles (Full Overload, CPU Spike, Service Overload, Dependency Failure, and Gradual CPU Escalation) and trigger a gradual 5-step recovery reset.

---

## 🛠️ Tech Stack

* **Frontend:** React 18, Tailwind CSS, Recharts, Lucide Icons, Axios
* **Backend:** Node.js, Express, `prom-client` (Prometheus client)
* **Monitoring & DevOps:** Prometheus, Grafana, Node Exporter, Docker, Docker Compose

---

## 📂 Project Structure

```text
AI-OPS/
├── backend/                  # Node.js Express Backend
│   ├── src/
│   │   ├── server.js         # Express server & Prometheus metrics registry
│   │   └── metricsGen.js     # Stateful metric generator (Gaussian noise + Spikes)
│   ├── Dockerfile
│   └── package.json
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/       # LoginPage, LandingPage, MetricCard, ControlPanel, AlertPanel, TopologyMap
│   │   ├── hooks/            # useMetricsPoller (with Prometheus & Host queries)
│   │   ├── utils/            # anomalyDetector, correlationEngine, insightsEngine
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   └── package.json
├── prometheus/               # Prometheus Configurations
│   ├── prometheus.yml        # Scrape configs for backend & node-exporter
│   └── alert_rules.yml       # Threshold alerting rules
├── grafana/                  # Grafana Auto-Provisioning
│   └── provisioning/         # Datasources & Dashboard definitions
├── docker-compose.yml        # Multi-service Docker orchestration
└── README.md
```

---

## 💻 How to Run the Project

### Method 1: Full Docker Compose (Recommended)
Ensure **Docker Desktop** is running, then execute the following command in the root directory:
```bash
docker compose up --build
```
Once started, access the services at:
* **React Dashboard:** `http://localhost:5173` (Login: `admin` / `admin`)
* **Grafana Dashboard:** `http://localhost:3000` (Login: `admin` / `admin`)
* **Prometheus UI:** `http://localhost:9090`
* **Node Exporter:** `http://localhost:9100`

---

### Method 2: Hybrid Local Mode (For Development & Testing)
This mode runs the frontend and backend locally for instant live reload, while keeping Prometheus, Grafana, and Node Exporter in Docker.

1. **Start the Monitoring Services in Docker:**
   ```bash
   docker compose up -d prometheus grafana alertmanager pushgateway node-exporter
   ```
2. **Start the Backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```
3. **Start the Frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.

---

## 👥 Team Workload Division

This project was designed, developed, and validated by a team of 4 members:

### 1. Tanishq Mohod (B400780331) — Lead Architect & Backend Engineer
* **Responsibilities:**
  * Designed the overall system architecture and container orchestration.
  * Developed the Node.js Express backend and the stateful metrics generator (`metricsGen.js`) using the Box-Muller transform.
  * Implemented the simulation and recovery REST APIs (`POST /api/simulate`, `POST /api/reset`).
  * Set up Docker Compose configurations for the multi-service stack.

### 2. Gayatri Parkhe (B400780302) — Frontend Developer & UI/UX Designer
* **Responsibilities:**
  * Designed and built the responsive, glassmorphic React dashboard.
  * Created the futuristic landing page (`LandingPage.jsx`) and security login gate (`LoginPage.jsx`).
  * Integrated Recharts to render real-time, animated sparkline charts for telemetry tracking.
  * Developed the `MetricCard`, `ControlPanel`, and `AlertPanel` components.

### 3. Vaishnavi Landge (B400780292) — DevOps & Observability Engineer
* **Responsibilities:**
  * Configured Prometheus scraping targets and evaluation intervals.
  * Wrote the Prometheus alerting rules (`alert_rules.yml`) for threshold breaches.
  * Set up Grafana datasource and dashboard provisioning.
  * Created the custom Grafana dashboard JSON containing time-series panels and the Composite System Health Score.
  * Integrated Node Exporter to capture host-level metrics.

### 4. Atharv Bhalerao (B400780272) — QA Lead & AIOps Logic Developer
* **Responsibilities:**
  * Developed the client-side `AnomalyDetector` and `CorrelationEngine` matching the project report equations.
  * Implemented the `InsightsEngine` to generate natural language root causes and remediation actions.
  * Built the custom React hook `useMetricsPoller` with a graceful API fallback and PromQL host scraping.
  * Conducted system testing, performance evaluation, and verified the 12 validation test cases.

