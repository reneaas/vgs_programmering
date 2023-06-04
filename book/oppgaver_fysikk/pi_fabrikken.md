---
jupytext:
  text_representation:
    extension: .md
    format_name: myst
    format_version: 0.13
    jupytext_version: 1.14.5
kernelspec:
  display_name: Python 3
  language: python
  name: python3
---

# Elastiske kollisjoner som en $\pi$-fabrikk

+++

Det finnes en underlig sammenheng mellom elastiske kollisjoner og siffer i tallet $\pi$. 

Scenario er som følger: Vi har en uendelig tung vegg. Vi plasserer en lett kloss med masse $m$ foran veggen. Så dytter vi en tyngere kloss med masse $M$ (så $M > m$), og så teller vi total antall kollisjoner som klossene har med hverandre og veggen. Hvor mange kollisjoner blir det? 

Så lenge $M = 100^p m$ for $p = 0, 1, 2, 3, ... $, så kan vi hente ut de $p + 1$ første siffrene i $\pi$.

Din oppgave er å skrive en kode som simulerer denne prosessen og genererer de første siffrene i $\pi$.

+++

## Bakgrunnsteori

Anta vi plasserer en vegg med uendelig masse i origo ($x = 0$). Så plasserer vi den lette klossen med masse $m$ ved en posisjon $x = x_0$ og den tyngre klossen med masse $M$ ved $X = X_0$, der $X_0 > x_0$. 

Anta at kloss $m$ har hastighet $v$ og kloss $M$ har hastighet $V$ før en kollisjon. Etter kollisjonen vil kloss $m$ ha hastighet $v'$ og kloss $M$ vil ha hastighet $V'$, gitt ved følgende uttrykk:

$$
v' = \frac{m - M}{m + M} v + \frac{2M}{m + M} V,
$$

og

$$
V' = \frac{2m}{m + M} v + \frac{M - m}{m + M} V.
$$

Vi kan bruke disse uttrykkene til å simulere kollisjonene.

Videre, dersom kloss $m$ treffer veggen, så vil den reflekteres, men ha uendret hastighet slik at $v' = -v$.

+++

## Oppgave 0 (frivillig, men lærerik)

Utled formlene for $v'$ og $V'$ ved å ta utgangspunkt i at det er en *elastisk kollisjon* slik at både bevegelsesmengde og kinetisk energi er bevart for totalsystemet.

+++

## Oppgave 1

Skriv en funksjon som tar inn hastighetene $v$ og $V$, og massene $m$ og $M$, og returnerer de nye hastighetene $v'$ og $V'$ etter kollisjonen.

*Under er et kodeskall for funksjonen. Du må fylle inn alle steder det står* `NotImplemented`.

```{code-cell} ipython3
def kollisjon(v, V, m, M):
    """Tar inn hastighetene v og V til to legemer med massene m og M,
    og returnerer hastighetene v_neste og V_neste etter kollisjonen.
    """
    v_neste = NotImplemented
    V_neste = NotImplemented
    return v_neste, V_neste
```

````{Admonition} Løsningsforslag:
:class: dropdown
    
```python
def kollisjon(v, V, m, M):
    v_neste = (m - M) / (m + M) * v + 2*M / (m + M) * V
    V_neste = 2*m / (m + M) + (M - m) / (m + M) * V
    return v_neste, V_neste
```
````


Du kan kjøre testkoden under for å sjekke at funksjonen din gjør det den skal.

```{code-cell} ipython3
def test_kollisjon():
    """Tester kollisjonsfunksjonen for tilfelle der v = 0, V = -1, m = 1, M = 1.
    Da skal v_neste = -1 og V_neste = 0. Gir en feilmelding hvis dette ikke stemmer.
    """
    v = 0
    V = -1
    m = 1
    M = 1
    v_neste, V_neste = kollisjon(v, V, m, M)
    assert v_neste == -1 and V_neste == 0, "Feil i kollisjon(v, V, m, M). Testen feilet for v = 0, V = -1, m = 1, M = 1."

    v = 1
    V = 0
    m = 1
    M = 1
    v_neste, V_neste = kollisjon(v, V, m, M)
    assert v_neste == 0 and V_neste == 1, "Feil i kollisjon(v, V, m, M). Testen feilet for v = 1, V = 0, m = 1, M = 1."
test_kollisjon()
```

## Oppgave 2

Skriv en funksjon som simulerer flere kollisjoner mellom både klossene, og kloss og vegg over tid. Funksjonen skal returnere antall kollisjoner totalt, det vil si antall kollisjoner mellom de to klossene, og antall kollisjoner mellom kloss $m$ og veggen.

*Under er et kodeskall for funksjonen. Du må fylle inn alle steder det står* `NotImplemented`

