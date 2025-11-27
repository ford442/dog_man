// Dog Man RPG - A top-down RPG game
// Character: A man with the head of a dog
// Starting location: City map, in front of a hospital

import './styles.css';

// Game constants
const TILE_SIZE = 32;
const MAP_WIDTH = 25;
const MAP_HEIGHT = 18;
const COLLISION_PADDING = 4;

let canvas;
let ctx;

// Player state
const player = {
    x: 12 * TILE_SIZE, // Starting position in front of hospital
    y: 13 * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    speed: 3,
    direction: 'down'
};

// Input handling
const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

// City map layout
// 0 = grass/ground, 1 = road, 2 = building, 3 = hospital, 4 = tree, 5 = sidewalk
const cityMap = [
    [4, 4, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4],
    [4, 0, 0, 0, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 4, 0, 0, 0, 4],
    [4, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 4],
    [4, 0, 0, 0, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 0, 0, 0, 4],
    [2, 2, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 2, 2],
    [2, 2, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 2, 2],
    [2, 2, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 2, 2],
    [2, 2, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 2, 2],
    [4, 0, 0, 0, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 0, 0, 0, 4],
    [4, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 4],
    [4, 0, 0, 0, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 0, 0, 0, 4],
    [4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4],
    [4, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 4],
    [4, 0, 0, 0, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 0, 0, 0, 4],
    [2, 2, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 2, 2],
    [2, 2, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
];

// Tile colors
const tileColors = {
    0: '#4a7c59', // grass
    1: '#555555', // road
    2: '#8b7355', // building
    3: '#ffffff', // hospital (white)
    4: '#2d5a27', // tree
    5: '#b8b8b8'  // sidewalk
};

// Event listeners for keyboard input
document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
            keys.up = true;
            break;
        case 's':
        case 'arrowdown':
            keys.down = true;
            break;
        case 'a':
        case 'arrowleft':
            keys.left = true;
            break;
        case 'd':
        case 'arrowright':
            keys.right = true;
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
            keys.up = false;
            break;
        case 's':
        case 'arrowdown':
            keys.down = false;
            break;
        case 'a':
        case 'arrowleft':
            keys.left = false;
            break;
        case 'd':
        case 'arrowright':
            keys.right = false;
            break;
    }
});

// Check if a position is walkable
function isWalkable(x, y) {
    const tileX = Math.floor(x / TILE_SIZE);
    const tileY = Math.floor(y / TILE_SIZE);
    
    if (tileX < 0 || tileX >= MAP_WIDTH || tileY < 0 || tileY >= MAP_HEIGHT) {
        return false;
    }
    
    const tile = cityMap[tileY][tileX];
    // Can walk on grass (0), road (1), and sidewalk (5)
    return tile === 0 || tile === 1 || tile === 5;
}

// Check collision for the player's bounding box
function canMove(newX, newY) {
    return isWalkable(newX + COLLISION_PADDING, newY + COLLISION_PADDING) &&
           isWalkable(newX + player.width - COLLISION_PADDING, newY + COLLISION_PADDING) &&
           isWalkable(newX + COLLISION_PADDING, newY + player.height - COLLISION_PADDING) &&
           isWalkable(newX + player.width - COLLISION_PADDING, newY + player.height - COLLISION_PADDING);
}

// Update player position
function updatePlayer() {
    let newX = player.x;
    let newY = player.y;
    
    if (keys.up) {
        newY -= player.speed;
        player.direction = 'up';
    }
    if (keys.down) {
        newY += player.speed;
        player.direction = 'down';
    }
    if (keys.left) {
        newX -= player.speed;
        player.direction = 'left';
    }
    if (keys.right) {
        newX += player.speed;
        player.direction = 'right';
    }
    
    // Check collision for X and Y separately for smoother movement
    if (canMove(newX, player.y)) {
        player.x = newX;
    }
    if (canMove(player.x, newY)) {
        player.y = newY;
    }
}

// Draw the city map
function drawMap() {
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const tile = cityMap[y][x];
            ctx.fillStyle = tileColors[tile];
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            
            // Add details for trees
            if (tile === 4) {
                ctx.fillStyle = '#1a4a1a';
                ctx.beginPath();
                ctx.arc(x * TILE_SIZE + TILE_SIZE/2, y * TILE_SIZE + TILE_SIZE/2, TILE_SIZE/3, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Add hospital cross
            if (tile === 3) {
                ctx.fillStyle = '#ff0000';
                const centerX = x * TILE_SIZE + TILE_SIZE/2;
                const centerY = y * TILE_SIZE + TILE_SIZE/2;
                ctx.fillRect(centerX - 2, centerY - 8, 4, 16);
                ctx.fillRect(centerX - 8, centerY - 2, 16, 4);
            }
        }
    }
    
    // Draw "HOSPITAL" text
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('HOSPITAL', 12.5 * TILE_SIZE, 11.5 * TILE_SIZE);
}

