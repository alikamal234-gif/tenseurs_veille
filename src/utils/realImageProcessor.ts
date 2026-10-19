// Canvas image processing helpers for real photos (cat, parrot)

export interface RGBPixel {
  r: number;
  g: number;
  b: number;
}

// Extract pixel at (x, y) from an ImageData array
export function getPixel(imageData: ImageData, x: number, y: number): RGBPixel {
  const clampedX = Math.max(0, Math.min(imageData.width - 1, Math.round(x)));
  const clampedY = Math.max(0, Math.min(imageData.height - 1, Math.round(y)));
  const idx = (clampedY * imageData.width + clampedX) * 4;
  return {
    r: imageData.data[idx],
    g: imageData.data[idx + 1],
    b: imageData.data[idx + 2],
  };
}

// Apply channel multipliers (Red, Green, Blue) to ImageData
export function filterChannels(
  source: ImageData,
  target: ImageData,
  rFactor: number,
  gFactor: number,
  bFactor: number,
  isolatedChannel: 'all' | 'r' | 'g' | 'b' = 'all'
) {
  const data = source.data;
  const out = target.data;
  for (let i = 0; i < data.length; i += 4) {
    let r = (data[i] * rFactor) / 100;
    let g = (data[i + 1] * gFactor) / 100;
    let b = (data[i + 2] * bFactor) / 100;

    if (isolatedChannel === 'r') {
      g = 0;
      b = 0;
    } else if (isolatedChannel === 'g') {
      r = 0;
      b = 0;
    } else if (isolatedChannel === 'b') {
      r = 0;
      g = 0;
    }

    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = b;
    out[i + 3] = data[i + 3]; // Alpha
  }
}

// 3x3 Convolution filter applied to ImageData (producing a real feature map!)
export function applyConvolution(
  source: ImageData,
  target: ImageData,
  kernel: number[][],
  bias: number = 0
) {
  const w = source.width;
  const h = source.height;
  const src = source.data;
  const dst = target.data;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let rSum = 0;
      let gSum = 0;
      let bSum = 0;

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const weight = kernel[ky + 1][kx + 1];
          const idx = ((y + ky) * w + (x + kx)) * 4;
          rSum += src[idx] * weight;
          gSum += src[idx + 1] * weight;
          bSum += src[idx + 2] * weight;
        }
      }

      // Convert to luminance feature intensity
      const val = Math.max(0, Math.min(255, (rSum * 0.299 + gSum * 0.587 + bSum * 0.114) + bias));
      const dstIdx = (y * w + x) * 4;
      dst[dstIdx] = val;
      dst[dstIdx + 1] = val;
      dst[dstIdx + 2] = val;
      dst[dstIdx + 3] = 255;
    }
  }
}
