import { useRef, useEffect, useState } from 'react';
import { Gamepad2, AlertTriangle, Maximize2, Minimize2 } from 'lucide-react';

interface GameRendererProps {
    gamePayload: string;
}

function getSnakeGameHTML(): string {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #0a0a0f;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-family: 'Courier New', monospace;
    color: #39ff14;
    overflow: hidden;
  }
  #info {
    display: flex;
    gap: 24px;
    margin-bottom: 10px;
    font-size: 13px;
    letter-spacing: 1px;
  }
  #info span { color: #39ff14; }
  #info .val { color: #fff; font-weight: bold; }
  canvas {
    border: 1px solid #39ff1440;
    box-shadow: 0 0 20px #39ff1430, 0 0 40px #39ff1415;
    display: block;
  }
  #msg {
    margin-top: 10px;
    font-size: 12px;
    color: #39ff1480;
    letter-spacing: 1px;
  }
  #overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #0a0a0fcc;
    font-size: 14px;
    gap: 8px;
  }
  #overlay h2 { font-size: 22px; color: #39ff14; text-shadow: 0 0 10px #39ff14; }
  #overlay p { color: #aaa; font-size: 12px; }
  #overlay button {
    margin-top: 8px;
    padding: 8px 24px;
    background: transparent;
    border: 1px solid #39ff14;
    color: #39ff14;
    font-family: 'Courier New', monospace;
    font-size: 13px;
    cursor: pointer;
    letter-spacing: 1px;
    transition: all 0.2s;
  }
  #overlay button:hover { background: #39ff1420; box-shadow: 0 0 10px #39ff1440; }
</style>
</head>
<body>
<div id="info">
  <span>SCORE: <span class="val" id="score">0</span></span>
  <span>HIGH: <span class="val" id="high">0</span></span>
  <span>LEVEL: <span class="val" id="level">1</span></span>
</div>
<canvas id="c" width="320" height="320"></canvas>
<div id="msg">ARROW KEYS or WASD to move</div>
<div id="overlay">
  <h2>🐍 SNAKE</h2>
  <p>Use arrow keys or WASD</p>
  <button id="startBtn">PRESS TO START</button>
</div>
<script>
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const startBtn = document.getElementById('startBtn');
const scoreEl = document.getElementById('score');
const highEl = document.getElementById('high');
const levelEl = document.getElementById('level');

const GRID = 16;
const COLS = canvas.width / GRID;
const ROWS = canvas.height / GRID;

let snake, dir, nextDir, food, score, highScore = 0, level, speed, gameLoop, running = false;

function init() {
  snake = [{x: 10, y: 10}, {x: 9, y: 10}, {x: 8, y: 10}];
  dir = {x: 1, y: 0};
  nextDir = {x: 1, y: 0};
  score = 0;
  level = 1;
  speed = 150;
  placeFood();
  scoreEl.textContent = 0;
  levelEl.textContent = 1;
}

function placeFood() {
  let pos;
  do {
    pos = {x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS)};
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  food = pos;
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid dots
  ctx.fillStyle = '#39ff1410';
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      ctx.fillRect(x * GRID + GRID/2 - 1, y * GRID + GRID/2 - 1, 2, 2);
    }
  }

  // Food
  ctx.shadowBlur = 12;
  ctx.shadowColor = '#ff4444';
  ctx.fillStyle = '#ff4444';
  ctx.beginPath();
  ctx.arc(food.x * GRID + GRID/2, food.y * GRID + GRID/2, GRID/2 - 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Snake
  snake.forEach((seg, i) => {
    const alpha = i === 0 ? 1 : Math.max(0.3, 1 - i * 0.04);
    ctx.shadowBlur = i === 0 ? 14 : 4;
    ctx.shadowColor = '#39ff14';
    ctx.fillStyle = i === 0 ? '#39ff14' : \`rgba(57,255,20,\${alpha})\`;
    const pad = i === 0 ? 1 : 2;
    ctx.fillRect(seg.x * GRID + pad, seg.y * GRID + pad, GRID - pad*2, GRID - pad*2);
  });
  ctx.shadowBlur = 0;
}

function step() {
  dir = nextDir;
  const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};

  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || snake.some(s => s.x === head.x && s.y === head.y)) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10 * level;
    scoreEl.textContent = score;
    if (score > highScore) { highScore = score; highEl.textContent = highScore; }
    if (score % 50 === 0) {
      level++;
      levelEl.textContent = level;
      speed = Math.max(60, speed - 15);
      clearInterval(gameLoop);
      gameLoop = setInterval(step, speed);
    }
    placeFood();
  } else {
    snake.pop();
  }
  draw();
}

function endGame() {
  running = false;
  clearInterval(gameLoop);
  overlay.style.display = 'flex';
  overlay.innerHTML = \`
    <h2>GAME OVER</h2>
    <p>Score: \${score} | High: \${highScore}</p>
    <button id="startBtn" onclick="startGame()">PLAY AGAIN</button>
  \`;
}

function startGame() {
  overlay.style.display = 'none';
  init();
  running = true;
  clearInterval(gameLoop);
  gameLoop = setInterval(step, speed);
  draw();
}

document.addEventListener('keydown', e => {
  if (!running) { if (e.key === 'Enter' || e.key === ' ') startGame(); return; }
  const map = {
    ArrowUp: {x:0,y:-1}, ArrowDown: {x:0,y:1}, ArrowLeft: {x:-1,y:0}, ArrowRight: {x:1,y:0},
    w: {x:0,y:-1}, s: {x:0,y:1}, a: {x:-1,y:0}, d: {x:1,y:0},
    W: {x:0,y:-1}, S: {x:0,y:1}, A: {x:-1,y:0}, D: {x:1,y:0}
  };
  const nd = map[e.key];
  if (nd && !(nd.x === -dir.x && nd.y === -dir.y)) {
    nextDir = nd;
    e.preventDefault();
  }
});

startBtn.addEventListener('click', startGame);
draw();
</script>
</body>
</html>`;
}

function getPongGameHTML(): string {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #0a0a0f;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-family: 'Courier New', monospace;
    color: #00e5ff;
    overflow: hidden;
  }
  #info {
    display: flex;
    gap: 40px;
    margin-bottom: 10px;
    font-size: 13px;
    letter-spacing: 1px;
  }
  canvas {
    border: 1px solid #00e5ff30;
    box-shadow: 0 0 20px #00e5ff25, 0 0 40px #00e5ff10;
    display: block;
  }
  #msg { margin-top: 10px; font-size: 12px; color: #00e5ff60; letter-spacing: 1px; }
  #overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #0a0a0fcc;
    gap: 8px;
  }
  #overlay h2 { font-size: 22px; color: #00e5ff; text-shadow: 0 0 10px #00e5ff; }
  #overlay p { color: #aaa; font-size: 12px; }
  #overlay button {
    margin-top: 8px;
    padding: 8px 24px;
    background: transparent;
    border: 1px solid #00e5ff;
    color: #00e5ff;
    font-family: 'Courier New', monospace;
    font-size: 13px;
    cursor: pointer;
    letter-spacing: 1px;
    transition: all 0.2s;
  }
  #overlay button:hover { background: #00e5ff20; box-shadow: 0 0 10px #00e5ff40; }
