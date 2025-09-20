const fs = require('fs');
const mapData = require('./data.json')


let vertices = [];
let faces = [];
let offset = { x: 0, y: 0 };
let vertexCount = 1; // OBJ indices start at 1

function parseCoords(str) {
    // Converts "16,80" -> [16,80] and applies current offset
    const [x, y] = str.split(/[ ,]/).map(Number);
    return [(x + offset.x) / 10, (y + offset.y) / 10]; // divide by 10 to undo game scale
}

// Parse map data
mapData.forEach((line, idx) => {
    if (!line) return;
    const parts = line.trim().split(' ');
    const type = parts[0];

    if (type === 'b') {
        const [x, y] = parts[1].split(/[ ,]/).map(Number);
        offset = { x, y };
    }

    if (type === 'w') {
        const [startStr, endStr] = parts.slice(1, 3);
        const [sx, sy] = parseCoords(startStr);
        const [ex, ey] = parseCoords(endStr);
        const zBottom = 0;
        const zTop = 1; // default wall height 1, you could map textures to heights if you like

        // Add vertices
        vertices.push([sx, zBottom, sy]);
        vertices.push([ex, zBottom, ey]);
        vertices.push([ex, zTop, ey]);
        vertices.push([sx, zTop, sy]);

        // Add face
        faces.push([vertexCount, vertexCount + 1, vertexCount + 2, vertexCount + 3]);
        vertexCount += 4;
    }

    if (type === 'z') {
        const [startStr, endStr] = parts.slice(1, 3);
        const [sx, sy] = parseCoords(startStr);
        const [ex, ey] = parseCoords(endStr);
        // wait for x line for sectors/height
        const xLine = mapData[idx + 1].trim().split(' ');
        if (xLine[0] !== 'x') return;

        const [sector1, sector2, texU, texL] = xLine.slice(1).map(n => Number(n.split(',')[0]));
        const zBottom = 0;
        const zTop = 1;

        vertices.push([sx, zBottom, sy]);
        vertices.push([ex, zBottom, ey]);
        vertices.push([ex, zTop, ey]);
        vertices.push([sx, zTop, sy]);
        faces.push([vertexCount, vertexCount + 1, vertexCount + 2, vertexCount + 3]);
        vertexCount += 4;
    }
});

// Build OBJ content
let obj = '';
vertices.forEach(v => obj += `v ${v[0]} ${v[1]} ${v[2]}\n`);
faces.forEach(f => obj += `f ${f.join(' ')}\n`);

// Write OBJ file
fs.writeFileSync('map.obj', obj);
console.log('OBJ file created!');