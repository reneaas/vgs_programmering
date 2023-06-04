# Test med markdown


## Oppgave 1:

````{dropdown} Løsning
```{code-cell} python
def kollisjon(v, V, m, M):
    """Tar inn hastighetene v og V til to legemer med massene m og M,
    og returnerer hastighetene v_neste og V_neste etter kollisjonen.
    """
    v_neste = (m - M) / (m + M) * v + 2 * M / (m + M) * V
    V_neste = 2 * m / (m + M) * v + (M - m) / (m + M) * V
    return v_neste, V_neste
```
````


## Oppgave 2:

````{dropdown} Løsning
```{code-cell} python
def kollisjon(v, V, m, M):
    """Tar inn hastighetene v og V til to legemer med massene m og M,
    og returnerer hastighetene v_neste og V_neste etter kollisjonen.
    """
    v_neste = (m - M) / (m + M) * v + 2 * M / (m + M) * V
    V_neste = 2 * m / (m + M) * v + (M - m) / (m + M) * V
    return v_neste, V_neste
```
````


## Oppgave 3: 

````{tab-set}
```{tab-item} Din kode
```{code-cell} python
def kollisjon(v, V, m, M):
    """Tar inn hastighetene v og V til to legemer med massene m og M,
    og returnerer hastighetene v_neste og V_neste etter kollisjonen.
    """
    v_neste = NotImplemented
    V_neste = NotImplemented
    return v_neste, V_neste
```

```{tab-item} Løsningsforslag

```{code-cell} python
def kollisjon(v, V, m, M):
    """Tar inn hastighetene v og V til to legemer med massene m og M,
    og returnerer hastighetene v_neste og V_neste etter kollisjonen.
    """
    v_neste = (m - M) / (m + M) * v + 2 * M / (m + M) * V
    V_neste = 2 * m / (m + M) * v + (M - m) / (m + M) * V
    return v_neste, V_neste
```
````
