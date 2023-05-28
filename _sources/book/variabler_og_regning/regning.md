# Å regne med Python

Python kode kan gjøre vanlige regneoperasjoner som vi lærer om i matematikken, og siden vi skal bruke Python i de regnetunge realfagene, er det naturlig at vi må lære om dette.

```{admonition} Hvilke datatyper kan man regne med?
:class: tip
Vi kan regne med to datatyper:

1. **int** (heltall).
2. **float** (flyttall/desimaltall). 


Det er vanligst å regne med `float`. Man kan regne med `int` på samme måte som man regner med `float`, men resultatet blir ofte omgjort til en `float` selv om du opprinnelig hadde en eller flere `int` i regnestykket. Mer om dette senere.
```

## Regneoperasjoner i Python

Alle de vanlige regneartene er mulig å bruke når man skriver Python kode. 
I tabell 1 vises de alle regneoperasjonene du kan gjøre med Python, og hvilket operasjonstegn du må bruke med et eksempel for hver regneart.

**Tabell 1**: Regneoperasjoner i Python.

| Regneart | Operasjonstegn | Eksempel | Resultat | 
|---|---|---| --- |
| Addisjon | `+` | `2 + 3` | `5` |
| Subtraksjon | `-` | `2 - 3` | `-1` |
| Multiplikasjon | `*` | `2 * 3` |  `6` |
| Divisjon | `/` | `2 / 3` | `0.6666666666666666` |
| Potens | `**` | `2 ** 3` | `8` |
| Heltallsdivisjon | `//` | `2 // 3` | `0` |
| Modulo (restdivisjon) | `%` | `2 % 3` | `2` |

```{admonition} Hva betyr heltallsdivisjon og modulo?
:class: tip

**Heltallsdivisjon** er antallet *hele* ganger et tall går opp i et annet. For eksempel går `3` opp i `10` tre ganger, og derfor er `10 // 3 = 3`.

**Modulo** eller **restdivisjon** er resten av en heltallsdivisjon. For eksempel er `10 % 3 = 1` siden `3` går opp i `10` tre ganger med rest `1`. 
```

