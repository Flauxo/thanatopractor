with open("js/data.js", 'r', encoding='utf-8') as f:
    lines = f.readlines()

for id_val in ['crema_pro', 'collector', 'perfectionist', 'reputable', 'bribe_master', 'capitalist', 'daily_grind', 'rich_undertaker', 'grave_robber', 'social_butterfly', 'overtime', 'paperwork_ninja', 'first_client', 'burn_it_all', 'nat_20', 'nat_1']:
    for idx, line in enumerate(lines):
        if id_val in line:
            print(f"Line {idx+1}: {line.strip()}")
            break
