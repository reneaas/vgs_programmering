# `for`{l=python}-løkker

::::{admonition} Læringsmål
---
class: tip
---
* Kunne bruke `for`{l=python}-løkker med `range`{l=python}-funksjonen for å lage en liste med tall. 
* Kunne bruke `for`{l=python}-løkker til å gjenta én eller flere kodelinjer et bestemt antall ganger.
* Kunne tolke og skrive nøstede `for`{l=python}-løkker for å lage rutenett med punkter $(x, y)$.

::::

## `for`{l=python}-løkker for å lage tall

En `for`{l=python}-løkke er noe som kan brukes til å lage en liste med tall. Dette er det første vi skal se på.

::::::::::::::{admonition} Utforsk 1
---
class: explore
---

Her skal du bli kjent med `range`{l=python}-funksjonen som ofte brukes sammen med `for`{l=python}-løkker.



:::::::{tab-set}
---
class: tabs-parts
---
::::::{tab-item} a
Under vises tre eksempler på programmer som bruker `range(a, b, c)`{l=python}-funksjonen med tre tall `a`{l=python}, `b`{l=python} og `c`{l=python}.

Kjør programmene og se på utskriften deres. Bruk de tre kodeeksemplene til å formulere en hypotese på hva de tre tallene bestemmer.

::::{admonition} Test hypotesen din her når du er klar!
---
class: dropdown, check
---
Les programmet under og forutsi hva programmet skriver ut basert på hypotesen din.

Skriv inn under og sjekk!

:::{raw} html
---
file: ./python/utforsk/utforsk_1/oppgave_a/test_deg_selv.html
---
:::
::::

````{tab-set}
```{tab-item} Eksempel 1

:::{raw} html
---
file: ./python/utforsk/utforsk_1/oppgave_a/eksempel_1.html
---
:::

```
```{tab-item} Eksempel 2

:::{raw} html
---
file: ./python/utforsk/utforsk_1/oppgave_a/eksempel_2.html
---
:::

```

```{tab-item} Eksempel 3

:::{raw} html
---
file: ./python/utforsk/utforsk_1/oppgave_a/eksempel_3.html
---
:::

```
````

::::::

::::::{tab-item} b
Under vises tre eksempler på programmer som bruker `range`{l=python}-funksjonen som `range(a, b)`{l=python}. 

Kjør programmene og se på utskriften deres. Bruk de tre kodeeksemplene til å formulere en hypotese på hva de to tallene bestemmer og hvordan denne skrivemåten henger sammen med skrivemåten i deloppgave a.

::::{admonition} Test hypotesen din her når du er klar!
---
class: dropdown, check
---
Les programmet under og forutsi hva programmet skriver ut basert på hypotesen din.

Skriv inn under og sjekk!

:::{raw} html
---
file: ./python/utforsk/utforsk_1/oppgave_b/test_deg_selv.html
---
:::
::::

````{tab-set}
```{tab-item} Eksempel 1

:::{raw} html
---
file: ./python/utforsk/utforsk_1/oppgave_b/eksempel_1.html
---
:::

```

```{tab-item} Eksempel 2

:::{raw} html
---
file: ./python/utforsk/utforsk_1/oppgave_b/eksempel_2.html
---
:::

```

```{tab-item} Eksempel 3

:::{raw} html
---
file: ./python/utforsk/utforsk_1/oppgave_b/eksempel_3.html
---
:::

```

````



::::::

:::::::

::::::::::::::

---

> Ta gjerne en titt på oppsummeringen av utforsk 1 før du går videre! 

::::::::{admonition} Oppsummering: Utforsk 1
---
class: summary, dropdown
---
Når vi bruker `range`{l=python}-funksjonen til å lage en liste med tall kan vi enten bruke den som:
::::{tab-set}
:::{tab-item} `range(start, stopp, steglengde)`{l=python}
```{code-block} python
for x in range(start, stopp, steglengde):
    # kode som skal gjentas
```

* `start`{l=python} er det første tallet i listen.
* `stopp`{l=python} er stoppekriteriet. Vi stopper alltid *før* dette tallet.
* `steglengde`{l=python} er hvor mye vi skal endre på løkkevariabelen `x`{l=python} på hver runde i løkken.
* `x`{l=python} kalles for **løkkevariabelen** fordi den lages av løkka og endres for hver runde i løkka automatisk.

| Eksempel | Liste med tall |
|-----------|----------|
| `range(1, 5, 1)`{l=python} | $1, 2, 3, 4$ |
| `range(1, 10, 2)`{l=python} | $1, 3, 5, 7, 9$ |
| `range(5, 1, -1)`{l=python} | $5, 4, 3, 2$ |
:::

