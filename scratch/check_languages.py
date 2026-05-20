import re

# Read data files
with open("js/data.js", "r", encoding="utf-8") as f:
    en_content = f.read()

with open("js/data_es.js", "r", encoding="utf-8") as f:
    es_content = f.read()

# Extract the interviewScenarios block from both
def get_scenarios_block(content):
    start_idx = content.find('interviewScenarios:')
    if start_idx == -1:
        return ""
    bracket_start = content.find('[', start_idx)
    if bracket_start == -1:
        return ""
    count = 1
    idx = bracket_start + 1
    while count > 0 and idx < len(content):
        if content[idx] == '[':
            count += 1
        elif content[idx] == ']':
            count -= 1
        idx += 1
    return content[bracket_start:idx]

en_block = get_scenarios_block(en_content)
es_block = get_scenarios_block(es_content)

# We want to find all text strings within these blocks
# Matching "text": "..." or 'text': "..." or text: "..."
en_texts = re.findall(r'text:\s*["\'](.*?)["\']', en_block)
es_texts = re.findall(r'text:\s*["\'](.*?)["\']', es_block)

print(f"Extracted {len(en_texts)} strings from EN scenarios block")
print(f"Extracted {len(es_texts)} strings from ES scenarios block")

# Let's check for english words in ES block
en_words = {'the', 'you', 'and', 'with', 'your', 'about', 'from', 'this', 'that', 'have', 'will'}
es_words = {'el', 'la', 'de', 'con', 'para', 'que', 'esta', 'este', 'tiene', 'como', 'para'}

print("\n--- Potential English strings in Spanish scenarios block ---")
for text in es_texts:
    words = set(re.findall(r'\b\w+\b', text.lower()))
    if words & en_words and not (words & es_words):
        # Could be English
        print(f"ES block string looks English: {text}")

print("\n--- Potential Spanish strings in English scenarios block ---")
for text in en_texts:
    words = set(re.findall(r'\b\w+\b', text.lower()))
    if words & es_words and not (words & en_words):
        # Could be Spanish
        print(f"EN block string looks Spanish: {text}")
