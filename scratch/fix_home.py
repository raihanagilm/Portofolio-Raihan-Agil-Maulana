import os, urllib.request

headers = {'User-Agent': 'Mozilla/5.0'}

def get_svg(slug):
    try:
        req = urllib.request.Request(f'https://koboyo.com/icons/svg/{slug}.svg', headers=headers)
        with urllib.request.urlopen(req) as res:
            return res.read().decode('utf-8')
    except Exception as e:
        print('Error:', e)
        return None

svg_home = get_svg('house')
svg_image = get_svg('photo')

base_dir = r'c:\Users\r\Documents\Agil Lama\Projek\Portofolio-Raihan-Agil-Maulana\Frontend\templates'

with open(os.path.join(base_dir, 'base.html'), 'r', encoding='utf-8') as f:
    content = f.read()
if svg_home:
    content = content.replace('<i class="koboyo koboyo-home text-xl"></i>', svg_home.replace('<svg ', '<svg class="text-xl" ', 1))
with open(os.path.join(base_dir, 'base.html'), 'w', encoding='utf-8') as f:
    f.write(content)
    
proj_path = os.path.join(base_dir, 'dashboard', 'projects.html')
with open(proj_path, 'r', encoding='utf-8') as f:
    content = f.read()
if svg_image:
    content = content.replace('<i class="koboyo koboyo-image text-border-card text-4xl"  ></i>', svg_image.replace('<svg ', '<svg class="text-border-card text-4xl" ', 1))
with open(proj_path, 'w', encoding='utf-8') as f:
    f.write(content)
