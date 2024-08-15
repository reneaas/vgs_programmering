# `for`{l=python}-løkker

:::{admonition} Gjør dette først!
---
class: warning, margin
---
Du bør ha lest om [while-løkker](../while_loops/while_loops.md) før du leser dette kapittelet, eller være godt kjent med bruken av `while`{l=python}-løkker.
:::

:::{admonition} Læringsmål: `for`{l=python}-løkker
---
class: tip
---
Etter å ha gått gjennom dette delkapittelet, er målet at du skal kunne:
* Lese og forstå `for`{l=python}-løkker som brukes `range`{l=python}-funksjonen.
* Skrive grunnleggende `for`{l=python}-løkker som bruker `range`{l=python}-funksjonen til å løse matematiske problemer.

:::


En `for`{l=python}-løkke kan tenkes på som en *spesiell* type `while`{l=python}-løkke som automatiserer tellingen for deg. Det finnes mange typer `for`{l=python}-løkker, men vi skal konsentrere oss om en som er mest nyttig i matematikk. 

Vi starter med en sammenlikning av `for`{l=python}-løkker og `while`{l=python}-løkker:




:::::{admonition} Utforsk 1
---
class: explore,
---
Under vises to interaktive kodevinduer. Begge kodene skriver ut de 5 første naturlige tallene, men den éne bruker en `for`{l=python}-løkke og den andre bruker en `while`{l=python}-løkke.

```{raw} html
---
file: interaktiv_kode/utforsk/utforsk_1_for_loop.html
---
```

<!-- ::::{grid}
---

gutter: 1
---

:::{grid-item-card} 
`for`{l=python}-løkke
```{raw} html
---
file: interaktiv_kode/utforsk/utforsk_1_for_loop.html
---
```
:::

:::{grid-item-card} 
`while`{l=python}-løkke
```{raw} html
---
file: interaktiv_kode/utforsk/utforsk_1_while_loop.html
---
```
:::
:::: -->




Deloppgave 1
: Undersøk hva de tre tallene i `range(1, 6, 1)`{l=python} gjør for noe ved å prøve ut forskjellige kombinasjoner av tall. Kan du forklare rollen til de tre tallene?
: *Tips*: Prøv ut ett tall av gangen! Du kan også bruke negative tall.


<br>


::::{admonition} Løsning
---
class: solution, dropdown 
---
De tre tallene har følgende betydning:
* Det første tallet er startverdien til tellingen.
* Det andre tallet er slutten på tellingen. Men det siste tallet er aldri inkludert.
* Det tredje tallet er avstanden mellom hvert tall, kalt for steglengden. 

Vi kan altså tenke på de det som at vi skriver `range(start, stopp, steglengde)`{l=python}. 
::::

Deloppgave 2
: Undersøk hva som skjer hvis du bare bruker ett tall, som `range(6)`{l=python}.  
: Undersøk hva som skjer når du bruker to tall, som `range(1, 6)`{l=python}. 
: Hva er sammenhengen med når du bruker tre tall? 


::::{admonition} Løsning
---
class: solution, dropdown
---
* Hvis du bare bruker ett tall, som `range(6)`{l=python}, så vil startverdien være 0 og steglengden være 1. Det er det samme som å skrive `range(0, 6, 1)`{l=python}. Mer generelt kan vi skrive `range(stopp)`{l=python}. Da vil vi automatisk ha startverdien 0 og steglengden 1.
* Hvis vi bruker to tall, som `range(1, 6)`{l=python}, så vil startverdien være 1 og steglengden være 1. Det er det samme som å skrive `range(1, 6, 1)`{l=python}. Mer generelt kan vi skrive `range(start, stopp)`{l=python}. Da vil vi automatisk ha steglengden 1.
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


Nå har du fått litt oversikt over hvordan en enkel `for`{l=python}-løkke fungerer. Nå skal du se på hvordan du kan få en `for`{l=python}-løkke til å løse tilsvarende problemer som du løste når du så på `while`{l=python}-løkker.


:::::{admonition} Utforsk 2
---
class: explore
---
Under vises en kode som regner ut summen av de 5 første naturlige tallene. 


```{raw} html
---
file: interaktiv_kode/utforsk/utforsk_2_for_loop.html
---
```


Deloppgave 1
: Endre programet slik at det regner ut summen av de 10 første naturlige tallene. 


::::{admonition} Løsning
---
class: solution, dropdown
---
Vi endrer stoppverdien til `11`{l=python} for å få med tallet 10. 

