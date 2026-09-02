import os
from PIL import Image
import shutil

base_dir = r"C:\Users\Kivan\.gemini\antigravity\scratch\tanatopractor"
icon_path = os.path.join(base_dir, "icon.png")
res_dir = os.path.join(base_dir, r"android\app\src\main\res")

if not os.path.exists(icon_path):
    print("Error: icon.png not found in " + base_dir)
    exit(1)

sizes = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

try:
    img = Image.open(icon_path).convert("RGBA")
    
    for mipmap_folder, size in sizes.items():
        folder_path = os.path.join(res_dir, mipmap_folder)
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
            
        resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
        
        # Save as ic_launcher.png
        launcher_path = os.path.join(folder_path, "ic_launcher.png")
        resized_img.save(launcher_path, format="PNG")
        
        # Save as ic_launcher_round.png (we just use the same square one for now, or we could crop it to a circle)
        # To make it round:
        mask = Image.new('L', (size, size), 0)
        from PIL import ImageDraw
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, size, size), fill=255)
        
        round_img = resized_img.copy()
        round_img.putalpha(mask)
        
        launcher_round_path = os.path.join(folder_path, "ic_launcher_round.png")
        round_img.save(launcher_round_path, format="PNG")
        
        print(f"Updated {mipmap_folder} ({size}x{size})")
        
    print("All icons successfully updated.")
except Exception as e:
    print(f"Error processing image: {e}")
