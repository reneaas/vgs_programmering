# Beholdere (containers)

**Beholdere** er datatyper som kan lagre flere andre objekter samtidig. For eksempel kan den lagre flere tall på en gang, eller flere tekststrenger. Eller den kan lagre både tekststreker og tall samtidig. Objektene i en beholder kalles gjerne for **elementer**.
Vi skal se på tre beholdere:

1. [Lister](lists.ipynb). Lister er fleksible beholdere som lar oss legge til elementer som lagres i listen eller slette elementer, hente ut spesifikke elementer osv. Denne beholderen brukes når vi ikke er opptatt av navnet på elementene. Det er vanlig at vi har samme type elementer i listen (for eksempel *bare* tall eller *bare* tekststrenger), men vi kan også bruke den med blandede datatyper.
<!-- 2. [Dictionaries](dictionaries.ipynb). Dictionaries ("oppslagsverk" eller "ordbok") er en beholder der man har navnsatt hva elementet heter med nøkkelord og kan hente ut elementene basert på nøkkelordet. Det gjør det lettvint å lese og bruke koden, men dictionaries er ikke nødvendigvis spesielt raske. Men de er meget fleksible og nyttige for å løse mange problemer i programmering.
3. [Numpy arrays](numpy_arrays.ipynb). Numpy arrays er som lister, men de er mindre fleksible i den forstand at de har en statisk størrelse gjennom koden. Vi må bestemme hvor mange elementer den skal romme helt fra start. Fordelen med denne datatypen er at den er enormt mye raskere enn lister og dictionaries for å gjøre beregninger på mange elementer av gangen. Ofte ønsker vi å regne på flere tusen tall samtidig, og Numpy kan gjøre dette, mens med de to andre får vi bare brukt ett element av gangen.   -->