:::{tab-item} `range(start, stopp)`{l=python}
```{code-block} python
for y in range(start, stopp):
    # kode som skal gjentas
```

* `start`{l=python} er det første tallet i listen.
* `stopp`{l=python} er stoppekriteriet. Vi stopper alltid *før* dette tallet.
* `steglengde`{l=python} er satt fast til `1`{l=python} som standardverdi her.
* `y`{l=python} kalles for **løkkevariabelen** fordi den lages av løkka og endres for hver runde i løkka automatisk.


| Eksempel | Liste med tall |
|-----------|----------|
| `range(1, 5)`{l=python} | $1, 2, 3, 4$ |
| `range(1, 10)`{l=python} | $1, 2, 3, 4, 5, 6, 7, 8, 9$ |
| `range(5, 1)`{l=python} | Ingen tall lages |
:::
::::
::::::::

---

:::::{admonition} Quiz 1
---
class: quiz
---
Ta quizen!

:::{raw} html
---
file: ./quiz/quiz_1/quiz_1.html
---
:::

:::::

---

:::::::::::::::{admonition} Underveisoppgave 1
---
class: check
---
::::::::::::::{tab-set}
---
class: tabs-parts 
---
:::::::::::::{tab-item} a

Les programmet under og forutsi hva programmet skriver ut.

Skriv inn forutsigelsen din og sjekk!

:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_1/a.html
---
:::

:::::::::::::

:::::::::::::{tab-item} b

Les programmet under og forutsi hva programmet skriver ut.

Skriv inn forutsigelsen din og sjekk!

:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_1/b.html
---
:::

:::::::::::::

:::::::::::::{tab-item} c

Les programmet under og forutsi hva programmet skriver ut.

Skriv inn forutsigelsen din og sjekk!

:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_1/c.html
---
:::

:::::::::::::

:::::::::::::{tab-item} d

Les programmet under og forutsi hva programmet skriver ut.

Skriv inn forutsigelsen din og sjekk!

:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_1/d.html
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
Fyll ut programmet slik at det skriver ut tallfølgen

$$
1, 4, 7, 10. 
$$

:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_2/a.html
---
:::

::::{admonition} Fasit
---
class: answer, dropdown
---
:::{code-block} python
---
linenos: true
---
for x in range(1, 11, 3):
    print(x)
:::
::::

:::::::::::::

:::::::::::::{tab-item} b
Fyll ut programmet slik at det skriver ut tallfølgen

$$
-4, 0, 4, 8, 12. 
$$

:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_2/b.html
---
:::


::::{admonition} Fasit
---
class: answer, dropdown
---
:::{code-block} python
---
linenos: true
---
for x in range(-4, 13, 4):
    print(x)
:::
::::

:::::::::::::

:::::::::::::{tab-item} c
Fyll ut programmet slik at det skriver ut tallfølgen

$$
0, 100, 200, 300, 400, 500. 
$$

:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_2/c.html
---
:::

::::{admonition} Fasit
---
class: answer, dropdown
---
:::{code-block} python
---
linenos: true
---
for x in range(0, 501, 100):
    print(x)
:::
::::

:::::::::::::

:::::::::::::{tab-item} d
Fyll ut programmet slik at det skriver ut tallfølgen

$$
15, 9, 3, -3, -9, -15.
$$

:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_2/d.html
---
:::

::::{admonition} Fasit
---
class: answer, dropdown
---
:::{code-block} python
---
linenos: true
---
for x in range(15, -16, -6):
    print(x)
:::
::::

:::::::::::::

::::::::::::::

:::::::::::::::

---


## `for`{l=python}-løkker for å gjenta noe 

En annen vanlig måte å jobbe med `for`{l=python}-løkker på, er at man ønsker å gjenta en eller flere utregninger et bestemt antall ganger. Dette skal du se nærmere på i Utforsk 2.

:::::::{admonition} Utforsk 2
---
class: explore
---

Her skal du bli kjent med hvordan `for`{l=python}-løkker kan brukes til å gjenta en eller flere kodelinjer et bestemt antall ganger.

::::::{tab-set} 
---
class: tabs-parts
---
:::::{tab-item} a
Under vises tre eksempler på programmer som bruker `for`{l=python}-løkker med kun ett tall i `range`{l=python}-funksjonen.

Kjør eksempelkodene og se på utskriften. Lag en hypotese om hvordan denne typen `for`{l=python}-løkker fungerer.


