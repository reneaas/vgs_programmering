# Numerisk integrasjon med Python

## Introduksjon
Å finne verdien til bestemte integraler er en viktig oppgave i matematikken og fysikken. I mange tilfeller er det ikke mulig å finne en analytisk løsning på integralet, og vi må da ty til numeriske metoder. I dette kapittelet skal vi se på hvordan vi kan finne tilnærmede verdier til bestemte integraler ved hjelp av Python. 


## Trapesmetoden
En av de enkleste metodene for å finne tilnærmede verdier til bestemte integraler er **trapesmetoden**. Vi tenker oss at vi har en funksjon $f$ og skal regne ut integralet

$$
I = \int\limits_a^b f(x) \, dx.
$$

Tanken bak metoden er 
1. Vi deler opp intervallet $[a, b]$ i $n$ like store delintervaller, slik at vi får delintervallene $[x_0, x_1]$, $[x_1, x_2]$, ..., $[x_{n-1}, x_n]$.
2. Vi kaller lengden til hvert delintervall for $h$. Da er $h = \frac{b - a}{n}$. Vi kaller også $x_0 = a$ og $x_n = b$. 
3. Vi regner ut arealet av trapesene som er avgrenset av grafen til $f$ og de to linjene $x = x_i$ og $x = x_{i+1}$ for hvert delintervall. Vi kaller disse arealene for $S_i$.

Se {numref}`trapesmetoden` for en illustrasjon av trapesmetoden. Her spiller $h = x_{i+1} - x_i$ rollen som "høyden" i hvert trapes, mens $f(x_i)$ og $f(x_{i+1})$ spiller rollen som "sidelengdene".

```{figure} ./figurer/Integration_num_trapezes_notation.svg
---
:name: trapesmetoden
---
Figuren viser en graf av en funksjon $f$ og trapesene som er avgrenset av grafen til $f$ og de to linjene $x = x_i$ og $x = x_{i+1}$ for hvert delintervall. Figuren er hentet fra [Wikimedia Commons](https://en.wikipedia.org/wiki/Trapezoidal_rule#/media/File:Integration_num_trapezes_notation.svg).
```


```{admonition} Arealet av et trapes
:class: tip

Påminnelse om hva arealet av et trapes er gitt ved. Det finner vi med formelen
$
A = \frac{a + b}{2}h
$
der $h$ er høyden til trapeset, og $a$ og $b$ er sidelengdene. I {numref}`trapes` ser du et trapes med høyde $h$ og sidelengder $a$ og $b$ for referanse.

```{figure} ./figurer/Trapezoid.svg
---
:name: trapes
---
Figuren viser et trapes med høyde $h$ og sidelengder $a$ og $b$. Figuren er hentet fra [Wikimedia Commons](https://en.wikipedia.org/wiki/Trapezoid#/media/File:Trapezoid.svg).

```


