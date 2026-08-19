import os, re

base_dir = r'c:\Users\r\Documents\Agil Lama\Projek\Portofolio-Raihan-Agil-Maulana\Frontend\templates'

for root, _, files in os.walk(base_dir):
    for f in files:
        if f.endswith('.html'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
                
            original_content = content
            
            def repl(m):
                tag = m.group(0)
                if 'class="' in tag:
                    if not re.search(r'\bw-\d+', tag) and not re.search(r'\bh-\d+', tag):
                        tag = re.sub(r'class="(.*?)"', r'class="\1 w-6 h-6 flex-shrink-0 object-contain"', tag, 1)
                else:
                    tag = tag.replace('<svg ', '<svg class="w-6 h-6 flex-shrink-0 object-contain" ', 1)
                return tag
                
            content = re.sub(r'<svg\s+[^>]*xmlns="http://www\.w3\.org/2000/svg"[^>]*>', repl, content)
            
            if content != original_content:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(content)
                print(f'Updated {f}')
print('Done')