</style>
</head>
<body>
<div id="info">
  <span>YOU: <b id="ps">0</b></span>
  <span>CPU: <b id="cs">0</b></span>
</div>
<canvas id="c" width="400" height="280"></canvas>
<div id="msg">W/S or ↑/↓ to move your paddle</div>
<div id="overlay">
  <h2>🏓 PONG</h2>
  <p>W/S or Arrow keys to move</p>
  <button id="startBtn">PRESS TO START</button>
</div>
<script>
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const psEl = document.getElementById('ps');
const csEl = document.getElementById('cs');

const W = canvas.width, H = canvas.height;
const PW = 10, PH = 60, BALL = 8, SPEED = 3.5;

let player, cpu, ball, pScore, cScore, keys = {}, running = false, raf;

function init() {
  player = {x: 12, y: H/2 - PH/2, dy: 0};
  cpu = {x: W - 12 - PW, y: H/2 - PH/2};
  ball = {x: W/2, y: H/2, vx: SPEED * (Math.random() > 0.5 ? 1 : -1), vy: SPEED * (Math.random() > 0.5 ? 0.8 : -0.8)};
  pScore = 0; cScore = 0;
  psEl.textContent = 0; csEl.textContent = 0;
}

function drawRect(x, y, w, h, color, glow) {
  ctx.shadowBlur = glow || 0;
  ctx.shadowColor = color;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  ctx.shadowBlur = 0;
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, W, H);

  // Center line
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = '#ffffff15';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W/2, 0);
  ctx.lineTo(W/2, H);
  ctx.stroke();
  ctx.setLineDash([]);

  drawRect(player.x, player.y, PW, PH, '#00e5ff', 12);
  drawRect(cpu.x, cpu.y, PW, PH, '#39ff14', 12);

  // Ball
  ctx.shadowBlur = 16;
  ctx.shadowColor = '#ffffff';
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL/2, 0, Math.PI*2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function update() {
  // Player
  if ((keys['ArrowUp'] || keys['w'] || keys['W']) && player.y > 0) player.y -= 5;
  if ((keys['ArrowDown'] || keys['s'] || keys['S']) && player.y < H - PH) player.y += 5;

  // CPU AI
  const cpuCenter = cpu.y + PH/2;
  if (cpuCenter < ball.y - 4) cpu.y = Math.min(cpu.y + 3.5, H - PH);
  else if (cpuCenter > ball.y + 4) cpu.y = Math.max(cpu.y - 3.5, 0);

  // Ball
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Top/bottom bounce
  if (ball.y - BALL/2 <= 0) { ball.y = BALL/2; ball.vy *= -1; }
  if (ball.y + BALL/2 >= H) { ball.y = H - BALL/2; ball.vy *= -1; }

  // Paddle collisions
  if (ball.vx < 0 && ball.x - BALL/2 <= player.x + PW && ball.x + BALL/2 >= player.x && ball.y >= player.y && ball.y <= player.y + PH) {
    ball.vx = Math.abs(ball.vx) * 1.05;
    ball.vy += (ball.y - (player.y + PH/2)) * 0.1;
    ball.x = player.x + PW + BALL/2;
  }
  if (ball.vx > 0 && ball.x + BALL/2 >= cpu.x && ball.x - BALL/2 <= cpu.x + PW && ball.y >= cpu.y && ball.y <= cpu.y + PH) {
    ball.vx = -Math.abs(ball.vx) * 1.05;
    ball.vy += (ball.y - (cpu.y + PH/2)) * 0.1;
    ball.x = cpu.x - BALL/2;
  }

  // Clamp speed
  const spd = Math.sqrt(ball.vx*ball.vx + ball.vy*ball.vy);
  if (spd > 10) { ball.vx = ball.vx/spd*10; ball.vy = ball.vy/spd*10; }

  // Score
  if (ball.x < 0) {
    cScore++;
    csEl.textContent = cScore;
    if (cScore >= 7) { endGame('CPU WINS!'); return; }
    resetBall(1);
  }
  if (ball.x > W) {
    pScore++;
    psEl.textContent = pScore;
    if (pScore >= 7) { endGame('YOU WIN!'); return; }
    resetBall(-1);
  }
}