// Draw the dog man character
function drawPlayer() {
    const x = player.x;
    const y = player.y;
    const size = TILE_SIZE;
    
    // Draw body (human body in simple style)
    ctx.fillStyle = '#3498db'; // Blue shirt
    ctx.fillRect(x + size * 0.25, y + size * 0.45, size * 0.5, size * 0.4);
    
    // Draw legs
    ctx.fillStyle = '#2c3e50'; // Dark pants
    ctx.fillRect(x + size * 0.25, y + size * 0.75, size * 0.2, size * 0.25);
    ctx.fillRect(x + size * 0.55, y + size * 0.75, size * 0.2, size * 0.25);
    
    // Draw arms
    ctx.fillStyle = '#e8b89d'; // Skin color
    ctx.fillRect(x + size * 0.1, y + size * 0.45, size * 0.15, size * 0.3);
    ctx.fillRect(x + size * 0.75, y + size * 0.45, size * 0.15, size * 0.3);
    
    // Draw dog head
    ctx.fillStyle = '#b87333'; // Brown dog color
    ctx.beginPath();
    ctx.ellipse(x + size/2, y + size * 0.28, size * 0.32, size * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw snout (based on direction)
    ctx.fillStyle = '#a06830';
    if (player.direction === 'down') {
        ctx.beginPath();
        ctx.ellipse(x + size/2, y + size * 0.42, size * 0.15, size * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();
    } else if (player.direction === 'up') {
        // No snout visible from back
    } else if (player.direction === 'left') {
        ctx.beginPath();
        ctx.ellipse(x + size * 0.25, y + size * 0.32, size * 0.15, size * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();
    } else if (player.direction === 'right') {
        ctx.beginPath();
        ctx.ellipse(x + size * 0.75, y + size * 0.32, size * 0.15, size * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw ears
    ctx.fillStyle = '#8b5a2b';
    if (player.direction === 'down' || player.direction === 'up') {
        // Left ear
        ctx.beginPath();
        ctx.ellipse(x + size * 0.22, y + size * 0.12, size * 0.1, size * 0.15, -0.3, 0, Math.PI * 2);
        ctx.fill();
        // Right ear
        ctx.beginPath();
        ctx.ellipse(x + size * 0.78, y + size * 0.12, size * 0.1, size * 0.15, 0.3, 0, Math.PI * 2);
        ctx.fill();
    } else if (player.direction === 'left') {
        ctx.beginPath();
        ctx.ellipse(x + size * 0.35, y + size * 0.08, size * 0.12, size * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
    } else if (player.direction === 'right') {
        ctx.beginPath();
        ctx.ellipse(x + size * 0.65, y + size * 0.08, size * 0.12, size * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw eyes
    ctx.fillStyle = '#000000';
    if (player.direction === 'down') {
        ctx.beginPath();
        ctx.arc(x + size * 0.38, y + size * 0.25, size * 0.05, 0, Math.PI * 2);
        ctx.arc(x + size * 0.62, y + size * 0.25, size * 0.05, 0, Math.PI * 2);
        ctx.fill();
    } else if (player.direction === 'left') {
        ctx.beginPath();
        ctx.arc(x + size * 0.35, y + size * 0.25, size * 0.05, 0, Math.PI * 2);
        ctx.fill();
    } else if (player.direction === 'right') {
        ctx.beginPath();
        ctx.arc(x + size * 0.65, y + size * 0.25, size * 0.05, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw nose
    ctx.fillStyle = '#1a1a1a';
    if (player.direction === 'down') {
        ctx.beginPath();
        ctx.arc(x + size/2, y + size * 0.38, size * 0.04, 0, Math.PI * 2);
        ctx.fill();
    } else if (player.direction === 'left') {
        ctx.beginPath();
        ctx.arc(x + size * 0.18, y + size * 0.32, size * 0.04, 0, Math.PI * 2);
        ctx.fill();
    } else if (player.direction === 'right') {
        ctx.beginPath();
        ctx.arc(x + size * 0.82, y + size * 0.32, size * 0.04, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Draw UI elements
function drawUI() {
    // Draw game title
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 200, 30);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('DOG MAN RPG', 20, 30);
    
    // Draw controls hint
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, canvas.height - 35, 200, 25);
    ctx.fillStyle = '#cccccc';
    ctx.font = '12px Arial';
    ctx.fillText('Use WASD or Arrow keys to move', 20, canvas.height - 18);
}

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update
    updatePlayer();
    
    // Draw
    drawMap();
    drawPlayer();
    drawUI();
    
    // Continue loop
    requestAnimationFrame(gameLoop);
}

// Start the game when DOM is ready
function init() {
    canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get canvas context');
        return;
    }
    gameLoop();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
