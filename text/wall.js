// --- Globals (need to be set elsewhere in your game) ---
let hts_playerX = 0;
let hts_playerY = 0;
let hts_playerZ = 0;
let hts_playerRot = 0;
let hts_viewSin = 0;
let hts_viewCos = 1;
const hts_scalarScreenWidth = 320;
const hts_scalarHalfScreenWidth = hts_scalarScreenWidth / 2;
const DOUBLE_504315c8 = 0.032;

// --- Wall Compute 1 ---
function HTS_WallCompute1(wall, param2) {
    const scalar4Over128 = 125 / 4;
    const paramSmaller = 10000 / (param2 - 160);

    const local8 = scalar4Over128 * wall.relStartY - paramSmaller * wall.relStartX;
    const local10 = (local8 !== 0) ? local8 / (wall.relEndY - wall.relStartX) : 0;

    return local10; // optional return if needed
}

// --- Compare two numbers like FP2_Compare ---
function FP2_Compare(a, b) {
    if (a === b) return 0;
    return a < b ? -1 : 1;
}

// --- Wall Compute 2 ---
function HTS_WallCompute2(wall1, wall2) {
    if (!wall1 || !wall2) return 0;

    let screen1 = wall1.firstColumn;
    let screen2 = wall2.lastColumn;

    if (FP2_Compare(screen1, screen2) < 0 &&
        FP2_Compare(wall1.lastColumn, wall2.firstColumn) > 0) {

        if (FP2_Compare(screen1, wall2.firstColumn) < 0) screen1 = wall2.firstColumn;

        let local18 = (((screen1 + Math.min(wall1.lastColumn, screen2)) / 2) - hts_scalarHalfScreenWidth)
            * DOUBLE_504315c8 / hts_scalarScreenWidth;

        let local8 = -(local18 * wall2.f1 - wall2.f2);
        let local10 = wall2.g / local8;

        let wall1Local = -(local18 * wall1.f1 - wall1.f2) / wall1.g;

        if (FP2_Compare(local10, wall1Local) > 0) return 0;
    }

    return 1;
}

// --- Update Wall Relative Positions ---
function HTS_UpdateWallRelPositions(walls) {
    for (let wall of walls) {
        // relative start/end positions from player
        wall.relStartY = (wall.startY - hts_playerY) * hts_viewSin -
            (wall.startX - hts_playerX) * hts_viewCos;
        wall.relStartX = (wall.startX - hts_playerX) * hts_viewSin +
            (wall.startY - hts_playerY) * hts_viewCos;

        wall.relEndX = (wall.endX - hts_playerX) * hts_viewSin -
            (wall.endY - hts_playerY) * hts_viewCos;
        wall.relEndY = (wall.endY - hts_playerY) * hts_viewSin +
            (wall.endX - hts_playerX) * hts_viewCos;

        // screen projection
        let firstCol = (hts_scalarHalfScreenWidth + wall.relStartY / wall.relEndY * hts_scalarScreenWidth) || 0;
        let lastCol = (hts_scalarHalfScreenWidth + wall.relEndY / wall.relEndX * hts_scalarScreenWidth) || 0;

        wall.firstColumn = Math.min(hts_scalarScreenWidth - 1, Math.max(0, firstCol));
        wall.lastColumn = Math.min(hts_scalarScreenWidth - 1, Math.max(0, lastCol));
    }
}