function resetBall(dir) {
  ball = {x: W/2, y: H/2, vx: SPEED * dir, vy: SPEED * (Math.random() > 0.5 ? 0.8 : -0.8)};
}

function endGame(msg) {
  running = false;
  cancelAnimationFrame(raf);
  overlay.style.display = 'flex';
  overlay.innerHTML = \`
    <h2>\${msg}</h2>
    <p>You: \${pScore} | CPU: \${cScore}</p>
    <button onclick="startGame()">PLAY AGAIN</button>
  \`;
}

function loop() {
  if (!running) return;
  update();
  draw();
  raf = requestAnimationFrame(loop);
}

function startGame() {
  overlay.style.display = 'none';
  init();
  running = true;
  loop();
}

document.addEventListener('keydown', e => {
  keys[e.key] = true;
  if (['ArrowUp','ArrowDown','w','s','W','S'].includes(e.key)) e.preventDefault();
  if (!running && (e.key === 'Enter' || e.key === ' ')) startGame();
});
document.addEventListener('keyup', e => { keys[e.key] = false; });
document.getElementById('startBtn').addEventListener('click', startGame);
draw();
</script>
</body>
</html>`;
}

function getMemoryGameHTML(): string {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #0a0a0f;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-family: 'Courier New', monospace;
    color: #c084fc;
    overflow: hidden;
  }
  #info { display: flex; gap: 24px; margin-bottom: 12px; font-size: 13px; letter-spacing: 1px; }
  #info .val { color: #fff; font-weight: bold; }
  #grid {
    display: grid;
    grid-template-columns: repeat(4, 64px);
    grid-template-rows: repeat(4, 64px);
    gap: 8px;
  }
  .card {
    width: 64px; height: 64px;
    background: #1a1a2e;
    border: 1px solid #c084fc30;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    user-select: none;
    box-shadow: 0 0 6px #c084fc15;
  }
  .card:hover:not(.flipped):not(.matched) { transform: scale(1.05); box-shadow: 0 0 12px #c084fc40; }
  .card.flipped, .card.matched {
    background: #2a1a3e;
    border-color: #c084fc60;
    box-shadow: 0 0 14px #c084fc40;
  }
  .card.matched { border-color: #39ff1480; box-shadow: 0 0 14px #39ff1440; background: #1a2e1a; }
  .card .face { display: none; }
  .card.flipped .face, .card.matched .face { display: block; }
  .card .back { display: block; color: #c084fc40; font-size: 20px; }
  .card.flipped .back, .card.matched .back { display: none; }
  #msg { margin-top: 12px; font-size: 12px; color: #c084fc60; letter-spacing: 1px; }
  #overlay {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: #0a0a0fcc; gap: 8px;
  }
  #overlay h2 { font-size: 22px; color: #c084fc; text-shadow: 0 0 10px #c084fc; }
  #overlay p { color: #aaa; font-size: 12px; }
  #overlay button {
    margin-top: 8px; padding: 8px 24px;
    background: transparent; border: 1px solid #c084fc;
    color: #c084fc; font-family: 'Courier New', monospace;
    font-size: 13px; cursor: pointer; letter-spacing: 1px; transition: all 0.2s;
  }
  #overlay button:hover { background: #c084fc20; box-shadow: 0 0 10px #c084fc40; }
</style>
</head>
<body>
<div id="info">
  <span>MOVES: <span class="val" id="moves">0</span></span>
  <span>PAIRS: <span class="val" id="pairs">0</span>/8</span>
  <span>TIME: <span class="val" id="timer">0s</span></span>
</div>
<div id="grid"></div>
<div id="msg">Click cards to find matching pairs!</div>
<div id="overlay">
  <h2>🃏 MEMORY</h2>
  <p>Find all 8 matching pairs</p>
  <button id="startBtn">PRESS TO START</button>
</div>
<script>
const EMOJIS = ['🎮','🕹️','👾','🎯','🏆','⚡','🔥','💎'];
let cards = [], flipped = [], matched = 0, moves = 0, lock = false, timerInterval, seconds = 0;

const grid = document.getElementById('grid');
const movesEl = document.getElementById('moves');
const pairsEl = document.getElementById('pairs');
const timerEl = document.getElementById('timer');
const overlay = document.getElementById('overlay');

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startGame() {
  overlay.style.display = 'none';
  clearInterval(timerInterval);
  seconds = 0; moves = 0; matched = 0; flipped = []; lock = false;
  movesEl.textContent = 0; pairsEl.textContent = 0; timerEl.textContent = '0s';
  const deck = shuffle([...EMOJIS, ...EMOJIS]);
  grid.innerHTML = '';
  cards = deck.map((emoji, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.emoji = emoji;
    card.dataset.index = i;
    card.innerHTML = \`<span class="back">?</span><span class="face">\${emoji}</span>\`;
    card.addEventListener('click', () => flipCard(card));
    grid.appendChild(card);
    return card;
  });
  timerInterval = setInterval(() => { seconds++; timerEl.textContent = seconds + 's'; }, 1000);
}

function flipCard(card) {
  if (lock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  flipped.push(card);
  if (flipped.length === 2) {
    lock = true;
    moves++;
    movesEl.textContent = moves;
    const [a, b] = flipped;
    if (a.dataset.emoji === b.dataset.emoji) {
      a.classList.add('matched'); b.classList.add('matched');
      matched++;
      pairsEl.textContent = matched;
      flipped = []; lock = false;
      if (matched === 8) {
        clearInterval(timerInterval);
        setTimeout(() => {
          overlay.style.display = 'flex';
          overlay.innerHTML = \`
            <h2>🏆 YOU WIN!</h2>
            <p>Moves: \${moves} | Time: \${seconds}s</p>
            <button onclick="startGame()">PLAY AGAIN</button>
          \`;
        }, 400);
      }
    } else {
      setTimeout(() => {
        a.classList.remove('flipped'); b.classList.remove('flipped');
        flipped = []; lock = false;
      }, 900);
    }
  }
}

document.getElementById('startBtn').addEventListener('click', startGame);
</script>
</body>
</html>`;
}

function getBreakoutGameHTML(): string {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #0a0a0f;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-family: 'Courier New', monospace;
    color: #f97316;
    overflow: hidden;
  }
  #info { display: flex; gap: 24px; margin-bottom: 8px; font-size: 13px; letter-spacing: 1px; }
  #info .val { color: #fff; font-weight: bold; }
  canvas { border: 1px solid #f9731630; box-shadow: 0 0 20px #f9731625; display: block; }
  #msg { margin-top: 8px; font-size: 12px; color: #f9731660; letter-spacing: 1px; }
  #overlay {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: #0a0a0fcc; gap: 8px;
  }
  #overlay h2 { font-size: 22px; color: #f97316; text-shadow: 0 0 10px #f97316; }
  #overlay p { color: #aaa; font-size: 12px; }
  #overlay button {
    margin-top: 8px; padding: 8px 24px;
    background: transparent; border: 1px solid #f97316;
    color: #f97316; font-family: 'Courier New', monospace;
    font-size: 13px; cursor: pointer; letter-spacing: 1px; transition: all 0.2s;
  }
  #overlay button:hover { background: #f9731620; box-shadow: 0 0 10px #f9731640; }
</style>
</head>
<body>
<div id="info">
  <span>SCORE: <span class="val" id="score">0</span></span>
  <span>LIVES: <span class="val" id="lives">3</span></span>
  <span>LEVEL: <span class="val" id="level">1</span></span>
</div>
<canvas id="c" width="360" height="300"></canvas>
<div id="msg">← → Arrow keys or mouse to move</div>
<div id="overlay">
  <h2>🧱 BREAKOUT</h2>
  <p>Arrow keys or mouse to move paddle</p>
  <button id="startBtn">PRESS TO START</button>
</div>
<script>
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const levelEl = document.getElementById('level');
const W = canvas.width, H = canvas.height;

const COLS = 9, ROWS = 5;
const BW = (W - 20) / COLS - 4, BH = 14;
const COLORS = ['#f97316','#fb923c','#fdba74','#fcd34d','#86efac'];

let paddle, ball, bricks, score, lives, level, keys = {}, running = false, raf;

function initBricks() {
  bricks = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      bricks.push({
        x: 10 + c * (BW + 4),
        y: 30 + r * (BH + 4),
        alive: true,
        color: COLORS[r % COLORS.length]
      });
    }
  }
}

