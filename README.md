# AI-OPS: AI-Driven Proactive IT Operations Using Intelligent Monitoring, Anomaly Detection and Predictive Analytics

[![React](https://img.shields.io/badge/Frontend-React%2018-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20Express-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Prometheus](https://img.shields.io/badge/Monitoring-Prometheus-orange?style=for-the-badge&logo=prometheus)](https://prometheus.io/)
[![Grafana](https://img.shields.io/badge/Visualization-Grafana-orange?style=for-the-badge&logo=grafana)](https://grafana.com/)
[![Docker](https://img.shields.io/badge/Orchestration-Docker%20Compose-blue?style=for-the-badge&logo=docker)](https://www.docker.com/)

AI-OPS is a comprehensive, production-grade simulator and demonstration platform for intelligent IT operations. The system integrates industry-standard observability tools (Prometheus and Grafana) with a custom React-based intelligent dashboard and a stateful Node.js metrics generator. It implements real-time anomaly detection, multi-metric event correlation, and natural language root cause analysis to reduce alert noise and accelerate incident resolution.

---

## 🚀 Key Features

1. **Premium Long Landing Page (`LandingPage.jsx`):** A sleek, dark-themed, glassmorphic landing page inspired by modern DeFi command centers. Features floating interactive SVG node maps, a tech-stack marquee, and an academic showcase.
2. **Multi-User Security Gateway (`LoginPage.jsx`):** A secure login gate supporting multiple operator profiles.
3. **Stateful Metrics Generation (`metricsGen.js`):** Simulates realistic application metrics (CPU, Memory, Latency, Error Rate, System Load, etc.) with normal Gaussian variation using the Box-Muller transform.
4. **Real Host Workstation Telemetry (`useMetricsPoller.js`):** Queries the Dockerized `node-exporter` running on the host machine using parallel PromQL queries to display actual hardware metrics.
5. **Dual-Mode SVG Topology Map (`TopologyMap.jsx`):** 
   * **Application Server:** Visualizes the microservice network flow (`API Gateway` -> `Core Service` -> `Database` / `Downstream API`).
   * **Host Workstation:** Visualizes the physical monitoring ingestion pipeline (`Host Workstation` -> `Docker Engine` -> `Node Exporter` -> `Prometheus TSDB`).
6. **Smart Terminal Log (`AlertPanel.jsx`):** Displays live operational logs. Intelligently pauses auto-scrolling if the user scrolls up to inspect previous logs, and automatically resumes once the user scrolls back to the bottom.
7. **Telemetry Verification Hub (Modal):** A dedicated panel on the dashboard that displays active PromQL queries, live JSON payloads, and verification steps to prove to examiners that the data is genuine.

---

## 👥 Multi-User Authentication System

To demonstrate multi-tenant/multi-system monitoring, the application supports two distinct operator profiles. The system health dashboard automatically defaults to and configures itself for the system assigned to that operator.

| Operator ID | Security Key | Assigned Role | Default Monitored System |
| :--- | :--- | :--- | :--- |
| **`admin`** | `admin` | **System Administrator** | **Application Server** (Simulated Cluster) |
| **`operator`** | `operator` | **Field Engineer** | **Host Workstation** (Genuine Host PC Telemetry) |

---

## 🧪 How to Prove Telemetry is Genuine

External examiners often check if the metrics on the dashboard are real-time, genuine machine data rather than a mock loop. Here is how to prove it during your project defense:

### Method 1: CPU Stress Test (Immediate Visual Proof)
1. Log in to the dashboard as **`operator`** (which displays the **Host Workstation** telemetry).
2. Open a terminal on your host machine and run a CPU-intensive command to stress the processor:
   * **macOS/Linux:** Run `yes > /dev/null &` (you can run this 4 to 8 times in parallel to stress multiple cores).
   * **Windows (PowerShell):** Run `while ($true) {}` in multiple tabs.
3. Watch the **CPU Utilization** circular gauge on the dashboard immediately spike to 90%+ in real-time.
4. Terminate the stress processes:
   * **macOS/Linux:** Run `killall yes`.
   * **Windows:** Close the PowerShell windows.
5. Observe the CPU utilization gauge on the dashboard cool down back to normal levels.

### Method 2: Compare with Activity Monitor / Task Manager
Compare the CPU utilization percentage and the number of running processes shown on the **Host Workstation** dashboard with your operating system's native **Activity Monitor** (macOS) or **Task Manager** (Windows). They will match in real-time.

### Method 3: Direct Prometheus API Verification
Click the **"Verify Telemetry"** button in the dashboard header. This opens the **Telemetry Verification Hub**, which displays:
* The raw JSON payload currently scraped from Prometheus.
* The exact PromQL query being executed.
* The URL of the Prometheus server (`http://localhost:9090`). You can open this URL in another tab, paste the PromQL query (`100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[1m])) * 100)`), and show the examiner that the values match exactly.

---

## 🔌 How to Know if Prometheus is Offline

The frontend client-side poller (`useMetricsPoller`) sends a heartbeat query to the Prometheus API (`/prometheus/api/v1/query`) every 5 seconds.
* **If Prometheus is Online:** The status badge in the top right of the header displays a solid green **`PROMETHEUS`** indicator.
* **If Prometheus is Offline:**
  1. The status badge immediately switches to a pulsing yellow **`API FALLBACK`** indicator.
  2. A warning is printed in the live terminal log: `[WARN] Prometheus API unreachable. Switched to direct backend polling fallback.`
  3. The system gracefully redirects its data fetching to the backend Express server (`/api/health`) or uses local emulation for the host PC so the UI remains fully operational.

---

## 🐳 The Role of Docker in this Project

Docker is a critical component of the AI-OPS architecture, serving three main purposes:

1. **Isolation & Portability:** Setting up Prometheus, Grafana, Alertmanager, and Node Exporter manually on a host machine requires installing multiple binaries, managing system services, and configuring paths. Docker packages each of these tools into isolated, lightweight containers that run identically on macOS, Windows, or Linux.
2. **Reproducibility:** By defining the entire stack in `docker-compose.yml`, we guarantee that the database configurations, Grafana dashboards, and scraping intervals are identical for every developer and examiner. It eliminates the "it works on my machine" problem.
3. **Containerized Scraping:** The `node-exporter` container runs in the background, scraping hardware metrics from the host operating system and exposing them at port `9100`. The `prometheus` container then scrapes `node-exporter` over the internal Docker network (`http://node-exporter:9100/metrics`), simulating a real-world enterprise monitoring pipeline.

---

## 💻 Commands to Run the Project

### Method 1: Running with Docker Compose (Recommended)
Ensure **Docker Desktop** is running, then execute the following command in the root directory:
```bash
docker compose up --build
```
* **React Dashboard:** `http://localhost:5173` (Login: `admin` / `admin` or `operator` / `operator`)
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

## 🌐 Scaling for Remote Monitoring (Anywhere in the World)

To monitor your home PC or any remote server from anywhere, the architecture can be scaled as follows:

```mermaid
graph TD
    subgraph Home PC (Remote)
        NodeExporter[Node Exporter Container :9100]
    end
    
    subgraph Public Cloud (AWS / GCP / Azure)
        Prometheus[Prometheus Server :9090]
        Backend[Express Backend :3001]
        Frontend[React Dashboard :5173]
    end
    
    NodeExporter -->|1. Push Metrics OR Scraped via VPN| Prometheus
    Prometheus -->|2. Query PromQL| Backend
    Backend -->|3. Serve Telemetry| Frontend
    Operator((Operator Anywhere)) -->|4. Access HTTPS| Frontend
```

### Setup Steps:
1. **Deploy the Dashboard in the Cloud:** Host the React frontend, Node.js backend, and Prometheus on a public cloud VM (e.g., AWS EC2, GCP Compute Engine).
2. **Deploy the Exporter on the Home PC:** Run `node-exporter` on your home PC or target server.
3. **Establish a Secure Connection:** Prometheus needs to reach the remote `node-exporter` to scrape it. Since the home PC is behind a NAT/firewall, you can:
   * **Option A (VPN - Recommended):** Use a mesh VPN like **Tailscale** or **WireGuard** to put the cloud VM and the home PC on the same private network. Configure Prometheus to scrape the home PC's VPN IP (e.g., `100.x.x.x:9100`).
   * **Option B (Pushgateway):** Configure a script on the home PC to collect metrics and push them to the cloud-hosted **Prometheus Pushgateway** using HTTP POST requests. Prometheus will then scrape the Pushgateway locally.
4. **Access Anywhere:** You can now log into the cloud-hosted dashboard from your phone or laptop anywhere in the world and monitor your home PC's real-time health.

---

## 👥 Team Workload Division

This project was designed, developed, and validated by a team of 4 members:

### 1. Tanishq Mohod (B400780331) — Lead Architect & Backend Engineer
* **Responsibilities:**
  * Designed the overall system architecture and container orchestration.
  * Developed the Node.js Express backend and the stateful metrics generator (`metricsGen.js`) using the Box-Muller transform.
  * Implemented the simulation and recovery REST APIs (`POST /api/simulate`, `POST /api/reset`).
  * Set up Docker Compose configurations for the multi-service stack.

### 2. Vaishnavi Landge (B400780292) — Frontend Developer & UI/UX Designer
* **Responsibilities:**
  * Designed and built the responsive, glassmorphic React dashboard.
  * Created the futuristic landing page (`LandingPage.jsx`) and security login gate (`LoginPage.jsx`).
  * Integrated Recharts to render real-time, animated sparkline charts for telemetry tracking.
  * Developed the `MetricCard`, `ControlPanel`, and `AlertPanel` components.

### 3. Gayatri Parkhe (B400780302) — DevOps & Observability Engineer
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
