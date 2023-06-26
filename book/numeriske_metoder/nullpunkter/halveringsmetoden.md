# Halveringsmetoden

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



<!-- ```{prf:algorithm} Halveringsmetoden
:label: halveringsmetoden

__Input__: En funksjon $f(x)$, et intervall $[a, b]$ der vi vet at nullpunktet ligger, og en toleranse $\epsilon$.

__Output__: Et tilnærming til et nullpunkt til $f$.

1. Sjekk at $f(a) \cdot f(b) < 0$. Hvis ikke, avslutt algoritmen.
2. Regn ut midtpunktet $c = (a + b) / 2$.
3. While $|f(c)| > \epsilon$:
    1. Hvis $f(a) \cdot f(c) < 0$, sett $b = c$.
    2. Hvis ikke, sett $a = c$.
    3. Regn ut midtpunktet $c = (a + b) / 2$.
4. Returner $c$.
``` -->


## Eksempel: Finne nullpunktene til en andregradsfunksjon med halveringsmetoden 

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
:class: warning, dropdown

1. Halveringsmetoden er en *iterativ* algoritme. Det vil si at den gjentar en prosess flere ganger. I praksis betyr dette at vi må velge et maksimalt antall iterasjoner. Hvis vi ikke gjør det, kan algoritmen potensielt kjøre i all evighet. Dette er en svakhet ved halveringsmetoden, og vi må derfor være forsiktige med å bruke den. 
2. Halveringsmetoden klarer bare å finne ett nullpunkt av gangen. Har en funksjon flere nullpunkter, må vi derfor bruke den flere ganger. 
3. Algoritmen krever også at vi har litt kjennskap til funksjonen vi skal finne nullpunktet til. Vi må vite at nullpunktet ligger i et intervall $[a, b]$. Dette kan være vanskelig å vite på forhånd, og må alltid sjekkes.
```