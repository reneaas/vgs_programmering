# Feilmeldinger

::::{admonition} Læringsmål: feilmeldinger
---
class: tip
---
Etter å ha gått gjennom dette delkapittelet, er målet at du skal kunne:
* Forstå ulike type feilmeldinger og bruke dem til å feilsøke og fikse feil i kode. 
::::



Å kunne lese og forstå feilmeldinger er en viktig ferdighet i programmering som gjør at du kan fikse kode som ikke fungerer på egen hånd. Når du kjører en kode som inneholder feil, vil Python gi deg en feilmelding som beskriver:
* Hva slags type feil som har oppstått.
* Hvor i koden feil oppstår.
* Hva i koden som forårsaker feilen.


:::::{admonition} Utforsk 1
---
class: explore
---
Under vises et interaktivt kodevindu med kode som fungerer som den skal.
:::{raw} html
---
file: interaktiv_kode/utforsk/utforsk_1.html
---
:::


Deloppgave 1
: Kjør programmet og undersøk hva programmet gjør for noe. Kan du forklare hva programmet gjør?

::::{admonition} Løsning
---
class: solution, dropdown
---

Programmet regner ut summen av de fem første naturlige tallene ved å bruke en `for`{l=python}-løkke. Underveis skriver programmet ut alle de naturlige tallene, får det så skriver ut summen av dem til slutt.
::::

<br>

Deloppgave 2
: Ta bort `:`{l=python} på slutten av linje 2. Kjør programmet på nytt og se på utskriften. Hvilken type feil får du? Forteller utskriften deg både hva og hvor feilen i programmet er? 
: Fiks feilen til slutt.


::::{admonition} Løsning
---
class: solution, dropdown
---
* Type: `SyntaxError`{l=python}. Denne typen feil oppstår når man ikke følger riktig skriveregler i koden.
* Hvor: Linje 2
* Hva: Programmet forventet `:`{l=python} på slutten av linja. 
::::

<br>

Deloppgave 3
: Ta bort innrykket til linje 3 og kjør programmet. Hva slags type feil får du nå? Forteller feilmeldingen deg både hva og hvor feilen i programmet er?
: Fiks programmet til slutt.


::::{admonition} Løsning
---
class: solution, dropdown
---
* Type: `IndentationError`{l=python}. Denne typen feil oppstår når man ikke har riktig innrykk. 
* Hvor: Linje 3
* Hva: Programmet forventet et innrykk på første linje etter `for`{l=python}-setningen på linje 2.
::::


<br>



Deloppgave 4
: Slett `s = 0`{l=python} på linje 1. Hva slags type feil får du nå? Forstår du hva feilmeldingen forteller deg?
: Fiks programmet til slutt.


::::{admonition} Løsning
---
class: solution, dropdown
---
* Type: `NameError`{l=python}. Denne typen feil oppstår når man prøver å bruke en variabel som ikke er laget eller eksisterer enda.
* Hvor: Linje 4
* Hva: Programmet finner ikke noen variabel med navn `s`{l=python}. 
::::

:::::