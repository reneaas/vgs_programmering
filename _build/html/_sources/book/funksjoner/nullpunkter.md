# Finne nullpunkter med Python

## Introduksjon

En klassisk problem i matematikken er å finne nullpunktene til en funksjon. Formelt sett er nullpunkter de verdiene $x$ som gjør at funksjonsverdien er null, eller da alle $x$ der $f(x) = 0$. 

### Eksempel 1: Finne nullpunktene til en lineær funksjon

Vi tenker oss at vi har den lineære funksjonen

$$
f(x) = 2x - 1.
$$

Vi kan finne nullpunktet numerisk med Python kode slik:

```python
def f(x):
    return 2*x - 1

x = -10 # startverdi for x.
dx = 0.1 # steglengde for x.
while f(x) < 0: # Så lenge funksjonsverdien er negativ.
    x = x + dx # øk x med dx.
print(x)
```

Her har vi løst problemet med *brute-force*. Ved å se på funksjonsuttrykket ser vi at funksjonsverdien er negativ ved $x = -10$. Siden stigningstallet er positivt, *må* funksjonen bli positiv en eller annen gang. Så ved å starte fra denne verdien og gradvis øke verdien til $x$ frem til $f(x)$ skifter fortegn, vil vi finne et tilnærming til nullpunktet.


## Halveringsmetoden

En systematisk måte å finne nullpunkter til vilkårlige funksjoner $f(x)$ på, er å bruke **halveringsmetoden**. 
Algoritmen tar utgangspunkt i at vi velger oss et intervall $[a, b]$ der vi vet at nullpunktet ligger. Hvordan kan vi vite at nullpunktet ligger der? Funksjonsverdien må ha forskjellig fortegn i endepunktet. Det vil si $f(a) < 0$ og $f(b) > 0$, eller motsatt. Dette kan vi sjekke ved å regne ut funksjonsverdien i endepunktene, og gange de sammen. Hvis produktet er negativt, vet vi at funksjonsverdiene har forskjellig fortegn. Ideen er vi så regne ut midtpunktet på intervallet, for å deretter velge ut et nytt intervall som er halvparten så stort. Vi gjør dette ved å velge den halvdelen av intervallet som vi *vet* nullpunktet ligger i:

1. Regn ut midtpunktet $c = (a + b) / 2$.
2. Hvis $f(a) \cdot f(c) < 0$, sett $b = c$. Så midtpunktet blir høyre endepunkt på det nye intervallet.
3. Hvis ikke, sett $a = c$. Midtpunktet blir da venstre endepunkt på det nye intervallet.

Dette repeteres til en har en tilstrekkelig god tilnærming til nullpunktet. Det vil si at vi stopper når $|f(c)| < \epsilon$, der $\epsilon$ er en toleranseverdi som ofte settes til $\epsilon \approx 10^{-8}$. {prf:ref}`halveringsmetoden` viser pseudokode for algoritmen.

{numref}`bisection` viser en animasjon av halveringsmetoden.



```{figure} ./figurer/Bisection_ani.gif
---
name: bisection
---

Animasjon av halveringsmetoden. Hentet fra [Wikimedia Commons](https://upload.wikimedia.org/wikipedia/commons/d/d9/Bisection_anime.gif)
```



```{prf:algorithm} Halveringsmetoden
:label: halveringsmetoden
**Input:** En funksjon $f(x)$, et intervall $[a, b]$ der vi vet at nullpunktet ligger, og en toleranse $\epsilon$.

**Output:** Et tilnærming til et nullpunkt til $f$.

1. Sjekk at $f(a) \cdot f(b) < 0$. Hvis ikke, avslutt algoritmen.
2. Regn ut midtpunktet $c = (a + b) / 2$.
3. While $|f(c)| > \epsilon$:
    1. Hvis $f(a) \cdot f(c) < 0$, sett $b = c$.
    2. Hvis ikke, sett $a = c$.
    3. Regn ut midtpunktet $c = (a + b) / 2$.
4. Returner $c$.
```


### Eksempel 2: Finne nullpunktene til en andregradsfunksjon med halveringsmetoden 

Vi skal finne nullpunktene til funksjonen

$$
f(x) = x^2 - 1.
$$

Nullpunktene til denne funksjonen er $x = \pm 1$, så vi vet at vi må ende opp der. For å finne ett av de numerisk med halveringsmetoden, må vi i følge {prf:ref}`halveringsmetoden` velge oss ut:

1. En funksjon $f$. Check.
2. Et intervall $[a,b]$ der vi vet at $f$ har et nullpunkt, så $f$ *må* endre fortegn på intervallet.
3. En toleranse $\epsilon$.

Vi kan for eksempel velge oss ut intervallet $[a, b] = [-2, 0]$. Da har vi $f(-2) = 3$ og $f(0) = -1$, så $f$ endrer fortegn på intervallet.
Toleransen kan vi bare sette til $\epsilon = 10^{-8}$. 

Under kan du prøve å skrive koden som finner det ene nullpunktet ved hjelp av halveringsmetoden selv.
Løsningen ligger i fanen `fasit.py`, hvis du trenger hjelp.
Prøv å bruke løsningen din til å finne det *andre* nullpunktet også ved å velge et nytt intervall.


<iframe src="https://trinket.io/embed/python/f74e2a41cb" width="100%" height="600" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>


```{admonition} Svakheter med halveringsmetoden
:class: warning

1. Halveringsmetoden er en *iterativ* algoritme. Det vil si at den gjentar en prosess flere ganger. I praksis betyr dette at vi må velge et maksimalt antall iterasjoner. Hvis vi ikke gjør det, kan algoritmen potensielt kjøre i all evighet. Dette er en svakhet ved halveringsmetoden, og vi må derfor være forsiktige med å bruke den. 
2. Halveringsmetoden klarer bare å finne ett nullpunkt av gangen. Har en funksjon flere nullpunkter, må vi derfor bruke den flere ganger. Dette erfarte vi [eksempel 2](#Eksempel-2:-Finne-nullpunktene-til-en-andregradsfunksjon-med-halveringsmetoden).
3. Algoritmen krever også at vi har litt kjennskap til funksjonen vi skal finne nullpunktet til. Vi må vite at nullpunktet ligger i et intervall $[a, b]$. Dette kan være vanskelig å vite på forhånd, og må alltid sjekkes.

```


## Newtons metode

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
:class: warning

1. Newtons metode bruker tangenten til en funksjon. Hvis en funksjon har asymptoter, kan algoritmen feile eller gi feil svar fordi den aldri konvergerer mot et sant nullpunkt. Dette er en svakhet med Newtons metode, og vi må derfor være forsiktige med å bruke den, og dette er også hvorfor man noen ganger får "?" som løsning når man bruker NLØS i CAS i Geogebra.
2. Netwons metode, akkurat som halveringsmetoden, gir oss bare ett nullpunkt. Vi må derfor bruke den flere ganger hvis vi har en funksjon med flere nullpunkter.
```

### Oppgaver

#### Oppgave 1

Finn et av nullpunktene til funksjonen

$$
f(x) = x^3 - 2x^2 - 5x + 6,
$$

ved å bruke Newtons metode. Bruk et startpunkt $x_0 = 2$ og en toleranse $\epsilon = 10^{-8}$.
Du kan bruke kodeblokken under. *Det ligger et løsningsforslag i fanen `fasit.py` som du kan se på hvis du trenger hjelp.*


<iframe src="https://trinket.io/embed/python/49b50912da" width="100%" height="600" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>