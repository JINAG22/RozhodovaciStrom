import re
"""Převede sešit průvodce (a katalogy Asitis / MiSe klima) do pruvodce.json pro aplikaci.
Použití: python3 scripts/export_data.py <sešit.xlsx> [katalog_asitis.xlsx] [prehled_mk.csv]"""
import sys, json, re, csv, os, openpyxl
XL = sys.argv[1]; AS = sys.argv[2] if len(sys.argv) > 2 else None; MK = sys.argv[3] if len(sys.argv) > 3 else None
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pruvodce.json')
wb = openpyxl.load_workbook(XL, data_only=True)
def rows(name):
    ws = wb[name]; h = [c.value for c in ws[1]]
    return [dict(zip(h, r)) for r in ws.iter_rows(min_row=2, values_only=True) if r[0]]
OKR = {'Teplo – stín a povrchy':'T','Voda – sucho':'V','Voda – přívalové deště':'R','Voda – sucho i přívaly':'V','Zeleň a její správa':'Z','Krajina a půda':'K','Koncepce a spolupráce':'S'}
PASMO = {'A':'do 50 tis. Kč','A–B':'do 500 tis. Kč','B':'50–500 tis. Kč','B–C':'50 tis.–5 mil. Kč','C':'0,5–5 mil. Kč','C–D':'od 0,5 mil. Kč','B–D':'od 50 tis. Kč','D':'nad 5 mil. Kč'}
DOK = 'Další okruhy'
def okrs(r):
    a = [OKR.get(r['Okruh'], 'S')] + [x for x in str(next((v for k, v in r.items() if k and str(k).startswith(DOK)), None) or '').replace(',', ' ').split() if x in 'TVRZK']
    return list(dict.fromkeys(a))
def fin(p): return 'rozpočet obce, malý grant' if p == 'A' else ('rozpočet obce + dotace' if p in ('A–B','B','B–C','B–D') else 'dotace + spolufinancování obce')
UK = {'O04':'m² nově zastíněné plochy u laviček a hřiště','O10':'počet vysazených stromů a podíl ujmutých po 3 letech','O15':'m² dešťových záhonů a plocha, z níž do nich teče voda','O17':'m² odpečetěných nebo propustných ploch','O39':'schválená změna ÚP s koeficientem zeleně a vsaku','O38':'akční plán schválený zastupitelstvem a každoročně vyhodnocený','O42':'cíle adaptace ve strategickém plánu','O43':'zpracovaná studie a vybrané prioritní prostranství','O13':'počet stromů v pasportu, plán péče schválen','O06':'m² ploch s mozaikovou sečí','O32':'podíl obecních polí s upravenou pachtovní smlouvou','O31':'délka zeleného pásu na okraji obce (m)','O34':'délka nových alejí (m)','O44':'počet ochráněných náletových stromů','O03':'počet pítek a mlžítek v provozu','O16':'počet stromů ve zpevněných plochách','O21':'objem zadržené vody (m³)','O11':'počet zapojených obyvatel a sebraných podnětů','O45':'počet předzahrádek se zelení místo kamene','O24':'m² ozeleněných fasád','O08':'objem zachycené dešťové vody (m³)','O09':'plocha, ze které voda teče do zeleně (m²)','O07':'podíl stromů zalévaných nepitnou vodou','O12':'počet chráněných stromů','O41':'počet podpořených žádostí občanů','O46':'počet upravených zastávek','O47':'m² trávníků sečených na 10–20 cm'}
# katalogy
ASM = {'O03':['MZ16','MZ17'],'O04':['S8'],'O24':['MZ2','MZ3'],'O16':['MZ14'],'O23':['MZ4','MZ7'],'O29':['MZ10'],'O27':['MZ5'],'O08':['S7'],'O15':['MZ19'],'O17':['MZ13'],'O19':['MZ6'],'O20':['MZ1'],'O21':['MZ11'],'O22':['S7'],'O30':['MZ18','MZ12'],'O06':['MZ15'],'O10':['MZ14'],'O28':['MZ9'],'O11':['M2']}
MKM = {'O03':[34],'O04':[35],'O24':[3,4],'O16':[1],'O26':[36,37],'O27':[32,33],'O08':[30],'O15':[23,39],'O17':[9,10,12,13],'O19':[14,17],'O20':[24,26],'O21':[28],'O22':[31,29],'O06':[6,38],'O10':[2],'O07':[40],'O28':[5]}
asit = {}
if AS:
    aw = openpyxl.load_workbook(AS, read_only=True)['Přehled opatření']; ah = None
    for r in aw.iter_rows(values_only=True):
        if ah is None: ah = r; continue
        if r[0]: asit[r[0]] = dict(zip(ah, r))
mk = {}
if MK:
    for i, r in enumerate(csv.reader(open(MK, encoding='utf-8-sig'), delimiter=';')):
        if i: mk[i] = dict(nazev=r[2], popis=r[3], kde=r[4])
def first_sentences(t, n=2):
    if not t: return ''
    t = re.sub(r'\s+', ' ', str(t)).strip()
    parts = re.split(r'(?<=[.!?])\s+(?=[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ])', t)
    return ' '.join(parts[:n])
