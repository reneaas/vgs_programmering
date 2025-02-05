# Likninger

::::{admonition} Læringsmål
---
class: tip
---
* Kunne bruke `for`{l=python}-løkker og `if`{l=python}-tester til å løse likninger.
* Kunne bruke `while`{l=python}-løkker til å løse likninger.
* Kunne skrive programmer som bruker bestemte algoritmer til å løse likninger.
::::

> **Forkunnskaper**: <br> Her må du være kjent med både `for`{l=python}-løkker, `while`{l=python}-løkker og `if`{l=python}-tester. Vi starter derfor med litt repetisjon:

:::::::::::::::{admonition} Repetisjonsquiz 1
---
class: quiz
---
Her finner du en repetisjonsquiz for noen av programmeringsverktøyene vi skal bruke. Ta de quizzene du trenger for å friske opp kunnskapen din!

::::::::::::::{tab-set}
---
class: tabs-parts
---
:::::::::::::{tab-item} `for`{l=python}-løkker

:::{raw} html
---
file: quiz/quiz_1/quiz_1_for_loops.html
---
:::

:::::::::::::

:::::::::::::{tab-item} `while`{l=python}-løkker

:::{raw} html
---
file: quiz/quiz_1/quiz_1_while_loops.html
---
:::

:::::::::::::
::::::::::::::



:::::::::::::::

--- 


:::::::::::::::{admonition} Utforsk 1
---
class: explore
---
Vi starter med å se på en strategi for løse likninger der løsningene er **hele tall**. 

::::::::::::::{admonition} Strategi 1: Heltallsløsninger
---
class: theory
---
Gitt en funksjon $f$, kan vi løse likningen $f(x) = 0$ med følgende steg:
1. Start med en heltallsverdi for $x$. 
2. Sjekk om $f(x) = 0$. Hvis dette er tilfelle, skriv ut verdien til $x$.
3. Øk verdien til $x$ med $1$. 

Stegene over gjentas et forhåndsbestemt antall ganger i et forsøk på å finne alle heltallsløsninger til likningen $f(x) = 0$.

::::::::::::::


:::::::::::::{tab-set}
---
class: tabs-parts
---
::::::::::::{tab-item} a

Under vises et program som anvender denne strategi ved å bruke en `for`{l=python}-løkke og en `if`{l=python}-test. 

:::{raw} html
---
file: ./python/utforsk/utforsk_1/a.html
---
:::

::::::::::::


::::::::::::{tab-item} b

En likning er gitt ved

$$
x^2 - x - 2 = 0.
$$

Fyll ut programmet og bestem løsningene til likningen. 

:::{raw} html
---
file: ./python/utforsk/utforsk_1/b.html
---
:::

::::::::::::


::::::::::::{tab-item} c
En likning er gitt ved

$$
x^3 - 2x^2 - 5x + 6 = 0.
$$

Fyll ut programmet og bestem løsningene til likningen.

:::{raw} html
---
file: ./python/utforsk/utforsk_1/c.html
---
:::

::::::::::::



:::::::::::::


:::::::::::::::

---


:::::::::::::::{admonition} Underveisoppgave 1
---
class: check
---
Bruk **strategi 1** fra Utforsk 1 til å bestemme heltallsløsningene til likningene.

::::::::::::::{tab-set}
---
class: tabs-parts
---
:::::::::::::{tab-item} a
Fyll ut programmet og bestem heltallsløsningene til likningen 

$$
x^2 - 3x + 2 = 0.
$$

:::{raw} html
---
file: ./python/underveisoppgaver/oppgave_1/a.html
---
:::

:::::::::::::


:::::::::::::{tab-item} b
En funksjon $f$ er gitt ved 

$$
f(x) = x^3 - 3x^2 - 4x + 12.
$$

Fyll ut programmet under og bestem heltallsløsningene til likningen $f(x) = 0$. 

:::{raw} html
---
file: ./python/underveisoppgaver/oppgave_1/b.html
---
:::

:::::::::::::


:::::::::::::{tab-item} c
En tredjegradsfunksjon $f$ er gitt ved 

$$
f(x) = x^3 + 5x^2 + 2x - 6. 
$$

Fyll ut programmet under og bestem heltallsløsningene til likningen $f(x) = 2$.

:::{raw} html
---
file: ./python/underveisoppgaver/oppgave_1/c.html
---
:::

:::::::::::::


:::::::::::::{tab-item} d
En fjerdegradsfunksjon $f$ er gitt ved 


$$
f(x) = x^4 - x^3 - 7x^2 + 13x - 10
$$

Fyll ut programmet under og bestem heltallsløsningene til likningen $f(x) = -4$.

:::{raw} html
---
file: ./python/underveisoppgaver/oppgave_1/d.html
---
:::

:::::::::::::



::::::::::::::


:::::::::::::::

---

