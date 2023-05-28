# Variabler 

Den grunnleggende størrelsen i Python som du kommer til å bruke er *variabler*. En variabel har 

1. Et **variabelnavn**. Dette bestemmes av deg som skriver koden.
2. En **verdi**. Denne kan settes av deg manuelt eller regnes ut som en del av programmet.
3. En **datatype**. Datatypen bestemmer hva man kan bruke variabelen til.

I tabell 1 ser du noen eksempler på variabler. 

**Tabell 1**: Eksempler på variabler og deres variabelnavn, verdi og datatype.
| Variabelnavn | Verdi | Datatype |
|---|---|---|
| `i` | `1` | `int` |
| `a` | `1.0` | `float` |
| `s` | `"1.0"` | `str` |
| `res1` | `-5.0` | `float`
| `melding` | `"Dette er en liten melding"` | `str` |


Det finnes mange forskjellige datatyper i Python. Men for nå holder det å kjenne til disse:

1. `int` er *heltall*. 
2. `float` er *flyttall* og er de man brukes når man regner. Du kan tenke på det som desimaltall eller *reelle tall*.
3. `str` er tekst.


## Øvelser: Verdi og datatype

### Øvelse 1: Skrive ut verdi og datatype

Under kan du se hvordan man kan skrive ut verdien til en variabel med `print`-funksjonen og datatypen til variabelen ved å bruke `type`-funksjonen:

<iframe src="https://trinket.io/embed/python/61f0fa2c97" width="100%" height="600" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>


### Øvelse 2: Sette riktig verdi og datatype.

Under er en uferdig kode der to variabler ikke er implementert (derfor markert med `NotImplemented`). Sammen med den uferdige koden er det en notis som sier at

- `a` skal ha verdien `10` og datatypen `int`.
- `r` skal ha verdien `-0.5` og datatypen `float`.

Fullfør koden. Trykk på run og se om du har gjort riktig.

<iframe src="https://trinket.io/embed/python/2fd0bb1151" width="100%" height="600" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>