function init() {
  paddle = {x: W/2 - 30, y: H - 20, w: 60, h: 10};
  const spd = 3.5 + (level - 1) * 0.4;
  ball = {x: W/2, y: H - 40, vx: spd * (Math.random() > 0.5 ? 1 : -1), vy: -spd, r: 6};
  score = 0; lives = 3;
  scoreEl.textContent = 0; livesEl.textContent = 3; levelEl.textContent = level;
  initBricks();
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, W, H);

  // Bricks
  bricks.forEach(b => {
    if (!b.alive) return;
    ctx.shadowBlur = 6; ctx.shadowColor = b.color;
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, BW, BH);
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#0a0a0f40';
    ctx.strokeRect(b.x, b.y, BW, BH);
  });

  // Paddle
  ctx.shadowBlur = 12; ctx.shadowColor = '#f97316';
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 4);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Ball
  ctx.shadowBlur = 14; ctx.shadowColor = '#fff';
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function update() {
  if (keys['ArrowLeft']) paddle.x = Math.max(0, paddle.x - 6);
  if (keys['ArrowRight']) paddle.x = Math.min(W - paddle.w, paddle.x + 6);

  ball.x += ball.vx; ball.y += ball.vy;

  if (ball.x - ball.r <= 0) { ball.x = ball.r; ball.vx *= -1; }
  if (ball.x + ball.r >= W) { ball.x = W - ball.r; ball.vx *= -1; }
  if (ball.y - ball.r <= 0) { ball.y = ball.r; ball.vy *= -1; }

  // Paddle
  if (ball.vy > 0 && ball.y + ball.r >= paddle.y && ball.y - ball.r <= paddle.y + paddle.h &&
      ball.x >= paddle.x && ball.x <= paddle.x + paddle.w) {
    ball.vy = -Math.abs(ball.vy);
    ball.vx += (ball.x - (paddle.x + paddle.w/2)) * 0.08;
    ball.y = paddle.y - ball.r;
  }

  // Bricks
  for (const b of bricks) {
    if (!b.alive) continue;
    if (ball.x + ball.r > b.x && ball.x - ball.r < b.x + BW &&
        ball.y + ball.r > b.y && ball.y - ball.r < b.y + BH) {
      b.alive = false;
      score += 10;
      scoreEl.textContent = score;
      const overlapX = Math.min(ball.x + ball.r - b.x, b.x + BW - (ball.x - ball.r));
      const overlapY = Math.min(ball.y + ball.r - b.y, b.y + BH - (ball.y - ball.r));
      if (overlapX < overlapY) ball.vx *= -1; else ball.vy *= -1;
      break;
    }
  }

  // Win
  if (bricks.every(b => !b.alive)) {
    level++;
    endGame('LEVEL CLEAR! 🎉', true);
    return;
  }

  // Lose ball
  if (ball.y - ball.r > H) {
    lives--;
    livesEl.textContent = lives;
    if (lives <= 0) { endGame('GAME OVER'); return; }
    ball = {x: W/2, y: H - 40, vx: 3.5 * (Math.random() > 0.5 ? 1 : -1), vy: -3.5, r: 6};
    paddle.x = W/2 - 30;
  }
}

