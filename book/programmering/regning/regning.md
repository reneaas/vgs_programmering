# Regning med Python


:::{admonition} Læringsmål: regning med Python
---
class: tip
---
Etter å ha lest dette delkapittelet, er målet at du skal kunne:
* Bruke python til å regne ut enkle og sammensatte regnestykker.
:::

Python kan på mange måter sees på som en kraftfull og fleksibel kalkulator som lar oss regne matematisk på en måte vi ikke ellers kan gjøre på noen annen måte. Dette kan være å gjenta en utregning millioner av ganger frem til vi oppnår et ønsket resultat, eller bare regne ut en enkel matematisk formel. 

## Regneoperasjoner i Python

Vi starter med de viktigste regneoperasjonene

:::{admonition} Divisjon og brøker
---
class: sidenote, margin
---

I Python, så vil en brøk alltid regnes ut til et heltall (`int`{l=python}) eller et desimaltall (`float`{l=python}). Det er ingen innebygd måte å representere brøker på direkte.
:::

::::{admonition} Viktige regneoperasjoner i Python
---
class: theory
---
| Operasjon | Symbol i Python | Kodeeksempel | Matematikk |
| --- | --- | --- | --- |
| Addisjon | `+`{l=python} | `3 + 4`{l=python} | $3 + 4$ |
| Subtraksjon | `-`{l=python} | `3 - 4`{l=python} |  $3 - 4$ |
| Multiplikasjon | `*`{l=python} | `3 * 4`{l=python} | $3 \cdot 4$ |
| Divisjon | `/`{l=python} | `3 / 4`{l=python} | $\dfrac{3}{4}$ |
| Potens | `**`{l=python} | `3 ** 4`{l=python} | $3^4$ |

::::

:::::{admonition} Utforsk 1
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

:::::


## Regnerekkefølge

Python følger samme regnerekkefølge du har møtt i matematikken, bortsett fra at divisjon kommer alltid før multiplikasjon. 

::::{admonition} Regnerekkefølge i Python
---
class: theory
---
Regnerekkefølgen i Python er:

1. Parenteser
2. Potenser
3. Divisjon
4. Multiplikasjon
5. Addisjon og subtraksjon

::::

:::::{admonition} Utforsk 2
---
class: explore
---
Under vises et interaktiv kodevindu der regneoperasjoner som bruker regnerekkefølgen utføres.

Prøv å bruke regnerekkefølgen til å bestemme verdiene til variablene `a`{l=python}, `b`{l=python}, `c`{l=python}, `p`{l=python}, `q`{l=python} og `r`{l=python} før du kjører programmet. <br>

:::{raw} html
---
file: interaktiv_kode/utforsk/utforsk_2.html
---
:::

:::::




## Oppgaver

:::::{admonition} Oppgave 1
---
class: problem-level-1
---
I tabellen under vises noen regnestykker. Fyll ut koden i det interaktive kodevinduet under for å regne ut svarene.

| Variabel | Regnestykke |
| --- | --- |
| `a`{l=python} | $3 + 2 \cdot 4$ |
| `b`{l=python} | $6 - 2 + 5$ |
| `c`{l=python} | $\dfrac{9}{3} + 3$ |
| `d`{l=python} | $5\cdot (-2) + 4$ |


<br>

:::{raw} html
---
file: interaktiv_kode/oppgaver/oppgave_1.html
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
a = 3 + 2*4
b = 6 - 2 + 5
c = 9/3 + 3
d = 5*(-2) + 4

# Skriver ut resultatet
print(f"{a = } \n{b = } \n{c = } \n{d = }")
```
:::

:::::


:::::{admonition} Oppgave 2
---
class: problem-level-2
---
I tabellen under vises noen regnestykker. Fyll ut koden i det interaktive kodevinduet under for å regne ut svarene.

| Variabel | Regnestykke |
| --- | --- |
| `a`{l=python} | $7 + 3 \cdot (10 - 4)$ |
| `b`{l=python} | $\dfrac{8 + 2}{2} + 5\cdot 3$ |
| `c`{l=python} | $\dfrac{12}{3\cdot 2}\cdot 4 + 1$ |
| `d`{l=python} | $4\cdot (5 + 3^2) - \dfrac{6}{2}\cdot 3$ |

<br>

:::{raw} html
---
file: interaktiv_kode/oppgaver/oppgave_2.html
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
a = 7 + 3*(10 - 4)
b = (8 + 2)/2 + 5*3
c = 12 /(3 * 2) * 4 + 1
d = 4 * (5 + 3**2) - 6/2 * 3

# Skriver ut resultatet
print(f"{a = } \n{b = } \n{c = } \n{d = }")
```
:::

:::::


:::::{admonition} Oppgave 3
---
class: problem-level-3
---
En elev har forsøkt å regne ut

$$
r = \dfrac{2^3}{4\cdot 2} + \dfrac{1}{2}\cdot (1 + 3)
$$

ved å skrive koden under. Koden inneholder **to feil**. 

Finn feilene og rett de opp.

:::{raw} html
---
file: interaktiv_kode/oppgaver/oppgave_3.html
---
:::


:::{admonition} Fasit
---
class: answer, dropdown
---
Feilene:
1. `2 * 3`{l=python} skal være `2**3`{l=python}
2. `3 / 4 * 2`{l=python} skal være `3 / (4 * 2)`{l=python}

```{code-block} python
---
linenos:true
---
r = 2**3 / (4 * 2) + 1 / 2 * (1 + 3)           # FIKS MEG

print(f"{r = }")
```
:::::