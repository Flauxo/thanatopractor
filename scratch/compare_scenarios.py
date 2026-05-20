import re

def extract_scenarios(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find start of interviewScenarios
    start_idx = content.find('interviewScenarios:')
    if start_idx == -1:
        return []
    
    # Find the opening '[' after 'interviewScenarios:'
    bracket_start = content.find('[', start_idx)
    if bracket_start == -1:
        return []
    
    # Bracket counting to extract the array content
    count = 1
    idx = bracket_start + 1
    while count > 0 and idx < len(content):
        if content[idx] == '[':
            count += 1
        elif content[idx] == ']':
            count -= 1
        idx += 1
        
    array_content = content[bracket_start:idx]
    
    # Now find all { ... } blocks containing id: "..." in this array
    # Let's extract the IDs by matching id: "..." inside this block
    ids = re.findall(r'id:\s*["\'](.*?)["\']', array_content)
    return ids

en_ids = extract_scenarios("js/data.js")
es_ids = extract_scenarios("js/data_es.js")

print("English Scenarios count:", len(en_ids))
print("Spanish Scenarios count:", len(es_ids))
print("IDs in EN but not in ES:", set(en_ids) - set(es_ids))
print("IDs in ES but not in EN:", set(es_ids) - set(en_ids))
