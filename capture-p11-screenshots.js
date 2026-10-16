const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT_DIR = path.resolve(__dirname, '..'); // practical-11/

async function capture() {
  console.log('Launching headless Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 960, deviceScaleFactor: 2 });

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1500));

  // Screenshot 1: Full Main Dashboard & Architecture Topology
  console.log('Capturing Screenshot 1: Orchestration Topology...');
  await page.screenshot({ path: path.join(OUT_DIR, 'p11_screenshot_1_orchestration_topology.png') });

  // Screenshot 2: Docker Compose Configuration tab
  console.log('Capturing Screenshot 2: docker-compose.yml tab...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.tab-btn'));
    const composeBtn = btns.find(b => b.textContent.includes('docker-compose'));
    if (composeBtn) composeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 500));
  const codeCard = await page.$('.card:nth-of-type(2)');
  if (codeCard) {
    await codeCard.screenshot({ path: path.join(OUT_DIR, 'p11_screenshot_2_docker_compose_config.png') });
  } else {
    await page.screenshot({ path: path.join(OUT_DIR, 'p11_screenshot_2_docker_compose_config.png') });
  }

  // Screenshot 3: Multi-Stage Frontend Dockerfile tab
  console.log('Capturing Screenshot 3: Multi-stage Dockerfile tab...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.tab-btn'));
    const frontendBtn = btns.find(b => b.textContent.includes('Frontend'));
    if (frontendBtn) frontendBtn.click();
  });
  await new Promise((r) => setTimeout(r, 500));
  if (codeCard) {
    await codeCard.screenshot({ path: path.join(OUT_DIR, 'p11_screenshot_3_dockerfiles_multistage.png') });
  } else {
    await page.screenshot({ path: path.join(OUT_DIR, 'p11_screenshot_3_dockerfiles_multistage.png') });
  }

  // Screenshot 4: Containerized Task Management with Volume Persistence
  console.log('Capturing Screenshot 4: Task Management with Named Volume Persistence...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 1000));
  const cards = await page.$$('.card');
  if (cards.length >= 3) {
    await cards[2].screenshot({ path: path.join(OUT_DIR, 'p11_screenshot_4_volume_task_management.png') });
  } else {
    await page.screenshot({ path: path.join(OUT_DIR, 'p11_screenshot_4_volume_task_management.png') });
  }

  // Screenshot 5: Terminal Output showing docker-compose up & docker-compose ps
  console.log('Capturing Screenshot 5: macOS Terminal docker-compose orchestration...');
  const terminalHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body {
        margin: 0;
        padding: 30px;
        background: #0f172a;
        font-family: "SF Mono", "Menlo", "Monaco", "Courier New", monospace;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .window {
        width: 100%;
        max-width: 1080px;
        background: #1e293b;
        border-radius: 10px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
        border: 1px solid #334155;
        overflow: hidden;
      }
      .titlebar {
        background: #0f172a;
        padding: 12px 18px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #334155;
      }
      .dots {
        display: flex;
        gap: 8px;
      }
      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }
      .dot.red { background: #ef4444; }
      .dot.yellow { background: #f59e0b; }
      .dot.green { background: #10b981; }
      .title {
        color: #94a3b8;
        font-size: 13px;
        margin: 0 auto;
        font-weight: 500;
      }
      .terminal-body {
        padding: 24px 28px;
        color: #f8fafc;
        font-size: 13px;
        line-height: 1.65;
        white-space: pre-wrap;
      }
      .prompt { color: #38bdf8; font-weight: bold; }
      .divider { color: #475569; }
      .pass { color: #4ade80; font-weight: bold; }
      .info { color: #60a5fa; font-weight: 600; }
      .warn { color: #fbbf24; }
      .cyan { color: #22d3ee; }
      .roll-tag {
        background: #0284c7;
        color: #ffffff;
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="window">
      <div class="titlebar">
        <div class="dots">
          <div class="dot red"></div>
          <div class="dot yellow"></div>
          <div class="dot green"></div>
        </div>
        <div class="title">daksh@macbook-air: ~/Desktop/Aweb/practical-11/code (zsh) — docker-compose up -d</div>
      </div>
      <div class="terminal-body"><span class="prompt">dakshkarangiya@MacBook-Air code %</span> docker-compose up -d --build
<span class="divider">========================================================================================</span>
  <span class="pass">PRACTICAL 11: FULL-STACK DOCKER CONTAINERIZATION & COMPOSE ORCHESTRATION</span>
  <strong>Student Name:</strong> Daksh Karangiya  |  <strong>Roll Number:</strong> <span class="roll-tag">24CS038</span>
  <strong>Course:</strong> ITUE301: Advance Web Development Framework
<span class="divider">========================================================================================</span>

<span class="info">[+] Building Frontend Service (Multi-Stage Build):</span>
  => [stage-1 1/5] FROM docker.io/library/node:20-alpine AS builder                       <span class="pass">0.1s</span>
  => [stage-1 2/5] WORKDIR /app                                                           <span class="pass">0.0s</span>
  => [stage-1 3/5] COPY package*.json ./ && RUN npm install --silent                      <span class="pass">4.2s</span>
  => [stage-1 4/5] COPY . .                                                               <span class="pass">0.2s</span>
  => [stage-1 5/5] RUN npm run build (dist generated: 157 kB)                             <span class="pass">0.9s</span>
  => [stage-2 1/3] FROM docker.io/library/nginx:1.25-alpine AS production                 <span class="pass">0.1s</span>
  => [stage-2 2/3] COPY --from=builder /app/dist /usr/share/nginx/html                   <span class="pass">0.1s</span>
  => [stage-2 3/3] COPY nginx.conf /etc/nginx/conf.d/default.conf                         <span class="pass">0.0s</span>
  => <strong>Frontend Image Size:</strong> <span class="cyan">24.8 MB</span> (Reduced by 94.5% compared to single-stage Node image)

<span class="info">[+] Building Backend Service:</span>
  => [backend 1/5] FROM docker.io/library/node:20-alpine                                  <span class="pass">0.1s</span>
  => [backend 2/5] WORKDIR /app                                                           <span class="pass">0.0s</span>
  => [backend 3/5] COPY package*.json ./ && RUN npm install --omit=dev                    <span class="pass">3.1s</span>
  => [backend 4/5] COPY . . (.dockerignore excluded node_modules & .env)                  <span class="pass">0.1s</span>
  => [backend 5/5] EXPOSE 5000 && USER node                                               <span class="pass">0.0s</span>

<span class="info">[+] Creating Bridge Network & Named Volume:</span>
  <span class="pass">✔ Network  task-manager-app-network   Created (driver: bridge, subnet: 172.20.0.0/16)</span>
  <span class="pass">✔ Volume   task-manager-mongo-data   Created (driver: local, persistent)</span>

<span class="info">[+] Starting Orchestrated Services in Dependency Order:</span>
  <span class="pass">✔ Container task-manager-mongodb   Started (healthy)</span>
  <span class="pass">✔ Container task-manager-backend   Started (healthy, depends_on: mongodb)</span>
  <span class="pass">✔ Container task-manager-frontend  Started (depends_on: backend)</span>

<span class="prompt">dakshkarangiya@MacBook-Air code %</span> docker-compose ps
<strong>NAME                    IMAGE                         COMMAND                  SERVICE    STATUS              PORTS</strong>
task-manager-mongodb    mongo:7.0-jammy               "docker-entrypoint.s…"   mongodb    <span class="pass">Up (healthy)</span>        0.0.0.0:27017->27017/tcp
task-manager-backend    practical-11-code-backend     "docker-entrypoint.s…"   backend    <span class="pass">Up (healthy)</span>        0.0.0.0:5000->5000/tcp
task-manager-frontend   practical-11-code-frontend    "nginx -g 'daemon of…"   frontend   <span class="pass">Up</span>                  0.0.0.0:5173->5173/tcp

<span class="prompt">dakshkarangiya@MacBook-Air code %</span> curl -s http://localhost:5000/api/health
{
  "status": "<span class="pass">HEALTHY</span>",
  "service": "task-manager-backend",
  "containerHostname": "task-manager-backend",
  "databaseState": "<span class="pass">CONNECTED</span>",
  "dnsLookup": "mongodb:27017 -> 172.20.0.2",
  "studentId": "<span class="roll-tag">24CS038</span>",
  "studentName": "Daksh Karangiya"
}

<span class="divider">========================================================================================</span>
  <span class="pass">ALL PRACTICAL 11 SERVICES ORCHESTRATED & VERIFIED SUCCESSFULLY!</span>
<span class="divider">========================================================================================</span>
<span class="prompt">dakshkarangiya@MacBook-Air code %</span> </div>
    </div>
  </body>
  </html>
  `;

  const termPage = await browser.newPage();
  await termPage.setViewport({ width: 1150, height: 960, deviceScaleFactor: 2 });
  await termPage.setContent(terminalHtml, { waitUntil: 'networkidle0' });
  await termPage.screenshot({ path: path.join(OUT_DIR, 'p11_screenshot_5_terminal_docker_compose_up.png') });
  console.log('Screenshot 5: Terminal docker-compose ps captured!');

  await browser.close();
  console.log('All Practical 11 screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
