# Variabler

:::{admonition} Læringsmål: variabler
---
class: tip
---
Etter å ha lest dette delkapittelet, er målet at du skal kunne:
* Forklare hva en **variabel** er.
* Vite hva som menes med **variabelnavn**, **verdi** og **datatype**.
* Kjenne til noen viktige datatyper i Python som er relevante for programmering i matematikken.
:::


## Hva er en variabel? 

En variabel er den grunnleggende byggesteinen i Python. Det er noe vi selv lager (såkalt *brukerdefinert*). Vi bruker variabelen til å gjøre noe - i matematikk bruker vi det typisk til å regne ut noe og lagre tall. 


::::{admonition} Variabel i Python
---
class: theory
---
En **variabel** er en brukerdefinert ting som:
* Har et **variabelnavn** som vi selv velger.
* Har en **verdi** som vi selv gir.
* Har en **datatype** som avhenger av hva slags verdi vi gir variabelen.
::::

La oss se på noen eksempler på variabler i Python


:::{admonition} Innebygde funksjoner
---
class: sidenote, margin
---
`print`{l=python}-funksjonen
: skriver ut verdien til en variabel.

`type`{l=python}-funksjonen
: henter ut datatypen til en variabel.

`#`-tegnet
: brukes for å kommentere koden. Alt etter `#`-tegnet ignoreres av Python.
:::


::::{admonition} Eksempel 1: variabler
---
class: example
---
Under vises en kort Python-kode: 

```{code-block} python
---
linenos: 
---
a = 5                       # Definerer en variabel med navn `a` med verdi `5`
print(f"{a = }")            # Skriver ut verdien til variabelen `a`
print(f"{type(a) = }")      # Skriver ut datatypen til variabelen `a`
```

Kjører du koden over, får du utskriften:

``` console
a = 5
type(a) = <class 'int'>
```
som forteller oss at verdien til `a`{l=python} er `5`{l=python} og datatypen til `a`{l=python} er `int`{l=python}. Denne datatypen står for *integer* som er engelsk for *heltall*.
::::

Vi tar et eksempel til på litt flere variabler og datatyper, før du skal prøve ut forståelsen din! 


::::{admonition} Eksempel 2: flere variabler og datatyper
---
class: example
---
| Kode | Variabelnavn | Verdi | Datatype |
| :--- | :--- | :---| :--- | 
| `b = -2`{l=python}    | `b`{l=python} | `-2`{l=python} | `int`{l=python} (heltall) |
| `c = 3.14`{l=python}  | `c`{l=python} | `3.14`{l=python} | `float`{l=python} <br> (*flyttall* - desimaltall) |
| `min_melding = "Sup?"`{l=python} | `min_melding`{l=python} | `"Sup?"`{l=python} | `str`{l=python} (tekst) |
| `sant = True`{l=python} <br> `usant = False`{l=python} | `sant`{l=python} <br> `usant`{l=python} | `True`{l=python} <br> `False`{l=python} | `bool`{l=python} <br> (boolsk - to muligheter: `True`{l=python}/`False`{l=python}) |
::::

Så er det **din tur**!

::::{admonition} Underveisoppgave 1
---
class: check
---
Fyll ut tabellen under:

| Kode | Variabelnavn | Verdi | Datatype |
| :--- | :--- | :---| :--- |
| `x = 2.2`{l=python} |  |  |  |
|  | `min_hilsen`{l=python} | `"Halla"`{l=python} | |
| `y = 3`{l=python} |  |  |  |
| `på_skole = True`{l=python} | | | |  


:::{admonition} Løsning
---
class: solution, dropdown
---
| Kode | Variabelnavn | Verdi | Datatype |
| :--- | :--- | :---| :--- |
| `x = 2.2`{l=python} | `x`{l=python} | `2.2`{l=python} | `float`{l=python} |
| `min_hilsen = "Halla"`{l=python} | `min_hilsen`{l=python} | `"Halla"`{l=python} | `str`{l=python} |
| `y = 3`{l=python} | `y`{l=python} | `3`{l=python} | `int`{l=python} |
| `på_skole = True`{l=python} | `på_skole`{l=python} | `True`{l=python} | `bool`{l=python} | 
:::

::::

::::{admonition} Underveisoppgave 2
---
class: check
---
Under vises et interaktivt kodevindu. Fyll ut koden under og kjør programmet.

:::{raw} html
---
file: interaktiv_kode/underveisoppgaver/underveisoppgave_2.html
---
:::


:::{admonition} Fasit
---
class: answer, dropdown
---
```{code-block} python
---
linenos: true
---
navn = "René" 
alder = 29
høyde = 180.0


# Skriver ut dataen
print(f"{navn = } \n{alder = } \n{høyde = }")
```
som gir utskriften

```console
navn = 'René' 
alder = 29 
høyde = 180.0
```
:::

::::