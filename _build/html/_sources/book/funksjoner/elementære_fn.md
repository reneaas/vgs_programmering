# Elementære Funksjoner i Python

Mange funksjoner kan uttrykkes ved hjelp av elementære funksjoner. Vi skal se på noen eksempler på hvordan vi kan skrive disse i Python. Men først oppgir vi en liste over de viktigste elementære funksjonene som dukker opp i matematikken så vi har en oversikt over dem.

```{admonition}  Liste over elementære funksjoner
Elementære funksjoner i Python kan hentes fra to biblioteker. De to er:
1. `math`-biblioteket. Det kan beregne funksjonsverdien for inputs med datatypene `int` og `float`.
2. `numpy`-biblioteket. Det kan bergen funksjonsverdien for inputs med datatypene `int`, `float` og `numpy.ndarray`.

| Funksjon | Ren Python | `math` | `numpy` |
| --- | --- | --- | --- |
| $f(x) = \|x\|$ | `abs(x)`| - | `numpy.abs(x)` |
| $f(x) = x^a$ | `x**a` | - |`numpy.power(x, a)` |
| $f(x) = e^x$ | - |`math.exp(x)` | `numpy.exp(x)` |
| $f(x) = \sqrt{x}$ | - |`math.sqrt(x)` | `numpy.sqrt(x)` |
| $f(x) = \sin(x)$ | - |`math.sin(x)` | `numpy.sin(x)` |
| $f(x) = \cos(x)$ | - |`math.cos(x)` | `numpy.cos(x)` |
| $f(x) = \tan(x)$ | - |`math.tan(x)` | `numpy.tan(x)` |


```