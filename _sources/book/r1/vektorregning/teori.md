# Vektorregning

:::::{admonition} Læringsmål
---
class: tip
---
* Kunne finne vektorer mellom to punkter.
* Kunne regne ut skalarproduktet mellom to vektorer.
* Kunne regne ut lengden av en vektor. 
<!-- * Kunne finne vinkelen mellom to vektorer. -->
:::::


## Vektorer mellom to punkter
En viktig del av vektorregning er å kunne finne vektorer mellom to punkter, gjerne bare som en del av en større oppgave.


:::::{admonition} Eksempel 1
---
class: example
---
To punkter $A(1, 2)$ og $B(-2, 5)$ er gitt. 

Finn vektoren $\overrightarrow{AB}$. 

::::{admonition} Løsning
---
class: solution
---
:::{raw} html 
---
file: ./python/eksempler/eksempel_1.html
---
::::
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
Fyll ut programmet under for å bestemme vektoren $\overrightarrow{AB}$ når $A(2, 3)$ og $B(4, 5)$.

:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_1/a.html
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
import numpy as np 
A = [2, 3]
A = np.array(A)

B = [4, 5]
B = np.array(B)

AB = B - A

print(AB)
:::

som gir utskriften 

```console
[2 2]
```

som betyr at $\overrightarrow{AB} = [2, 2]$.

::::


:::::::::::::

:::::::::::::{tab-item} b
Fyll ut programmet under for å bestemme vektoren $\overrightarrow{AB}$ når $A(-3, 6)$ og $B(2, -7)$.

:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_1/b.html
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
import numpy as np 
A = [-3, 6]
A = np.array(A)

B = [2, -7]
B = np.array(B)

AB = B - A

print(AB)
:::

som gir utskriften 

```console
[  5 -13]
```

som betyr at $\overrightarrow{AB} = [5, -13]$.

::::


:::::::::::::


:::::::::::::{tab-item} c
Fyll ut programmet under for å bestemme vektoren $\overrightarrow{AB}$ når $A(-2, -1)$ og $B(3, 1)$.

:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_1/c.html
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
import numpy as np 
A = [-2, -1]
A = np.array(A)

B = [3, 1]
B = np.array(B)

AB = B - A

print(AB)
:::

som gir utskriften 

```console
[5 2]
```

som betyr at $\overrightarrow{AB} = [5, 2]$.

::::


:::::::::::::

::::::::::::::

:::::::::::::::



## Skalarproduktet
Skalarproduktet er en størrelse man regner ut svært ofte i vektorregningen. 

:::::::::::::::{admonition} Utforsk 1
---
class: explore
---
> Her skal du lære hvordan man regner ut skalarproduktet mellom to vektorer med Python.
::::::::::::::{tab-set}
---
class: tabs-parts
---
:::::::::::::{tab-item} a
Programmet under regner ut skalarproduktet mellom to vektorer.

Les programmet og forutsi hva som skrives ut av programmet. Skriv inn hypotesen og sjekk svaret ditt under! 

:::::::::::::

:::::::::::::{tab-item} b
Endre på programmet slik at det regner ut skalarproduktet mellom vektorene $\vec{a} = [-1, 5]$ og $\vec{b} = [3, 2]$.

Sjekk at svaret stemmer ved regning.


:::::::::::::
::::::::::::::

:::{raw} html
---
file: ./python/utforsk/utforsk_1/a.html
---
:::


:::::::::::::::

---

:::::::::::::::{admonition} Underveisoppgave 2
---
class: check
---

Fyll ut programmene for å regne ut skalarproduktet mellom vektorene.

::::::::::::::{tab-set}
---
class: tabs-parts
---
:::::::::::::{tab-item} a
$\vec{a} = [2, 3]$ og $\vec{b} = [4, 5]$.


:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_2/a.html
---
:::

