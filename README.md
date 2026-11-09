# Průvodce adaptací obecního veřejného prostoru

Statická webová aplikace pro starosty obcí do 10 000 obyvatel. Má pět krátkých otázek a z odpovědí sestaví plán: s čím začít ještě tento týden, žebřík opatření, kdo pomůže, kde vzít peníze a akční plán k vytištění.

Aplikace nepotřebuje server ani databázi. Odpovědi zůstávají jen v prohlížeči uživatele (localStorage).

## Obsah repozitáře

| Soubor | K čemu je |
|---|---|
| `index.html` | vstupní stránka |
| `app.js` | logika průvodce a rozhodovací pravidla R01–R18 (odpovídají listu Pravidla v sešitu) |
| `style.css` | vzhled, verze pro mobil a pro tisk |
| `pruvodce.json` | veškerý obsah: opatření, příklady, zdroje, kontakty |
| `*.png` | ilustrace |
| `export_data.py` | vytvoří `pruvodce.json` ze sešitu průvodce |

Všechny soubory leží vedle sebe v jedné úrovni, bez podsložek.

## Zveřejnění na GitHub Pages

1. Nahrajte obsah této složky do kořene repozitáře.
2. Otevřete Settings → Pages, jako Source zvolte „Deploy from a branch“, větev `main` a složku `/ (root)`.
3. Za minutu bude aplikace na adrese `https://<účet>.github.io/<repozitář>/`.

## Vložení do portálu

```html
<iframe id="pruvodce" src="https://<účet>.github.io/<repozitář>/"
        title="Průvodce adaptací obecního veřejného prostoru"
        style="width:100%;height:900px;border:0" loading="lazy"></iframe>
<script>
  // Volitelné: iframe se přizpůsobí výšce obsahu, takže nebude mít vlastní posuvník
  window.addEventListener('message', function (e) {
    if (e.data && e.data.pruvodceHeight) {
      document.getElementById('pruvodce').style.height = e.data.pruvodceHeight + 'px';
    }
  });
</script>
```

Pokud portál skripty nepovoluje, stačí samotný `<iframe>` s pevnou výškou, např. 900 px.

Tlačítko „Uložit jako PDF“ v akčním plánu funguje i uvnitř iframe. Kdyby ho portál blokoval, doplňte do iframe atribut `allow="print"` nebo odkažte na aplikaci v novém okně.

## Úprava obsahu

Obsah se upravuje v sešitu `Pruvodce_adaptace_obsah_stromu_v39.xlsx`, ne v JSON. Po úpravě sešitu spusťte:

```bash
pip install openpyxl
python3 export_data.py Pruvodce_adaptace_obsah_stromu_v39.xlsx \
        Katalog_adaptacnich_opatreni_asitis.xlsx prehled_opatreni_mk.csv
```

Skript přepíše `pruvodce.json`. Ten pak nahrajte do repozitáře.

Texty uvnitř `app.js` jsou krátké popisky obrazovek. Patří k nim názvy okruhů, „Proč začít“ a tipy na tento týden.

## Lokální vyzkoušení

```bash
python3 -m http.server 8000
```

Pak otevřete http://localhost:8000. Přímé otevření `index.html` z disku nefunguje, protože prohlížeč nenačte data.
