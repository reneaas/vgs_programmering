# Regning med Python


:::{admonition} Læringsmål: regning med Python
---
class: tip
---
* Bruke Pythonkode til å regne ut enkle regnestykker.
* Bruke Pythonkode til å regne med formler.
:::

Python kan på mange måter sees på som en kraftfull og fleksibel kalkulator. Den kan brukes for å regne ut en enkel matematisk formel, men også gjennomføre millioner av utregninger i løpet av noen få sekunder. 

## Regnearter i Python

Vi starter med å bli kjent med de vanlige regneartene vi bruker i matematikken.

:::::{admonition} Utforsk 1: regnearter
---
class: explore
---

::::{tab-set}
---
class: tabs-parts
---
:::{tab-item} a
Under vises et program som bruker de ulike regneartene i Python til å regne ut noe og skrive ut svaret.

Les programmet og forutsi hva som skrives ut. Skriv inn hypotesen din under for å sjekke.
:::

:::{tab-item} b
Bruk programmet til å regne ut svarene på følgende regnestykker:

* $3 + 4$
* $3 - 4$
* $3 \cdot 4$
* $\dfrac{3}{4}$
* $3^4$

````{admonition} Fasit
---
class: dropdown, answer
---
```{code-block} python
---
linenos: true
---
print(3 + 4)
print(3 - 4)
print(3 * 4)
print(3 / 4)
print(3 ** 4) 
```
````
:::
::::

<br>

:::{raw} html
---
file: ./interaktiv_kode/utforsk/utforsk_1/steg_1.html
---
:::
:::::

> Etter utforsk 1, kan du ta en titt på oppsummeringsboksen under.

::::{admonition} Oppsummering: regneartene i Python
---
class: summary, dropdown
---
| Operasjon | Symbol i Python | Kodeeksempel | Matematikk |
| --- | --- | --- | --- |
| Addisjon | `+`{l=python} | `3 + 4`{l=python} | $3 + 4$ |
| Subtraksjon | `-`{l=python} | `3 - 4`{l=python} |  $3 - 4$ |
| Multiplikasjon | `*`{l=python} | `3 * 4`{l=python} | $3 \cdot 4$ |
| Divisjon | `/`{l=python} | `3 / 4`{l=python} | $\dfrac{3}{4}$ |
| Potens | `**`{l=python} | `3 ** 4`{l=python} | $3^4$ |

::::

<!-- :::::{admonition} Utforsk 1
---
class: explore
---
Under vises et interaktivt kodevindu der noen regneoperasjoner blir utført.

Prøv å bestemme hvilke verdier variablene `a`{l=python}, `b`{l=python}, `c`{l=python}, `p`{l=python} og `q`{l=python} får før du kjører programmet. <br>
Kjør programmet for å sjekke svaret ditt!

:::{raw} html
---
file: interaktiv_kode/utforsk/utforsk_1.html
---
:::

::::: -->


## Formler

Det er sjelden vi skriver regnestykker manuelt slik som vi så på i utforsk 1. Vi er oftest interessert i å regne ut noe med en formel som inneholder variabler. Vi ønsker med andre ord å bruke Python som en avansert kalkulator.


:::::{admonition} Utforsk 2: formler
---
class: explore
---
Strekning, fart og tid er tre størrelser som henger sammen. Vi kan bruke formelen 

$$
s = v\cdot t
$$

til å regne ut strekningen $s$ dersom vi har farten $v$ og tiden $t$. 

::::{tab-set}
---
class: tabs-parts
---

:::{tab-item} a
I programkoden under regnes det ut en strekning $s$ basert på en fart $v$ og en tid $t$.

Les programmet og forutsi hva som skrives ut. Skriv inn hypotesen din under for å sjekke.
:::

:::{tab-item} b
Bruk programmet til å regne ut strekningen når $v = 80 \ \mathrm{km / h}$ og $t = 2.5 \ \mathrm{h}$.

Hva blir strekningen?

````{admonition} Fasit
---
class: dropdown, answer
---
```{code-block} python
---
linenos: true
---
v = 80          # kilometer per time
t = 2.5         # timer

s = v * t       # strekning i kilometer

print(s)
```
````
:::

:::{tab-item} c
En bil kjører i $90 \ \mathrm{km / h}$ og kjører en avstand på $342 \ \mathrm{km}$. 

Juster programmet slik at du kan regne ut tiden det tok å kjøre denne strekningen. Hvor lang tid tok det?

````{admonition} Fasit
---
class: dropdown, answer
---
Vi kan enten prøve oss frem med ulike verdier av $t$ til vi får riktig avstand, eller så kan vi skrive om formelen til å regne ut tiden $t$:

$$
t = \dfrac{s}{v}
$$
```{code-block} python
---
linenos: true
---
v = 90
s = 342

t = s / v

print(t)
```
````
:::
::::

<br>

:::{raw} html
---
file: interaktiv_kode/utforsk/utforsk_2.html
:::

::::: 


