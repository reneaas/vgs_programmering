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

Tilnærmingen til integralet blir da

$$
\int\limits_a^b f(x) \, dx \approx \sum\limits_{i=0}^{n-1} S_i = \sum\limits_{i=0}^{n-1} \frac{f(x_i) + f(x_{i+1})}{2}h.
$$

Denne formelen kan vi skrive om litt smartere, så vi ikke regner ut $f(x_i)$ og $f(x_{i+1})$ to ganger. Du skal vise at formelen i oppgavene.

$$
\int\limits_a^b f(x) \, dx \approx h \frac{f(a) + f(b)}{2} + h\sum_{i=1}^{n-2} f(x_i).
$$

```{figure} ./figurer/Integration_num_trapezes_notation.svg
---
name: trapesmetoden
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
name: trapes
---
Figuren viser et trapes med høyde $h$ og sidelengder $a$ og $b$. Figuren er hentet fra [Wikimedia Commons](https://en.wikipedia.org/wiki/Trapezoid#/media/File:Trapezoid.svg).

```


### Oppgaver

#### Oppgave 1

Finn en tilnærming til integralet

$$
I = \int\limits_0^1 e^{-x^2} \, dx 
$$

ved å bruke trapesmetoden. Bruk $n = 1000$ delintervaller. Du kan bruke kodeblokken under til å regne ut svaret.
*Du finner et løsningsforslag i fanen `fasit.py` hvis du trenger hjelp*.

<iframe src="https://trinket.io/embed/python/41c0defb70" width="100%" height="600" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>



#### Oppgave 2

Vis at vi kan skrive formelen for tilnærmingen til integralet som

$$
\int_a^b f(x) \, dx \approx h \frac{f(a) + f(b)}{2} + h\sum_{i=1}^{n-2} f(x_i),
$$

ved å starte fra summen

$$
\int\limits_a^b f(x) \, dx \approx \sum\limits_{i=0}^{n-1} \frac{f(x_i) + f(x_{i+1})}{2}h.
$$


## Midtpunktsmetoden

En annen metode for å finne en tilnærming til integralet 

$$
I = \int\limits_a^b f(x) \, dx,
$$

er ved å ta i bruk **midtpunktsmetoden**. Ingrediensene i midtpunktsmetoden er

1. Del opp intervallet $[a, b]$ i $n$ delintervaller $[x_0, x_1]$, $[x_1, x_2]$, ..., $[x_{n-1}, x_n]$ med bredde $h = (b - a) / n$.
2. Regn ut $f$ i midtpunktet til hvert delintervall. Vi kaller disse verdiene for $f(x_{i+1/2})$, der $x_{i + 1/2} = a + (i + 1/2)h$.
3. Regn ut arealet av rektangel $i$ med høyde $f(x_{i+1/2})$ og bredde $h$. Vi kaller disse arealene for $S_i$.
4. Summer opp arealene som en tilnærming til integralet $I$.

Tilnærmingen til integralet blir da


$$
I = \int\limits_a^b f(x) \, dx \approx \sum\limits_{i=0}^{n-1} S_i = \sum\limits_{i=0}^{n-1} f(x_{i+1/2})h.
$$

Vi oppsummerer det hele i {prf:ref}`midtpunktsmetoden`.

```{prf:algorithm} Midtpunktsmetoden
:label: midtpunktsmetoden

**Input**: $a$, $b$, $n$, $f$.

**Output**: Tilnærmingen til integralet $I$.

1. Regn ut $h = (b - a) / n$.
2. Sett $I = 0$.
3. For $i = 0, 1, 2, ..., n-1$:
    1. $x_{i+1/2} = a + (i + 1/2)h$.
    2. $S = f(x_{i+1/2})h$.
    3. $I = I + S$
4. Returner $I$.
```

```{admonition} Midtpunktsmetoden vs. trapesmetoden
:class: tip

Midtpunktsmetoden har mange likheter med trapesmetoden. Forskjellen ligger i hvordan selve arealet regnes ut. I midtpunktsmetoden regner vi ut arealet av rektangler, mens vi i trapesmetoden regner ut arealet av trapeser. Det som gjør midtpunktsmetoden god, er måten man velger ut høyden i rektanglene. Generelt sett, er midtpunktsmetoden mer nøyaktig enn trapesmetoden!
```

### Oppgaver

#### Oppgave 1

Finn en tilnærming til integralet

$$
I = \int\limits_0^1 x**2 * e^{-x} \, dx,
$$

ved å bruke midtpunktsmetoden. Bruk $n = 1000$ delintervaller. Du kan bruke kodeblokken under til å regne ut svaret.
*Du finner et løsningsforslag i fanen `fasit.py` hvis du trenger hjelp*.

<iframe src="https://trinket.io/embed/python/27d766e4e2" width="100%" height="600" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>

#### Oppgave 2

Finn en tilnærming til integralet

$$
I = \int\limits_0^1 e^{-x^2}\, dx
$$

ved å bruke midtpunktsmetoden. Bruk $n = 1000$ delintervaller. Du kan bruke kodeblokken under til å regne ut svaret.

<iframe src="https://trinket.io/embed/python/352bd16743" width="100%" height="600" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>