function endGame(msg, win) {
  running = false;
  cancelAnimationFrame(raf);
  overlay.style.display = 'flex';
  overlay.innerHTML = \`
    <h2>\${msg}</h2>
    <p>Score: \${score}</p>
    <button onclick="\${win ? 'nextLevel()' : 'resetAndStart()'}">
      \${win ? 'NEXT LEVEL' : 'PLAY AGAIN'}
    </button>
  \`;
}

window.nextLevel = function() {
  overlay.style.display = 'none';
  const spd = 3.5 + (level - 1) * 0.4;
  paddle = {x: W/2 - 30, y: H - 20, w: 60, h: 10};
  ball = {x: W/2, y: H - 40, vx: spd * (Math.random() > 0.5 ? 1 : -1), vy: -spd, r: 6};
  lives = 3; livesEl.textContent = 3; levelEl.textContent = level;
  initBricks();
  running = true;
  loop();
};

window.resetAndStart = function() {
  level = 1;
  startGame();
};

function loop() {
  if (!running) return;
  update(); draw();
  raf = requestAnimationFrame(loop);
}

function startGame() {
  overlay.style.display = 'none';
  level = 1;
  init();
  running = true;
  loop();
}

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  paddle.x = Math.max(0, Math.min(W - paddle.w, e.clientX - rect.left - paddle.w/2));
});

document.addEventListener('keydown', e => {
  keys[e.key] = true;
  if (['ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
  if (!running && (e.key === 'Enter' || e.key === ' ')) startGame();
});
document.addEventListener('keyup', e => { keys[e.key] = false; });
document.getElementById('startBtn').addEventListener('click', startGame);
draw();
</script>
</body>
</html>`;
}

function getFlappyGameHTML(): string {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #0a0a0f;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-family: 'Courier New', monospace;
    color: #facc15;
    overflow: hidden;
  }
  #info { display: flex; gap: 24px; margin-bottom: 8px; font-size: 13px; letter-spacing: 1px; }
  #info .val { color: #fff; font-weight: bold; }
  canvas { border: 1px solid #facc1530; box-shadow: 0 0 20px #facc1525; display: block; cursor: pointer; }
  #msg { margin-top: 8px; font-size: 12px; color: #facc1560; letter-spacing: 1px; }
  #overlay {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: #0a0a0fcc; gap: 8px;
  }
  #overlay h2 { font-size: 22px; color: #facc15; text-shadow: 0 0 10px #facc15; }
  #overlay p { color: #aaa; font-size: 12px; }
  #overlay button {
    margin-top: 8px; padding: 8px 24px;
    background: transparent; border: 1px solid #facc15;
    color: #facc15; font-family: 'Courier New', monospace;
    font-size: 13px; cursor: pointer; letter-spacing: 1px; transition: all 0.2s;
  }
  #overlay button:hover { background: #facc1520; box-shadow: 0 0 10px #facc1540; }
</style>
</head>
<body>
<div id="info">
  <span>SCORE: <span class="val" id="score">0</span></span>
  <span>BEST: <span class="val" id="best">0</span></span>
</div>
<canvas id="c" width="280" height="360"></canvas>
<div id="msg">SPACE / CLICK / TAP to flap</div>
<div id="overlay">
  <h2>🐦 FLAPPY</h2>
  <p>Space, click, or tap to flap</p>
  <button id="startBtn">PRESS TO START</button>
</div>
<script>
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const W = canvas.width, H = canvas.height;

const GAP = 110, PIPE_W = 36, SPEED = 2.2, GRAVITY = 0.32, FLAP = -6.5;
let bird, pipes, score, best = 0, running = false, raf, frame = 0;

function init() {
  bird = {x: 70, y: H/2, vy: 0, r: 14};
  pipes = [];
  score = 0;
  scoreEl.textContent = 0;
  frame = 0;
}

function addPipe() {
  const top = 50 + Math.random() * (H - GAP - 100);
  pipes.push({x: W + 10, top, bottom: top + GAP});
}

function flap() {
  if (!running) { startGame(); return; }
  bird.vy = FLAP;
}