---

:::{admonition} Deling før ganging
---
class: sidenote, margin
---
Merk at i Python så skjer deling før ganging! Dette får du bruk for i oppgave 1.
:::

::::{admonition} Oppgave 1
---
class: problem-level-1
---
Gjennomfør quizen! Mer enn et alternativ kan være riktig.

:::{raw} html
---
file: quiz/oppgaver/oppgave_1.html/
---
:::

::::

---


:::::{admonition} Oppgave 2
---
class: problem-level-1
---
Når et program ble kjørt, ga det utskriften

```console
6
-11
0
3
2.0
```

Programmet er vist i tilfeldig rekkefølge under. Sett sammen programmet i riktig rekkefølge.

:::{raw} html
---
file: ./parsons_puzzle/oppgaver/oppgave_2.html
---
:::
:::::

---

::::::{admonition} Oppgave 3
---
class: problem-level-1
---
To enheter som er brukt for å måle temperatur er Celsius og Fahrenheit. En av statene som er mest kjent for å bruke Fahrenheit er USA. 

En formel som forteller oss hva temperaturen i Celsius $C$ er når vi kjenner temperaturen i Fahrenheit $F$ er gitt ved

$$
C = \dfrac{5}{9} \cdot (F - 32)
$$

:::::{tab-set}
---
class: tabs-parts
---
::::{tab-item} a
Fyll ut programmet under med formelen for å regne ut temperaturen i Celsius.

Prøv programmet ditt ved å kjøre programmet med $F = 32$. <br> Da skal temperaturen i Celsius være $0$.
````{admonition} Fasit
---
class: dropdown, answer
---
```{code-block} python
---
linenos: true
---
F = float(input("Skriv inn temperatur i Fahrenheit: "))

C = (5 / 9) * (F - 32)

print(C)
```
````
::::

::::{tab-item} b
Det finnes en temperatur der både temperaturen i Fahrenheit og Celsius blir den samme.

Bruk programmet ditt til å lete etter denne temperaturen ved å prøve ut ulike verdier for $F$. 

Hva er temperaturen da?

````{admonition} Hint
---
class: dropdown, hints
---
Når du prøver deg fram, kan du bruke følgende strategi:
1. Start med å prøve deg fram med en temperatur i Fahrenheit.
2. Når forskjellen i temperatur i Celsius og Fahrenheit begynner å bli mindre, så nærmer du deg den riktige verdien.
````

````{admonition} Fasit
---
class: dropdown, answer
---
$F = -40$ gir $C = -40$. Da er temperaturen den samme i Fahrenheit og Celsius.
````
::::
:::::

<br>

:::{raw} html
---
file: ./interaktiv_kode/oppgaver/oppgave_3.html
---
:::

::::::



::::::{admonition} Oppgave 4
---
class: problem-level-2
---
Universet er fryktelig stort. Vi kan sette tall på avstander i Universet, men når tall blir veldig store, blir de ganske vanskelige å tolke for menneskehjernen - vi har liksom ikke noen innebygd forståelse av ting vi ikke omgir oss med på den lille planeten vi kaller Jorden (som vi sikkert kan være enig om er forholdsvis stor den også!).

Her skal du regne litt på størrelser i Universet og omforme avstandene til noe vi kan tolke og forstå.

:::::{tab-set}
---
class: tabs-parts
---
::::{tab-item} a
I mange sammenhenger må vi omforme mellom forskjellige enheter av tid for å tolke tallet. For eksempel vil ikke 7200 sekunder, 45 000 timer eller 892 dager være spesielt nyttige måter å uttrykke hvor lang tid noe tar. 

I kodevinduet under vises et eksempel der en tid i sekunder omformes til tid i dager. Da bruker vi følgende omgjøringsfaktor til å omforme enheten:

$$
\text{faktor} =
\begin{pmatrix}
    \text{sekunder} \\
    \text{per} \\
    \text{minutt}
\end{pmatrix}
\cdot
\begin{pmatrix}
    \text{minutter} \\
    \text{per} \\
    \text{time}
\end{pmatrix}
$$


Les programmet og forutsi hva som skrives ut. Skriv inn hypotesene din under for å sjekke!

:::{raw} html
---
file: ./interaktiv_kode/oppgaver/oppgave_4/oppgave_a.html
---
:::


::::
::::{tab-item} b
Avstanden til vår nærmeste nabo, *månen*, er på ca. $384 \, 400 \ \mathrm{km}$. Tenk deg at vi skulle kjørt til månen med samme fart som en bil på E6 som har en fartsgrense på $100 \ \mathrm{km/h}$. 

Bruk programmet under til å bestemme hvor mange dager det tar før vi kommer fram til månen. 

:::{admonition} Hint
---
class: dropdown, hints
---
Du kan få bruk for vei-fart-tid formelen:

$$
s = v\cdot t
$$
:::


:::{raw} html
---
file: ./interaktiv_kode/oppgaver/oppgave_4/oppgave_b.html
---
:::

