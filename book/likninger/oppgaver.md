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
Her finner du en repetisjonsquiz for hvert av de tre programmeringsverktøyene vi skal bruke. Ta de quizzene du trenger for å friske opp kunnskapen din!

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



:::::::::::::


:::::::::::::::


