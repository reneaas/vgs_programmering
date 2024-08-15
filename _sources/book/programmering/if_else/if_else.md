# `if`{l=python}-`else`{l=python}-setninger

:::{admonition} Læringsmål: `if`{l=python}-`else`{l=python}-setninger
---
class: tip
--- 
Etter å ha lest dette delkapittelet, er målet at du skal kunne:
* Forklare hva en **betingelse** er, og sette opp betingelser i Python.
* Forstå hva en **boolsk** variabel er, og kunne sette opp en sannhetstabell for ulike betingelser.
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

:::::{admonition} Utforsk 2
---
class: explore
---
Under vises et interakivt program som skriver ut forskjellige betingelser.


Deloppgave 1
: Prøv å bestemme hvilke av betingelsene som er `True`{l=python} og hvilke som er `False`{l=python} før du kjører programmet. 
: Skriv ned forutsigelsene dine og kjør programmet.

<br>



:::{raw} html
---
file: interaktiv_kode/utforsk/utforsk_2.html
---
:::


<br>

Deloppgave 2
: Hvis du endrer verdiene til `a`{l=python} og `b`{l=python} slik at betingelsen `a > b`{l=python} er `True`{l=python}, hvilke av de andre betingelsene vil da også være `True`{l=python}? 
: Tenk ut først, deretter test ut med programmet!


<br>

Deloppgave 3
: Hva er det største antall betingelser som er `True`{l=python} du kan få ut ifra programmet bare ved å endre på verdiene til `a`{l=python} og `b`{l=python}?



:::::

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

:::::{admonition} Utforsk 3
---
class: explore
---
Under vises et program som bruker en `if`{l=python}-`elif`{l=python}-`else`{l=python}-setning. 

:::{raw} html
---
file: interaktiv_kode/utforsk/utforsk_3.html
:::

<br>

Deloppgave 1
: Kjør programmet med varetype som "mat" og sett prisen til 50. <br> Kan du forutsi verdien programmet skriver ut? Kjør programmet og sjekk svaret ditt!


<br>

Deloppgave 2
: Hva blir utskriften hvis du endrer varetype til "reise"? <br> Sjekk svaret ditt med programmet!


<br>

Deloppgave 3
: Endre varetype til "annet" og prisen til 100. <br> Hva blir utskriften? Sjekk svaret ditt med programmet!
:::::