::::{admonition} Fasit
---
class: answer, dropdown
---
**Programkode**
:::{code-block} python
---
linenos: true
---
import numpy as np

a = [2, 3]
a = np.array(a)

b = [4, 5]
b = np.array(b)

skalarprodukt = a @ b

print(skalarprodukt)
:::

**Utskrift**

:::{code-block} console
23
:::

**Skalarproduktet**

$$
\vec{a} \cdot \vec{b} = 23
$$

::::

:::::::::::::




:::::::::::::{tab-item} b
$\vec{a} = [-6, 2]$ og $\vec{b} = [-1, -3]$.


:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_2/b.html
---
:::

::::{admonition} Fasit
---
class: answer, dropdown
---
**Programkode**
:::{code-block} python
---
linenos: true
---
import numpy as np


a = [-6, 2]
a = np.array(a)

b = [-1, -3]
b = np.array(b)

skalarprodukt = a @ b

print(skalarprodukt)
:::

**Utskrift**

:::{code-block} console
0
:::

**Skalarproduktet**

$$
\vec{a} \cdot \vec{b} = 0
$$

::::

:::::::::::::


:::::::::::::{tab-item} c
$\vec{a} = [1, 2]$ og $\vec{b} = [-3, 1/2]$.


:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_2/c.html
---
:::

::::{admonition} Fasit
---
class: answer, dropdown
---
**Programkode**
:::{code-block} python
---
linenos: true
---
import numpy as np

a = [1, 2]
a = np.array(a)

b = [-3, 1/2]
b = np.array(b)

skalarprodukt = a @ b

print(skalarprodukt)
:::

**Utskrift**

:::{code-block} console
-2.0
:::

**Skalarproduktet**

$$
\vec{a} \cdot \vec{b} = -2
$$

::::

:::::::::::::

::::::::::::::


:::::::::::::::





## Lengden av en vektor
For å finne lengden av en vektor, bruker vi følgende sammenheng:

:::::{admonition} Lengden av en vektor
---
class: theory
---
Lengden av en vektor $\vec{a}$ er gitt ved 

$$
|\vec{a}| = \sqrt{\vec{a} \cdot \vec{a}}
$$

Altså, kvadratroten av skalarproduktet av vektoren med seg selv.

:::::

:::::::::::::::{admonition} Utforsk 2
---
class: example
---
Programmet under regner ut lengden av en vektor. 

Les programmet og forutsi hva programmet skrives. Skriv inn hypotesen din og sjekk svaret under!


:::{raw} html
---
file: ./python/utforsk/utforsk_2/utforsk_2.html
---
:::


:::::::::::::::


---



:::::::::::::::{admonition} Underveisoppgave 3
---
class: check
---
Fyll ut programmene og bruk de til å regne ut lengden av vektorene.

::::::::::::::{tab-set}
---
class: tabs-parts
---
:::::::::::::{tab-item} a

$$
\vec{a} = [2, 3].
$$


:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_3/a.html
---
:::

:::::::::::::


:::::::::::::{tab-item} b

$$
\vec{b} = [-6, 2].
$$


:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_3/b.html
---
:::
:::::::::::::


:::::::::::::{tab-item} c

$$
\vec{c} = [5, -11].
$$


:::{raw} html
---
file: ./python/underveisoppgaver/underveisoppgave_3/c.html
---
:::
:::::::::::::

::::::::::::::



:::::::::::::::





<!-- ## Vinkelen mellom vektorer

For å finne vinkelen mellom to vektorer, bruker vi følgende sammenheng

:::::{admonition} Vinkelen mellom to vektorer
---
class: theory
---
Vinkelen $\theta$ mellom to vektorer $\vec{a}$ og $\vec{b}$ tilfredsstiller

$$
\cos \theta = \frac{\vec{a} \cdot \vec{b}}{|\vec{a}| \cdot |\vec{b}|}
$$

:::::


:::::::::::::::{admonition} Utforsk 3 -->

