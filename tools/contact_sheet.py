"""Une varios PNG en una hoja de contactos con etiquetas de tiempo. Uso: python3 -I contact_sheet.py out.png cols thumb_w img1 img2 ..."""
import sys, os
from PIL import Image, ImageDraw, ImageFont
out, cols, tw = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); files = sys.argv[4:]
ims = [Image.open(f).convert('RGB') for f in files]
w0, h0 = ims[0].size; th = int(tw * h0 / w0); pad = 8; lab = 26
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (tw + pad) + pad, rows * (th + pad + lab) + pad), (40, 40, 40))
try: font = ImageFont.truetype('/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Bold.ttf', 18)
except Exception: font = ImageFont.load_default()
d = ImageDraw.Draw(sheet)
for i, (im, f) in enumerate(zip(ims, files)):
    r, c = divmod(i, cols); x = pad + c * (tw + pad); y = pad + r * (th + pad + lab)
    sheet.paste(im.resize((tw, th), Image.LANCZOS), (x, y + lab))
    d.text((x + 2, y + 3), os.path.basename(f).rsplit('_', 1)[-1].replace('.png', 's'), fill=(255, 220, 90), font=font)
sheet.save(out)
print(out, sheet.size)