function draw() {
  // Sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#0a0a1f');
  grad.addColorStop(1, '#0a1a0f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Stars
  ctx.fillStyle = '#ffffff20';
  for (let i = 0; i < 30; i++) {
    const sx = (i * 97 + frame * 0.2) % W;
    const sy = (i * 53) % (H * 0.6);
    ctx.fillRect(sx, sy, 1, 1);
  }

  // Pipes
  pipes.forEach(p => {
    ctx.shadowBlur = 8; ctx.shadowColor = '#39ff14';
    ctx.fillStyle = '#1a4a1a';
    ctx.fillRect(p.x, 0, PIPE_W, p.top);
    ctx.fillRect(p.x, p.bottom, PIPE_W, H - p.bottom);
    ctx.strokeStyle = '#39ff1460';
    ctx.lineWidth = 1;
    ctx.strokeRect(p.x, 0, PIPE_W, p.top);
    ctx.strokeRect(p.x, p.bottom, PIPE_W, H - p.bottom);
    // Caps
    ctx.fillStyle = '#2a6a2a';
    ctx.fillRect(p.x - 3, p.top - 12, PIPE_W + 6, 12);
    ctx.fillRect(p.x - 3, p.bottom, PIPE_W + 6, 12);
    ctx.shadowBlur = 0;
  });

  // Ground
  ctx.fillStyle = '#1a2a1a';
  ctx.fillRect(0, H - 20, W, 20);
  ctx.strokeStyle = '#39ff1430';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H - 20); ctx.lineTo(W, H - 20); ctx.stroke();

  // Bird
  ctx.shadowBlur = 16; ctx.shadowColor = '#facc15';
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI*2);
  ctx.fill();
  // Eye
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#0a0a0f';
  ctx.beginPath();
  ctx.arc(bird.x + 5, bird.y - 3, 3, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(bird.x + 6, bird.y - 4, 1.5, 0, Math.PI*2);
  ctx.fill();
  // Wing
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.ellipse(bird.x - 4, bird.y + 4, 8, 5, -0.3, 0, Math.PI*2);
  ctx.fill();
}

function update() {
  frame++;
  bird.vy += GRAVITY;
  bird.y += bird.vy;

  if (frame % 80 === 0) addPipe();

  pipes.forEach(p => { p.x -= SPEED; });
  pipes = pipes.filter(p => p.x + PIPE_W > 0);

  // Score
  pipes.forEach(p => {
    if (!p.scored && p.x + PIPE_W < bird.x) {
      p.scored = true;
      score++;
      scoreEl.textContent = score;
      if (score > best) { best = score; bestEl.textContent = best; }
    }
  });

  // Collisions
  if (bird.y + bird.r >= H - 20 || bird.y - bird.r <= 0) { endGame(); return; }
  for (const p of pipes) {
    if (bird.x + bird.r > p.x && bird.x - bird.r < p.x + PIPE_W) {
      if (bird.y - bird.r < p.top || bird.y + bird.r > p.bottom) { endGame(); return; }
    }
  }
}

function endGame() {
  running = false;
  cancelAnimationFrame(raf);
  overlay.style.display = 'flex';
  overlay.innerHTML = \`
    <h2>GAME OVER</h2>
    <p>Score: \${score} | Best: \${best}</p>
    <button onclick="startGame()">PLAY AGAIN</button>
  \`;
}

function loop() {
  if (!running) return;
  update(); draw();
  raf = requestAnimationFrame(loop);
}

function startGame() {
  overlay.style.display = 'none';
  init();
  running = true;
  loop();
}

canvas.addEventListener('click', flap);
document.addEventListener('keydown', e => {
  if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); flap(); }
});
document.getElementById('startBtn').addEventListener('click', startGame);
draw();
</script>
</body>
</html>`;
}

function getTetrisGameHTML(): string {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #0a0a0f;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-family: 'Courier New', monospace;
    color: #00e5ff;
    overflow: hidden;
  }
  #wrap { display: flex; gap: 12px; align-items: flex-start; }
  #info { display: flex; flex-direction: column; gap: 10px; padding-top: 4px; min-width: 70px; font-size: 11px; letter-spacing: 1px; }
  #info .label { color: #00e5ff80; }
  #info .val { color: #fff; font-weight: bold; font-size: 14px; }
  canvas { border: 1px solid #00e5ff30; box-shadow: 0 0 20px #00e5ff25; display: block; }
  #msg { margin-top: 8px; font-size: 11px; color: #00e5ff50; letter-spacing: 1px; }
  #overlay {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: #0a0a0fcc; gap: 8px;
  }
  #overlay h2 { font-size: 22px; color: #00e5ff; text-shadow: 0 0 10px #00e5ff; }
  #overlay p { color: #aaa; font-size: 12px; }
  #overlay button {
    margin-top: 8px; padding: 8px 24px;
    background: transparent; border: 1px solid #00e5ff;
    color: #00e5ff; font-family: 'Courier New', monospace;
    font-size: 13px; cursor: pointer; letter-spacing: 1px; transition: all 0.2s;
  }
  #overlay button:hover { background: #00e5ff20; }
</style>
</head>
<body>
<div id="wrap">
  <canvas id="c" width="160" height="320"></canvas>
  <div id="info">
    <div><div class="label">SCORE</div><div class="val" id="score">0</div></div>
    <div><div class="label">LINES</div><div class="val" id="lines">0</div></div>
    <div><div class="label">LEVEL</div><div class="val" id="level">1</div></div>
    <div><div class="label">NEXT</div><canvas id="next" width="60" height="60"></canvas></div>
  </div>
</div>
<div id="msg">← → move · ↑ rotate · ↓ soft drop · Space hard drop</div>
<div id="overlay">
  <h2>🟦 TETRIS</h2>
  <p>Arrow keys to play</p>
  <button id="startBtn">PRESS TO START</button>
</div>
<script>
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next');
const nctx = nextCanvas.getContext('2d');
const overlay = document.getElementById('overlay');
const scoreEl = document.getElementById('score');
const linesEl = document.getElementById('lines');
const levelEl = document.getElementById('level');