::::{admonition} Skriv inn hypotesen din her når du er klar!
---
class: dropdown, check
---

:::{raw} html
---
file: ./python/utforsk/utforsk_2/oppgave_a/test_deg_selv.html
---
:::

::::

````{tab-set}
```{tab-item} Eksempel 1

:::{raw} html
---
file: ./python/utforsk/utforsk_2/oppgave_a/eksempel_1.html
---
:::

```

```{tab-item} Eksempel 2

:::{raw} html
---
file: ./python/utforsk/utforsk_2/oppgave_a/eksempel_2.html
---
:::

```

```{tab-item} Eksempel 3

:::{raw} html
---
file: ./python/utforsk/utforsk_2/oppgave_a/eksempel_3.html
---
:::

```
````

:::::

:::::{tab-item} b
En tallfølge er en sekvens av tall som følger en bestemt regel. For eksempel er $2, 5, 8, 11$ en tallfølge som øker med $3$ for hvert tall.

Under vises tre kodeeksempler som bruker `for`{l=python}-løkker til å lage bestemte tallfølger. Kjør programmene og se på hvilke tallfølger de gir. Bruk de tre kodeeksemplene til å 
formulere en hypotese på hvordan `for`{l=python}-løkker du kan lage tallfølger med `for`{l=python}-løkker.

::::{admonition} Test hypotesen din her når du er klar!
---
class: dropdown, check
---
Les programmet under og forutsi hva programmet skriver ut basert på hypotesen din.

Skriv inn under og sjekk!

:::{raw} html
---
file: ./python/utforsk/utforsk_2/oppgave_b/test_deg_selv.html
---
:::

::::


````{tab-set}
```{tab-item} Eksempel 1

:::{raw} html
---
file: ./python/utforsk/utforsk_2/oppgave_b/eksempel_1.html
---
:::

```

```{tab-item} Eksempel 2

:::{raw} html
---
file: ./python/utforsk/utforsk_2/oppgave_b/eksempel_2.html
---
:::

```

```{tab-item} Eksempel 3

:::{raw} html
---
file: ./python/utforsk/utforsk_2/oppgave_b/eksempel_3.html
---
:::

```
````


:::{admonition} Merknad: bruk av `_`{l=python} i `for`{l=python}-løkker
---
class: sidenote, dropdown
---
I kodeeksemplene her vil du se at løkkevariabelen er `_`{l=python}. Det er vanlig å bruke `_`{l=python} som løkkevariabel når vi ikke bruker løkkevariabelen til å utføre noen handler. Typisk betyr dette at `for`{l=python}-løkka bare skal gjenta noe et bestemt antall ganger og det spiller ingen rolle hva løkkevariabelen sin er verdi er underveis. Det holder bare styr på hvor mange ganger løkka har kjørt og når den skal stoppe.
:::

:::::


::::::


:::::::

---

:::::::::::::::{admonition} Oppsummering: Utforsk 2
---
class: summary, dropdown
---

::::::::::::::{tab-set}
:::::::::::::{tab-item} Gjentakelse av kodelinjer
Vi kan gjenta noen kodelinjer et bestemt antall ganger ved å skrive:

:::{code-block} python
---
linenos: true
---
for x in range(N):
    # Noen kodelinjer her. Disse gjentas `N` ganger.
:::

| Eksempel | Tall | Beskrivelse |
|-----------|----------|----------|
| `for x in range(3)`{l=python} | $0, 1, 2$. | 3 gjentakelser. |
| `for x in range(5)`{l=python} | $0, 1, 2, 3, 4$ | 5 gjentakelser. |
| `for x in range(-2)`{l=python} | Ingen tall | Ingen gjentakelse. |

:::::::::::::

:::::::::::::{tab-item} Gjentakelse av kodelinjer uten løkke-variabel
Når vi skal gjenta noen kodelinjer et bestemt antall ganger, men ikke skal bruke løkkevariabelen til noe, skriver vi:

:::{code-block} python
---
linenos: true
---
# bruker `_` som løkkevariabel fordi den ikke brukes i utregninger.
for _ in range(N):
    # Noen kodelinjer her. Disse gjentas `N` ganger.
:::

| Eksempel | Beskrivelse |
|-----------|----------|
| `for _ in range(3)`{l=python} | Gir 3 gjentakelser. |
| `for _ in range(5)`{l=python} | 5 gjentakelser. |
| `for _ in range(-2)`{l=python} | Ingen gjentakelser. |
:::::::::::::
::::::::::::::

:::::::::::::::


---

:::::{admonition} Quiz 2
---
class: quiz
---
Ta quizen!

