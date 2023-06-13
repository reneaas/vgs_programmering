# Monte Carlo Integrasjon (Matematikk S2)

Vi skal nå se på en metode for å tilnærme integralet ved å bruke teorien for kontinuerlige stokastiske variabler.
Vi ønsker å løse integralet

$$
I = \int\limits_a^b f(x) \, dx. 
$$

Vi tenker oss at $p(x)$ er en uniform sannsynlighetsfordeling på intervallet $[a, b]$, slik at

$p(x) = 1/(b-a)$ for $x \in [a, b]$, og $p(x) = 0$ ellers.

Vi kan trikse litt med integralet slik at vi får

$$
I = \int\limits_a^b f(x) \, dx = \int\limits_a^b \frac{f(x)}{p(x)}p(x) \, dx = (b-a)\int\limits_a^b f(x)p(x) \, dx = (b-a)E[f(X)].
$$

Integralet kan altså skrives som forventningsverdien av $f(X)$. Vi kan tilnærme denne forventningsverdien ved å trekke $N$ tilfeldige tall av $X$ fra sannsynlighetsfordelingen $p(x)$, og regne ut gjennomsnittet av $f(X)$! Med andre ord

$$
I = \int\limits_a^b f(x) \, dx \approx \frac{b-a}{N}\sum\limits_{i=1}^{N} f(x_i),
$$

der $x_1, x_2, ..., x_N$ er $N$ tilfeldige tall trukket fra $p(x)$.


## Oppgaver

### Oppgave 1

Bruk Monte Carlo integrasjon til å tilnærme integralet

$$
I = \int\limits_0^1 4\sqrt{1 - x^2} \, dx.
$$

Integralet bør nærme seg en veldig kjent matematisk konstant når du trekker mange tall.

Du kan bruke kodeblokken under. *Du finner et løsningsforslag i fanen `fasit.py` hvis du trenger hjelp*.

<iframe src="https://trinket.io/embed/python/a75a7ef20b" width="100%" height="600" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>