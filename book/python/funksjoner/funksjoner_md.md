# Pythonfunksjoner


## Introduksjon

En funksjon i Python har mange likheter med en funksjon i matematikken. Den generelle måten vi skriver funksjoner på er

```python
def funksjonsnavn(argument):
    # Kodeblokk
    return # returner funksjonsverdien
```

```{Admonition} Forklaring av skrivemåten til funksjoner
:class: tip, dropdown

Vi må gi en funksjon et `funksjonsnavn` slik at vi kan bruke den i koden vår. I tillegg må vi oppgi

- `argument` som er en variabel som vi kan bruke inne i funksjonen. Det kan være mer enn ett argument også, men det skal vi se på senere.
- `def` er et *nøkkelord* som forteller Python at vi skal definere en funksjon.
- `return` er et *nøkkelord* som forteller Python at vi skal returnere en verdi. Denne verdien vil ofte være en funksjonsverdi.

```

### Eksempel 1

Funksjonen $f(x) = x^2 - 1$ kan vi skrive definere med koden

eller 

$$
f(x) = x^2 - 1.
$$

```python
def f(x):
    return x**2 - 1
```


Vi kan regne ut funksjonsverdier med et såkalt *funksjonskall*. Som eksempel, la oss regne ut funksjonsverdien i $x = 2$. Dette kan gjøres på to måter:

```python
y = f(2) # Skrive inn x-verdien direkte
y = f(x=2) # Presisere at det er `x` som skal settes lik 2.
```


Under kan du eksperimentere med funksjonen:

<iframe src="https://trinket.io/embed/python/dd5bbfca3d" width="100%" height="600" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>


### Eksempel 2

Noen funksjoner kan ikke skrives med elementære funksjoner (lukkede formler). Et eksempel er en rekke på formen

$$
S_N = \sum_{n=1}^N \frac{1}{n^2}.
$$

Vi kan anse $S_N$ som en funksjon av antall ledd $N$. Vi kan da skrive funksjonen som

```python
def S(N):
    res = 0
    for i in range(1, N+1):
        res += 1 / i**2
    return res
```


Under kan du eksperimentere med funksjonen. Prøv å øke `N` og se hva som skjer.

<iframe src="https://trinket.io/embed/python/7a0bf0ce69" width="100%" height="600" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>



## Oppgaver

### Oppgave 1

Skriv en Python funksjon for følgende funksjoner:

1. $f(x) = 2x + 1$
2. $g(x) = x^2 - 3x + 2$
3. $h(x) = \frac{1}{x^2 + 1}$


Du kan bruke kodeblokken under til å skrive kode. *Du finner et løsningsforslag under fanen `fasit.py`.*

<iframe src="https://trinket.io/embed/python/2e17476d19" width="100%" height="600" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>