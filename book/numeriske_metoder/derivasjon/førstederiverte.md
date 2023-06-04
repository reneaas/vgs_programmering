# Numerisk derivasjon av første orden (førstederiverte)

Selv om man i prinsippet alltid kan finne en formel for den deriverte til en funksjon $f$, er det i blant
bedre å bruke en mer robust og fleksibel måte regne ut en tilnærming til den deriverte. Dette kan vi gjøre med
numerisk derivasjon.


## Netwons kvotient (fremover)

**Newtons kvotient** er en metode for numerisk derivasjon som vi kan motivere ut ifra definisjonen av den deriverte

$$
f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h},
$$

ved å redusere kravet om at $h \to 0$ til at vi i stedet setter $h$ til et *lite tall*. Vi kan da tilnærme den deriverte som

$$
f'(x) \approx \frac{f(x+h) - f(x)}{h},
$$

der $h \ll 1$ (symbolet $\ll$ betyr "mye mindre enn", forresten).


### Eksempel: Deriverte av et polynom

La oss se på et eksempel der vi ønsker å finne den deriverte til 

$$
f(x) = x^2 + 2x + 1,
$$

i $x = 1. Vi kan løse dette for hånd ganske lett som

$$
f'(x) = 2x + 2 \implies f'(1) = 4.
$$

Under ser du hvordan vi kan tilnærme den deriverte med Newtons kvotient for flere verdier av $h$. Merk hvordan vi får en bedre tilnærming jo mindre $h$ er (dog det blir faktisk dårligere etter at vi passerer $h = 10^{-7}$, men dette er en avrundingsfeil som skjer på datamaskinen og ikke et direkte matterelatert problem).

<iframe src="https://trinket.io/embed/python/09977207eb" width="100%" height="600" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>


### Oppgave:

Finn en tilnærming til den deriverte av

$$
f(x) = 3x^3 - 2x^2 + 1,
$$

i $x = 1$ ved å bruke Newtons kvotient. Finn tilnærmingen ved å bruke $h = 10^{-3}, 10^{-5}, 10^{-7}$.


<iframe src="https://trinket.io/embed/python/31949a779e" width="100%" height="600" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>





