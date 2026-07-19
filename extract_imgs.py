import re, os

path = r'D:\d\9\blog\docs\posts'
files = set()
for f in os.listdir(path):
    if f.endswith('.md'):
        with open(os.path.join(path, f), 'r', encoding='utf-8') as fh:
            content = fh.read()
            for m in re.finditer(r'md_assets/([^\)\s"]+)', content):
                files.add(m.group(1))

print(f'Total: {len(files)}')
for x in sorted(files):
    print(x)
