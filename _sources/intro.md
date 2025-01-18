# Programmering i Videregående Skole

:::{raw} html
---
file: ./velkommen.html
---
:::

<br>

:::::{grid} 1 1 2 2
---
gutter: 3
---

::::{grid-item-card}
---
link: book/programmering/variabler/variabler
link-type: doc
---
**Variabler og `print`{l=python}-funksjonen**


^^^
:::{code-block} python
---
linenos: true
---
a = 5
b = -2.3
melding = "Hei, verden!"

print(a)

print(f"{b = }")

print(f"{melding = }")
:::


::::

::::{grid-item-card}
---
link: book/programmering/regning/regning
link-type: doc
---
**Regning med Python** ➕➖✖️➗


^^^
:::{code-block} python
---
linenos: true
---
a = 2 * 3
b = 5 / 2
c = 2 ** 3

print(a, b, c)
:::


::::


::::{grid-item-card}
---
link: book/programmering/for_loops/for_loops
link-type: doc
---
**`for`{l=python}-løkker** 🔁


^^^
:::{code-block} python
---
linenos: true
---
for x in range(1, 5, 2):
    print(x)
:::


::::


::::{grid-item-card}
---
link: book/programmering/while_loops/while_loops
link-type: doc
---
**`while`{l=python}-løkker** 🔁


^^^
:::{code-block} python
---
linenos: true
---
x = 1
while x < 5:
    print(x)
    x = x + 2
:::


::::


::::{grid-item-card}
---
link: book/programmering/if_else/if_else
link-type: doc
---
**`if`{l=python}-`else`{l=python}-setninger** 🤔


^^^
:::{code-block} python
---
linenos: true
---
x = 2 
if x > 0:
    print("Positivt")
else:
    print("Ikke positivt")
:::

::::


::::{grid-item-card}
---
link: book/programmering/turtle/turtle
link-type: doc
---
**Turtle programmering** 🐢


^^^
:::{code-block} python
---
linenos: true
---
from turtle import *

for _ in range(4):
    forward(100)
    right(90)

:::

::::






:::::