def bullets(t, n=3):
    if not t: return []
    out = []
    for line in str(t).split('\n'):
        line = line.strip(' –-•+\t')
        if len(line) > 12 and not line.endswith(':'): out.append(line)
    return out[:n]
src = {}
for r in rows('Opatření – zdroje'):
    src.setdefault(r['ID opatření'], []).append(dict(n=r['Zdroj'], u=r['Odkaz na originál'], k=r['K čemu je'], kde=r['Kde v originálu'] or ''))
priklady = rows('Příklady'); dotace = rows('Dotace'); var = rows('Varianty řešení') if 'Varianty řešení' in wb.sheetnames else []
meas = []
for r in rows('Opatření'):
    i = r['ID']; c = (r['Cenové pásmo'] or 'A').replace(' ', '')
    a = [asit[k] for k in ASM.get(i, []) if k in asit]; m = [mk[k] for k in MKM.get(i, []) if k in mk]
    popis = first_sentences(a[0].get('Popis')) if a else (first_sentences(m[0]['popis']) if m else '')
    d = dict(id=i, n=r['Opatření'].split(' (')[0].split(' – ')[0], full=r['Opatření'], okr=OKR.get(r['Okruh'],'S'), okrs=okrs(r), r=int(str(r['Příčka žebříku'])[0]),
        cena=c, ct=(r.get('Cenové pásmo – text v aplikaci (přepíše kód)') or PASMO.get(c, c)), cst=r.get('Cena – stav ověření (v45)') or '', cpod=r.get('Cena – podklad') or '', curl=r.get('Cena – zdroj (odkaz)') or '', cr=max([{'A':1,'B':2,'C':3,'D':4}[x] for x in re.findall('[ABCD]', c)] or [1]),
        kap=(r.get('Potřebná kapacita') or 'S').split('+'), kdo=r['Kdo to zvládne'] or '', j=r['Výběr']=='jádro', fin=fin(c),
        uk=UK.get(i, '[doplnit ukazatel]'), mista=r.get('Místa (typy CESMOD)') or '',
        pozor=r.get('Na co si dát pozor') or '', pozn=r.get('Poznámka k výběru') or '',
        popis=popis,
        prinosy=sum([bullets(x.get('Benefity'), 2) for x in a], [])[:3],
        cenaKat=first_sentences(a[0].get('Cena'), 1) if a else '',
        cas=first_sentences(a[0].get('Časová náročnost'), 1) if a else '',
        kde=(m[0]['kde'] if m else first_sentences(a[0].get('Příklady užití'), 1) if a else ''),
        kombi=bullets(a[0].get('Kombinovatelnost'), 2) if a else [],
        katalog=('Katalog adaptačních opatření (Asitis / Atregia)' if a else '') + (' · ' if a and m else '') + ('Katalog klimatických opatření (MiSe klima)' if m else ''),
        zdroje=src.get(i, []),
        priklady=[],
        dotace=[dict(n=x['Kde hledat'], u=x['Odkaz']) for x in dotace if x.get('Opatření') and (i in str(x['Opatření']) or str(x['Opatření']).strip() == 'všechna') and str(x['ID']).startswith('DT')][:3],
        varianty=[dict(q=v['Otázka k místu'], k=v['Když…'], z=v['Pak zvolte']) for v in var if v['Opatření'] == i])
    meas.append(d)
STEPS = {'O04':['Vyberte místa, kde lidé v létě čekají nebo sedí – zastávka, lavičky na návsi, pískoviště.','Zvolte typ: sezónní plachta (nejlevnější), pergola s popínavkami, nebo přístřešek.','U pevného přístřešku se zeptejte stavebního úřadu, zda je potřeba povolení.','Plachty na zimu sundejte; pergolu osaďte popínavkou, ať časem stíní sama.']}
_ps = {r['ID']: r for r in rows('Opatření')}
for d in meas:
    r = _ps.get(d['id'], {})
    d['sp'] = r.get('Pro starostu – co to je') or ''
    d['kdy'] = r.get('Pro starostu – kdy to dává smysl') or ''
    kk = [x.strip() for x in str(r.get('Pro starostu – první kroky (oddělit |)') or '').split('|') if x.strip()]
    d['kroky'] = kk or STEPS.get(d['id'], [])
priz = [dict(id=r['ID'], m=r['Místo'], t=r['Příznak (co obec vidí)'], o=re.findall(r'O\d+', str(r.get('Navazující opatření') or '')), w=dict(T=r['Teplo'] or 0, V=r.get('Sucho', r.get('Voda')) or 0, R=r.get('Přívaly') or 0, Z=r['Zeleň'] or 0, K=r.get('Krajina a půda') or 0)) for r in rows('Příznaky')]
kont = {r['ID']: r['Kdo'] for r in rows('Koho oslovit')}
zd = [dict(typ=r['Typ'], k=r['Když…'], c=r['Co zvážit'], okr=(r['Okruhy (prázdné = vždy)'] or '').split()) for r in rows('Závěrečná doporučení')]
def links(t):
    out = []
    for line in str(t or '').split('\n'):
        m = re.match(r'\s*(?:Z\d+\s+)?(.*?):\s*(https?://\S+)\s*$', line)
        if m: out.append(dict(n=m.group(1).strip(), u=m.group(2)))
    return out
