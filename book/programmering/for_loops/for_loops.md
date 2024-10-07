# `for`{l=python}-løkker

::::{admonition} Læringsmål
---
class: tip
---
Etter dette delkapittelet, er målet at du skal:
* Kunne bruke `for`{l=python}-løkker med `range`{l=python}-funksjonen for å lage en liste med tall. 
* Kunne bruke `for`{l=python}-løkker til å gjenta én eller kodelinjer et bestemt antall ganger.

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

````{tab-set}
```{tab-item} Eksempel 1

:::{raw} html
---
file: ./interaktiv_kode/utforsk/utforsk_1/oppgave_a/eksempel_1.html
---
:::

```
```{tab-item} Eksempel 2

:::{raw} html
---
file: ./interaktiv_kode/utforsk/utforsk_1/oppgave_a/eksempel_2.html
---
:::

```

```{tab-item} Eksempel 3

:::{raw} html
---
file: ./interaktiv_kode/utforsk/utforsk_1/oppgave_a/eksempel_3.html
---
:::

```
````

<br>

::::{admonition} Test hypotesen din her når du er klar!
---
class: dropdown, check
---
Les programmet under og forutsi hva programmet skriver ut basert på hypotesen din.

Skriv inn under og sjekk!

:::{raw} html
---
file: ./interaktiv_kode/utforsk/utforsk_1/oppgave_a/test_deg_selv.html
---
:::
::::

::::::

::::::{tab-item} b
Under vises tre eksempler på programmer som bruker `range`{l=python}-funksjonen som `range(a, b)`{l=python}. 

Kjør programmene og se på utskriften deres. Bruk de tre kodeeksemplene til å formulere en hypotese på hva de to tallene bestemmer og hvordan denne skrivemåten henger sammen med skrivemåten i deloppgave a.

````{tab-set}
```{tab-item} Eksempel 1

:::{raw} html
---
file: ./interaktiv_kode/utforsk/utforsk_1/oppgave_b/eksempel_1.html
---
:::

```

```{tab-item} Eksempel 2

:::{raw} html
---
file: ./interaktiv_kode/utforsk/utforsk_1/oppgave_b/eksempel_2.html
---
:::

```

```{tab-item} Eksempel 3

:::{raw} html
---
file: ./interaktiv_kode/utforsk/utforsk_1/oppgave_b/eksempel_3.html
---
:::

```

````

<br>

::::{admonition} Test hypotesen din her når du er klar!
---
class: dropdown, check
---
Les programmet under og forutsi hva programmet skriver ut basert på hypotesen din.

Skriv inn under og sjekk!

:::{raw} html
---
file: ./interaktiv_kode/utforsk/utforsk_1/oppgave_b/test_deg_selv.html
---
:::
::::


::::::

:::::::

::::::::::::::

---
Ta gjerne en titt på oppsummeringen av utforsk 1 før du går videre! 

::::::::{admonition} Oppsummering: utforsk 1
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
class: check
---
Ta quizen!

:::{raw} html
---
file: ./quiz/quiz_1/quiz_1.html
---
:::

:::::

---

En annen vanlig måte å jobbe med `for`{l=python}-løkker på, er at ønsker å gjenta en eller flere utregninger et bestemt antall ganger. Dette skal du se nærmere på i utforsk 2.


## `for`{l=python}-løkker for å gjenta noe 


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


````{tab-set}
```{tab-item} Eksempel 1

:::{raw} html
---
file: ./interaktiv_kode/utforsk/utforsk_2/oppgave_a/eksempel_1.html
---
:::

```

```{tab-item} Eksempel 2

:::{raw} html
---
file: ./interaktiv_kode/utforsk/utforsk_2/oppgave_a/eksempel_2.html
---
:::

```

```{tab-item} Eksempel 3

:::{raw} html
---
file: ./interaktiv_kode/utforsk/utforsk_2/oppgave_a/eksempel_3.html
---
:::

```
````

::::{admonition} Skriv inn hypotesen din her når du er klar!
---
class: dropdown, check
---

:::{raw} html
---
file: ./interaktiv_kode/utforsk/utforsk_2/oppgave_a/test_deg_selv.html
---
:::

::::

:::::

:::::{tab-item} b
En tallfølge er en sekvens av tall som følger en bestemt regel. For eksempel er $2, 5, 8, 11$ en tallfølge som øker med $3$ for hvert tall.

Under vises tre kodeeksempler som bruker `for`{l=python}-løkker til å lage bestemte tallfølger. Kjør programmene og se på hvilke tallfølger de gir. Bruk de tre kodeeksemplene til å 
formulere en hypotese på hvordan `for`{l=python}-løkker du kan lage tallfølger med `for`{l=python}-løkker.


````{tab-set}
```{tab-item} Eksempel 1

:::{raw} html
---
file: ./interaktiv_kode/utforsk/utforsk_2/oppgave_b/eksempel_1.html
---
:::

```

```{tab-item} Eksempel 2

:::{raw} html
---
file: ./interaktiv_kode/utforsk/utforsk_2/oppgave_b/eksempel_2.html
---
:::

```

```{tab-item} Eksempel 3

:::{raw} html
---
file: ./interaktiv_kode/utforsk/utforsk_2/oppgave_b/eksempel_3.html
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

---

::::{admonition} Test hypotesen din her når du er klar!
---
class: dropdown, check
---
Les programmet under og forutsi hva programmet skriver ut basert på hypotesen din.

Skriv inn under og sjekk!

:::{raw} html
---
file: ./interaktiv_kode/utforsk/utforsk_2/oppgave_b/test_deg_selv.html
---
:::

::::

:::::


::::::


:::::::

---

:::::{admonition} Oppsummering: utforsk 2
---
class: summary, dropdown
---
Oppsummering av utforsk 2 kommer her.
:::::


---

:::::{admonition} Quiz 2
---
class: check
---
Ta quizen!

:::{raw} html
---
file: ./quiz/quiz_2/quiz_2.html
---
:::

:::::