const COLS = 10, ROWS = 20, SZ = 16;
const COLORS = ['','#00e5ff','#facc15','#c084fc','#39ff14','#f97316','#f43f5e','#3b82f6'];
const PIECES = [
  null,
  [[1,1,1,1]],
  [[2,2],[2,2]],
  [[0,3,0],[3,3,3]],
  [[4,0],[4,0],[4,4]],
  [[0,5],[0,5],[5,5]],
  [[6,6,0],[0,6,6]],
  [[0,7,7],[7,7,0]]
];

let board, current, next, score, lines, level, dropTimer, dropInterval, running = false, raf, keys = {};

function newBoard() { return Array.from({length: ROWS}, () => new Array(COLS).fill(0)); }

function randomPiece() {
  const id = Math.floor(Math.random() * 7) + 1;
  const shape = PIECES[id].map(r => [...r]);
  return {id, shape, x: Math.floor(COLS/2) - Math.floor(shape[0].length/2), y: 0};
}

function rotate(shape) {
  return shape[0].map((_, i) => shape.map(r => r[i]).reverse());
}

function valid(shape, ox, oy) {
  return shape.every((row, dy) =>
    row.every((v, dx) => {
      if (!v) return true;
      const nx = ox + dx, ny = oy + dy;
      return nx >= 0 && nx < COLS && ny < ROWS && (ny < 0 || !board[ny][nx]);
    })
  );
}

function place() {
  current.shape.forEach((row, dy) =>
    row.forEach((v, dx) => {
      if (v) board[current.y + dy][current.x + dx] = current.id;
    })
  );
  let cleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(c => c)) {
      board.splice(r, 1);
      board.unshift(new Array(COLS).fill(0));
      cleared++; r++;
    }
  }
  if (cleared) {
    const pts = [0, 100, 300, 500, 800];
    score += (pts[cleared] || 800) * level;
    lines += cleared;
    level = Math.floor(lines / 10) + 1;
    dropInterval = Math.max(80, 500 - (level - 1) * 45);
    scoreEl.textContent = score;
    linesEl.textContent = lines;
    levelEl.textContent = level;
  }
  current = next;
  next = randomPiece();
  drawNext();
  if (!valid(current.shape, current.x, current.y)) endGame();
}

function drawBlock(c, x, y, sz, alpha) {
  if (!c) return;
  c.globalAlpha = alpha || 1;
  c.shadowBlur = 6; c.shadowColor = COLORS[0] || '#fff';
  c.fillStyle = COLORS[0] || '#fff';
  c.fillStyle = COLORS[Math.abs(c === ctx ? board[y]?.[x] || 0 : 0)] || COLORS[1];
  c.shadowBlur = 0;
  c.globalAlpha = 1;
}

function draw() {
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid
  ctx.strokeStyle = '#ffffff08';
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x*SZ,0); ctx.lineTo(x*SZ,ROWS*SZ); ctx.stroke(); }
  for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0,y*SZ); ctx.lineTo(COLS*SZ,y*SZ); ctx.stroke(); }

  // Board
  board.forEach((row, y) => row.forEach((v, x) => {
    if (!v) return;
    ctx.shadowBlur = 4; ctx.shadowColor = COLORS[v];
    ctx.fillStyle = COLORS[v];
    ctx.fillRect(x*SZ+1, y*SZ+1, SZ-2, SZ-2);
    ctx.shadowBlur = 0;
  }));

  // Ghost
  let gy = current.y;
  while (valid(current.shape, current.x, gy + 1)) gy++;
  current.shape.forEach((row, dy) => row.forEach((v, dx) => {
    if (!v) return;
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = COLORS[current.id];
    ctx.fillRect((current.x+dx)*SZ+1, (gy+dy)*SZ+1, SZ-2, SZ-2);
    ctx.globalAlpha = 1;
  }));

  // Current
  current.shape.forEach((row, dy) => row.forEach((v, dx) => {
    if (!v) return;
    ctx.shadowBlur = 8; ctx.shadowColor = COLORS[current.id];
    ctx.fillStyle = COLORS[current.id];
    ctx.fillRect((current.x+dx)*SZ+1, (current.y+dy)*SZ+1, SZ-2, SZ-2);
    ctx.shadowBlur = 0;
  }));
}

function drawNext() {
  nctx.fillStyle = '#0a0a0f';
  nctx.fillRect(0, 0, 60, 60);
  const s = next.shape;
  const ox = Math.floor((4 - s[0].length) / 2) * 12 + 6;
  const oy = Math.floor((4 - s.length) / 2) * 12 + 6;
  s.forEach((row, dy) => row.forEach((v, dx) => {
    if (!v) return;
    nctx.shadowBlur = 6; nctx.shadowColor = COLORS[next.id];
    nctx.fillStyle = COLORS[next.id];
    nctx.fillRect(ox + dx*12, oy + dy*12, 10, 10);
    nctx.shadowBlur = 0;
  }));
}

