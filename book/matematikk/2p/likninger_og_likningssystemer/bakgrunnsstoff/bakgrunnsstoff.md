# Bakgrunnsstoff 

:::{admonition} Læringsmål
---
class: tip
---
Etter å ha gått gjennom dette delkapittelet, er målet at du skal:
* Kunne lese og forstå `for`{l=python}-løkker som bruker `range`{l=python}-funksjonen.
* Kunne endre på programmer som bruker `for`{l=python}-løkker for å løse lignende oppgaver.
* Kunne lese, tolke og endre på `if`{l=python}-setninger som brukes sammen med `for`{l=python}-løkker.

:::

## `for`{l=python}-løkker



En `for`{l=python}-løkke er noe som brukes til å gjenta en eller flere linjer med kode et bestemt antall ganger som er forhåndsbestemt. For å oppnå dette, brukes ofte `range`{l=python}-funksjonen.

:::::{admonition} Utforsk 1: `for`{l=python}-løkker
---
class: explore
---
Her skal du bli kjent med `for`{l=python}-løkker på formen:

```{code-block} python
for i in range(a, b, c):
    ...
```

som ofte brukes når man løser matematiske problemer med Pythonkode. 

Under vises et interaktivt kodevindu. 

```{raw} html
---
file: interaktiv_kode/utforsk/utforsk_1.html
---
```


<br>

Deloppgave 1
: Undersøk hva de tre tallene i `range(1, 6, 1)`{l=python} gjør for noe ved å prøve ut forskjellige kombinasjoner av tall. Kan du forklare rollen til de tre tallene?
: *Tips*: Prøv å endre på *ett* tall av gangen! Du kan også bruke negative tall.


<br>


::::{admonition} Løsning
---
class: solution, dropdown 
---
Vi bruker notasjonen `range(a, b, c)`{l=python} for å gjøre det enklere å beskrive de ulike tallene.
* `a`{l=python} beskriver startverdien til `i`{l=python} i løkka.
* `b`{l=python} beskriver sluttverdien, men er *ikke* inkludert. Vi stopper alltid før sluttverdien. 
* `c`{l=python} er steglengden (avstanden mellom hvert tall). 

Vi kan altså tenke på de det som at vi skriver `range(start, slutt, steglengde)`{l=python}. 
::::

Deloppgave 2
: Undersøk hva som skjer hvis du bare bruker ett tall, som `range(6)`{l=python}.  
: Undersøk hva som skjer når du bruker to tall, som `range(1, 6)`{l=python}. 
: Hva er sammenhengen med når du bruker tre tall? 


::::{admonition} Løsning
---
class: solution, dropdown
---
* Hvis du bare bruker ett tall, som `range(6)`{l=python}, så vil startverdien være 0 og steglengden være 1. Det er det samme som å skrive `range(0, 6, 1)`{l=python}. Mer generelt kan vi skrive `range(slutt)`{l=python}. Da vil vi automatisk ha startverdien 0 og steglengden 1.
* Hvis vi bruker to tall, som `range(1, 6)`{l=python}, så vil startverdien være 1 og steglengden være 1. Det er det samme som å skrive `range(1, 6, 1)`{l=python}. Mer generelt kan vi skrive `range(start, slutt)`{l=python}. Da vil vi automatisk ha steglengden 1.
::::

<br>

Deloppgave 3
: Undersøk om du kan få `for`{l=python}-løkka til å skrive ut de 10 første naturlige tallene.

::::{admonition} Løsning
---
class: solution, dropdown
---
Vi må endre stoppverdien til `11`{l=python} for å få med tallet 10. 

```{code-block} python
---
linenos: true
emphasize-lines: 1
---
for i in range(1, 11, 1):
    print(i)
```

Fra deloppgave 2, lærte vi også at vi ikke trenger å ta med steglengden når den er 1. Derfor kan vi skrive `range(1, 11)`{l=python} i stedet.
::::


<br>

Deloppgave 4
: Undersøk om du kan få `for`{l=python}-løkka til å skrive ut alle partall fra 2 til 10. 


::::{admonition} Løsning
---
class: solution, dropdown
---
Vi må sette følgende verdier:
* Startverdi: 2
* Stoppverdi: 11 (husk at vi aldri får med det siste tallet)
* Steglengde: 2

```{code-block} python
---
linenos: true
emphasize-lines: 1
---
for i in range(2, 11, 2):
    print(i)
```
::::

<br>

Deloppgave 5
: Kan du få `for`{l=python}-løkka til å skrive ut tallene fra 10 til 1 i synkende rekkefølge?

::::{admonition} Løsning
---
class: solution, dropdown
---
Vi må sette følgende verdier:
* Startverdi: 10
* Stoppverdi: 0 (husk at vi aldri får med det siste tallet)
* Steglengde: -1

```{code-block} python
---
linenos: true
emphasize-lines: 1
---
for i in range(10, 0, -1):
    print(i)
```
::::

:::::

---

::::{admonition} Underveisoppgave 1
---
class: check
---

Under vises noen `for`{l=python}-løkker og noen følger med tall. <br> Pusle sammen riktig løkke med riktig tallfølge.
:::{raw} html
---
file: ./pair_puzzles/underveisoppgaver/underveisoppgave_1.html
---
:::

::::


## `if`{l=python}-setninger og `for`{l=python}-løkker
Noen ganger å ønsker vi å gjenta noe frem til noe spesielt skjer. Da kan vi bruke en `if`{l=python}-setning inni en `for`{l=python}-løkke.


::::{admonition} Utforsk 2: `if`{l=python}-setninger og `for`{l=python}-løkker
---
class: explore
---
Under vises et interaktivt program som bruker en `if`{l=python}-setning inni en `for`{l=python}-løkke. 

:::{raw} html
---
file: interaktiv_kode/utforsk/utforsk_2.html 
---
:::

<br>

Deloppgave 1
: Kjør koden og se på utskriften. Kan du forklare hva programmet gjør? 


<br>

Deloppgave 2
: Endre på koden slik at programmet skriver ut $7$ i stedet.

<br>

Delopppgave 3
: Endre på `if`{l=python}-setningen til å være `if i > 5:`{l=python} <br> Kan du forklare hva som skjer nå? 

<br>

Deloppgave 4
: Endre på `if`{l=python}-setningen slik at programmet bare skriver ut tallene $0, 1, 2, 3$. 


Deloppgave 5
: Endre `if`{l=python}-setningen til å være `if i == 2 or i == 6:`{l=python}. <br> Kan du forklare hva som skjer på grunn av denne `if`{l=python}-setningen?
::::

---

::::{admonition} Underveisoppgave 2
---
class: check, full-width
---
Under vises noen `for`{l=python}-løkker med `if`{l=python}-setninger og noen utskrifter som parvis hører sammen. <br> Pusle sammen riktig løkke med riktig utskrift. 

:::{raw} html
---
file: ./pair_puzzles/underveisoppgaver/underveisoppgave_2.html
---
:::
::::