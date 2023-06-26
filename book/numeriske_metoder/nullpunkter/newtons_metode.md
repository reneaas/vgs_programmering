# Newtons metode

**Newtons metode** er en effektiv måte å finne nullpunktene til en funksjon $f$ dersom vi også kjenner til den deriverte $f'$. Algoritmen er basert på å finne nullpunktet til tangenten til funksjonen $f$ i et punkt $x_0$. Vi kan finne nullpunktet til tangenten ved å bruke nullpunktet til funksjonen $f'$, som vi kjenner til. Dette gir oss et nytt punkt $x_1$. Vi kan så gjenta prosessen, og finne nullpunktet til tangenten til $f$ i $x_1$. Dette gir oss et nytt punkt $x_2$. Vi kan fortsette slik til vi har en tilstrekkelig god tilnærming til nullpunktet. {numref}`newtonsmetode_fig` viser en animasjon av prosessen.



```{figure} ./figurer/NewtonIteration_Ani.gif
---
name: newtonsmetode_fig
---
Animasjonen viser fem steg i Newtons metode der man finner en tilnærming til nullpunktet til en funksjon $f$ vist i blå. Animasjonen er hentet fra [Wikimedia Commons](https://en.wikipedia.org/wiki/Newton%27s_method#/media/File:NewtonIteration_Ani.gif).
```

Vi kan formelt komme frem til en algoritme som følger. La $x_0$ være et vilkårlig startpunkt.
Bruker vi ettpunktsformelen for en tangent som tangerer funksjonen vår i punktet $x_0$, får vi likningen

$$
y = f(x_0) + f'(x_0)(x - x_0).
$$

Ideen er å finne en tilnærming til nullpunktet til $f$ ved å finne nullpunktet til tangenten i stedet. Nullpunktet til tangenten er gitt ved løsningen av likningen

$$
f(x_0) + f'(x_0)(x_1 - x_0) = 0,
$$

som gir

$$
x_1 = x_0 - \frac{f(x_0)}{f'(x_0)}.
$$

Denne formelen kan vi repetere igjen og igjen, slik at vi kommer nærmere og nærmere et nullpunktet til $f$. Mer generelt kan vi finne et nytt estimat på nullpunktet med $x_{i+1}$ ved å bruke funksjonsverdien $f(x_i)$ og den deriverte $f'(x_i)$ i punktet $x_i$ ved formelen

$$
x_{i + 1} = x_i - \frac{f(x_i)}{f'(x_i)}.
$$

Med denne formelen er vi klare til å formalisere algoritmen i en pseudokode. Algoritmen for Newtons metode er vist i {prf:ref}`newtonsmetode`.

```{prf:algorithm} Newtons metode
:label: newtonsmetode

**Input:** En funksjon $f(x)$, den deriverte $f'(x)$, et startpunkt $x_0$ og en toleranse $\epsilon$.

**Output:** Et tilnærmet nullpunkt $x$.

1. Regn ut $x_1 = x_0 - \frac{f(x_0)}{f'(x_0)}$.
2. While $|f(x_i)| > \epsilon$:
    1. Regn ut $x_{i + 1} = x_i - \frac{f(x_i)}{f'(x_i)}$.
3. Returner $x_{i + 1}$.
```


```{admonition} Svakheter med Newtons metode
:class: warning, dropdown

1. Newtons metode bruker tangenten til en funksjon. Hvis en funksjon har asymptoter, kan algoritmen feile eller gi feil svar fordi den aldri konvergerer mot et sant nullpunkt. Dette er en svakhet med Newtons metode, og vi må derfor være forsiktige med å bruke den, og dette er også hvorfor man noen ganger får "?" som løsning når man bruker NLØS i CAS i Geogebra.
2. Netwons metode, akkurat som halveringsmetoden, gir oss bare ett nullpunkt. Vi må derfor bruke den flere ganger hvis vi har en funksjon med flere nullpunkter.
```

## Oppgaver

### Oppgave 1

Finn et av nullpunktene til funksjonen

$$
f(x) = x^3 - 2x^2 - 5x + 6,
$$

ved å bruke Newtons metode. Bruk et startpunkt $x_0 = 2$ og en toleranse $\epsilon = 10^{-8}$.
Du kan bruke kodeblokken under. *Det ligger et løsningsforslag i fanen `fasit.py` som du kan se på hvis du trenger hjelp.*


<iframe src="https://trinket.io/embed/python/49b50912da" width="100%" height="600" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>