:::{raw} html
---
file: ./quiz/quiz_2/quiz_2.html
---
:::

:::::

---

## Nøstede `for`{l=python}-løkker

Nøstede `for`{l=python}-løkker er `for`{l=python}-løkker som er plassert inni hverandre. Når vi jobber med likningssystemer, bruker vi ofte dette til å lage et rutenett av punkter $(x, y)$. Dette skal du se nærmere på i Utforsk 3.

:::::::::::::::{admonition} Utforsk 3
---
class: explore, full-width
---
Under vises tre eksempler på programmer som bruker nøstede `for`{l=python}-løkker til å lage et rutenett av punkter $(x, y)$. 

Ved siden av programmene er det tilhørende animasjoner som viser hvilke punkter som lager og i hvilken rekkefølge det skjer.

Legg spesielt merke til rekkefølgen på de to `for`{l=python}-løkkene og hvordan det påvirker hvilken rekkefølge man løper gjennom punktene i rutenettet.

::::::::::::::{tab-set}
:::::::::::::{tab-item} Eksempel 1

:::::{grid}
::::{grid-item} **Programkode**
:::{raw} html
---
file: ./python/utforsk/utforsk_3/eksempel_1.html
---
:::
::::

::::{grid-item} **Animasjon**
:::{figure} ./figurer/utforsk_3/eksempler/eksempel_1.gif
---
width: 100%
class: no-click
---
:::
::::

:::::
:::::::::::::

:::::::::::::{tab-item} Eksempel 2

:::::{grid}
::::{grid-item} **Programkode**
:::{raw} html
---
file: ./python/utforsk/utforsk_3/eksempel_2.html
---
:::
::::

::::{grid-item} **Animasjon**
:::{figure} ./figurer/utforsk_3/eksempler/eksempel_2.gif
---
width: 100%
class: no-click
---
:::
::::

:::::
:::::::::::::

:::::::::::::{tab-item} Eksempel 3

:::::{grid}
::::{grid-item} **Programkode**
:::{raw} html
---
file: ./python/utforsk/utforsk_3/eksempel_3.html
---
:::
::::

::::{grid-item} **Animasjon**
:::{figure} ./figurer/utforsk_3/eksempler/eksempel_3.gif
---
width: 100%
class: no-click
---
:::
::::

:::::
:::::::::::::

::::::::::::::


:::::::::::::::

---


:::::::::::::::{admonition} Quiz 3
---
class: quiz
---
Ta quizen!

:::{raw} html
---
file: ./quiz/quiz_3/quiz_3.html
---
:::


:::::::::::::::

---

:::::::::::::::{admonition} Underveisoppgave 4
---
class: check, full-width
---
::::::::::::::{tab-set}
---
class: tabs-parts
---
:::::::::::::{tab-item} a
Fyll inn i for-løkka slik at den gir rutenettet som er vist i animasjonen til høyre.


:::::{grid}
::::{grid-item} **Programkode**

:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_4/a.html
---
:::
::::

::::{grid-item} **Animasjon**
:::{figure} ./figurer/underveisoppgaver/underveisoppgave_4/a.gif
---
width: 100%
class: no-click
---
:::
::::

:::::



:::::::::::::

:::::::::::::{tab-item} b
Fyll inn i for-løkka slik at den gir rutenettet som er vist i animasjonen til høyre.


:::::{grid}
::::{grid-item} **Programkode**

:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_4/b.html
---
:::
::::

::::{grid-item} **Animasjon**
:::{figure} ./figurer/underveisoppgaver/underveisoppgave_4/b.gif
---
width: 100%
class: no-click
---
:::
::::

:::::



:::::::::::::

:::::::::::::{tab-item} c
Fyll inn i for-løkka slik at den gir rutenettet som er vist i animasjonen til høyre.


:::::{grid}
::::{grid-item} **Programkode**

:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_4/c.html
---
:::
::::

::::{grid-item} **Animasjon**
:::{figure} ./figurer/underveisoppgaver/underveisoppgave_4/c.gif
---
width: 100%
class: no-click
---
:::
::::

:::::



:::::::::::::

:::::::::::::{tab-item} d
Fyll inn i for-løkka slik at den gir rutenettet som er vist i animasjonen til høyre.


:::::{grid}
::::{grid-item} **Programkode**

:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_4/d.html
---
:::
::::

::::{grid-item} **Animasjon**
:::{figure} ./figurer/underveisoppgaver/underveisoppgave_4/d.gif
---
width: 100%
class: no-click
---
:::
::::

:::::



:::::::::::::
::::::::::::::

:::::::::::::::

