# Midtpunktsmetoden

I denne seksjonen skal vi se på en annen måte å tilnærme verdien til et integral på formen

$$
I = \int\limits_a^b f(x) \, dx,
$$

men metode som kalles for **midtpunktsmetoden**. Midtpunktsmetoden er en metode for å tilnærme integralet med arealet av rektangler der man bruker funksjonsverdien i midtpunktet på hvert intervall som høydene til rektanglene. 

```{admonition} Midtpunktsmetoden vs. trapesmetoden
:class: tip

Midtpunktsmetoden har mange likheter med trapesmetoden. Forskjellen ligger i hvordan selve arealet regnes ut. I midtpunktsmetoden regner vi ut arealet av rektangler, mens vi i trapesmetoden regner ut arealet av trapeser. Det som gjør midtpunktsmetoden god, er måten man velger ut høyden i rektanglene. Generelt sett, er midtpunktsmetoden mer nøyaktig enn trapesmetoden!
```

Ingrediensene i midtpunktsmetoden er:

1. Del opp intervallet $[a, b]$ i $n$ delintervaller $[x_0, x_1]$, $[x_1, x_2]$, ..., $[x_{n-1}, x_n]$ med bredde $h = (b - a) / n$.
2. Regn ut $f$ i midtpunktet til hvert delintervall. Vi kaller disse verdiene for $f(x_{i+1/2})$, der $x_{i + 1/2} = a + (i + 1/2)h$.
3. Regn ut arealet av rektangel $i$ med høyde $f(x_{i+1/2})$ og bredde $h$. Vi kaller disse arealene for $S_i$.
4. Summer opp arealene som en tilnærming til integralet $I$.

Tilnærmingen til integralet blir da

$$
I = \int\limits_a^b f(x) \, dx \approx \sum\limits_{i=0}^{n-1} S_i = \sum\limits_{i=0}^{n-1} f(x_{i+1/2})h.
$$

Vi oppsummerer det hele i {prf:ref}`midtpunktsmetoden`.

```{prf:algorithm} Midtpunktsmetoden
:label: midtpunktsmetoden

**Input**: $a$, $b$, $n$, $f$.

**Output**: Tilnærmingen til integralet $I$.

1. Regn ut $h = (b - a) / n$.
2. Sett $I = 0$.
3. For $i = 0, 1, 2, ..., n-1$:
    1. $x_{i+1/2} = a + (i + 1/2)h$.
    2. $S = f(x_{i+1/2})h$.
    3. $I = I + S$
4. Returner $I$.
```


## Oppgaver

### Oppgave 1

Finn en tilnærming til integralet

$$
I = \int\limits_0^1 x^2 e^{-x} \, dx,
$$

ved å bruke midtpunktsmetoden. Bruk $n = 1000$ delintervaller. Du kan bruke kodeblokken under til å regne ut svaret.
*Du finner et løsningsforslag i fanen `fasit.py` hvis du trenger hjelp*.

<iframe src="https://trinket.io/embed/python/27d766e4e2" width="100%" height="600" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>

### Oppgave 2

Finn en tilnærming til integralet

$$
I = \int\limits_0^1 e^{-x^2}\, dx
$$

ved å bruke midtpunktsmetoden. Bruk $n = 1000$ delintervaller. Du kan bruke kodeblokken under til å regne ut svaret.

<iframe src="https://trinket.io/embed/python/352bd16743" width="100%" height="600" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>




[Flere oppgaver på numerisk integrasjon finner du her.](../oppgaver/integrasjon_nb) 