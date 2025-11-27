// Dog Man RPG - A top-down RPG game
// Character: A man with the head of a dog
// Starting location: City map, in front of a hospital

import './styles.css';

// Game constants
const TILE_SIZE = 32; // Logic size
const ISO_TILE_WIDTH = 64; // Visual width
const ISO_TILE_HEIGHT = 32; // Visual height
const BLOCK_HEIGHT = 40; // Height of 3D blocks

const MAP_WIDTH = 25;
const MAP_HEIGHT = 18;
const COLLISION_PADDING = 4;

let canvas;
let ctx;

// Camera state
const camera = {
    x: 0,
    y: 0,
    rotation: 0 // 0, 90, 180, 270
};

// Player state
const player = {
    x: 12 * TILE_SIZE, // Starting position in front of hospital
    y: 13 * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    speed: 3,
    direction: 'down',
    isLocked: false
};

// NPCs
const ptCat = {
    x: 2 * TILE_SIZE,
    y: 16 * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    direction: 'down',
    triggered: false
};

const sarah = {
    x: 4 * TILE_SIZE,
    y: 15 * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    direction: 'down'
};

const zazu = {
    x: 5 * TILE_SIZE,
    y: 15 * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    direction: 'left'
};

const captain = {
    x: 1 * TILE_SIZE,
    y: 6 * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    direction: 'right'
};

// Input handling
const keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    q: false,
    e: false
};

// City map layout
// 0 = grass/ground, 1 = road, 2 = building, 3 = hospital, 4 = tree, 5 = sidewalk, 6 = lab, 7 = police station
const cityMap = [
    [4, 4, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4],
    [4, 0, 0, 0, 4, 2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 4, 0, 0, 0, 4],
    [4, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 4],
    [4, 0, 0, 0, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 0, 0, 0, 4],
    [7, 7, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 2, 2],
    [7, 7, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 2, 2],
    [7, 7, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 2, 2],
    [7, 7, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 2, 2],
    [4, 0, 0, 0, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 0, 0, 0, 4],
    [4, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 4],
    [4, 0, 0, 0, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 0, 0, 0, 4],
    [4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4],
    [4, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 4],
    [4, 0, 0, 0, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 0, 0, 0, 4],
    [2, 2, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 2, 2],
    [6, 6, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6]
];

// Tile colors
const tileColors = {
    0: '#4a7c59', // grass
    1: '#555555', // road
    2: '#8b7355', // building
    3: '#ffffff', // hospital (white)
    4: '#2d5a27', // tree
    5: '#b8b8b8', // sidewalk
    6: '#4a3b5a', // lab (dark purple)
    7: '#34495e'  // police station (dark blue)
};

// Tile Heights (Z)
const tileHeights = {
    0: 0,
    1: 0,
    2: BLOCK_HEIGHT,
    3: BLOCK_HEIGHT,
    4: 10,
    5: 0,
    6: BLOCK_HEIGHT,
    7: BLOCK_HEIGHT
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
        case 'q':
            if (!keys.q) rotateCamera('left');
            keys.q = true;
            break;
        case 'e':
            if (!keys.e) rotateCamera('right');
            keys.e = true;
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
        case 'q':
            keys.q = false;
            break;
        case 'e':
            keys.e = false;
            break;
    }
});

function rotateCamera(direction) {
    if (direction === 'left') {
        camera.rotation = (camera.rotation + 90) % 360;
    } else {
        camera.rotation = (camera.rotation - 90 + 360) % 360;
    }
}

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