ex = [dict(o=p['Obec'].split(' (')[0], ob=p['Obec'], p=p['Počet obyvatel'], t=p['Příklad'], co=p['Co se udělalo'] or '', pozn=p.get('Poznámka') or '',
           okr=OKR.get(p['Okruh'], 'S'), okrs=okrs(p), v=p['Velikost obce'], r=str(p['Hlavní příčka'])[0], mala=p['Pro malé obce']=='ano',
           kraj=p.get('Kraj (ČSÚ)') or '', kod=str(p.get('Kód obce (ČSÚ)') or ''), ids=re.findall(r'O\d\d', str(p.get('Opatření (ID)') or '')),
           m=re.findall(r'M\d\d', str(p.get('Typ místa (ID)') or '')), zdr=links(p.get('Odkazy na zdroje (plné publikace)')) + links(p.get('Další zdroje (ověřené odkazy)')), zkr=p.get('Zdroj') or '')
      for p in priklady if p.get('Obec') and p.get('Počet obyvatel')]
for i, e in enumerate(ex): e['i'] = i
reg = [dict(id=r['Č.'] if 'Č.' in r else None, **{k: r[k] for k in r}) for r in rows('Registr zdrojů')]
for d in meas: d['priklady'] = [e['i'] for e in ex if d['id'] in e['ids'] and e['mala']][:4] + [e['i'] for e in ex if d['id'] in e['ids'] and not e['mala']][:4]
def stem(o): return re.sub(r'\s*\(.*', '', o)[:-2]
mdop = rows('Místa – doporučení') if 'Místa – doporučení' in wb.sheetnames else []
mista = []
for r in rows('Místa'):
    dop = []
    for d in mdop:
        if d['ID místa'] != r['ID']: continue
        exi = []
        if d['Oblast'].startswith('5'):
            exi = [e['i'] for e in ex if r['ID'] in e['m'] and len(e['o']) > 3 and stem(e['o']) in d['Co']][:1]
        dop.append(dict(ob=d['Oblast'][2:], k=d['Co'], t=d['Popis'] or '', u=d['Odkaz (u příkladů)'] or '', ex=exi))
    mista.append(dict(id=r['ID'], n=r['Místo'], p=r['Popis'], proc=r.get('Proč je důležité (CESMOD)') or '', s=r.get('Strana v CESMOD') or '', dop=dop))
postup = [dict(typ=r['Typ'], c=r['Č.'], n=r['Název'], t=re.sub(r'\s*\(viz [\d.]+\)', '', r['Text']), kdo=r['Kdo'] or '', z=r['Zdroj'], ids=re.findall(r'O\d\d', str(r.get('Opatření (u kterých se ukáže)') or ''))) for r in rows('Postup a principy')] if 'Postup a principy' in wb.sheetnames else []
pece = [dict(typ=r['Typ'], c=r['Krok'], n=r['Název'] or '', t=r['Text'] or '', u=r['Odkaz'] or '', s=r['Strana ZPK']) for r in rows('Péče o zeleň')] if 'Péče o zeleň' in wb.sheetnames else []
sub = {}
if 'Rozdvojení' in wb.sheetnames:
    ids = lambda v: re.findall(r'O\d+', str(v or ''))
    for r in rows('Rozdvojení'):
        k = r['Okruh (kód)']
        if not k: continue
        e = sub.setdefault(k, dict(q='', link=None, o=[], rec={}, tt={}, n={}))
        if r['Otázka']: e['q'] = r['Otázka']
        if r['Odkaz „Nevíte?“']: e['link'] = [r['Odkaz „Nevíte?“'], r['Text odkazu'] or 'Nevíte? →']
        e['o'].append([r['Klíč'], r['Obrázek (soubor)'] or '', r['Možnost'], r['Popis'] or ''])
        if ids(r['Doporučená opatření (ID)']): e['rec'][r['Klíč']] = ids(r['Doporučená opatření (ID)'])
        if ids(r['Tento týden (ID, pořadí)']): e['tt'][r['Klíč']] = ids(r['Tento týden (ID, pořadí)'])
        e['n'][r['Klíč']] = r['Text ve shrnutí plánu'] or r['Možnost']
data = dict(verze=os.path.basename(XL), mista=mista, postup=postup, pece=pece, sub=sub, meas=meas, priz=priz, kont=kont, zd=zd, ex=ex,
            zdroje=[{k: (v if v is None or isinstance(v,(int,float,str)) else str(v)) for k, v in r.items()} for r in rows('Registr zdrojů')])

json.dump(data, open(OUT, 'w'), ensure_ascii=False, indent=0)
print('ok', len(meas), 'opatření,', len(ex), 'příkladů,', len(data['zdroje']), 'zdrojů →', os.path.abspath(OUT))
