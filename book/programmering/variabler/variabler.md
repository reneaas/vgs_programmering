# Variabler og `print`{l=python}-funksjonen

:::{admonition} Læringsmål: variabler
---
class: tip
---
* Kunne bruke `print`{l=python}-funksjonen til å skrive ut verdien til en variabel.
* Kunne forklare hva en variabel er og lage dine egne variabler.
* Kunne skrive ut verdien til en variabel.
:::


## Hva er en variabel? 

En variabel er den grunnleggende byggesteinen i Python. Det er noe vi selv lager (såkalt *brukerdefinert*). Vi bruker variabelen til å gjøre noe - i matematikk bruker vi det typisk til å regne ut noe og lagre tall. 


::::{admonition} Variabel i Python
---
class: theory
---
En **variabel** er en brukerdefinert ting som har
* Et variabelnavn
* En verdi
::::

La oss se på noen eksempler på variabler i Python



---

:::{admonition} `#`{l=python}-tegnet
---
class: sidenote, margin
---
`#`{l=python}-tegnet
: brukes for å kommentere koden. Alt som følger bak `#`{l=python}-tegnet ignoreres av Python når koden kjøres. Det er ment for å skrive forklarende kommentarer til oss som leser koden!
:::

::::::{admonition} Utforsk 1
---
class: explore
---

:::::{tab-set}
---
class: tabs-custom
---

::::{tab-item} Del 1: Skriv ut verdier
Her er et lite program som skriver ut noen verdier direkte. Før du kjører det, prøv å lese gjennom koden og tenk på hva programmet vil skrive ut. Dette hjelper deg med å forstå hvordan datamaskinen "ser" koden.

- **Oppgave:** Les gjennom programmet, og prøv å forutsi hva det vil skrive ut basert på variablene. Skriv ned hypotesen din og sjekk om den stemmer når du kjører programmet.

:::{raw} html
---
file: interaktiv_kode/utforsk/utforsk_1/del_1.html
---
::: 

::::

::::{tab-item} Del 2: Skriv ut variabler
Ofte bruker vi variabler for å lagre verdier som vi skal jobbe med i programmet. Tenk på variabler som "bokser" som holder på tall, tekst, eller andre typer data vi trenger senere.

I dette programmet definerer vi noen variabler og skriver ut verdiene deres. 

- **Oppgave:** Les gjennom programmet, og prøv å forutsi hva det vil skrive ut basert på variablene. Skriv ned hypotesen din og sjekk om den stemmer når du kjører programmet.

:::{raw} html
---
file: interaktiv_kode/utforsk/utforsk_1/del_2.html
---
::: 

::::

::::{tab-item} Del 3: Kombinere tekst og variabler med `print`{l=python}
Ofte ønsker vi å skrive ut både tekst og verdier fra variabler samtidig, for å lage meningsfulle meldinger. For å gjøre dette kan vi bruke noe som heter `f`-strings, som lar oss kombinere tekst og variabler på en enkel måte.

I dette programmet ser du hvordan vi kan bruke `f`-strings til å sette inn verdien av en variabel i en tekststreng.

- **Oppgave:** Kjør programmet og legg merke til hva som skjer når `f` står foran tekststrengen. Hvor i teksten settes variabelverdien inn? Skriv ned hva du oppdager!

:::{raw} html
---
file: interaktiv_kode/utforsk/utforsk_1/del_3.html
---
::: 

::::
:::::
::::::

---
<!-- 
::::{admonition} Underveisquiz 1
---
class: check
---
:::{raw} html
---
file: quiz/quiz_1/quiz_1.html
---
:::

:::: -->

---



::::

::::{admonition} Underveisoppgave 1
---
class: check
---
Under vises et interaktivt kodevindu. Fyll ut koden under og kjør programmet.

:::{raw} html
---
file: interaktiv_kode/underveisoppgaver/underveisoppgave_2.html
---
:::


:::{admonition} Fasit
---
class: answer, dropdown
---
Jeg begynner å *dra* på åra, men her har du en mulig løsning:
```{code-block} python
---
linenos: true
---
navn = "René" 
alder = 30
høyde = 180.0


# Skriver ut dataen
print(f"{navn = } \n{alder = } \n{høyde = }")
```
som gir utskriften

```console
navn = 'René' 
alder = 30
høyde = 180.0
```
:::

::::