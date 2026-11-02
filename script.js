const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");

const player = {
  x: 180,
  y: 480,
  width: 40,
  height: 40,
  speed: 5
};

let bullets = [];
let enemies = [];
let keys = {};
let score = 0;
let gameOver = false;
let frame = 0;

document.addEventListener("keydown", (event) => {
  keys[event.code] = true;

  if (event.code === "Space") {
    event.preventDefault();

    if (!gameOver) {
      shoot();
    }
  }

  if (event.code === "Enter" && gameOver) {
    restartGame();
  }
});

document.addEventListener("keyup", (event) => {
  keys[event.code] = false;
});

function shoot() {
  bullets.push({
    x: player.x + player.width / 2 - 3,
    y: player.y,
    width: 6,
    height: 15,
    speed: 7
  });
}

function createEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 35),
    y: -40,
    size: 35,
    speed: 2 + Math.random() * 2
  });
}

function drawPlayer() {
  ctx.fillStyle = "#f5c542";
  ctx.beginPath();
  ctx.moveTo(player.x + player.width / 2, player.y);
  ctx.lineTo(player.x, player.y + player.height);
  ctx.lineTo(player.x + player.width, player.y + player.height);
  ctx.closePath();
  ctx.fill();
}

function drawBullets() {
  ctx.fillStyle = "#4deaff";

  bullets.forEach((bullet) => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

function drawEnemies() {
  ctx.fillStyle = "#ff4d6d";

  enemies.forEach((enemy) => {
    ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
  });
}

function update() {
  if (gameOver) return;

  if (keys["ArrowLeft"] && player.x > 0) {
    player.x -= player.speed;
  }

  if (keys["ArrowRight"] && player.x + player.width < canvas.width) {
    player.x += player.speed;
  }

  bullets.forEach((bullet) => {
    bullet.y -= bullet.speed;
  });

  bullets = bullets.filter((bullet) => bullet.y + bullet.height > 0);

  enemies.forEach((enemy) => {
    enemy.y += enemy.speed;
  });

  // Check whether an enemy hits the player's ship.
  for (const enemy of enemies) {
    const hitPlayer =
      player.x < enemy.x + enemy.size &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.size &&
      player.y + player.height > enemy.y;

    if (hitPlayer) {
      gameOver = true;
      break;
    }
  }

  // Check whether a laser hits an enemy.
  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      const enemy = enemies[i];
      const bullet = bullets[j];

      const hitEnemy =
        bullet.x < enemy.x + enemy.size &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.size &&
        bullet.y + bullet.height > enemy.y;

      if (hitEnemy) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score += 10;
        scoreText.textContent = score;
        break;
      }
    }
  }

  // Remove enemies that have moved off the screen.
  enemies = enemies.filter((enemy) => enemy.y < canvas.height);
}

function drawGameOver() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "bold 30px Arial";
  ctx.fillText("GAME OVER", canvas.width / 2, 260);

  ctx.font = "16px Arial";
  ctx.fillText("Press ENTER to restart", canvas.width / 2, 295);
  ctx.textAlign = "left";
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawBullets();
  drawEnemies();

  if (gameOver) {
    drawGameOver();
  }
}

function restartGame() {
  player.x = 180;
  bullets = [];
  enemies = [];
  score = 0;
  scoreText.textContent = score;
  gameOver = false;
  frame = 0;
}

function gameLoop() {
  update();
  draw();

  frame++;

  if (frame % 60 === 0 && !gameOver) {
    createEnemy();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
