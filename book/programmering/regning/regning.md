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

```{interactive-code}
---
predict: true
---
print(8 + 2)            # Pluss
print(8 - 2)            # Minus
print(8 * 2)            # Gange
print(8 / 2)            # Dele
print(8 ** 2)           # Potens
```
:::

:::{tab-item} b
Bruk programmet til å regne ut svarene på følgende regnestykker:

* $3 + 4$
* $3 - 4$
* $3 \cdot 4$
* $\dfrac{3}{4}$
* $3^4$

```{interactive-code}
# Skriv din kode her
```

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



:::{interactive-code}
---
predict: true
---
v = 20      # kilometer per time
t = 2       # timer

s = v * t   # strekning i kilometer

print(s)
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

:::{parsons-puzzle}
print(2 * 3)
print(-3 * 5 + 4)
print(-1 ** 2 + 1)
print((-1) ** 2 + 2)
print((3 + 1) / 2)
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


:::{interactive-code}
F = float(input("Skriv inn temperatur i Fahrenheit: ")) # IKKE RØR

C = # FYLL INN: formelen for temperatur i celsius

print(C)

:::

::::::


