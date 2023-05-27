# Introduksjon til Funksjoner

# Funksjoner i Python


## Introduksjon

En funksjon i Python har mange likheter med en funksjon i matematikken. Den generelle måten vi skriver funksjoner på er

```python
def funksjonsnavn(variabelnavn):
    # Kodeblokk
    return # returner funksjonsverdien
```

### Eksempel 1:

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
