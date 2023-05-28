# Introduksjon til Funksjoner

# Funksjoner i Python


## Introduksjon

En funksjon i Python har mange likheter med en funksjon i matematikken. Den generelle måten vi skriver funksjoner på er

```python
def funksjonsnavn(variabelnavn):
    # Kodeblokk
    return # returner funksjonsverdien
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