````{admonition} Fasit
---
class: dropdown, answer
---
Programkode:
```{code-block} python
fart = 100                       # km/h
strekning = 384_400              # km
tid = avstand / fart             # h (timer) 

timer_per_dag = 24
tid = tid / timer_per_dag

print(tid)
```
````
::::

::::{tab-item} c
Avstanden til solen er omtrent $149 \, 600 \, 000 \ \mathrm{km}$.

Vi tenker oss igjen at vi skal kjøre til solen med fart på $100 \ \mathrm{km/h}$. 

Bruk programmet under til å bestemme hvor mange år det ville tatte å kjøre til solen.


:::{admonition} Hint
---
class: dropdown, hints
---
For å regne ut antall timer per år, kan vi utføre regnestykket

$$
\text{timer per år} = (\text{timer per dag}) \cdot (\text{dager per år})
$$
:::

:::{raw} html
---
file: ./interaktiv_kode/oppgaver/oppgave_4/oppgave_c.html
---
:::


````{admonition} Fasit
---
class: dropdown, answer
---
Programkode:
```{code-block} python
---
linenos: true
---
strekning = 149_600_000  # km til solen
fart = 100  # bilfart i km/h

tid = strekning / fart
timer_per_år = 24 * 365
tid = tid / timer_per_år

print(tid)
```
````
::::

::::{tab-item} d

:::{admonition} Fakta om lys
---
class: summary
---
* Lys beveger seg med en konstant fart på ca. $300 \, 000 \ \mathrm{km/s}$. Vi kaller dette for *lysfarten*.
* Avstanden lyset reiser på 1 jordår, kaller vi for et *lysår*. For å regne ut denne avstanden kan vi bruke formelen 

$$
s = v\cdot t
$$ 
:::

Bruk programmet under til å bestemme hvor mange kilometer et lysår er.


:::{admonition} Hint
---
class: dropdown, hints
---
For å regne ut antall sekunder per år, kan vi utføre regnestykket

$$
\begin{pmatrix}
    \text{sekunder} \\
    \text{per} \\
    \text{år}
\end{pmatrix}
= 
\begin{pmatrix}
    \text{sekunder} \\
    \text{per} \\
    \text{minutt}
\end{pmatrix}
\cdot
\begin{pmatrix}
    \text{minutter} \\
    \text{per} \\
    \text{time}
\end{pmatrix}
\cdot
\begin{pmatrix}
    \text{timer} \\
    \text{per} \\
    \text{dag}
\end{pmatrix}
\cdot
\begin{pmatrix}
    \text{dager} \\
    \text{per} \\
    \text{år}
\end{pmatrix}
$$
:::


:::{raw} html
---
file: ./interaktiv_kode/oppgaver/oppgave_4/oppgave_d.html
---
:::

:::{admonition} Fasit
---
class: dropdown, answer
---
Programkode:
```{code-block} python
---
linenos: true
---
lysfart = 300_000 # km / s

t_år = 60 * 60 * 24 * 365
lysår = lysfart * t_år

print(f"{lysår = :_} km.") # IKKE RØR: formatterer utskriften pent!
```
Utskriften blir: 

```console
lysår = 9_460_800_000_000 km.
```

Som betyr at 

$$
1 \ \text{lysår} = 9 \, 460 \, 800 \, 000 \, 000 \ \mathrm{km}.
$$

:::
::::

::::{tab-item} e
Det nærmeste solsystemet til oss er *Alpha Centauri*. Avstanden til Alpha Centauri er ca. $4.25 \ \text{lysår}$. 

Bruk programmet under til å bestemme hvor mange år det ville tatt å kjøre med en bil som har en fart på $100 \ \mathrm{km/h}$ til Alpha Centauri.

:::{admonition} Hint
---
class: dropdown, hints
---
Bruk avstanden du fant for lysår i kilometer fra oppgave c. Eller bare kopier kodelinjene som regner det ut!
:::


:::{raw} html
---
file: ./interaktiv_kode/oppgaver/oppgave_4/oppgave_e.html
---
:::

:::{admonition} Fasit
---
class: dropdown, answer
---
Programkode:

```{code-block} python
---
linenos: true
---
fart = 100 # bilfarten km/h 
lysår = 9_460_800_000_000 # km

strekning = 4.25 * lysår
reisetid = strekning / fart
timer_per_år = 24 * 365

reisetid = reisetid / timer_per_år  # <-- omdanner fra timer til år

print(f"{reisetid :_.0f} år.") # IKKE RØR: formatterer utskriften pent!
```

Utskriften blir:

```console
45_900_000 år.
```

som betyr at vi måtte kjørt bil i $45 \, 900 \, 000 \ \text{år}$. Nå har vi igjen møtt på et tall som er ufattelig å tolke for menneskehjernen. Men vi kan i det minste konkludere at det nærmeste solsystemet vi kjenner til er svært svært langt unna.
:::

::::
:::::


::::::

