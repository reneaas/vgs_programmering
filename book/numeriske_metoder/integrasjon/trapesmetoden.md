# Trapesmetoden
En av de enkleste metodene for å finne tilnærmede verdier til bestemte integraler er **trapesmetoden**. Vi tenker oss at vi har en funksjon $f$ og skal regne ut integralet

$$
I = \int\limits_a^b f(x) \, dx.
$$

Tanken bak metoden er 
1. Vi deler opp intervallet $[a, b]$ i $n$ like store delintervaller, slik at vi får delintervallene $[x_0, x_1]$, $[x_1, x_2]$, ..., $[x_{n-1}, x_n]$.
2. Vi kaller lengden til hvert delintervall for $h$. Da er $h = \frac{b - a}{n}$. Vi kaller også $x_0 = a$ og $x_n = b$. 
3. Vi regner ut arealet av trapesene som er avgrenset av grafen til $f$ og de to linjene $x = x_i$ og $x = x_{i+1}$ for hvert delintervall. Vi kaller disse arealene for $S_i$.

Se {numref}`trapesmetoden` for en illustrasjon av trapesmetoden. Her spiller $h = x_{i+1} - x_i$ rollen som "høyden" i hvert trapes, mens $f(x_i)$ og $f(x_{i+1})$ spiller rollen som "sidelengdene".

Tilnærmingen til integralet blir da

$$
\int\limits_a^b f(x) \, dx \approx \sum\limits_{i=0}^{n-1} S_i = \sum\limits_{i=0}^{n-1} \frac{f(x_i) + f(x_{i+1})}{2}h.
$$

Denne formelen kan vi skrive om litt smartere, så vi ikke regner ut $f(x_i)$ og $f(x_{i+1})$ to ganger. I oppgavene skal du vise at uttrykket kan skrives om til:

$$
\int\limits_a^b f(x) \, dx \approx h \frac{f(a) + f(b)}{2} + h\sum_{i=1}^{n-2} f(x_i).
$$


Vi kan oppsummere med en algoritme:

```{prf:algorithm} Trapesmetoden
:label: trapesmetoden

**Input**: $f$, $a$, $b$, $n$

**Output**: Tilnærming til integralet $\int\limits_a^b f(x) \, dx$

1. Sett $h = \frac{b - a}{n}$.
2. Sett $I = 0$.
3. For $i = 1,2,\ldots, n-1$:
    1. Sett $x = a + ih$.
    2. Sett $I = I + f(x)$.
4. Sett $I = h \frac{f(a) + f(b)}{2} + hI$.
5. Returner $I$.
```


```{figure} ./figurer/Integration_num_trapezes_notation.svg
---
name: trapesmetoden
---
Figuren viser en graf av en funksjon $f$ og trapesene som er avgrenset av grafen til $f$ og de to linjene $x = x_i$ og $x = x_{i+1}$ for hvert delintervall. Figuren er hentet fra [Wikimedia Commons](https://en.wikipedia.org/wiki/Trapezoidal_rule#/media/File:Integration_num_trapezes_notation.svg).
```


````{admonition} Repetisjon: Arealet av et trapes
:class: tip, dropdown

Påminnelse om hva arealet av et trapes er gitt ved. Det finner vi med formelen
$
A = \frac{a + b}{2}h
$
der $h$ er høyden til trapeset, og $a$ og $b$ er sidelengdene. I {numref}`trapes` ser du et trapes med høyde $h$ og sidelengder $a$ og $b$ for referanse.

```{figure} ./figurer/Trapezoid.svg
---
name: trapes
---
Figuren viser et trapes med høyde $h$ og sidelengder $a$ og $b$. Figuren er hentet fra [Wikimedia Commons](https://en.wikipedia.org/wiki/Trapezoid#/media/File:Trapezoid.svg).

```
````

## Oppgaver


### Oppgave 1

Finn en tilnærming til integralet

$$
I = \int\limits_0^1 e^{-x^2} \, dx 
$$

ved å bruke trapesmetoden. Bruk $n = 1000$ delintervaller. Du kan bruke kodeblokken under til å regne ut svaret.
*Du finner et løsningsforslag i fanen `fasit.py` hvis du trenger hjelp*.

<iframe src="https://trinket.io/embed/python/41c0defb70" width="100%" height="600" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>



### Oppgave 2

Vis at vi kan skrive formelen for tilnærmingen til integralet som

$$
\int_a^b f(x) \, dx \approx h \frac{f(a) + f(b)}{2} + h\sum_{i=1}^{n-2} f(x_i),
$$

ved å starte fra summen

$$
\int\limits_a^b f(x) \, dx \approx \sum\limits_{i=0}^{n-1} \frac{f(x_i) + f(x_{i+1})}{2}h.
$$


## Flere oppgaver på temaet



[Flere oppgaver på numerisk integrasjon finner du her.](../oppgaver/integrasjon_nb) 