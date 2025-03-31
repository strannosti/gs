// Game Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player Object
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    speed: 5
};

// Bullets Array
let bullets = [];
let enemies = [];

// Controls
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && player.x > 0) {
        player.x -= player.speed;
    }
    if (event.key === "ArrowRight" && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
    if (event.key === " " || event.key === "ArrowUp") {
        bullets.push({ x: player.x + 20, y: player.y, speed: 7 });
    }
});

// Enemy Spawn
function spawnEnemy() {
    enemies.push({
        x: Math.random() * (canvas.width - 50),
        y: 0,
        width: 50,
        height: 50,
        speed: 2
    });
}
setInterval(spawnEnemy, 1000);

// Game Loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Player
    ctx.fillStyle = "white";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Move and Draw Bullets
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        ctx.fillStyle = "red";
        ctx.fillRect(bullet.x, bullet.y, 5, 10);

        // Remove off-screen bullets
        if (bullet.y < 0) bullets.splice(index, 1);
    });

    // Move and Draw Enemies
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        ctx.fillStyle = "blue";
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // Remove enemies off-screen
        if (enemy.y > canvas.height) enemies.splice(index, 1);
    });

    requestAnimationFrame(update);
}

update();
