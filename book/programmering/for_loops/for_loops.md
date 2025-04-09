# `for`{l=python}-løkker

::::{admonition} Læringsmål
---
class: tip
---
* Kunne bruke `for`{l=python}-løkker med `range`{l=python}-funksjonen for å lage en liste med tall. 
* Kunne bruke `for`{l=python}-løkker til å gjenta én eller flere kodelinjer et bestemt antall ganger.

::::

## `for`{l=python}-løkker for å lage tallfølger

En `for`{l=python}-løkke er noe som kan brukes til å lage en liste med tall. Dette er det første vi skal se på.

::::::::::::::{explore} Utforsk 1

Her skal du bli kjent med `range`{l=python}-funksjonen som ofte brukes sammen med `for`{l=python}-løkker.

Under vises tre eksempler på programkoder som bruker `range(a, b, c)`{l=python}-funksjonen til å lage en tallfølge.

1. Kjør programmene og se på utskriften deres. 
2. Lag en hypotese om hva tallene `a`{l=python}, `b`{l=python} og `c`{l=python} bestemmer i `range(a, b, c)`{l=python}.
3. Test hypotesen din nedenfor.



:::::::::::::{tab-set}
::::::::::::{tab-item} Eksempel 1


:::{interactive-code}
for x in range(2, 6, 1):
    print(x)


:::

::::::::::::
::::::::::::{tab-item} Eksempel 2


:::{interactive-code}
for y in range(-1, 5, 2):
    print(y)


:::



::::::::::::

::::::::::::{tab-item} Eksempel 3


:::{interactive-code}
for z in range(7, 3, -1):
    print(z)


:::

::::::::::::
:::::::::::::


::::{admonition} Test hypotesen din her når du er klar!
---
class: dropdown, check
---
Les programmet under og forutsi hva programmet skriver ut basert på hypotesen din.

Skriv inn under og sjekk!

:::{interactive-code}
---
predict:
---
for x in range(-5, 7, 3):
    print(x)


:::

::::



::::::::::::::


---

> Se på oppsummeringen nedenfor før du går videre!

::::::::{admonition} Oppsummering: `for`{l=python}-løkker med `range(a, b, c)`{l=python}
---
class: summary, dropdown
---
Når vi bruker `range`{l=python}-funksjonen til å lage en tallfølge, kan vi skrive

:::{code-block} python
for x in range(start, stopp, steglengde):
    # kode som skal gjentas
:::

* `x`{l=python} kalles for en **løkkevariabel**. Den opprettes og endres på automatisk av `for`{l=python}-løkka.
* `start`{l=python} er det første tallet i listen.
* `stopp`{l=python} er stoppekriteriet. Vi stopper alltid *før* dette tallet.
* `steglengde`{l=python} er hvor mye vi skal endre på løkkevariabelen `x`{l=python} på hver runde i løkken.

| Eksempel | Liste med tall |
|-----------|----------|
| `range(1, 5, 1)`{l=python} | $1, 2, 3, 4$ |
| `range(1, 10, 2)`{l=python} | $1, 3, 5, 7, 9$ |
| `range(5, 1, -1)`{l=python} | $5, 4, 3, 2$ |

::::::::

---


:::{quiz} Quiz 1
Q: Hvilken tallfølge skrives ut av programmet? <pre><code class="python">for x in range(1, 5, 1):\n    print(x)</code></pre>
+ $1, 2, 3, 4$
- $1, 2, 3, 4, 5$
- $1, 2, 3$
- $1, 2, 3, 4, 5, 6$

Q: Hvilken tallfølge skrives ut av programmet? <pre><code class="python">for x in range(1, 5, 2): \n    print(x)</code></pre>
+ $1, 3$
- $1, 3, 5$
- $1, 3, 4$
- $0, 2, 4$

Q: Hvilket program gir utskriften <pre><code class="console">-4 \n-2 \n0 \n2 \n4</code></pre>
+ <pre><code class="python">for x in range(-4, 5, 2): \n    print(x)</code></pre>
- <pre><code class="python">for x in range(-4, 4, 2): \n    print(x)</code></pre>
- <pre><code class="python">for x in range(-4, 2, 4): \n    print(x)</code></pre>
- <pre><code class="python">for x in range(-4, 2, 5): \n    print(x)</code></pre>

Q: Hvilken tallfølge skrives ut av programmet? <pre><code class="python">for x in range(1, 10, 3): \n    print(x)</code></pre>
+ $1, 4, 7$
- $1, 4, 7, 10$
- $1, 3, 6, 10$
- $1, 3, 6, 9$

