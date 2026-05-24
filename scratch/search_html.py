import sys
sys.stdout.reconfigure(encoding='utf-8')

filepath = r"C:\Users\Kivan\.gemini\antigravity\scratch\tanatopractor\index.html"
with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
    for i, line in enumerate(f, 1):
        if "crematorium" in line.lower() or "crema" in line.lower():
            print(f"{i}: {line.strip()}")