// Helper: Convert grid/world coordinates to Screen ISO coordinates
function toScreen(x, y, z = 0) {
    let rx, ry;
    const maxW = MAP_WIDTH * TILE_SIZE;
    const maxH = MAP_HEIGHT * TILE_SIZE;

    if (camera.rotation === 0) {
        rx = x;
        ry = y;
    } else if (camera.rotation === 90) {
        rx = y;
        ry = maxW - x;
    } else if (camera.rotation === 180) {
        rx = maxW - x;
        ry = maxH - y;
    } else { // 270
        rx = maxH - y;
        ry = x;
    }

    const gridX = rx / TILE_SIZE;
    const gridY = ry / TILE_SIZE;

    const screenX = (gridX - gridY) * (ISO_TILE_WIDTH / 2);
    const screenY = (gridX + gridY) * (ISO_TILE_HEIGHT / 2) - z;

    return { x: screenX + canvas.width / 2 - camera.x, y: screenY + canvas.height / 2 - camera.y };
}

// Update player position
function updatePlayer() {
    if (player.isLocked) return;

    let newX = player.x;
    let newY = player.y;
    
    let dx = 0;
    let dy = 0;
    
    if (keys.up) dy = -1;
    if (keys.down) dy = 1;
    if (keys.left) dx = -1;
    if (keys.right) dx = 1;

    if (dx !== 0 || dy !== 0) {
        let worldDx = dx;
        let worldDy = dy;

        if (camera.rotation === 90) {
            worldDx = -dy;
            worldDy = dx;
        } else if (camera.rotation === 180) {
            worldDx = -dx;
            worldDy = -dy;
        } else if (camera.rotation === 270) {
            worldDx = dy;
            worldDy = -dx;
        }

        newX += worldDx * player.speed;
        newY += worldDy * player.speed;

        if (worldDx > 0) player.direction = 'right';
        if (worldDx < 0) player.direction = 'left';
        if (worldDy > 0) player.direction = 'down';
        if (worldDy < 0) player.direction = 'up';
    }

    if (canMove(newX, player.y)) {
        player.x = newX;
    }
    if (canMove(player.x, newY)) {
        player.y = newY;
    }

    // Trigger PT Interaction
    checkInteractions();

    // Update Camera Target (centered on player)
    const gridX_P = getRotatedX(player.x, player.y) / TILE_SIZE;
    const gridY_P = getRotatedY(player.x, player.y) / TILE_SIZE;
    const targetCamX = (gridX_P - gridY_P) * (ISO_TILE_WIDTH / 2);
    const targetCamY = (gridX_P + gridY_P) * (ISO_TILE_HEIGHT / 2);

    camera.x = targetCamX;
    camera.y = targetCamY;
}

let activeDialog = null;

function checkInteractions() {
    // If cutscene is playing, don't check other interactions or clear dialog
    if (player.isLocked) return;

    // Distance to PT's Lab area
    const distToLab = Math.sqrt(Math.pow(player.x - ptCat.x, 2) + Math.pow(player.y - ptCat.y, 2));

    if (distToLab < 5 * TILE_SIZE && !ptCat.triggered) {
        ptCat.triggered = true;
        startPTCutscene();
        return; // Don't process other dialogs this frame
    }

    // Distance to Sarah
    const distToSarah = Math.sqrt(Math.pow(player.x - sarah.x, 2) + Math.pow(player.y - sarah.y, 2));
    if (distToSarah < 2 * TILE_SIZE) {
        activeDialog = { text: "Sarah: I'm writing a blog post about this villain!", x: sarah.x, y: sarah.y - TILE_SIZE };
        return;
    }

    // Distance to Captain
    const distToCapt = Math.sqrt(Math.pow(player.x - captain.x, 2) + Math.pow(player.y - captain.y, 2));
    if (distToCapt < 2 * TILE_SIZE) {
        activeDialog = { text: "Captain: Good work, Dog Man! Keep the city safe!", x: captain.x, y: captain.y - TILE_SIZE };
        return;
    }

    // Only clear if we aren't in a cutscene (checked at top)
    activeDialog = null;
}

function startPTCutscene() {
    player.isLocked = true;

    // Show Dialog
    activeDialog = { text: "PT: Butler! Bring me the Living Spray!", x: ptCat.x, y: ptCat.y - TILE_SIZE };

    setTimeout(() => {
        activeDialog = null;
        player.isLocked = false;
    }, 4000);
}

