// Procedural sample images and patterns for interactive tensor demonstrations

export interface PixelData {
  r: number;
  g: number;
  b: number;
}

export type ImageMatrix = PixelData[][];

// 8x8 MNIST-like digit '7' in grayscale (values 0-255)
export const DIGIT_7_PATTERN_8X8: number[][] = [
  [0,   0,   0,   0,   0,   0,   0,   0],
  [0, 220, 255, 255, 255, 255, 200,   0],
  [0,   0,   0,   0,  60, 240, 120,   0],
  [0,   0,   0,   0, 180, 220,   0,   0],
  [0,   0,   0, 120, 240,  40,   0,   0],
  [0,   0,  40, 230, 140,   0,   0,   0],
  [0,   0, 160, 220,   0,   0,   0,   0],
  [0,   0, 200, 100,   0,   0,   0,   0],
];

// 8x8 RGB sample image (landscape / sunset motif)
export const SUNSET_PATTERN_8X8: ImageMatrix = [
  // Sky
  [{r:255,g:100,b:60},  {r:255,g:110,b:70},  {r:250,g:120,b:80},  {r:240,g:130,b:90},  {r:230,g:140,b:100}, {r:220,g:130,b:90},  {r:210,g:120,b:80},  {r:200,g:100,b:70}],
  [{r:255,g:130,b:70},  {r:255,g:150,b:80},  {r:255,g:170,b:90},  {r:255,g:190,b:100}, {r:255,g:190,b:100}, {r:255,g:170,b:90},  {r:245,g:150,b:80},  {r:235,g:130,b:70}],
  // Sun row
  [{r:255,g:160,b:80},  {r:255,g:180,b:90},  {r:255,g:240,b:150}, {r:255,g:255,b:200}, {r:255,g:255,b:200}, {r:255,g:240,b:150}, {r:250,g:180,b:90},  {r:240,g:160,b:80}],
  [{r:255,g:140,b:70},  {r:255,g:170,b:90},  {r:255,g:255,b:200}, {r:255,g:255,b:255}, {r:255,g:255,b:255}, {r:255,g:255,b:200}, {r:255,g:170,b:90},  {r:240,g:140,b:70}],
  // Mountains
  [{r:70,g:40,b:80},    {r:90,g:50,b:100},   {r:110,g:60,b:120},  {r:80,g:45,b:90},    {r:60,g:35,b:70},    {r:100,g:55,b:110},  {r:130,g:70,b:140},  {r:80,g:45,b:90}],
  [{r:40,g:30,b:60},    {r:50,g:35,b:70},    {r:60,g:40,b:80},    {r:50,g:35,b:70},    {r:40,g:30,b:60},    {r:70,g:45,b:90},    {r:90,g:55,b:110},   {r:50,g:35,b:70}],
  // Ocean / Water reflection
  [{r:30,g:50,b:100},   {r:40,g:70,b:120},   {r:120,g:120,b:140}, {r:200,g:160,b:150}, {r:200,g:160,b:150}, {r:120,g:120,b:140}, {r:40,g:70,b:120},   {r:30,g:50,b:100}],
  [{r:20,g:40,b:80},    {r:30,g:50,b:100},   {r:80,g:90,b:120},   {r:150,g:120,b:130}, {r:150,g:120,b:130}, {r:80,g:90,b:120},   {r:30,g:50,b:100},   {r:20,g:40,b:80}],
];

// 8x8 Geometric circle pattern
export const CIRCLE_PATTERN_8X8: ImageMatrix = [
  [{r:240,g:240,b:240}, {r:240,g:240,b:240}, {r:30,g:144,b:255},  {r:30,g:144,b:255},  {r:30,g:144,b:255},  {r:30,g:144,b:255},  {r:240,g:240,b:240}, {r:240,g:240,b:240}],
  [{r:240,g:240,b:240}, {r:30,g:144,b:255},  {r:0,g:191,b:255},   {r:0,g:191,b:255},   {r:0,g:191,b:255},   {r:0,g:191,b:255},   {r:30,g:144,b:255},  {r:240,g:240,b:240}],
  [{r:30,g:144,b:255},  {r:0,g:191,b:255},   {r:135,g:206,b:250}, {r:135,g:206,b:250}, {r:135,g:206,b:250}, {r:135,g:206,b:250}, {r:0,g:191,b:255},   {r:30,g:144,b:255}],
  [{r:30,g:144,b:255},  {r:0,g:191,b:255},   {r:135,g:206,b:250}, {r:255,g:255,b:255}, {r:255,g:255,b:255}, {r:135,g:206,b:250}, {r:0,g:191,b:255},   {r:30,g:144,b:255}],
  [{r:30,g:144,b:255},  {r:0,g:191,b:255},   {r:135,g:206,b:250}, {r:255,g:255,b:255}, {r:255,g:255,b:255}, {r:135,g:206,b:250}, {r:0,g:191,b:255},   {r:30,g:144,b:255}],
  [{r:30,g:144,b:255},  {r:0,g:191,b:255},   {r:135,g:206,b:250}, {r:135,g:206,b:250}, {r:135,g:206,b:250}, {r:135,g:206,b:250}, {r:0,g:191,b:255},   {r:30,g:144,b:255}],
  [{r:240,g:240,b:240}, {r:30,g:144,b:255},  {r:0,g:191,b:255},   {r:0,g:191,b:255},   {r:0,g:191,b:255},   {r:0,g:191,b:255},   {r:30,g:144,b:255},  {r:240,g:240,b:240}],
  [{r:240,g:240,b:240}, {r:240,g:240,b:240}, {r:30,g:144,b:255},  {r:30,g:144,b:255},  {r:30,g:144,b:255},  {r:30,g:144,b:255},  {r:240,g:240,b:240}, {r:240,g:240,b:240}],
];

// Helper to generate dynamic grayscale grid of size H x W
export function generateGrayscalePattern(height: number, width: number, type: 'gradient' | 'checker' | 'circle'): number[][] {
  const result: number[][] = [];
  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      let val = 0;
      if (type === 'gradient') {
        val = Math.round(((y + x) / (height + width - 2 || 1)) * 255);
      } else if (type === 'checker') {
        val = (Math.floor(y / 2) + Math.floor(x / 2)) % 2 === 0 ? 230 : 30;
      } else {
        const cy = height / 2 - 0.5;
        const cx = width / 2 - 0.5;
        const dist = Math.sqrt((y - cy) ** 2 + (x - cx) ** 2);
        const maxDist = Math.sqrt(cy ** 2 + cx ** 2);
        val = Math.max(0, Math.min(255, Math.round((1 - dist / maxDist) * 255)));
      }
      row.push(val);
    }
    result.push(row);
  }
  return result;
}

// Helper to convert Grayscale to RGB Matrix
export function grayscaleToRGBMatrix(gray: number[][]): ImageMatrix {
  return gray.map(row => row.map(val => ({ r: val, g: val, b: val })));
}

// Convert ImageMatrix to 1D flat array of shape [H, W, 3] or [H, W, 1]
export function matrixToFlatValues(matrix: ImageMatrix, channels: 1 | 3): number[] {
  const flat: number[] = [];
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const p = matrix[y][x];
      if (channels === 1) {
        flat.push(Math.round(0.299 * p.r + 0.587 * p.g + 0.114 * p.b));
      } else {
        flat.push(p.r, p.g, p.b);
      }
    }
  }
  return flat;
}
