# Optimering

:::::::::::::::{admonition} Oppgave 1
---
class: problem-level-1
---

Nedenfor vises to funksjoner definert med Python kode, to `while`{l=python}-løkker. 

I {numref}`fig-1t-optimering-oppgave-1-merged` vises to strategier som hver seg hører til én funksjon og én `while`{l=python}-løkke.

Bestem hvilken funksjon, `while`{l=python}-løkke og figur som hører sammen.

:::::{grid}
:gutter: 2

::::{grid-item}
:outline:
**Funksjon 1**
:::{code-block} python
def f(x):
    return (x - 4) ** 2 + 2
:::

<br>

::::
::::{grid-item}
:outline:
**Funksjon 2**

:::{code-block} python
def f(x):
    return -(x - 4) ** 2 + 12
:::

<br>

::::

:::::


:::::{grid}
:gutter: 2

::::{grid-item}
:outline:
**`while`{l=python}-løkke I**
:::{code-block} python
x = 1
while f(x) < f(x + 1):
    x = x + 1

print(x)
:::

<br>

::::
::::{grid-item}
:outline:
**`while`{l=python}-løkke II**

:::{code-block} python
x = 1
while f(x) > f(x + 1):
    x = x + 1

print(x)
:::

<br>

::::

:::::


:::{figure} ./figurer/oppgave_1/merged_figure.svg
---
name: fig-1t-optimering-oppgave-1-merged
width: 100%
class: no-click
---
viser to forskjellige strategier for å finne ekstremalpunktet til en funksjon. Figuren til venstre viser en strategi for å finne ekstremalpunktet når det er et toppunkt, og figuren til høyre viser en strategi for å finne ekstremalpunktet når det er et bunnpunkt.
:::


<!-- :::::{admonition} Fasit
---
class: answer, dropdown
---


::::: -->




:::::::::::::::

---


:::::::::::::::{admonition} Oppgave 2
---
class: problem-level-1
---
En andregradsfunksjon $f$ er gitt ved 

$$
f(x) = (x + 1)(x - 5)
$$


::::::::::::::{tab-set}
---
class: tabs-parts
---
:::::::::::::{tab-item} a
Bestem ekstremalpunktet til funksjonen $f$. 


::::{admonition} Fasit
---
class: answer, dropdown
---
$$
x = 2.
$$
::::

:::::::::::::

:::::::::::::{tab-item} b
Fyll ut programmet nedenfor og bruk én av strategiene som vist i {numref}`fig-1t-optimering-oppgave-1-merged` for å finne ekstremalpunktet til funksjonen $f$. 

:::{raw} html
---
file: ./python/oppgave_2/b.html
---
:::

::::{admonition} Fasit
---
class: answer, dropdown 
---
Siden $f$ har et bunnpunkt, bruker vi strategien i figur B fra {numref}`fig-1t-optimering-oppgave-1-merged`. Betingelsen i `while`{l=python}-løkken blir derfor at vi skal øke $x$ med $1$ så lenge $f(x) > f(x + 1)$. 

**Programkode**:
:::{code-block} python
---
linenos:
---
def f(x):
    return (x + 1) * (x - 5)
    
x = -3
while f(x) > f(x + 1):
    x = x + 1 

print(x)
:::
::::

:::::::::::::

::::::::::::::



:::::::::::::::

---


:::::::::::::::{admonition} Oppgave 3
---
class: problem-level-2
---
En rasjonal funksjon $f$ er gitt ved 

$$
f(x) = \dfrac{x^2 - 6x + 5}{(x - 2)(x - 4)}
$$

I {numref}`fig-1t-optimering-oppgave-3` vises grafen til $f$. 

:::{figure} ./figurer/oppgave_3/graf.svg
---
name: fig-1t-optimering-oppgave-3
width: 80%
class: no-click
---
viser grafen til en rasjonal funksjon $f$. 
:::



::::::::::::::{tab-set}
---
class: tabs-parts
---
:::::::::::::{tab-item} a
Bestem nullpunktene og asymptotene til $f$.


:::::{admonition} Fasit
---
class: answer, dropdown
---
* Nullpunkter: $x = 1$ og $x = 5$
* Vertikale asymptoter: $x = 2$ og $x = 4$.
* Horisontal asymptote: $y = 1$.

:::::

:::::::::::::

:::::::::::::{tab-item} b
Bestem i hvilket intervall $f$ har et ekstremalpunkt. 


:::{admonition} Hint
---
class: hints, dropdown
---
Hvor vil en tangent i grafen til $f$ har stigningstall $0$?
:::


:::::{admonition} Fasit
---
class: answer, dropdown
---
$$
x \in \langle 2, 4 \rangle. 
$$
:::::

:::::::::::::

