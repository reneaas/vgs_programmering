# Symbolsk Integrasjon med `sympy`

## Introduksjon
> Derivasjon er et håndverk, integrasjon er en kunst! - Viggo Brun

Når man lærer å derivere funksjoner, så lærer man regneregler som kan anvendes direkte på vilkårlige funksjonsuttrykk uansett hvor kompliserte de måtte se ut. Man trenger bare holde tunga rett i munn og slavisk følge derivasjonsreglene, så kan man regne seg frem til den deriverte.

Integraler, på en annen side, er sjelden rett frem å løse. Prøving og feiling er nødvendig for å bygge opp intuisjon for hvilke integrasjonsteknikker så må anvendes. For å gjøre ting vondt verre, finnes det også integraler som ikke har noen antiderivert i det hele tatt, så å løse integralet for hånd er håpløst. Andre integraler kan løses for hånd, men kan være svært tidkrevende eller kreve avanserte teknikker som ikke undervises i videregående skole. Da er det greit å ha en datamaskin tilgjengelig som kan gjøre jobben for deg. Og det er her `sympy` kommer inn i bildet. 


## Hva er `sympy`?
`sympy` er et bibliotek for Python som lar deg utføre symbolsk matematikk. Det vil si at du kan utføre matematiske operasjoner på symboler, som for eksempel bokstaver, og få uttrykket forenklet. `sympy` kan også løse likninger og derivere og integrere funksjoner.
Her skal vi se på hvordan man kan integrere med `sympy`.

