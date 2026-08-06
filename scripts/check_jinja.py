import re
p='d:/Projek/Portofolio-Raihan-Agil-Maulana/Frontend/templates/public.html'
s=open(p,encoding='utf-8').read()
# find all tags like {% ... %}
tags=list(re.finditer(r"{%\s*(.*?)\s*%}",s,re.S))
stack=[]
for m in tags:
    tag=m.group(1).strip()
    lineno=s[:m.start()].count('\n')+1
    parts=tag.split()
    first_word=parts[0] if parts else ''
    # opening tags
    if first_word in ('if','for','block','macro','filter','while'):
        stack.append((first_word,tag,lineno))
    # closing tags
    elif first_word in ('endif','endfor','endblock','endmacro','endfilter'):
        if stack:
            stack.pop()
        else:
            print(f'Unmatched {first_word} at line {lineno}')

if stack:
    print('Unclosed blocks:')
    for w,tag,lin in stack:
        print(f'  line {lin}: {tag}')
else:
    print('All blocks closed')
print('\nScanned %d jinja tags' % len(tags))