function getRotatedX(x, y) {
    const maxW = MAP_WIDTH * TILE_SIZE;
    const maxH = MAP_HEIGHT * TILE_SIZE;
    if (camera.rotation === 0) return x;
    if (camera.rotation === 90) return y;
    if (camera.rotation === 180) return maxW - x;
    return maxH - y;
}

function getRotatedY(x, y) {
    const maxW = MAP_WIDTH * TILE_SIZE;
    const maxH = MAP_HEIGHT * TILE_SIZE;
    if (camera.rotation === 0) return y;
    if (camera.rotation === 90) return maxW - x;
    if (camera.rotation === 180) return maxH - y;
    return x;
}

// Draw a single block/tile
function drawBlock(tile, x, y, z) {
    const worldX = x * TILE_SIZE;
    const worldY = y * TILE_SIZE;

    const pos = toScreen(worldX, worldY, 0);

    const cx = pos.x;
    const cy = pos.y;

    const halfW = ISO_TILE_WIDTH / 2;
    const halfH = ISO_TILE_HEIGHT / 2;

    ctx.fillStyle = tileColors[tile];

    const topY = cy - z;

    // Top Face
    ctx.beginPath();
    ctx.moveTo(cx, topY);
    ctx.lineTo(cx + halfW, topY + halfH);
    ctx.lineTo(cx, topY + ISO_TILE_HEIGHT);
    ctx.lineTo(cx - halfW, topY + halfH);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Sides
    if (z > 0) {
        ctx.fillStyle = darken(tileColors[tile], 20);
        ctx.beginPath();
        ctx.moveTo(cx + halfW, topY + halfH);
        ctx.lineTo(cx + halfW, topY + halfH + z);
        ctx.lineTo(cx, topY + ISO_TILE_HEIGHT + z);
        ctx.lineTo(cx, topY + ISO_TILE_HEIGHT);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = darken(tileColors[tile], 40);
        ctx.beginPath();
        ctx.moveTo(cx - halfW, topY + halfH);
        ctx.lineTo(cx - halfW, topY + halfH + z);
        ctx.lineTo(cx, topY + ISO_TILE_HEIGHT + z);
        ctx.lineTo(cx, topY + ISO_TILE_HEIGHT);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    // Details
    if (tile === 4) { // Tree
        const treeX = cx;
        const treeY = topY + halfH;
        ctx.fillStyle = '#1a4a1a';
        ctx.beginPath();
        ctx.ellipse(treeX, treeY - 10, 10, 20, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    if (tile === 3) { // Hospital Cross
        const tx = cx;
        const ty = topY + halfH;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(tx - 2, ty - 8, 4, 16);
        ctx.fillRect(tx - 8, ty - 2, 16, 4);
    }

    if (tile === 6) { // Lab text
        const tx = cx;
        const ty = topY + halfH;
        ctx.fillStyle = '#cc0000';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('LAB', tx, ty - 5);
    }

    if (tile === 7) { // Police text
        const tx = cx;
        const ty = topY + halfH;
        ctx.fillStyle = '#f1c40f'; // Yellow
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('POLICE', tx, ty - 5);
    }
}

function darken(color, percent) {
    const num = parseInt(color.replace('#',''), 16);
    const amt = Math.round(2.55 * percent);
    let R = (num >> 16) - amt;
    let B = ((num >> 8) & 0x00FF) - amt;
    let G = (num & 0x0000FF) - amt;

    return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
}

// Draw the city map
function drawMap() {
    const tilesToDraw = [];
    for(let y=0; y<MAP_HEIGHT; y++) {
        for(let x=0; x<MAP_WIDTH; x++) {
            tilesToDraw.push({x, y, tile: cityMap[y][x]});
        }
    }
    
    // Add entities to sort list
    // We treat entities as objects at their floor position
    tilesToDraw.push({type: 'player', x: player.x/TILE_SIZE, y: player.y/TILE_SIZE});
    tilesToDraw.push({type: 'pt', x: ptCat.x/TILE_SIZE, y: ptCat.y/TILE_SIZE});
    tilesToDraw.push({type: 'sarah', x: sarah.x/TILE_SIZE, y: sarah.y/TILE_SIZE});
    tilesToDraw.push({type: 'zazu', x: zazu.x/TILE_SIZE, y: zazu.y/TILE_SIZE});
    tilesToDraw.push({type: 'captain', x: captain.x/TILE_SIZE, y: captain.y/TILE_SIZE});

    tilesToDraw.sort((a, b) => {
        const posA = toScreen(a.x * TILE_SIZE, a.y * TILE_SIZE, 0);
        const posB = toScreen(b.x * TILE_SIZE, b.y * TILE_SIZE, 0);
        return posA.y - posB.y;
    });

    tilesToDraw.forEach(t => {
        if (t.type) {
            if (t.type === 'player') drawPlayer();
            if (t.type === 'pt') drawPTCat();
            if (t.type === 'sarah') drawSarah();
            if (t.type === 'zazu') drawZazu();
            if (t.type === 'captain') drawCaptain();
        } else {
            const h = tileHeights[t.tile] || 0;
            drawBlock(t.tile, t.x, t.y, h);
        }
    });

    const hospPos = toScreen(12.5 * TILE_SIZE, 11.5 * TILE_SIZE, BLOCK_HEIGHT);
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('HOSPITAL', hospPos.x, hospPos.y - 20);

    if (activeDialog) {
        const dPos = toScreen(activeDialog.x, activeDialog.y, BLOCK_HEIGHT);
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        const textWidth = ctx.measureText(activeDialog.text).width;
        ctx.fillRect(dPos.x - textWidth/2 - 10, dPos.y - 40, textWidth + 20, 30);
        ctx.strokeRect(dPos.x - textWidth/2 - 10, dPos.y - 40, textWidth + 20, 30);

        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(activeDialog.text, dPos.x, dPos.y - 20);
    }
}

// Draw the dog man character
function drawPlayer() {
    const pos = toScreen(player.x, player.y, 0);
    drawCharacter(pos, 'dogman', player.direction);
}

function drawPTCat() {
    const pos = toScreen(ptCat.x, ptCat.y, 0);
    drawCharacter(pos, 'pt', ptCat.direction);
}

function drawSarah() {
    const pos = toScreen(sarah.x, sarah.y, 0);
    drawCharacter(pos, 'sarah', sarah.direction);
}

function drawZazu() {
    const pos = toScreen(zazu.x, zazu.y, 0);
    drawCharacter(pos, 'zazu', zazu.direction);
}

function drawCaptain() {
    const pos = toScreen(captain.x, captain.y, 0);
    drawCharacter(pos, 'captain', captain.direction);
}

function drawCharacter(pos, type, direction) {
    const px = pos.x - TILE_SIZE/2;
    const py = pos.y - TILE_SIZE/2 - TILE_SIZE/2;
    
    ctx.save();
    ctx.translate(px, py);
    
    const size = TILE_SIZE;
    const lx = 0;
    const ly = 0;
    
    if (type === 'dogman') {
        // Draw body
        ctx.fillStyle = '#3498db';
        ctx.fillRect(lx + size * 0.25, ly + size * 0.45, size * 0.5, size * 0.4);

        // Legs
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(lx + size * 0.25, ly + size * 0.75, size * 0.2, size * 0.25);
        ctx.fillRect(lx + size * 0.55, ly + size * 0.75, size * 0.2, size * 0.25);

        // Arms
        ctx.fillStyle = '#e8b89d';
        ctx.fillRect(lx + size * 0.1, ly + size * 0.45, size * 0.15, size * 0.3);
        ctx.fillRect(lx + size * 0.75, ly + size * 0.45, size * 0.15, size * 0.3);

        // Head
        ctx.fillStyle = '#b87333';
        ctx.beginPath();
        ctx.ellipse(lx + size/2, ly + size * 0.28, size * 0.32, size * 0.28, 0, 0, Math.PI * 2);
        ctx.fill();

        // Ears
        ctx.fillStyle = '#8b5a2b';
        ctx.beginPath();
        ctx.ellipse(lx + size * 0.22, ly + size * 0.12, size * 0.1, size * 0.15, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(lx + size * 0.78, ly + size * 0.12, size * 0.1, size * 0.15, 0.3, 0, Math.PI * 2);
        ctx.fill();

    } else if (type === 'pt') {
        // Orange cat, Quadruped
        ctx.fillStyle = '#ff9900'; // Orange

        // Body (Horizontal ellipse/rect)
        ctx.beginPath();
        ctx.ellipse(lx + size/2, ly + size * 0.65, size * 0.3, size * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Stripes on body
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(lx + size * 0.5, ly + size * 0.65, size * 0.2, 0, Math.PI, true); // Curve stripe
        ctx.stroke();
        // Simple stripes
        ctx.fillRect(lx + size * 0.35, ly + size * 0.55, size * 0.05, size * 0.2);
        ctx.fillRect(lx + size * 0.5, ly + size * 0.55, size * 0.05, size * 0.2);
        ctx.fillRect(lx + size * 0.65, ly + size * 0.55, size * 0.05, size * 0.2);

        // Head
        ctx.fillStyle = '#ff9900';
        ctx.beginPath();
        // Head position depends on direction slightly, but let's keep it simple
        ctx.arc(lx + size * 0.3, ly + size * 0.5, size * 0.18, 0, Math.PI * 2);
        ctx.fill();

        // Ears
        ctx.beginPath();
        ctx.moveTo(lx + size * 0.2, ly + size * 0.4);
        ctx.lineTo(lx + size * 0.25, ly + size * 0.3);
        ctx.lineTo(lx + size * 0.3, ly + size * 0.4);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(lx + size * 0.3, ly + size * 0.4);
        ctx.lineTo(lx + size * 0.35, ly + size * 0.3);
        ctx.lineTo(lx + size * 0.4, ly + size * 0.4);
        ctx.fill();

        // Legs (4 small paws)
        ctx.fillStyle = '#ff9900';
        ctx.fillRect(lx + size * 0.3, ly + size * 0.8, size * 0.08, size * 0.15);
        ctx.fillRect(lx + size * 0.45, ly + size * 0.8, size * 0.08, size * 0.15);
        ctx.fillRect(lx + size * 0.6, ly + size * 0.8, size * 0.08, size * 0.15);
        ctx.fillRect(lx + size * 0.7, ly + size * 0.8, size * 0.08, size * 0.15);

        // Tail
        ctx.strokeStyle = '#ff9900';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(lx + size * 0.75, ly + size * 0.65);
        ctx.quadraticCurveTo(lx + size * 0.9, ly + size * 0.5, lx + size * 0.95, ly + size * 0.6);
        ctx.stroke();
        ctx.lineWidth = 1;

    } else if (type === 'sarah') {
        // Red shirt, brown hair
         // Body
        ctx.fillStyle = '#cc0000'; // Red shirt
        ctx.fillRect(lx + size * 0.25, ly + size * 0.45, size * 0.5, size * 0.4);

        // Legs
        ctx.fillStyle = '#333333';
        ctx.fillRect(lx + size * 0.25, ly + size * 0.75, size * 0.2, size * 0.25);
        ctx.fillRect(lx + size * 0.55, ly + size * 0.75, size * 0.2, size * 0.25);

        // Arms
        ctx.fillStyle = '#e8b89d';
        ctx.fillRect(lx + size * 0.1, ly + size * 0.45, size * 0.15, size * 0.3);
        ctx.fillRect(lx + size * 0.75, ly + size * 0.45, size * 0.15, size * 0.3);

        // Head
        ctx.fillStyle = '#e8b89d';
        ctx.beginPath();
        ctx.ellipse(lx + size/2, ly + size * 0.28, size * 0.25, size * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();

        // Hair (Brown)
        ctx.fillStyle = '#5c4033';
        ctx.beginPath();
        ctx.arc(lx + size/2, ly + size * 0.25, size * 0.28, Math.PI, 0);
        ctx.fill();

    } else if (type === 'zazu') {
        // Grey poodle
        ctx.fillStyle = '#888888';

        // Poodle puffs!
        // Body
        ctx.beginPath();
        ctx.ellipse(lx + size/2, ly + size * 0.6, size * 0.2, size * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.beginPath();
        ctx.arc(lx + size/2, ly + size * 0.4, size * 0.12, 0, Math.PI * 2);
        ctx.fill();

        // Ears
        ctx.beginPath();
        ctx.ellipse(lx + size * 0.35, ly + size * 0.45, size * 0.08, size * 0.12, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(lx + size * 0.65, ly + size * 0.45, size * 0.08, size * 0.12, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // Legs
        ctx.fillRect(lx + size * 0.35, ly + size * 0.7, size * 0.05, size * 0.2);
        ctx.fillRect(lx + size * 0.6, ly + size * 0.7, size * 0.05, size * 0.2);

    } else if (type === 'captain') {
        // Police Captain (Blue Uniform, Hat)
        // Body
        ctx.fillStyle = '#2c3e50'; // Dark blue uniform
        ctx.fillRect(lx + size * 0.25, ly + size * 0.45, size * 0.5, size * 0.4);

        // Legs
        ctx.fillStyle = '#1a252f';
        ctx.fillRect(lx + size * 0.25, ly + size * 0.75, size * 0.2, size * 0.25);
        ctx.fillRect(lx + size * 0.55, ly + size * 0.75, size * 0.2, size * 0.25);

        // Arms
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(lx + size * 0.1, ly + size * 0.45, size * 0.15, size * 0.3);
        ctx.fillRect(lx + size * 0.75, ly + size * 0.45, size * 0.15, size * 0.3);

        // Badge
        ctx.fillStyle = '#f1c40f'; // Gold
        ctx.beginPath();
        ctx.moveTo(lx + size * 0.4, ly + size * 0.5);
        ctx.lineTo(lx + size * 0.45, ly + size * 0.6);
        ctx.lineTo(lx + size * 0.35, ly + size * 0.6);
        ctx.fill();

        // Head
        ctx.fillStyle = '#e8b89d';
        ctx.beginPath();
        ctx.ellipse(lx + size/2, ly + size * 0.28, size * 0.28, size * 0.28, 0, 0, Math.PI * 2);
        ctx.fill();

        // Hat
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.arc(lx + size/2, ly + size * 0.15, size * 0.3, Math.PI, 0);
        ctx.lineTo(lx + size * 0.8, ly + size * 0.15);
        ctx.lineTo(lx + size * 0.2, ly + size * 0.15);
        ctx.fill();
        // Hat brim
        ctx.fillStyle = '#000000';
        ctx.fillRect(lx + size * 0.2, ly + size * 0.12, size * 0.6, size * 0.05);
        // Badge on hat
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(lx + size/2, ly + size * 0.08, size * 0.04, 0, Math.PI * 2);
        ctx.fill();

    }

    // Common Face details
    if (type !== 'zazu') { // Zazu is too fluffy for details
        // Eyes
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(lx + size * 0.38, ly + size * 0.25, size * 0.05, 0, Math.PI * 2);
        ctx.arc(lx + size * 0.62, ly + size * 0.25, size * 0.05, 0, Math.PI * 2);
        ctx.fill();

        // Nose/Snout
        if (type === 'pt' || type === 'dogman') {
            ctx.fillStyle = '#000000';
             ctx.beginPath();
            ctx.arc(lx + size/2, ly + size * 0.38, size * 0.04, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.restore();
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
    // Clear canvas (Dark blue background for atmosphere)
    ctx.fillStyle = '#2c2c3e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update
    updatePlayer();
    
    // Draw
    drawMap();
    // drawPlayer(); // Removed because it's now drawn inside drawMap for depth sorting
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
