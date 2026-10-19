#!/usr/bin/env python3
"""Key green-screen images to transparency and fit them to a slide canvas.

Usage:

    python3 -I key-green.py [--canvas WxH] [--fill F] [--preview HEX] \
        OUT_DIR NAME=SRC [NAME=SRC ...]

Each SRC is an image generated on a solid #00FF00 background. Every subject is
keyed, cropped to its bounding box, scaled so that all subjects share one
height (F of the canvas height, less if a subject would be wider than F of the
canvas width), and centered on a transparent canvas, then saved as
OUT_DIR/NAME.webp. Sources keyed in one run get identical canvases and subject
heights, so a pair shown side by side matches.

--preview HEX also writes OUT_DIR/NAME-preview.png over that color, such as
the week's accent, for checking the edges by eye.

The run reports two things per subject. The first is how many pixels inside
the subject became partly transparent: anything above zero means the subject
itself contains green that the key ate, and the script exits 1 so the image is
looked at before it is used. The second is the share of the subject's outline
taken up by enclosed transparent holes. A hole can be real, such as a CD's
center, so a hole only prints a note; any hole the subject should not have
means the key cut a green patch out of it.

Needs numpy and Pillow. Keep downloaded images in their own directory and run
this script with python3 -I.
"""

import argparse
import sys

import numpy as np
from PIL import Image, ImageDraw

LO, HI = 40.0, 140.0  # greenness at which the key starts and fully clears
DESPILL_BAND = 4  # pixels around the cut where green spill is removed
INTERIOR_ERODE = 8  # pixels trimmed from the subject's edge for the check


def grow(mask, steps):
    for _ in range(steps):
        grown = mask.copy()
        grown[1:, :] |= mask[:-1, :]
        grown[:-1, :] |= mask[1:, :]
        grown[:, 1:] |= mask[:, :-1]
        grown[:, :-1] |= mask[:, 1:]
        mask = grown
    return mask


def hole_share(solid):
    # Flood the background in from the border on a reduced copy of the mask;
    # whatever transparent area the flood cannot reach is enclosed.
    step = max(1, -(-max(solid.shape) // 512))
    small = np.pad(solid[::step, ::step], 1)
    # copy(): an image made by fromarray shares the array's read-only buffer,
    # and a flood fill on it is silently lost.
    mask = Image.fromarray(small.astype(np.uint8) * 255, "L").copy()
    ImageDraw.floodfill(mask, (0, 0), 128)
    holes = int((np.asarray(mask) == 0).sum())
    return holes / (holes + int(small.sum()))


def key(path):
    rgb = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    greenness = g - np.maximum(r, b)

    # Soft key: clearly not green stays opaque, pure green becomes transparent.
    alpha = np.clip(1.0 - (greenness - LO) / (HI - LO), 0.0, 1.0)

    # Despill only in a thin band along the cut, so a subject's own teal or
    # cyan is left alone.
    band = grow(alpha < 0.999, DESPILL_BAND)
    spill = band & (g > np.maximum(r, b))
    g = np.where(spill, np.maximum(r, b), g)

    solid = alpha > 0.5
    if not solid.any():
        sys.exit(f"{path}: nothing left after keying; is the background green?")
    interior = ~grow(~solid, INTERIOR_ERODE)
    lost = int((interior & (alpha < 0.999)).sum())
    inside = float(greenness[interior].max()) if interior.any() else 0.0
    holes = hole_share(solid)

    out = np.dstack([r, g, b, alpha * 255.0]).clip(0, 255).astype(np.uint8)
    ys, xs = np.nonzero(solid)
    box = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
    return Image.fromarray(out, "RGBA").crop(box), box, lost, inside, holes


def main():
    parser = argparse.ArgumentParser(
        description="Key green-screen images and fit them to a slide canvas."
    )
    parser.add_argument("--canvas", default="900x1200", help="WxH, default 900x1200")
    parser.add_argument(
        "--fill", type=float, default=0.9, help="subject share of the canvas, default 0.9"
    )
    parser.add_argument("--preview", metavar="HEX", help="also write a preview over this color")
    parser.add_argument("out_dir")
    parser.add_argument("pairs", nargs="+", metavar="NAME=SRC")
    args = parser.parse_args()

    cw, ch = (int(n) for n in args.canvas.lower().split("x"))
    subjects = []
    for pair in args.pairs:
        name, sep, src = pair.partition("=")
        if not sep or not name or not src:
            sys.exit(f"expected NAME=SRC, got {pair!r}")
        subjects.append((name, src, *key(src)))

    # One height for every subject, limited by the widest one.
    height = args.fill * ch
    for subject in subjects:
        w, h = subject[2].size
        height = min(height, args.fill * cw * h / w)

    status = 0
    for name, src, img, box, lost, inside, holes in subjects:
        w, h = img.size
        scaled = img.resize((round(w * height / h), round(height)), Image.LANCZOS)
        canvas = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
        canvas.paste(scaled, ((cw - scaled.size[0]) // 2, (ch - scaled.size[1]) // 2))
        canvas.save(f"{args.out_dir}/{name}.webp", quality=90, method=6)
        if args.preview:
            color = args.preview.lstrip("#")
            rgb = tuple(int(color[i : i + 2], 16) for i in (0, 2, 4))
            preview = Image.new("RGBA", canvas.size, rgb + (255,))
            preview.alpha_composite(canvas)
            preview.convert("RGB").save(f"{args.out_dir}/{name}-preview.png")
        print(
            f"{name}: subject {box} ({w}x{h}) -> {scaled.size[0]}x{scaled.size[1]} "
            f"on {cw}x{ch}; interior pixels that lost opacity: {lost} "
            f"(highest greenness inside {inside:.0f}, key starts at {LO:.0f})"
        )
        if holes >= 0.001:
            print(
                f"  note: enclosed transparent holes cover {holes:.1%} of the subject;"
                " confirm each one belongs there"
            )
        if lost:
            print(f"  WARNING: {name} has green inside the subject; check it before use")
            status = 1
    sys.exit(status)


if __name__ == "__main__":
    main()
