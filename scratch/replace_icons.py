import os, re, urllib.request, time

base_dir = r'c:\Users\r\Documents\Agil Lama\Projek\Portofolio-Raihan-Agil-Maulana\Frontend\templates'
headers = {'User-Agent': 'Mozilla/5.0'}
cache = {}

def get_svg(slug):
    if slug in cache:
        return cache[slug]
    try:
        req = urllib.request.Request(f'https://koboyo.com/icons/svg/{slug}.svg', headers=headers)
        with urllib.request.urlopen(req) as res:
            svg = res.read().decode('utf-8')
            cache[slug] = svg
            time.sleep(0.1)
            return svg
    except Exception as e:
        print(f'Failed to get {slug}: {e}')
        # fallbacks
        fallbacks = {
            'folder-cog': 'folder',
            'arrow-left': 'arrow-left',
            'trash': 'trash',
            'folder-star': 'star',
            'plus-circle': 'plus',
            'graduation-cap': 'hat',
            'check-circle': 'check',
            'external-link': 'link',
            'user-circle': 'user',
            'log-out': 'logout',
            'history': 'clock',
            'briefcase': 'bag',
            'edit': 'pencil',
            'award': 'medal',
            'menu': 'menu',
            'mail': 'email'
        }
        if slug in fallbacks:
            fallback = fallbacks[slug]
            if fallback != slug:
                return get_svg(fallback)
        return None

def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # We look for `<i class="koboyo koboyo-slug ... " ...></i>`
    # The regex needs to handle optional spaces, attributes etc.
    # class="koboyo koboyo-folder-cog text-white text-xl"
    def repl(m):
        full_tag = m.group(0)
        # Find the class attribute
        class_match = re.search(r'class="([^"]*koboyo-([^"\s]+)[^"]*)"', full_tag)
        if not class_match:
            return full_tag
            
        full_class = class_match.group(1)
        slug = class_match.group(2)
        
        # Strip koboyo and koboyo-slug from the class string
        new_class = full_class.replace('koboyo', '').replace(f'-{slug}', '').strip()
        # Remove extra spaces
        new_class = re.sub(r'\s+', ' ', new_class)
        
        svg = get_svg(slug)
        if svg:
            # We need to inject the classes into the SVG
            # Replace `class="..."` with nothing first from the full_tag attributes
            # to preserve any other attributes (like id, data-*).
            attrs = full_tag.replace('<i ', '').replace('</i>', '').replace('>', '').replace(f'class="{full_class}"', '').strip()
            
            # Inject into SVG
            svg = svg.replace('<svg ', f'<svg class="{new_class}" {attrs} ', 1)
            return svg
        
        return full_tag
        
    content = re.sub(r'<i\s+[^>]*class="[^"]*koboyo-[^"]*"[^>]*></i>', repl, content)
    
    if content != original_content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {path}')

for root, _, files in os.walk(base_dir):
    for f in files:
        if f.endswith('.html'):
            process_file(os.path.join(root, f))
print("Done")
