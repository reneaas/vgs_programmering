# `if`{l=python}-`else`{l=python}-setninger

:::{admonition} Læringsmål: `if`{l=python}-`else`{l=python}-setninger
---
class: tip
--- 
* Kunne forklare hva en **betingelse** er, og sette opp betingelser i Python.
* Kunne bruke `if`{l=python}-`else`{l=python}-setninger i Python.
:::


I mange tilfeller ønsker vi å skrive et program som gjør noe hvis én ting er sant, og noe annet hvis det er usant. Dette kan vi gjøre ved å bruke `if`{l=python}-`else`{l=python}-setninger.


:::::{admonition} Utforsk 1
---
class: explore
name: programmering-if-else-utforsk-1
---
Under vises et kort interaktivt program. 

Utforsk og kjør programmet, og forklar hva programmet gjør.

:::{raw} html
---
file: interaktiv_kode/utforsk/utforsk_1.html
---
:::
:::::


## Betingelser
Før vi ser mer på hvordan en `if`{l=python}-`else`{l=python}-setning fungerer, skal vi se på hva en **betingelse** er. 


:::{admonition} Betingelser
---
class: theory
---

En **betingelse** er en påstand som kan være sann eller usann. En betingelse er en boolsk variabel som enten er `True`{l=python} (sann) eller `False`{l=python} (usann).

:::

Vi tar et eksempel:

::::{admonition} Eksempel 1: betingelser
---
class: example
---
I programmet fra {ref}`utforsk 1 <programmering-if-else-utforsk-1>` har vi brukt betingelsen `x > 0`{l=python} for å dele opp programmet. <br> 
`x > 0`{l=python} blir `True`{l=python} hvis `x`{l=python} er større enn 0, og `False`{l=python} ellers.
:::: 


Så kan **du** få utforske litt mer:

:::::::::::::::{admonition} Utforsk 2
---
class: explore
---
Under vises et interakivt program som skriver ut forskjellige betingelser.


::::::::::::::{tab-set} 
---
class: tabs-parts
---
:::::::::::::{tab-item} a
Les programmet og forutsi hva programmet skriver ut. 

Skriv inn hypotesen din og sjekk svaret under!


:::::::::::::


:::::::::::::{tab-item} b
Hvis du endrer på verdien til `a`{l=python} og `b`{l=python} slik at betingelsen `a > b`{l=python} er `True`{l=python}, hvilke av de andre betingelsene vil da også være `True`{l=python}?

Tenk ut først – prøv deretter ut med programmet!


:::::::::::::

:::::::::::::{tab-item} c

Hvilke verdier kan du sette `a`{l=python} og `b`{l=python} slik at **flest mulig** betingelser blir `True`{l=python}?

::::::::::::::



:::{raw} html
---
file: interaktiv_kode/utforsk/utforsk_2.html
---
:::




:::::::::::::::

I {ref}`underveisoppgave 2 <programmering-if-else-underveisoppgave-2>` har vi brukt det vi kaller **sammenlikningsoperatorer** for å sette opp betingelser. Disse operatorene sammenlikner to verdier og returnerer `True`{l=python} eller `False`{l=python}.

::::{admonition} Sammenlikningsoperatorer
---
class: theory
---

Vi har følgende boolske operatorer i Python:

| Operator | Eksempel | Forklaring |
|:--------:|:-----------:|:---------|
| `==`{l=python} | `a == b`{l=python} | Er `a`{l=python} lik `b`{l=python}? |
| `!=`{l=python} | `a != b`{l=python} | Er `a`{l=python} ulik `b`{l=python}? |
| `>`{l=python} | `a > b`{l=python} | Er `a`{l=python} større enn `b`{l=python}? |
| `<`{l=python} | `a < b`{l=python} | Er `a`{l=python} mindre enn `b`{l=python}? |
| `>=`{l=python} | `a >= b`{l=python} | Er `a`{l=python} større enn eller lik `b`{l=python}? |
| `<=`{l=python} | `a <= b`{l=python} | Er `a`{l=python} mindre enn eller lik `b`{l=python}? |
::::




## `if`{l=python}-`elif`{l=python}-`else`{l=python}-setninger

Noen ganger ønsker å splitte programmet vårt i flere enn to deler. Da kan vi bruke en `elif`{l=python}-setning (står for "else if"): 

:::::::::::::::{admonition} Utforsk 3
---
class: explore
---
Under vises et program som bruker en `if`{l=python}-`elif`{l=python}-`else`{l=python}-setning. 


::::::::::::::{tab-set}
---
class: tabs-parts
---
:::::::::::::{tab-item} a
Kjør programmet med varetype som "mat" og sett prisen til 50. <br> Kan du forutsi verdien programmet skriver ut? Kjør programmet og sjekk svaret ditt!


:::::::::::::

:::::::::::::{tab-item} b
Hva blir utskriften hvis du endrer varetype til "reise"? <br> Sjekk svaret ditt med programmet!


:::::::::::::

:::::::::::::{tab-item} c
Endre varetype til "annet" og prisen til 100. <br> Hva blir utskriften? Sjekk svaret ditt med programmet!


:::::::::::::


::::::::::::::


:::{raw} html
---
file: interaktiv_kode/utforsk/utforsk_3.html
:::


:::::::::::::::