function endGame() {
  running = false;
  cancelAnimationFrame(raf);
  overlay.style.display = 'flex';
  overlay.innerHTML = \`
    <h2>GAME OVER</h2>
    <p>Score: \${score} | Lines: \${lines}</p>
    <button onclick="startGame()">PLAY AGAIN</button>
  \`;
}

let lastTime = 0;
function loop(ts) {
  if (!running) return;
  const dt = ts - lastTime;
  if (dt > dropInterval) {
    lastTime = ts;
    if (valid(current.shape, current.x, current.y + 1)) current.y++;
    else place();
  }
  if (keys['ArrowLeft'] && keys['_leftReady']) { if (valid(current.shape, current.x-1, current.y)) current.x--; keys['_leftReady'] = false; }
  if (keys['ArrowRight'] && keys['_rightReady']) { if (valid(current.shape, current.x+1, current.y)) current.x++; keys['_rightReady'] = false; }
  if (keys['ArrowDown']) { if (valid(current.shape, current.x, current.y+1)) { current.y++; score += 1; scoreEl.textContent = score; } }
  draw();
  raf = requestAnimationFrame(loop);
}

function startGame() {
  overlay.style.display = 'none';
  board = newBoard();
  score = 0; lines = 0; level = 1; dropInterval = 500;
  scoreEl.textContent = 0; linesEl.textContent = 0; levelEl.textContent = 1;
  current = randomPiece();
  next = randomPiece();
  drawNext();
  running = true;
  lastTime = 0;
  raf = requestAnimationFrame(loop);
}

document.addEventListener('keydown', e => {
  if (!running && (e.key === 'Enter' || e.key === ' ')) { startGame(); return; }
  if (e.key === 'ArrowLeft') { keys['ArrowLeft'] = true; keys['_leftReady'] = true; e.preventDefault(); }
  if (e.key === 'ArrowRight') { keys['ArrowRight'] = true; keys['_rightReady'] = true; e.preventDefault(); }
  if (e.key === 'ArrowDown') { keys['ArrowDown'] = true; e.preventDefault(); }
  if (e.key === 'ArrowUp') {
    const rotated = rotate(current.shape);
    if (valid(rotated, current.x, current.y)) current.shape = rotated;
    e.preventDefault();
  }
  if (e.key === ' ') {
    while (valid(current.shape, current.x, current.y + 1)) { current.y++; score += 2; }
    scoreEl.textContent = score;
    place();
    e.preventDefault();
  }
});
document.addEventListener('keyup', e => {
  keys[e.key] = false;
  if (e.key === 'ArrowLeft') keys['_leftReady'] = false;
  if (e.key === 'ArrowRight') keys['_rightReady'] = false;
});
document.getElementById('startBtn').addEventListener('click', startGame);
draw();
</script>
</body>
</html>`;
}

function getGenericGameHTML(gameType: string): string {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #0a0a0f;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-family: 'Courier New', monospace;
    color: #39ff14;
    text-align: center;
    gap: 12px;
  }
  h2 { font-size: 20px; text-shadow: 0 0 10px #39ff14; }
  p { color: #aaa; font-size: 13px; max-width: 260px; line-height: 1.6; }
</style>
</head>
<body>
  <h2>🎮 ${gameType.toUpperCase()}</h2>
  <p>This game type is coming soon! Try asking for Snake, Pong, Memory, Breakout, Flappy, or Tetris.</p>
</body>
</html>`;
}

function buildGameHTML(payload: string): { html: string; title: string } {
    try {
        const parsed = JSON.parse(payload);
        const gameType: string = (parsed.gameType || '').toLowerCase();

        if (gameType.includes('snake')) {
            return { html: getSnakeGameHTML(), title: '🐍 Snake' };
        }
        if (gameType.includes('pong')) {
            return { html: getPongGameHTML(), title: '🏓 Pong' };
        }
        if (gameType.includes('memory') || gameType.includes('card')) {
            return { html: getMemoryGameHTML(), title: '🃏 Memory Cards' };
        }
        if (gameType.includes('breakout') || gameType.includes('brick')) {
            return { html: getBreakoutGameHTML(), title: '🧱 Breakout' };
        }
        if (gameType.includes('flappy') || gameType.includes('bird')) {
            return { html: getFlappyGameHTML(), title: '🐦 Flappy Bird' };
        }
        if (gameType.includes('tetris')) {
            return { html: getTetrisGameHTML(), title: '🟦 Tetris' };
        }
        return { html: getGenericGameHTML(gameType || 'Game'), title: '🎮 Game' };
    } catch {
        return { html: getGenericGameHTML('Game'), title: '🎮 Game' };
    }
}

export function GameRenderer({ gamePayload }: GameRendererProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const { html, title } = buildGameHTML(gamePayload);

    useEffect(() => {
        setHasError(false);
    }, [gamePayload]);

    if (hasError) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs font-mono">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>Failed to load game. Please try again.</span>
            </div>
        );
    }

    return (
        <div className="mt-2 rounded-xl overflow-hidden border border-neon-green/30 shadow-neon-green-sm">
            {/* Game header bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-card border-b border-neon-green/20">
                <div className="flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-neon-green" />
                    <span className="text-xs font-mono font-semibold text-neon-green tracking-wider">
                        {title}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">· PLAYABLE</span>
                </div>
                <button
                    onClick={() => setIsExpanded(v => !v)}
                    className="text-muted-foreground hover:text-neon-green transition-colors p-0.5"
                    title={isExpanded ? 'Collapse' : 'Expand'}
                >
                    {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
            </div>

            {/* Game iframe */}
            <div
                className="relative bg-[#0a0a0f] transition-all duration-300"
                style={{ height: isExpanded ? '520px' : '360px' }}
            >
                <iframe
                    ref={iframeRef}
                    srcDoc={html}
                    sandbox="allow-scripts"
                    className="w-full h-full border-0"
                    title={title}
                    onError={() => setHasError(true)}
                    style={{ display: 'block' }}
                />
            </div>

            {/* Controls hint */}
            <div className="px-3 py-1.5 bg-card/50 border-t border-neon-green/10 text-center">
                <span className="text-xs font-mono text-muted-foreground">
                    Click inside the game to focus · Keyboard controls active
                </span>
            </div>
        </div>
    );
}
