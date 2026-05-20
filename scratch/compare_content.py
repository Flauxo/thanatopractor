import re

with open("js/data.js", "r", encoding="utf-8") as f:
    en_content = f.read()

with open("js/data_es.js", "r", encoding="utf-8") as f:
    es_content = f.read()

# Parse interviewScenarios array using bracket parser
def extract_scenarios_list(content):
    start_idx = content.find('interviewScenarios:')
    if start_idx == -1:
        return []
    bracket_start = content.find('[', start_idx)
    if bracket_start == -1:
        return []
    count = 1
    idx = bracket_start + 1
    while count > 0 and idx < len(content):
        if content[idx] == '[':
            count += 1
        elif content[idx] == ']':
            count -= 1
        idx += 1
    block = content[bracket_start:idx]
    
    # split by { id:
    parts = block.split('{')
    scenarios = []
    for part in parts:
        if 'id:' in part:
            scenarios.append('{' + part.strip().rstrip(',').rstrip(']'))
    return scenarios

en_scenarios = extract_scenarios_list(en_content)
es_scenarios = extract_scenarios_list(es_content)

print(f"Loaded {len(en_scenarios)} EN and {len(es_scenarios)} ES scenarios")

# Check if any ES scenarios are identical to EN scenarios (which would mean they were not translated!)
identical_count = 0
for i in range(min(len(en_scenarios), len(es_scenarios))):
    # Strip whitespace
    en_clean = re.sub(r'\s+', '', en_scenarios[i])
    es_clean = re.sub(r'\s+', '', es_scenarios[i])
    if en_clean == es_clean:
        print(f"Scenario {i} is identical in both! ID: {en_scenarios[i][:50]}")
        identical_count += 1

print(f"Identical scenarios: {identical_count}")