Q: Hvilken tallfølge skrives ut av programmet? <pre><code class="python">for x in range(12, 2, -4): \n    print(x)</code></pre> 
+ $12, 8, 4$
- $12, 8, 4, 0$
- $12, 8, 4, 2$
- $12, 2, -4$
:::

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


:::{interactive-code}
---
predict:
---
for x in range(0, 5, 2):
    print(x)


:::

:::::::::::::

:::::::::::::{tab-item} b

Les programmet under og forutsi hva programmet skriver ut.

Skriv inn forutsigelsen din og sjekk!



:::{interactive-code}
---
predict:
---
for x in range(-3, 7, 4):
    print(x)


:::

:::::::::::::

:::::::::::::{tab-item} c

Les programmet under og forutsi hva programmet skriver ut.

Skriv inn forutsigelsen din og sjekk!


:::{interactive-code}
---
predict:
---
for y in range(9, 2, -3):
    print(y)


:::

:::::::::::::

:::::::::::::{tab-item} d

Les programmet under og forutsi hva programmet skriver ut.

Skriv inn forutsigelsen din og sjekk!


:::{interactive-code}
---
predict:
---
for z in range(1, 6, 3):
    print(z)


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


:::{interactive-code}
for x in range(???): # FYLL INN: riktig tall i 'range'-funksjonen.
    print(x)

    
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

:::{interactive-code}
for x in range(???): # FYLL INN: riktig tall i 'range'-funksjonen.
    print(x)

    
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


:::{interactive-code}
for x in range(???): # FYLL INN: riktig tall i 'range'-funksjonen.
    print(x)

    
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


:::{interactive-code}
for x in range(???): # FYLL INN: riktig tall i 'range'-funksjonen.
    print(x)

    
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


:::::::::::::::{admonition} Underveisoppgave 3
---
class: check
---
::::::::::::::{tab-set}
---
class: tabs-parts
---
:::::::::::::{tab-item} a
Lag et program som skriver ut alle partall under $20$.

:::{interactive-code}
# Din kode her



:::

:::::::::::::


:::::::::::::{tab-item} b
Partallene kan beskrives med formelen 

$$
2\cdot n \quad \mathrm{der} \quad n\in\mathbb{N}.
$$

Lag et program som bruker denne formelen og en `for`{l=python}-løkke til å skrive ut de 15 første partallene.


:::{interactive-code}
# Din kode her



:::


:::::::::::::


:::::::::::::{tab-item} c
Lag et program som skriver ut alle oddetall under $20$.

:::{interactive-code}
# Din kode her



:::

:::::::::::::


:::::::::::::{tab-item} d
Oddetallene kan beskrives med formelen 

$$
2\cdot n - 1 \quad \mathrm{der} \quad n\in\mathbb{N}.
$$

Lag et program som bruker denne formelen og en `for`{l=python}-løkke til å skrive ut de 15 første oddetallene.


:::{interactive-code}
# Din kode her



:::


:::::::::::::

::::::::::::::


:::::::::::::::


---

::::::::::::::{explore} Utforsk 2


Nedenfor vises tre eksempler på programmer som bruker `range`{l=python}-funksjonen som `range(a, b)`{l=python}. 

1. Kjør programmene og se på utskriften deres. 
2. Lag en hypotese om hva tallene `a`{l=python} og `b`{l=python} bestemmer i `range(a, b)`{l=python}.
3. Test hypotesen din nedenfor.

````{tab-set}
```{tab-item} Eksempel 1

:::{interactive-code}
for x in range(2, 6):
    print(x)


:::

```

```{tab-item} Eksempel 2

:::{interactive-code}
for x in range(-1, 5):
    print(x)


:::

```

```{tab-item} Eksempel 3

:::{interactive-code}
for x in range(5, 2): # <-- Det er ikke feil at du ikke får noen utskrift!
    print(x)


:::

```

````

::::{admonition} Test hypotesen din her når du er klar!
---
class: dropdown, check
---
Les programmet under og forutsi hva programmet skriver ut basert på hypotesen din.

Skriv inn under og sjekk!

:::{interactive-code}
---
predict:
---
for x in range(-2, 3):
    print(x)


:::
::::

::::::::::::::

---



:::::::::::::::{admonition} Oppsummering: `for`{l=python}-løkker med `range(a, b)`{l=python}
---
class: summary, dropdown
---
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

:::::::::::::::

---


## `for`{l=python}-løkker for å gjenta noe 

En annen vanlig måte å jobbe med `for`{l=python}-løkker på, er at man ønsker å gjenta en eller flere utregninger et bestemt antall ganger. Dette skal du se nærmere på i Utforsk 3.

:::::::{admonition} Utforsk 3
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

:::::::::::::::{admonition} Oppsummering: Utforsk 3
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