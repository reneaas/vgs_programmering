# `while`{l=python}-løkker

:::{admonition} Læringsmål: `while`{l=python}-løkker
---
class: tip
---
* Kunne skrive enkle `while`{l=python}-løkker.
:::

En `while`{l=python}-løkke er noe vi bruker når vi ønsker å gjenta en eller flere kodelinjer igjen og igjen så lenge en betingelse er oppfylt. Vi skal først ta utgangspunkt i å lage `while`{l=python}-løkker som gjør tilsvarende de løkkene du lærte om når du jobbet med [`for`{l=python}-løkker](../for_loops/for_loops).


:::::::::::::::{admonition} Utforsk 1
---
class: explore
---
Under vises tre eksempler på `while`{l=python}-løkker som skriver ut noen tallfølger.

Se på og kjør kodeeksemplene. 

Lag deg en hypotese for hvordan løkka fungerer. 

:::::{admonition} Test hypotesen din her når du er klar!
---
class: check, dropdown
---
Les programkoden under og prøv å forutsi utskriften til programmet.

Skriv inn hypotesen din og sjekk svaret ditt!

:::{raw} html 
---
file: ./python/utforsk/utforsk_1/test_deg_selv.html
---
:::
:::::

::::::::::::::{tab-set}
:::::::::::::{tab-item} Eksempel 1

:::{raw} html
---
file: ./python/utforsk/utforsk_1/eksempel_1.html
---
:::

:::::::::::::

:::::::::::::{tab-item} Eksempel 2

:::{raw} html
---
file: ./python/utforsk/utforsk_1/eksempel_2.html
---
:::

:::::::::::::

:::::::::::::{tab-item} Eksempel 3

:::{raw} html
---
file: ./python/utforsk/utforsk_1/eksempel_3.html
---
:::

:::::::::::::
::::::::::::::


:::::::::::::::

> Sjekk oppsummeringen under når du har gjort Utforsk 1!

:::::::::::::::{admonition} Oppsummering: `while`{l=python}-løkker
---
class: summary, dropdown
---
En `while`{l=python}-løkke brukes for å gjenta en kodeblokk så lenge en **betingelse** er sann. Generelt kan en `while`{l=python}-løkke skrives på følgende måte:

```{code-block} python
while betingelse:
    # Gjøre noe så lenge `betingelse` er sann!
```

* `betingelse` er en logisk test som enten er `True` (sann) eller `False` (usann).

| Eksempler | Betingelse | Beskrivelse |
|-----------|-------------|-------------|
| `while x < 5:`{l=python} | `x < 5`{l=python} | Gjenta så lenge `x` er **mindre enn** 5 |
| `while x > 10:`{l=python} | `x > 10`{l=python} | Gjenta så lenge `x` er **større enn** 10 |
| `while x <= 5:`{l=python} | `x <= 5`{l=python} | Gjenta så lenge `x` er **mindre eller lik** 5 |
| `while x >= 8:`{l=python} | `x >= 8`{l=python} | Gjenta så lenge `x` er **større eller lik** 8 |

<br>

**Eksempelkode:**

:::{code-block} python
---
linenos: true
---
x = 1
while x < 5:    # Så lenge x er mindre enn 5
    print(x)    # Skriv ut verdien til x
    x = x + 2   # Øk x med 2
:::
:::::::::::::::

---

:::::::::::::::{admonition} Quiz 1
---
class: quiz
---
Ta quizen!

:::{raw} html
---
file: ./quiz/quiz_1/quiz_1.html
---
:::

:::::::::::::::

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
Les programmet under og forutsi utskriften.

Skriv inn hypotesen din og sjekk svaret!

:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_1/a.html
---
:::


:::::::::::::

:::::::::::::{tab-item} b
Les programmet under og forutsi utskriften.

Skriv inn hypotesen din og sjekk svaret!

:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_1/b.html
---
:::


:::::::::::::

:::::::::::::{tab-item} c
Les programmet under og forutsi utskriften.

Skriv inn hypotesen din og sjekk svaret!

:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_1/c.html
---
:::


:::::::::::::

:::::::::::::{tab-item} d
Les programmet under og forutsi utskriften.

Skriv inn hypotesen din og sjekk svaret!

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
Fyll ut programmet under slik at det skriver ut tallfølgen

$$
1, 3, 5, 7, 9. 
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
emphasize-lines: 4
---
x = 1
while x < 10:
    print(x)
    x = x + 2 
:::
::::

:::::::::::::

:::::::::::::{tab-item} b
Fyll ut programmet under slik at det skriver ut tallfølgen

$$
-3, 0, 3, 6, 9.
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
emphasize-lines: 2
---
x = -3
while x <= 9:
    print(x)
    x = x + 3 
:::
::::

:::::::::::::

:::::::::::::{tab-item} c
Fyll ut programmet under slik at det skriver ut tallfølgen

$$
0, 25, 50, 75, 100.
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
emphasize-lines: 2, 4
---
x = 0
while x <= 100:
    print(x)
    x = x + 25
:::
::::

:::::::::::::


:::::::::::::{tab-item} d
Fyll ut programmet under slik at det skriver ut tallfølgen

$$
10000, 1000, 100, 10, 1. 
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
emphasize-lines: 2, 4
---
x = 10_000
while x >= 1:
    print(x)
    x = x / 10
:::
::::

:::::::::::::

::::::::::::::

:::::::::::::::