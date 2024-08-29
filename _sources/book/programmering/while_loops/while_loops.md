# `while`{l=python}-løkker

:::{admonition} Læringsmål: `while`{l=python}-løkker
---
class: tip
---
Etter å ha gått gjennom dette delkapittelet, er målet at du skal kunne:
* Lese `while`{l=python}-løkker. 
* Skrive `while`{l=python}-løkker som løser matematiske problemer.
:::

En `while`{l=python}-løkke er noe vi bruker når vi ønsker å gjenta en eller flere kodelinjer igjen og igjen så lenge en betingelse er oppfylt. 


:::::{admonition} Utforsk 1
---
class: explore
---

Under vises et interaktivt program som bruker en `while`{l=python}-løkke til å skrive ut de **fem** første naturlige tallene. Her skal du utforske ulike biter av `while`{l=python}-løkken.

<br>

:::{raw} html
---
file: interaktiv_kode/utforsk/utforsk_1.html
---
:::



<br>

Deloppgave 1
: Prøv å endre *betingelsen* slik at programmet skriver ut de **ti** første naturlige tallene. 


:::{admonition} Løsning
---
class: solution, dropdown
---
Betingelsen kan settes til `i <= 10`{l=python} for å skrive ut de ti første naturlige tallene.
:::

<br>


Deloppgave 2
: Kan du forklare hva linja `i = i + 1`{l=python} gjør i programmet?  <br> Prøv å kjøre koden ved å endre til `i = i + 2`{l=python}. Hva skjer? <br> Hva med `i = i + 3`{l=python}? <br> Kan du forklare hva en sånn kodelinje gjør generelt ut ifra observasjonene dine?

:::{admonition} Løsning
---
class: solution, dropdown
---
* `i = i + 1`{l=python} øker verdien til `i`{l=python} med $1$ ved hver iterasjon. 
* `i = i + 2`{l=python} øker verdien til `i`{l=python} med $2$ ved hver iterasjon. 
* `i = i + 3`{l=python} øker verdien til `i`{l=python} med $3$ ved hver iterasjon.

Generelt vil `i = i + n`{l=python} øke verdien til `i`{l=python} med `n`{l=python} ved hver iterasjon.
:::

<br>


Deloppgave 3
: Gjør endringer slik at programmet skriver ut alle **partall** opp til og med 10.

:::{admonition} Løsning
---
class: solution, dropdown
---
Vi må gjøre tre endringer fra det opprinnelige programmet:
* Sette startverdien til `i`{l=python} til 2 slik at vi starter på et partall.
* Sette betingelsen til `i <= 10`{l=python}. 
* Endre linja `i = i + 1`{l=python} til `i = i + 2`{l=python} slik at vi øker verdien til `i`{l=python} med 2 ved hver iterasjon. 

Koden:
```{code-block} python
---
linenos: true
emphasize-lines: 1, 2, 4
---
i = 2
while i <= 10:
    print(f"{i = }")
    i = i + 2
```
:::
:::::


Nå kan vi ta med oss litt generell teori:

:::{admonition} Syntaks: `while`{l=python}-løkker
---
class: theory
---
En `while`{l=python}-løkke brukes for å gjenta en kodeblokk så lenge en **betingelse** er sann. Generelt kan en `while`{l=python}-løkke skrives på følgende måte:

```{code-block} python
while betingelse:
    # Gjøre noe så lenge `betingelse` er sann!
```
:::

Du skal få utforske litt mer der du skal løse matematiske problemer du *ikke* kan løse for hånd!

::::{admonition} Fun fact: Gauss
---
class: sidenote, margin
---
En matematiker som het Gauss fikk angiveligvis i oppgave å summere opp de 100 første naturlige tallene for hånd som straff fordi han var urolig i timen. Læreren tenkte det ville oppta han en god stund, men Gauss fant en lur løsning for å regne ut summen raskt. Dog, ikke like raskt som med et program...
::::

::::{admonition} Utforsk 2
---
class: explore
name: programmering-while-loops-utforsk-2
---
Under vises et interaktivt program som bruker en `while`{l=python}-løkke til å regne ut summen av de **fem** første naturlige tallene. 

<br>

:::{raw} html
---
file: ./interaktiv_kode/utforsk/utforsk_2.html
---
:::

<br>

Deloppgave 1
: Kan du få programmet til å regne ut summen av de **ti** første naturlige tallene? Sjekk at du får riktig svar ved å regne det ut for hånd.

:::{admonition} Løsning
---
class: solution, dropdown
---
Vi endrer betingelsen til `i <= 10`{l=python} for å regne ut summen av de ti første naturlige tallene. Svaret blir $55$.

:::


<br>

Deloppgave 2
: Kan du få programmet til å regne ut summen av de $100$ første naturlige tallene? Kan du stole på resultatet ditt? Hvorfor/hvorfor ikke?

:::{admonition} Løsning
---
class: solution, dropdown
---
* Vi endrer betingelsen til `i <= 100`{l=python} for å regne ut summen av de $100$ første naturlige tallene. Svaret blir da $5050$.
* Vi kan stole på resultatet fordi vi har bekreftet at programmet fungerer som det skal for de fem og ti første naturlige tallene. Det er ingen grunn til at det ikke skal fungere like godt for de $100$ første naturlige tallene. Eller de $10000$ første naturlige tallene, for den saks skyld.

:::

<br>

Deloppgave 3
: Kan du få programmet til å regne ut summen av bare partall eller bare oddetall opp til og med 100? Hvilke av de to summene er størst?

