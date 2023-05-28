# Numerisk integrasjon med Python

## Introduksjon
Å finne verdien til bestemte integraler er en viktig oppgave i matematikken og fysikken. I mange tilfeller er det ikke mulig å finne en analytisk løsning på integralet, og vi må da ty til numeriske metoder. I dette kapittelet skal vi se på hvordan vi kan finne tilnærmede verdier til bestemte integraler ved hjelp av Python. 


## Trapesmetoden
En av de enkleste metodene for å finne tilnærmede verdier til bestemte integraler er **trapesmetoden**. Vi tenker oss at vi har en funksjon $f$ og skal regne ut integralet

$$
I = \int\limits_a^b f(x) \, dx.
$$


Ideen er å dele opp intervallet $[a, b]$ i $n$ like store delintervaller, og så regne ut arealet av trapesene som dannes. Arealet av et trapes er gitt ved

$$
A = \frac{a + b}{2}h
$$
der $h$ er høyden til trapeset, og $a$ og $b$ er sidelengdene. I figur [trapes](#trapes) ser du et trapes med høyde $h$ og sidelengder $a$ og $b$ for referanse.

Deler vi opp intervallet 


```{figure} ./figurer/Trapezoid.svg
---
label: trapes
---
Figuren viser et trapes med høyde $h$ og sidelengder $a$ og $b$. Figuren er hentet fra [Wikimedia Commons](https://en.wikipedia.org/wiki/Trapezoid#/media/File:Trapezoid.svg).
```
