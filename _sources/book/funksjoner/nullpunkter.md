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

1. Hvis $f(a) \cdot f(m) < 0$, sett $b = m$. Så midtpunktet blir høyre endepunkt på det nye intervallet.
2. Hvis ikke, sett $a = m$. Midtpunktet blir da venstre endepunkt på det nye intervallet.

Dette repeteres til en har en tilstrekkelig god tilnærming til nullpunktet. Det vil si at vi stopper når $|f(m)| < \epsilon$, der $\epsilon$ er en toleranseverdi som ofte settes til $\epsilon \approx 10^{-8}$. {prf:ref}`halveringsmetoden` viser pseudokode for algoritmen.


```{prf:algorithm} Halveringsmetoden
:label: halveringsmetoden
**Input:** En funksjon $f(x)$, et intervall $[a, b]$ der vi vet at nullpunktet ligger, og en toleranse $\epsilon$.

**Output:** Et tilnærmet nullpunkt $x$.

1. Sjekk at $f(a) \cdot f(b) < 0$. Hvis ikke, avslutt algoritmen.
2. Regn ut midtpunktet $m = (a + b) / 2$.
3. While $|f(m)| > \epsilon$:
    1. Hvis $f(a) \cdot f(m) < 0$, sett $b = m$.
    2. Hvis ikke, sett $a = m$.
    3. Regn ut midtpunktet $m = (a + b) / 2$.
4. Returner $m$.
```

```{admonition} Svakheter ved halveringsmetoden
:class: warning

1. Halveringsmetoden er en *iterativ* algoritme. Det vil si at den gjentar en prosess flere ganger. I praksis betyr dette at vi må velge et maksimalt antall iterasjoner. Hvis vi ikke gjør det, kan algoritmen potensielt kjøre i all evighet. Dette er en svakhet ved halveringsmetoden, og vi må derfor være forsiktige med å bruke den. 
2. Halveringsmetoden klarer bare å finne ett nullpunkt av gangen. Har en funksjon flere nullpunkter, må vi derfor bruke den flere ganger. 
3. Algoritmen krever også at vi har litt kjennskap til funksjonen vi skal finne nullpunktet til. Vi må vite at nullpunktet ligger i et intervall $[a, b]$. Dette kan være vanskelig å vite på forhånd, og må alltid sjekkes.

```

### Eksempel 2: Finne nullpunktene til en andregradsfunksjon med halveringsmetoden

Vi skal finne nullpunktene til funksjonen
