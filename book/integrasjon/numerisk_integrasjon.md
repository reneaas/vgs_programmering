# Numerisk integrasjon med Python

## Introduksjon
Å finne verdien til bestemte integraler er en viktig oppgave i matematikken og fysikken. I mange tilfeller er det ikke mulig å finne en analytisk løsning på integralet, og vi må da ty til numeriske metoder. I dette kapittelet skal vi se på hvordan vi kan finne tilnærmede verdier til bestemte integraler ved hjelp av Python. 


## Trapesmetoden
En av de enkleste metodene for å finne tilnærmede verdier til bestemte integraler er **trapesmetoden**. Vi tenker oss at vi har en funksjon $f$ og skal regne ut integralet

$$
I = \int\limits_a^b f(x) \, dx.
$$

```{admonition} Arealet av et trapes
:class: tip

Først trenger vi en påminnelse om hva arealet av et trapes er gitt ved. Det finner vi med formelen
$$
A = \frac{a + b}{2}h
$$
der $h$ er høyden til trapeset, og $a$ og $b$ er sidelengdene. I figur 1 ser du et trapes med høyde $h$ og sidelengder $a$ og $b$ for referanse.

```{figure} ./figurer/Trapezoid.svg
---
name: trapes
---
Figuren viser et trapes med høyde $h$ og sidelengder $a$ og $b$. Figuren er hentet fra [Wikimedia Commons](https://en.wikipedia.org/wiki/Trapezoid#/media/File:Trapezoid.svg).


```
Først trenger vi en påminnelse om hva arealet av et trapes er gitt ved. Det finner vi med formelen
$$
A = \frac{a + b}{2}h
$$
der $h$ er høyden til trapeset, og $a$ og $b$ er sidelengdene. I figur 1 ser du et trapes med høyde $h$ og sidelengder $a$ og $b$ for referanse.

```{figure} ./figurer/Trapezoid.svg
---
name: trapes
---
Figuren viser et trapes med høyde $h$ og sidelengder $a$ og $b$. Figuren er hentet fra [Wikimedia Commons](https://en.wikipedia.org/wiki/Trapezoid#/media/File:Trapezoid.svg).
```