:::::::::::::{tab-item} c
Lag et program som finner ekstremalpunktet til $f$ ved å bruke én av strategiene i {numref}`fig-1t-optimering-oppgave-1-merged` fra oppgave 1.

> Tips: Her er det lurt å øke $x$ med et lite tall, f.eks $0.25$ i stedet for å øke $x$ med $1$. Husk at $f(x)$ ikke er definert i bruddpunktene sine heller.

:::{raw} html
---
file: ./python/oppgave_3/c.html
---
:::


:::::{admonition} Fasit
---
class: answer, dropdown
---
Vi leter etter et bunnpunkt, så vi bruker betingelsen $f(x) > f(x + 0.25)$ i `while`{l=python}-løkken for å gå i "nedoverbakke" mot bunnpunktet.

::::{code-block} python
---
linenos:
---
def f(x):
    teller = x**2 - 6 * x + 5
    nevner = (x - 2) * (x - 4)
    return teller / nevner
    
    
x = 2.25
while f(x) > f(x + 0.25):
    x = x + 0.25
    
print(x)
::::

utskriften forteller oss at $x = 3$ er ekstremalpunktet til $f$.
:::::

:::::::::::::

::::::::::::::


:::::::::::::::

---

:::::::::::::::{admonition} Oppgave 4
---
class: problem-level-3
---
En rasjonal funksjon $f$ er gitt ved 

$$
f(x) = \dfrac{8}{x^2 + 16} \quad \text{der} \quad D_f = [0, \to \rangle
$$

I {numref}`fig-1t-optimering-oppgave-4` vises grafen til $f$.
Et rektangel har hjørner i $(0, 0)$, $(3, 0)$, $(3, f(3))$ og $(0, f(3))$.

:::{figure} ./figurer/oppgave_4/graf.svg
---
name: fig-1t-optimering-oppgave-4
width: 80%
class: no-click
---
viser en rasjonal funksjon $f$ og et rektangel med hjørner i $(0, 0)$, $(3, 0)$, $(3, f(3))$ og $(0, f(3))$.
:::

::::::::::::::{tab-set}
---
class: tabs-parts
---

:::::::::::::{tab-item} a
Bestem arealet til rektangelet i {numref}`fig-1t-optimering-oppgave-4`.

::::{admonition} Fasit
---
class: answer, dropdown
---
$$
\mathrm{areal} = \dfrac{3 \cdot 8}{3^2 + 16} = \dfrac{24}{25}.
$$
::::

:::::::::::::


:::::::::::::{tab-item} b
Et annet rektangel har hjørner i $(0, 0)$, $(x, 0)$, $(x, f(x))$ og $(0, f(x))$.

Bestem arealet $A(x)$ til rektangelet.


::::{admonition} Fasit
---
class: answer, dropdown
---
$$
A(x) = x \cdot f(x) = \dfrac{8x}{x^2 + 16}.
$$
::::

:::::::::::::


:::::::::::::{tab-item} c
Lag et program som skriver ut en oversikt over arealet $A(n)$ til rektangeler med hjørner i $(0, 0)$, $(n, 0)$, $(n, f(n))$ og $(0, f(n))$ for $n \in \{1, 2, \ldots, 10\}$.


:::{raw} html
---
file: ./python/oppgave_4/c.html
---
:::

::::{admonition} Fasit
---
class: answer, dropdown
---
:::{code-block} python
---
linenos:
---
def f(x):
    teller = 8
    nevner = x**2 + 16
    return teller / nevner

def A(x):
    return x * f(x)


for n in range(1, 11):
    print(f"{n = } 	 {A(n) = :.2f}")
:::

som gir utskriften

:::{code-block} console
n = 1 	 A(n) = 0.47
n = 2 	 A(n) = 0.80
n = 3 	 A(n) = 0.96
n = 4 	 A(n) = 1.00
n = 5 	 A(n) = 0.98
n = 6 	 A(n) = 0.92
n = 7 	 A(n) = 0.86
n = 8 	 A(n) = 0.80
n = 9 	 A(n) = 0.74
n = 10 	 A(n) = 0.69
:::
::::

:::::::::::::


:::::::::::::{tab-item} d
Lag et program som bestemmer $x$ slik at arealet av rektangelet blir størst mulig. 

:::{raw} html
---
file: ./python/oppgave_4/d.html
---
:::


::::{admonition} Fasit
---
class: answer, dropdown
---
:::{code-block} python
---
linenos:
---
def f(x):
    teller = 8
    nevner = x**2 + 16
    return teller / nevner

def A(x):
    return x * f(x)


x = 0
while A(x) < A(x + 0.25):
    x = x + 0.25
    
print(x)
:::

Program skriver ut $4.0$ som betyr at $x = 4$ gir størst mulig areal for rektangelet.
::::



:::::::::::::

::::::::::::::


:::::::::::::::







