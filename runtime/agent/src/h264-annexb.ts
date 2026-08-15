export function findStartCode(buf: Buffer, from: number): number {
  for (let i = from; i + 2 < buf.length; i++) {
    if (buf[i] === 0 && buf[i + 1] === 0) {
      if (buf[i + 2] === 0 && buf[i + 3] === 1) return i;
      if (buf[i + 2] === 1) return i;
    }
  }
  return -1;
}

export function getStartCodeLength(buf: Buffer, index: number): 3 | 4 {
  return buf[index + 2] === 0 ? 4 : 3;
}

/** Returns whether an H.264 VCL NAL starts a new picture. */
export function isFirstSliceInPicture(nalu: Buffer): boolean | null {
  const type = nalu[0]! & 0x1f;
  if (type !== 1 && type !== 5) return null;

  const rbsp: number[] = [];
  for (let i = 1; i < nalu.length; i++) {
    if (i >= 3 && nalu[i - 2] === 0 && nalu[i - 1] === 0 && nalu[i] === 3) {
      continue;
    }
    rbsp.push(nalu[i]!);
  }

  let bit = 0;
  let leadingZeroBits = 0;
  while (readBit(rbsp, bit++) === 0) {
    leadingZeroBits++;
    if (leadingZeroBits > 31) return null;
  }
  if (bit > rbsp.length * 8) return null;
  return leadingZeroBits === 0;
}

function readBit(bytes: number[], bit: number): number | null {
  if (bit >= bytes.length * 8) return null;
  return (bytes[bit >> 3]! >> (7 - (bit & 7))) & 1;
}
