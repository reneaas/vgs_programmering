---
jupytext:
  text_representation:
    extension: .md
    format_name: myst
    format_version: 0.13
    jupytext_version: 1.14.5
kernelspec:
  display_name: Python 3
  language: python
  name: python3
---


# Test med markdown


## Oppgave 1:

````{dropdown} Løsning
```{code-cell} ipython3
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
```{code-cell} ipython3
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

`````{tab-set}
````{tab-item} Din kode
```{code-cell} ipython3
def kollisjon(v, V, m, M):
    """Tar inn hastighetene v og V til to legemer med massene m og M,
    og returnerer hastighetene v_neste og V_neste etter kollisjonen.
    """
    v_neste = NotImplemented
    V_neste = NotImplemented
    return v_neste, V_neste
```
````

````{tab-item} Løsningsforslag

```python
def kollisjon(v, V, m, M):
    """Tar inn hastighetene v og V til to legemer med massene m og M,
    og returnerer hastighetene v_neste og V_neste etter kollisjonen.
    """
    v_neste = (m - M) / (m + M) * v + 2 * M / (m + M) * V
    V_neste = 2 * m / (m + M) * v + (M - m) / (m + M) * V
    return v_neste, V_neste
```
````
`````

#### Oppgave 4

Enda en test:

```{code-cell} ipython3
def kollisjon(v, V, m, M):
    """Tar inn hastighetene v og V til to legemer med massene m og M,
    og returnerer hastighetene v_neste og V_neste etter kollisjonen.
    """
    v_neste = (m - M) / (m + M) * v + 2 * M / (m + M) * V
    V_neste = 2 * m / (m + M) * v + (M - m) / (m + M) * V
    return v_neste, V_neste
```