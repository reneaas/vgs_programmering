# Finne Nullpunkter

Et klassisk problem i matematikken er å finne nullpunktene til en funksjon. Formelt sett er nullpunkter de verdiene $x$ som gjør at funksjonsverdien er null, eller da alle $x$ der $f(x) = 0$. I de fleste problemene som dukker i matematikken i videregående skole, går det an å løse disse problemene for hånd. Men ønsker vi å jobbe med mer kompliserte, virkelighetsnære problemer, dukker det fort opp funksjoner der man ikke kan finne nullpunktene for hånd. Da må vi ty til numeriske metoder for å finne tilnærming til nullpunktene.

Vi skal se på følgende numeriske metoder for å finne nullpunkter til funksjoner. Disse er:

1. [Halveringsmetoden](./halveringsmetoden)
2. [Newtons metode](./newtons_metode)
<!-- 3. [Sekantmetoden](./sekantmetoden) -->

```{admonition} Finne nullpunkter numerisk: et robust verktøy
:class: tip
Selv om vi i hovedsak skal presentere det å finne nullpunkter som å løse likningen $f(x)=0$, er det verdt å huske på
at denne metoden også kan brukes til å finne ekstremalpunkter og vendepunkter til funksjoner. Da trenger vi bare å bruke samme metode på likningene $f'(x) = 0$ og $f''(x) = 0$. Vi ender derfor opp med et robust og generaliserbart verktøy som kan løse flere problemer med samme fremgangsmåte!
```

