# Symbolsk Integrasjon med `sympy`
> Derivasjon er et håndverk, integrasjon er en kunst! - Viggo Brun

Når man lærer å derivere funksjoner, så lærer man regneregler som kan anvendes direkte på vilkårlige funksjonsuttrykk uansett hvor kompliserte de måtte se ut. Man trenger bare holde tunga rett i munn og slavisk følge derivasjonsreglene, så kan man regne seg frem til den deriverte.

Integraler, på en annen side, er sjelden rett frem å løse. Prøving og feiling er nødvendig for å bygge opp intuisjon for hvilke integrasjonsteknikker så må anvendes. For å gjøre ting vondt verre, finnes det også integraler som ikke har noen antiderivert i det hele tatt, så å løse integralet for hånd er håpløst. Andre integraler kan løses for hånd, men kan være svært tidkrevende eller kreve avanserte teknikker som ikke undervises i videregående skole. Da er det greit å ha en datamaskin tilgjengelig som kan gjøre jobben for deg. Og det er her `sympy` kommer inn i bildet. 

## Ubestemte integraler

### Eksempel 1: Ubestemt integral av en polynomfunksjon

Vi kan starte med et konkret eksempel der skal finne løsningen på det ubestemte integralet

$$
I = \int x^2 \, dx = \frac{x^3}{3} + C.
$$

Med `sympy` kan vi oppnå det med følgende kode:

```python
import sympy as sp
x = sp.symbols("x")
I = sp.integrate(x**2, x)
sp.pprint(I) # pprint skriver ut løsningen med mattenotasjon.
```

Da skrives det

```console
 3
x 
──
3 
```

```{admonition} Ubestemte integraler, men ingen integrasjonskonstant?
:class: tip 
Når man bruker `sympy.integrate` til å løse ubestemte integraler, vil ikke integrasjonskonstanten $C$ vises. Dette er fordi `sympy` ikke vet hva $C$ er, og derfor ikke kan skrive den ut. Det er derfor viktig å huske på at alle ubestemte integraler har en integrasjonskonstant, selv om den ikke vises.
```

### Eksempel 2: Ubestemt integral av en transcendental funksjon

Vi kan også løse integraler av transcendente funksjoner. La oss finne løsningen på det ubestemte integralet

$$
I = \int x^2 e^{-x} \, dx = -(x^2 + 2x  + 2 )e^{-x} + C.
$$

Dette integralet kan man løse med delvis integrasjon, men er ganske tidkrevende. Med `sympy`, er det som følger alt vi trenger å skrive for å løse samme integral analytisk (altså med en eksakt løsning):

```python
import sympy as sp
x = sp.symbols("x")
I = sp.integrate(x**2 * sp.exp(-x), x)
sp.pprint(I)
```

```console
⎛   2          ⎞  -x
⎝- x  - 2⋅x - 2⎠⋅ℯ  
```

som vi tolker som at

$$
I = \int x^2 e^{-x} \, dx = (-x^2 - 2x - 2)e^{-x} + C = -(x^2 + 2x + 2)e^{-x} + C.
$$

Vi får altså akkurat samme svar, men på brøkdelen av tiden vi ville brukt på å løse integralet for hånd.


```{admonition} Generell syntaks for ubestemte integraler
:class: tip

Når man integrerer en funksjon analytisk må man

1. Importere `sympy` med `import sympy as sp`
2. Definere en symbolsk variabel med `x = sp.symbols("x")`
3. Bruke `I = sp.integrate(funksjonsuttrykk, x)` til å løse integralet. 
4. Skrive ut løsningen med `sp.pprint(I)`.

```

## Bestemte integraler

### Eksempel 3: Bestemt integral av en polynomfunksjon

Vi kan også løse bestemte integraler med `sympy`. La oss finne løsningen på det bestemte integralet

$$
I = \int_0^2 x^2 \, dx = \frac{8}{3}.
$$

Vi kan løse det samme integralet med `sympy` slik:


```python
import sympy as sp
x = sp.symbols("x")
I = sp.integrate(x**2, (x, 0, 2))
sp.pprint(I)
```
som gir utskriften 

```console
8/3
```


### Eksempel 4: Bestemte *uegentlige* integraler

Vi kan også løse bestemte *uegentlige* integraler med `sympy`. Disse dukker spesielt opp i sannsynlighetsteori i S2, for eksempel. 
La oss finne løsningen på det bestemte integralet

$$
\int_0^\infty e^{-x} \, dx = 1.
$$

Vi kan løse det samme integralet med `sympy` slik:

```python
import sympy as sp
x = sp.symbols("x")
I = sp.integrate(sp.exp(-x), (x, 0, sp.oo))
sp.pprint(I)
```
som gir utskriften

```console
1
```


```{admonition} Generell syntaks for bestemte integraler
:class: tip

1. Du må importere `sympy` med `import sympy as sp`
2. Du må definere en symbolsk variabel med `x = sp.symbols("x")`
3. Du må bruke `I = sp.integrate(funksjonsuttrykk, (x, nedre grense, øvre grense))` til å løse integralet.
4. Du må skrive ut løsningen med `sp.pprint(I)`.
```


```{note}
Legg merke til i eksempel 4 at vi bruker `sp.oo` for å angi uendelig. Dette er fordi `sympy` ikke kjenner til symbolet $\infty$, så vi må bruke `sp.oo` i stedet.
```


## Integraler med flere symboler

Noen ganger kan det være aktuelt å integrere en funksjon med flere symboler. 

### Eksempel 5: Ubestemt integral av en polynomfunksjon med flere symboler

La oss se på et eksempel der vi skal finne løsningen på det bestemte integralet

$$
\int_0^1 ax^2 + bx + c = \frac{a}{3} + \frac{b}{2} + c.
$$

For å finne dette kan vi skrive en kode som inkluderer flere symboler, et for hver koeffisient $a$, $b$ og $c$:

```python
import sympy as sp
x, a, b, c = sp.symbols("x a b c")
I = sp.integrate(a*x**2 + b*x + c, (x, 0, 1)) # Integrerer med hensyn på x fra 0 til 1.
sp.pprint(I)
```

som gir utskriften 

```console
a   b    
─ + ─ + c
3   2    
```

som er akkurat det samme som vi ville fått om vi løste integralet for hånd.

### Eksempel 6: 
