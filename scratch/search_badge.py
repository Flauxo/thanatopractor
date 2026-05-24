import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

dir_path = r"C:\Users\Kivan\.gemini\antigravity\scratch\tanatopractor\js"
query = "badge"

for filename in os.listdir(dir_path):
    if filename.endswith(".js"):
        filepath = os.path.join(dir_path, filename)
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            for i, line in enumerate(f, 1):
                if query.lower() in line.lower():
                    print(f"{filename}:{i}: {line.strip()}")