```{code-block} python
---
linenos: true
emphasize-lines: 2
---
s = 0 
for i in range(1, 11):
    s = s + i

print(f"{s = }")
```
::::

<br>

Deloppgave 2
: Endre programmet slik at det regner ut summen av de 100 første naturlige tallene. (Det kan lurt å ta bort `print`{l=python}-setningen i `for`{l=python}-løkka for å unngå for mye utskrift.)


::::{admonition} Løsning
---
class: solution, dropdown
---
Vi endrer stoppverdien til `101`{l=python} for å få med tallet 100. 

```{code-block} python
---
linenos: true
emphasize-lines: 2
---
s = 0
for i in range(1, 101):
    s = s + i

print(f"Summen ble: {s = }")
```

::::

<br>

Deloppgave 3
: Endre programmet slik at det regner ut summen av de 100 første kvadrattallene. 

:::{admonition} Hint: Kvadrattall?
---
class: hints, dropdown
---
Et kvadrattall er et tall på formen $n^2$ for et naturlig tall $n$. 
:::


::::{admonition} Løsning
---
class: solution, dropdown
---
Vi må endre på formelen som oppdaterer verdien til `s`{l=python} slik at vi legger til et kvadrattall `i**2`{l=python} i stedet for et naturlig tall `i` (linje 3).

```{code-block} python
---
linenos: true
emphasize-lines: 3
---
s = 0
for i in range(1, 101):
    s = s + i**2

print(f"Summen ble: {s = }")
```
::::


<br>

Deloppgave 4
: Et partall kan skrives på formen $2i$ for et naturlig tall $i \in \mathbb{N}$. Endre programmet slik at det regner ut summen av de 100 første partallene 


::::{admonition} Løsning
---
class: solution, dropdown
---
Vi endrer på formelen som oppdaterer verdien til `s`{l=python} slik at vi legger til et partall `2*i`{l=python} i stedet for et naturlig tall `i` (linje 3).

```{code-block} python
---
linenos: true
emphasize-lines: 3
---
s = 0
for i in range(1, 101):
    s = s + 2*i

print(f"Summen ble: {s = }")
```
::::


:::::


---

## Oppgaver 

:::::{admonition} Oppgave 1
---
class: problem-level-1
---
Vi husker at $x$ er et kvadrattall dersom $x = n^2$ for et tall $n \in \mathbb{N}$. <br>
Under vises et uferdig program som skal bruke en `for`{l=python}-løkke til å legge sammen de 5 første kvadrattallene. 

:::{raw} html
---
file: ./interaktiv_kode/oppgaver/oppgave_1.html
---
:::


Deloppgave 1
: Gjør ferdig koden og kjør programmet. <br> Sjekk at utskriften stemmer ved regning.



Delopppgave 2
: Endre programmet slik at det regner ut summen av de 10 første kvadrattallene. <br> Stemmer svaret du får ved å kjøre programmet?


Deloppgave 3
: Endre programmet til å regne ut summen av de 100 første kubikktallene. <br> Hva blir summen?


:::::



:::::{admonition} Oppgave 2
---
class: problem-level-2
---

Vi minner om at $n$-fakultet er definert som

$$
n! = 1 \cdot 2 \cdot \ldots \cdot (n - 1) \cdot n.
$$

For eksempel er 

$$
4! = 1 \cdot 2 \cdot 3 \cdot 4 = 24.
$$


Deloppgave 1
: Under vises et program som regner ut $4!$ der kodelinjene er plassert i tilfeldig rekkefølge. <br> Plasser kodelinjene i riktig rekkefølge for å få tilgang til det ferdige programmet. <br> Lim inn programmet i det interaktivt kodevinduet og kjør det.  <br> Blir svaret riktig?


:::{raw} html
---
file: ./parsons_puzzle/oppgaver/oppgave_2.html
---
:::

<br>

:::{raw} html
---
file: ./interaktiv_kode/oppgaver/oppgave_2.html
---
:::

<br>

Deloppgave 2
: Endre programmet slik at det regner ut $7!$. <br> Hva blir svaret? svaret ved regning.


<br>

Deloppgave 3
: Dobbeltfakultet $n!!$ er definert som at du tar produktet av annenhvert tall. Hvis tallet $n$ er et oddetall, starter du på $1$. Hvis $n$ er et partall, starter du på $2$. For eksempel er

    $$
    5!! = 1 \cdot 3 \cdot 5 = 15  \quad \text{og} \quad 6!! = 2 \cdot 4 \cdot 6 = 48.
    $$

    Endre programmet slik at det regner ut $6!!$ <br> Stemmer svaret overens med svaret over?
:::::