// --- Globals ---
let hts_rotSpeed = 0.05;
let hts_scalarPi = Math.PI;
let hts_scalarTwoPi = Math.PI * 2;
let hts_rotationNeedsUpdate = true;

let hts_playerX = 0, hts_playerY = 0, hts_playerZ = 0;
let hts_playerRot = 0;
let hts_playerVel = 0;
let hts_viewSin = 0, hts_viewCos = 1;

let hts_input = 0; // bitfield: HTS_INPUT_TURNING, etc.
let hts_normalSpeed = 1;
let hts_fastSpeed = 2;
let hts_playerSector = null;

let hts_solidWalls = []; // array of wall objects
let hts_thruWalls = [];  // array of wall objects

// --- Constants for input ---
const HTS_INPUT_TURNRIGHT = 0x02;
const HTS_INPUT_TURNLEFT = 0x04;
const HTS_INPUT_TURNING = HTS_INPUT_TURNRIGHT | HTS_INPUT_TURNLEFT;
const HTS_INPUT_FORWARD = 0x10;
const HTS_INPUT_BACKWARD = 0x08;
const HTS_INPUT_MOVING = HTS_INPUT_FORWARD | HTS_INPUT_BACKWARD;
const HTS_INPUT_RUN = 0x20;
const HTS_INPUT_FLY = 0x80;

// --- Player Update ---
function HTS_Update() {
    // Handle rotation
    if (hts_input & HTS_INPUT_TURNING) {
        if (hts_input & HTS_INPUT_TURNRIGHT) {
            hts_playerRot += hts_rotSpeed;
            if (hts_playerRot > hts_scalarTwoPi) hts_playerRot -= hts_scalarTwoPi;
            hts_rotationNeedsUpdate = true;
        }
        if (hts_input & HTS_INPUT_TURNLEFT) {
            hts_playerRot -= hts_rotSpeed;
            if (hts_playerRot < 0) hts_playerRot += hts_scalarTwoPi;
            hts_rotationNeedsUpdate = true;
        }
    }

    // Handle movement
    let moveAmt = 5;
    const speed = (hts_input & HTS_INPUT_RUN) ? hts_fastSpeed : hts_normalSpeed;
    moveAmt /= speed;

    if (hts_input & HTS_INPUT_FORWARD) hts_playerVel += moveAmt;
    if (hts_input & HTS_INPUT_BACKWARD) hts_playerVel -= moveAmt;

    // Update view sin/cos
    hts_viewSin = Math.sin(hts_playerRot);
    hts_viewCos = Math.cos(hts_playerRot);

    // Update wall positions if moving
    if (hts_playerVel !== 0) {
        HTS_UpdateWallRelPositions(hts_solidWalls);
        HTS_UpdateWallRelPositions(hts_thruWalls);

        // Collision / sector check
        let moveZ = hts_playerSector ? hts_playerSector.floorHeight : 0;
        if (!(hts_input & HTS_INPUT_FLY)) moveZ += hts_playerVel;

        for (let wall of [...hts_solidWalls, ...hts_thruWalls]) {
            let sectorToCheck = (wall.sector1 === hts_playerSector) ? wall.sector2 : wall.sector1;
            if (sectorToCheck && sectorToCheck.floorHeight > moveZ) {
                // collision detected
                hts_playerVel = 0;
                return false;
            }
        }

        // Move player
        hts_playerX += Math.sin(hts_playerRot) * hts_playerVel;
        hts_playerY += Math.cos(hts_playerRot) * hts_playerVel;

        // Update Z (height)
        if (!(hts_input & HTS_INPUT_FLY) && hts_playerSector) {
            hts_playerZ = hts_playerSector.floorHeight;
        }
    }

    return true;
}