Så langt har vi bare sett på en strategi for å bestemme heltallsløsninger til en likning. Nå skal vi utvide verktøykassen med en strategi som håndterer likninger med løsninger som ikke er heltall.


::::{admonition} `abs()`{l=python}-funksjonen
---
class: sidenote, margin
---
Når vi skriver `abs(f(x))`{l=python} i et program, regner vi ut $|f(x)|$. Dette betyr at vi får absoluttverdien til $f(x)$.
::::

:::::::::::::::{admonition} Utforsk 2
---
class: explore
---
Vi starter med en beskrivelse av strategien.

::::::::::::::{admonition} Strategi 2
---
class: theory
---
Gitt en funksjon $f$ kan vi løse likningen $f(x) = 0$ med følgende steg:
1. Start med en verdi for $x$.
2. Sjekk om $|f(x)| < \delta$  der $\delta$ er et **lite tall**. For eksempel $\delta = 10^{-4} = 0.0001$. Hvis dette er tilfellet, skriv ut verdien til $x$.
3. Øk verdien til $x$ med en liten økning $\Delta x$. 

Det er hensiktsmessig å velge $\Delta x$ til å være en brøk $\dfrac{1}{2^m}$ for et heltall $m$ for å unngå avrundingsfeil på datamaskinen. 

> I praksis kan det være lurt å velge $\delta = 2\cdot \Delta x$ for å finne løsningene.
::::::::::::::


::::::::::::::{tab-set}
---
class: tabs-parts
---
:::::::::::::{tab-item} a
Under vises et program som leter etter løsningene til likningen 

$$
x^2 - 4 = 0
$$

ved å bruke **strategi 2**. Les programmet og forutsi hvilke verdier som skrives ut av programmet.

:::{raw} html
---
file: ./python/utforsk/utforsk_2/a.html
---
:::


:::::::::::::


:::::::::::::{tab-item} b
En andregradsfunksjon $f$ er gitt ved 

$$
f(x) = x^2 - 8.
$$

Programmet under bruker strategi 2 til å bestemme nullpunktene til $f$. 

Forutsi hva programmet skriver ut og sjekk svaret ditt!

:::{raw} html
---
file: ./python/utforsk/utforsk_2/b.html
---
:::


:::::::::::::


:::::::::::::{tab-item} c
En andregradsfunksjon er gitt ved

$$
f(x) = x^2 - 3.
$$

Fyll ut programmet nedenfor ved å bruke **strategi 2** og bestem nullpunktene til $f$.

:::{raw} html
---
file: ./python/utforsk/utforsk_2/c.html
---
:::

:::::::::::::

::::::::::::::


:::::::::::::::

---

:::::::::::::::{admonition} Underveisoppgave 2
---
class: check
---
::::::::::::::{tab-set}
---
class: tabs-parts
---
:::::::::::::{tab-item} a
Fyll ut programmet ved å bruke **strategi 2** og bestem nullpunktene til funksjonen 

$$
f(x) = x^3 - 3x^2 - 4x + 12.
$$

:::{raw} html
---
file: ./python/underveisoppgaver/oppgave_2/a.html
---
:::


:::::::::::::


:::::::::::::{tab-item} b
Fyll ut programmet ved å bruke **strategi 2** til å bestemme røttene til polynomet 

$$
f(x) = x^3 + 5x^2 + 2x - 6.
$$


:::{raw} html
---
file: ./python/underveisoppgaver/oppgave_2/b.html
---
:::


:::::::::::::


:::::::::::::{tab-item} c
En funksjon $f$ er gitt ved 

$$
f(x) = x^4 - x^3 - 7x^2 + 13x - 10.
$$

Fyll ut programmet ved å bruke **strategi 2** til å bestemme hvor grafen til $f$ skjærer $x$-aksen.

:::{raw} html
---
file: ./python/underveisoppgaver/oppgave_2/c.html
---
:::

:::::::::::::


::::::::::::::


:::::::::::::::

<!-- 
---



Noen ganger går det veldig sakte å bruke strategi 1 eller strategi 2 for å finne nullpunktene til en funksjon. Heldigvis har man utviklet en strategi som finner en god tilnærming til et nullpunkt på en svært effektiv måte som vi kaller for **Newtons metode**. Strategien er basert på å finne nullpunktene til tangentene til grafen til en funksjon.

:::::::::::::::{admonition} Utforsk 3
---
class: explore
---
I animasjonen nedenfor vises en strategi der man bruker nullpunktene til tangenter til å gradvis nærmere seg nullpunktet til en funksjon $f$. 


:::{video} ./koder/animasjoner/media/videos/newtons_metode/1080p60/NewtonsMethod.mp4
---
width: 95%
---
:::


::::::::::::{tab-set}
---
class: tabs-parts
---
:::::::::::{tab-item} a


:::::::::::


:::::::::::{tab-item} b


:::::::::::


:::::::::::{tab-item} c


:::::::::::

::::::::::::

:::::::::::::






 -->
