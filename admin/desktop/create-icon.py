#!/usr/bin/env python3
import struct, zlib, os

def create_heart_png(size, filename):
    pixels = []
    for y in range(size):
        row = []
        for x in range(size):
            nx = (x / (size - 1)) * 2 - 1
            ny = -((y / (size - 1)) * 2 - 1) - 0.1
            val = (nx*nx + ny*ny - 0.7)**3 - nx*nx * ny**3
            if val <= 0:
                row.extend([220, 38, 38, 255])
            else:
                row.extend([0, 0, 0, 0])
        pixels.append(bytes([0] + row))
    raw = b''.join(pixels)
    def chunk(ct, d):
        c = ct + d
        return struct.pack('>I', len(d)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)
    png = b'\x89PNG\r\n\x1a\n'
    png += chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0))
    png += chunk(b'IDAT', zlib.compress(raw))
    png += chunk(b'IEND', b'')
    with open(filename, 'wb') as f:
        f.write(png)

d = os.path.dirname(os.path.abspath(__file__))
for s in [16, 32, 128, 256, 512]:
    create_heart_png(s, os.path.join(d, f'heart-{s}.png'))
print("Done!")
