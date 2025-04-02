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
    speed: 7,
    health: 3 // Жизни игрока
};

let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;

// Controls
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && player.x > 0) {
        player.x -= player.speed;
    }
    if (event.key === "ArrowRight" && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
    if ((event.key === " " || event.key === "ArrowUp") && !gameOver) {
        bullets.push({ x: player.x + 22, y: player.y, speed: 7 });
    }
});

// Enemy Spawn
function spawnEnemy() {
    let enemyType = Math.random() > 0.5 ? "fast" : "slow";
    let speed = enemyType === "fast" ? 4 : 2;
    
    enemies.push({
        x: Math.random() * (canvas.width - 50),
        y: 0,
        width: 50,
        height: 50,
        speed: speed,
        type: enemyType
    });
}
setInterval(spawnEnemy, 800);

// Collision Detection
function checkCollision(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

// Game Loop
function update() {
    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over! Score: " + score, canvas.width / 2 - 100, canvas.height / 2);
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Player
    ctx.fillStyle = "white";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Move and Draw Bullets
    bullets.forEach((bullet, bIndex) => {
        bullet.y -= bullet.speed;
        ctx.fillStyle = "red";
        ctx.fillRect(bullet.x, bullet.y, 5, 10);
        
        // Remove off-screen bullets
        if (bullet.y < 0) bullets.splice(bIndex, 1);
    });

    // Move and Draw Enemies
    enemies.forEach((enemy, eIndex) => {
        enemy.y += enemy.speed;
        ctx.fillStyle = enemy.type === "fast" ? "purple" : "blue";
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // Collision with player
        if (checkCollision(player, enemy)) {
            player.health -= 1;
            enemies.splice(eIndex, 1);
            if (player.health <= 0) gameOver = true;
        }
        
        // Collision with bullets
        bullets.forEach((bullet, bIndex) => {
            if (checkCollision(bullet, enemy)) {
                score += 10;
                enemies.splice(eIndex, 1);
                bullets.splice(bIndex, 1);
            }
        });
        
        // Remove off-screen enemies
        if (enemy.y > canvas.height) enemies.splice(eIndex, 1);
    });
    
    // Display Score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);
    ctx.fillText("Health: " + player.health, 20, 60);
    
    requestAnimationFrame(update);
}

update();
