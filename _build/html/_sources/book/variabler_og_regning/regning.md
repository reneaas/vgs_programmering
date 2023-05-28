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
I tabell 1 vises alle regneoperasjonene du kan gjøre med Python og hvilket operasjonstegn du må bruke.

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

## Regnerekkefølgen i Python

Regnerekkefølgen i Python er

1. Parenteser
2. Potenser.
3. Divisjon
4. Multiplikasjon
5. Addisjon og substraksjon

Dette er omtrent den samme rekkefølgen som man lærer om i matematikken. Den store forskjellen er at divisjon og multiplikasjon *ikke* stilles på lik linje. Man utfører divisjon *før* man utfører multiplikasjon.

```{admonition} Eksempel på regnerekkefølge
:class: tip
Vi skal regne ut `2 + 4 / 2 * 2`.

1. Først utfører vi divisjonen `4 / 2 = 2`.
2. Deretter utfører vi multiplikasjonen `2 * 2 = 4`.
3. Til slutt plusser vi `2 + 4 = 6`.

Her kan vi se hvorfor divisjon og multiplikasjon ikke kan være likestilt. 
Hadde vi i stedet multiplisert nevneren med `2`, hadde vi fått:

`2 + 4 / 2 * 2 = 2 + 4 / 4 = 2 + 1 = 3`.

som er et helt annet tall. Én av dem må derfor prioriteres, og det divisjon som er den prioriterte regnearten.
```



