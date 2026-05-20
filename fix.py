import sys

with open('js/data_es_v11.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(len(lines)):
    line = lines[i]
    if 'fail:' in line and line.rstrip('\n\r').endswith('},'):
        lines[i] = line.rstrip('\n\r')[:-2] + '} },\n'

with open('js/data_es_v11.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)
    
print("Fixed data_es_v11.js")
