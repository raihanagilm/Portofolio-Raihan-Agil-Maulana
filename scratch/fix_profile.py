import urllib.request, re

def get_svg(slug):
    req = urllib.request.Request(f'https://koboyo.com/icons/svg/{slug}.svg', headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as res:
            svg = res.read().decode('utf-8')
            return svg.replace('<svg ', '<svg class="text-accent w-5 h-5 flex-shrink-0 object-contain" ', 1)
    except:
        return ''

svg_photo = get_svg('photo')
svg_file = get_svg('file-text')

with open(r'c:\Users\r\Documents\Agil Lama\Projek\Portofolio-Raihan-Agil-Maulana\Frontend\templates\dashboard\profile.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix nested forms (Avatar)
content = re.sub(
    r'<form action="\{\{ url_for\(\'profile\.delete_avatar\'\) \}\}" method="POST" class="absolute top-4 right-4">\s*<button type="submit" (class="[^"]+") onclick="(.*?)">\s*(<svg.*?</svg>)\s*</button>\s*</form>', 
    r'<button type="submit" formaction="{{ url_for(\'profile.delete_avatar\') }}" formmethod="POST" \1 style="z-index: 10; position: absolute; top: 1rem; right: 1rem;" onclick="\2">\3</button>', 
    content, 
    flags=re.DOTALL
)

# For resume, replace the absolute top-right delete form with empty
content = re.sub(
    r'<form action="\{\{ url_for\(\'profile\.delete_resume\'\) \}\}" method="POST" class="absolute top-4 right-4">\s*<button type="submit".*?</form>', 
    r'', 
    content, 
    flags=re.DOTALL
)

# Add the delete button next to the Lihat link
resume_delete_btn = '''<button type="submit" formaction="{{ url_for('profile.delete_resume') }}" formmethod="POST" class="text-red-500 hover:text-red-700 bg-red-50 border border-red-200 p-1 rounded shadow-sm transition" onclick="return confirm('Hapus CV/Resume ini?')" title="Hapus CV"><svg class="text-lg w-3.5 h-3.5 flex-shrink-0 object-contain" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-label="trash" viewBox="0 0 141 173"><path d="M46.5 10.5c-2.1 2-2.5 3.3-2.5 8.8v6.4l-9.2.7c-5 .3-12.2.6-16 .6-6 0-7.2.3-9.3 2.5C7.3 31.6 7 32.8 7 38.7c0 7.9 1.5 10.9 6.3 12.1l3.1.8 4.3 49c2.4 26.9 4.6 50.4 4.9 52.2.7 4.4 5.7 9.9 10.2 11.2 2.2.6 17.1 1 35.8 1 31.5 0 32.2 0 36.4-2.3 7.4-3.9 7.3-3.5 12.4-59.2C123 76 125 52.9 125 52.2q.2-1 1.5-1.2c2.7 0 6.3-2.2 7.4-4.7a24 24 0 0 0-.4-15.3c-2.1-4.1-6.8-5.3-19.9-5-18.1.5-16.6 1.1-16.6-6.5 0-5.7-.3-6.9-2.5-9C92.1 8 92.1 8 70.5 8s-21.6 0-24 2.5m45.3 9.1.3 6.1-17.9.6c-9.8.3-19.5.4-21.5 0l-3.7-.6v-5.1c0-2.9.5-5.7 1.2-6.4.9-.9 6.5-1.2 21.3-1l20 .3zm37 13.6c1.6 1.6 1.6 10 0 11.6-.9.9-15 1.2-57.4 1.2-30.9 0-56.9-.3-57.8-.6-2-.8-2.3-10.3-.4-12.2 1.7-1.7 113.9-1.7 115.6 0m-9.2 22-4.7 50.3c-2.3 25.3-4.5 47-5 48.2-1.9 5.2-3 5.4-39.1 5.5-34.8 0-36.6-.1-38.8-4.2-.9-1.7-10-94.2-10-101.8V51h98.2z"/><path d="M48.1 74.4c-1.4 1.7.4 58.5 1.8 59.9.6.6 1.7.7 2.5.4 1.5-.6 1.6-3.7 1-29.4-.7-31.3-1.5-35.5-5.3-30.9m21-.1c-.8 1.1-1.1 9.6-.9 30.8.3 28.6.4 29.4 2.3 29.4 2 0 2-.7 2-30.4 0-30.4-.3-33.4-3.4-29.8m21.2-.5c-1.1.7-3.6 57.3-2.6 59.9.9 2.2 4.2 1.5 4.8-1 1-4.5 1-59 0-59.3q-1-.2-2.2.4"/></svg></button>'''
content = content.replace('<a href="{{ profile.resume_url }}" target="_blank" class="underline">Lihat</a></p>', f'<a href="{{{{ profile.resume_url }}}}" target="_blank" class="underline">Lihat</a></span> {resume_delete_btn}</p>')
content = content.replace('<p class="text-[10px] text-green-600 font-bold">CV saat ini sudah terunggah.', '<p class="text-[10px] text-green-600 font-bold flex items-center gap-2"><span>CV saat ini sudah terunggah.')

# Replace Emojis
if svg_photo:
    content = content.replace('📷 Upload Foto Profil', f'<span class="flex items-center gap-1.5">{svg_photo} Upload Foto Profil</span>')
if svg_file:
    content = content.replace('📄 Upload CV / Resume (PDF)', f'<span class="flex items-center gap-1.5">{svg_file} Upload CV / Resume (PDF)</span>')

# Add form action explicitly and make sure the grid styling works
content = content.replace('<form method="POST" enctype="multipart/form-data" class="space-y-6">', '<form action="{{ url_for(\'profile.edit\') }}" method="POST" enctype="multipart/form-data" class="flex flex-col gap-6">')

with open(r'c:\Users\r\Documents\Agil Lama\Projek\Portofolio-Raihan-Agil-Maulana\Frontend\templates\dashboard\profile.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed')