```{code-cell} ipython3
def simuler_kollisjoner(v, V, m, M, dt=0.001):
    """Simulerer kollisjoner mellom en kloss med masse m og en kloss med masse M,
    der klossene har hastighetene v og V ved start. 

    Argumenter:
        v: Hastighet til liten kloss ved start.
        V: Hastighet til stor kloss ved start.
        m: Masse til liten kloss.
        M: Masse til stor kloss.
        dt: Tidssteg for simuleringen. Default: 0.001
    
    Returnerer:
        antall_kollisjoner: Antall kollisjoner som har skjedd i løpet av simuleringen.
    """
    x = 0.5 # startposisjon til liten kloss
    X = 1 # startposisjon til stor kloss.
    antall_kollisjoner = 0

    while True: # Kjører helt til vi manuelt bryter ut av løkken med `break`.
        # Sjekk om liten kloss treffer veggen og oppdater hastighet hvis den gjør det.
        if NotImplemented: # Finn en betingelse for når den lille klossen treffer veggen.
            v = NotImplemented # Klossen reflekterer av veggen!
            antall_kollisjoner = NotImplemented


        # Sjekk om liten kloss og stor kloss kolliderer og oppdater hastighetene hvis de gjør det.
        elif NotImplemented: # Finn en betingelse for når klossene kolliderer.
            v, V = NotImplemented
            antall_kollisjoner = NotImplemented

        if NotImplemented: # Finn en betingelse for når klossene aldri lenger vil kollidere.
            break
        
        x = NotImplemented # Oppdater posisjon til liten kloss.
        X = NotImplemented # Oppdater posisjon til stor kloss.


    return antall_kollisjoner
```

````{admonition} Løsningsforlag:
:class: dropdown

```python

def simuler_kollisjoner(v, V, m, M, dt=0.001):
    """Simulerer kollisjoner mellom en kloss med masse m og en kloss med masse M,
    der klossene har hastighetene v og V ved start. 

    Argumenter:
        v: Hastighet til liten kloss ved start.
        V: Hastighet til stor kloss ved start.
        m: Masse til liten kloss.
        M: Masse til stor kloss.
        dt: Tidssteg for simuleringen. Default: 0.001
    
    Returnerer:
        antall_kollisjoner: Antall kollisjoner som har skjedd i løpet av simuleringen.
    """
    x = 0.5 # startposisjon til liten kloss
    X = 1 # startposisjon til stor kloss.
    antall_kollisjoner = 0

    while True: # Kjører helt til vi manuelt bryter ut av løkken med `break`.
        # Sjekk om liten kloss treffer veggen og oppdater hastighet hvis den gjør det.
        if x < 0: # når x < 0, har den lille klossen gått inn i veggen, så vi må snu den rundt! 
            v = -v # Klossen reflekterer av veggen!
            antall_kollisjoner += 1


        # Sjekk om liten kloss og stor kloss kolliderer og oppdater hastighetene hvis de gjør det.
        elif X < x: # Dersom X < x, har stor kloss passert gjennom liten kloss. Dette er en kollisjon!
            v, V = kollisjon(v, V, m, M)
            antall_kollisjoner += 1

        if v >= 0 and V >= 0 and V >= v: # Klossene kan aldri lenger treffe hverandre. Vi avslutter simuleringen.
            break
        
        x = x + v * dt # Oppdater posisjon til liten kloss. x = x + v * dt
        X = X + V * dt # Oppdater posisjonen til stor kloss.


    return antall_kollisjoner

```

````

Du kan kjøre kodecellen under for å sjekke at koden din fungerer som den skal!

```{code-cell} ipython3
def test_simuler_kollisjoner():
    antall_kollisjoner = simuler_kollisjoner(v=0, V=-1, m=1, M=1, dt=0.001, max_tid=10)
    if antall_kollisjoner != 3:
        raise ValueError(
        f"""
        Feil i simuler_kollisjoner(v, V, m, M, dt, max_tid). Testen feilet for v = 0, V = -1, m = 1, M = 1.
        Antall kollisjoner skulle vært 3, men koden din returnerte {antall_kollisjoner}
        """
        )

    antall_kollisjoner = simuler_kollisjoner(v=0, V=-1, m=1, M=100, dt=0.001, max_tid=10)
    if antall_kollisjoner != 31:
        raise ValueError(f"Antall kollisjoner skulle vært 31 når m=1 og M=100. Koden din returnerte {antall_kollisjoner}.")
    
    antall_kollisjoner = simuler_kollisjoner(v=0, V=-1, m=1, M=100**2, dt=0.001, max_tid=10)
    if antall_kollisjoner != 314:
        raise ValueError(f"Antall kollisjoner skulle vært 314 når m=1 og M=100**2. Koden din returnerte {antall_kollisjoner}.")
        
    print("Funksjonen din fungerer som den skal.")
test_simuler_kollisjoner()
```