:::{admonition} Løsning
---
class: solution, dropdown
---
* I begge tilfeller setter vi betingelsen til `i <= 100`{l=python}.
* I begge tilfeller endrer vi linja `i = i + 1`{l=python} til `i = i + 2`{l=python} for å få annenhvert tall.
* Startverdien til `i`{l=python} er avhengig av hva hvilken sum vi ønsker å regne ut:
    * Oddetall: `i = 1`{l=python}
    * Partall: `i = 2`{l=python}

Summene blir:
* Oddetall: $2500$
* Partall: $2550$

Summen av partallene er altså størst.

Fullstendig program:
```{code-block} python
---
linenos: true
---
s = 0   
i = 2   # NOTE: Startverdi for partall. Sett i = 1 for oddetall. 

while i <= 100:
    s = s + i
    i = i + 2

print(f"{s = }")
```
:::


::::



## Oppgaver



:::::{admonition} Oppgave 1
---
class: problem-level-1
---
Kvadrattallene $x$ er tall som kan skrives som $x = i^2$ for et naturlig tall $i$. 

Under vises et interaktivt kodevindu med en uferdig kode som skal summere opp de fem første kvadrattallene.

:::{raw} html
---
file: ./interaktiv_kode/oppgaver/oppgave_1.html
---
:::

<br>

Deloppgave 1
: Fiks programmet slik at det regner ut summen av de fem første kvadrattallene. Sjekk svaret ved å regne for hånd. 

:::{admonition} Løsning
---
class: solution, dropdown
---
Vi må legge på `i**2`{l=python} til `s`{l=python} ved hver iterasjon. <br> 
Dette oppnår vi med kodelinjen `s = s + i**2`{l=python}. Koden blir da
```{code-block} python
---
linenos: true
emphasize-lines: 5
---
s = 0   
i = 1

while i <= 5:
    s = s + i**2
    i = i + 1

print(f"{s = }")
```

Kjører vi koden, blir utskriften
```console
s = 55
```

Altså er summen av de fem første kvadrattallene $55$. 
:::


<br>

Deloppgave 2
: Juster programmet slik at det regner ut summen av de $100$ første kvadrattallene. Hva blir svaret?

:::{admonition} Løsning
---
class: solution, dropdown
---
Vi må endre betingelsen i `while`{l=python}-løkka til `i <= 100`{l=python} for å regne ut summen av de $100$ første kvadrattallene.
Koden blir altså

```{code-block} python
---
linenos: true
emphasize-lines: 4
---
s = 0   
i = 1

while i <= 100:
    s = s + i**2
    i = i + 1

print(f"{s = }")
```

Da får vi utskriften
```console
s = 338350
```
Svaret er altså $338350$.
:::

<br>

Deloppgave 3
: Endre programmet slik at det regner ut summen av de $100$ første kubikktallene $x \in \{1^3, 2^3 , 3^3, \ldots, 100^3\}$.

:::{admonition} Løsning
---
class: solution, dropdown
---
Vi må endre linja `s = s + i**2`{l=python} til `s = s + i**3`{l=python} for å legge til kubikktall i stedet for kvadrattall. Dermed får vi 
```{code-block} python
---
linenos: true
emphasize-lines: 5
---
s = 0
i = 1

while i <= 100:
    s = s + i**3
    i = i + 1

print(f"{s = }")
```

Kjører vi koden, får vi utskriften
```console
s = 25502500
```

Svaret er altså $25502500$.
:::

:::::

:::::{admonition} Oppgave 2
---
class: problem-level-2
---
En matematisk størrelse som dukker opp i mange sammenhenger er $n$-fakultet. $n$-fakultet skrives $n!$ og er definert som produktet av alle naturlige tall opp til og med $n$. Matematisk skriver vi:

$$
n! = 1 \cdot 2 \cdot 3 \cdot \ldots \cdot n
$$

For eksempel er 

$$
4! = 1 \cdot 2 \cdot 3 \cdot 4 = 24.
$$

<br>

Deloppgave 1
: Under vises et program som regner ut $4!$ i tilfeldig rekkefølge. <br> Plasser kodelinjene i riktig rekkefølge for å få tilgang til det ferdige programmet. <br> Lim inn programmet i et interaktivt kodevindu og kjør det.

<br>

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
: Juster programmet slik at det regner ut $10!$
: Hva blir svaret?


:::{admonition} Løsning
---
class: solution, dropdown
---
Vi endrer betingelsen i `while`{l=python}-løkka til `i <= 10`{l=python} for å regne ut $10!$ - Koden blir da

```{code-block} python
---
linenos: true
emphasize-lines: 4
---
p = 1
i = 1

while i <= 10:
    p = p * i
    i = i + 1

print(f"{p = }")
```
Kjører vi koden får vi utskriften
```console
p = 3628800
```
:::

<br>

Deloppgave 3
: Fra teorien om kombinatorikk, kan man komme fram til at antall måter å stokke en kortstokk med 52 kort på er $52!$. <br> Bruk programmet til å bestemme dette tallet. Hva blir svaret?


:::{admonition} Løsning
---
class: solution, dropdown
---
```{code-block} python
---
linenos: true
emphasize-lines: 4
---
i = 1 
p = 1

while i <= 52:
    p = p*i
    i = i + 1
    
print(f"{p = }")
```
som gir utskriften
```console
p = 80658175170943878571660636856403766975289505440883277824000000000000
```
For å få bedre oversikt over hva dette tallet er, kan vi skrive om `print`{l=python}-setningen som 

```{code-block} python
print(f"{p = :e}")
```
Dette skriver ut tallet med "vitenskapelig" notasjon (standardform, *kinda*). Utskriften blir da
```console
p = 8.065818e+67
```

som betyr at 

$$
52! = 8.065818 \times 10^{67},
$$

med en presisjon på 7 siffer.

:::


:::::

