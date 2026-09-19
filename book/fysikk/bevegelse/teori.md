# Bevegelse


:::{goals} Læringsmål
* Kunne forklare hva diskretisering av en funksjon innebærer, og bruke det til å sette opp likninger for bevegelse med ikke-konstant akselerasjon. 
* Kunne bruke Eulers metode og Euler-Cromers metode til å beregne fart og posisjon over tid med ikke-konstant akselerasjon. 
* Kunne lage og tolke programmer som simulerer bevegelse med Eulers metode og Euler-Cromers metode.
:::


## Simulering av bevegelse i ett tidssteg
En bevegelse foregår kontinuerlig. Posisjonen $s$, farten $v$ og akselerasjonen $a$ kan derfor forandre seg hele tiden. Vi kan derfor tenke på de tre størrelsene som funksjoner av tiden, altså at $s(t)$ er en posisjonsfunksjon, $v(t)$ er en fartsfunksjon, og $a(t)$ er en akselerasjonsfunksjon.

Akselerasjonen kan variere over tid, og for mange realistiske bevegelser vil det ikke være mulig å finne en fartsfunksjon eller en posisjonsfunksjon som en *formel*. For at vi skal kunne analysere bevegelse med varierende akselerasjon, tar vi derfor utgangspunkt i følgende idé: 

Den gjennomsnittlige akselerasjonen i et tidsintervall $\Delta t$ kan skrives som

$$
\bar{a} = \frac{\Delta v}{\Delta t}
$$

Hvis tidsintervallet er tilstrekkelig lite, kan vi betrakte akselerasjonen som tilnærmet konstant lik $a$ i hele intervallet. I løpet av tiden $\Delta t$ får vi da en fartsendring $\Delta v$ som er omtrent:

$$
a \approx \frac{\Delta v}{\Delta t} \liff \Delta v \approx a \cdot \Delta t
$$

Hvis farten på et tidspunkt $t$ er $v$, så vil farten på neste tidspunkt $t_\mathrm{neste} = t + \Delta t$ være omtrent lik:

$$
v_\mathrm{neste} \approx v + \Delta v = v + a \cdot \Delta t
$$

Tilsvarende kan vi bruke at gjennomsnittsfarten i et tidsintervall $\Delta t$ er gitt ved:

$$
\bar{v} = \frac{\Delta s}{\Delta t} 
$$

Og dersom $\Delta t$ er tilstrekkelig lite, så kan vi anse farten som tilnærmet konstant lik $v$ i hele intervallet, og da får vi at posisjonsendringen $\Delta s$ er omtrent:

$$
\Delta s \approx v \cdot \Delta t
$$

Hvis posisjonen på starten av intervallet er $s$, så vil posisjonen på slutten av intervallet være omtrent lik:

$$
s_\mathrm{neste} \approx s + \Delta s = s + v \cdot \Delta t
$$


:::::::::::::::{summary} Eulers metode i ett tidssteg
Gitt at ved et tidspunkt $t$, så er akselerasjonen $a$, farten $v$ og posisjonen $s$, så vil farten og posisjonen etter et tidsintervall $\Delta t$ være omtrent:

$$
\begin{align*}
v_\mathrm{neste} &= v + a \cdot \Delta t \\
\\
s_\mathrm{neste} &= s + v \cdot \Delta t
\end{align*}
$$
:::::::::::::::



---


:::::::::::::::{example} Eksempel 1
For en gjenstand ved tiden $t = 0$ er
* akselerasjonen $a = 2 \,\mathrm{m/s^2}$
* farten $v = 3 \,\mathrm{m/s}$
* posisjonen $s = 0 \,\mathrm{m}$


Finn omtrent hva farten og posisjonen er etter et tidsintervall $\Delta t = 0.1 \, \mathrm{s}$.


::::{solution}
---
open:
---
Farten etter tidsintervallet er omtrent:

$$
v_\mathrm{neste} \approx v + a \cdot \Delta t = 3 + 2 \cdot 0.1 = 3.2 \,\mathrm{m/s}
$$

Posisjonen etter tidsintervallet er omtrent:

$$
s_\mathrm{neste} \approx s + v \cdot \Delta t = 0 + 3 \cdot 0.1 = 0.3 \,\mathrm{m}
$$

::::
:::::::::::::::


---


## Simulering av bevegelse over tid
Når vi simulerer bevegelse på måten vi illustrerte i eksempel 1, så ønsker vi gjerne å gjenta denne prosedyren mange ganger for å få en tilnærmet beskrivelse av bevegelsen over tid. Altså at vi får hva farten er, og hva posisjonen er, over en lengre tidsperiode. Da liker vi gjerne å numerere størrelsene med en **indeks** $i$ som viser hvilket **tidssteg** de tilhører. Størrelsen på intervallet $\Delta t$ kaller vi for **steglengden**.

Vi lar $i = 0$ være startindeksen som forteller oss hvor vi starter bevegelsen. Da er $v_0$ startfart, $s_0$ startposisjon og $t_0$ starttidspunktet. 

Vi tar et eksempel for å gjøre det konkret:


:::::::::::::::{example} Eksempel 2
En gjenstand beveger seg med konstant akselerasjon $a = 2 \,\mathrm{m/s^2}$. Gjenstanden starter i ro slik at startfarten er $v_0 = 0 \,\mathrm{m/s}$ og startposisjonen er $s_0 = 0 \,\mathrm{m}$. 

Finn farten og posisjonen over $t = 1 \, \mathrm{s}$ ved å bruke en steglengde på $\Delta t = 0.5 \, \mathrm{s}$ ved å bruke Eulers metode.


::::{solution}
---
open:
---
Vi har at 

$$
t_0 = 0 \,\mathrm{s}, \quad v_0 = 0 \,\mathrm{m/s}, \quad s_0 = 0 \,\mathrm{m}
$$

Ved neste tidssteg har vi at:


$$
\begin{align*}
t_1 &= t_0 + \Delta t = 0 + 0.5 \, \mathrm{s} = 0.5 \, \mathrm{s} \\
\\
v_1 &= v_0 + a \cdot \Delta t = 0 + 2 \, \mathrm{m/s^2} \cdot 0.5 \, \mathrm{s} = 1 \,\mathrm{m/s} \\
\\
s_1 &= s_0 + v_0 \cdot \Delta t = 0 + 0 \cdot 0.5 \, \mathrm{s} = 0 \,\mathrm{m}
\end{align*}
$$

Ved neste tidssteg får vi:

$$
\begin{align*}
t_2 &= t_1 + \Delta t = 0.5 + 0.5 \, \mathrm{s} = 1 \, \mathrm{s} \\
\\
v_2 &= v_1 + a \cdot \Delta t = 1 + 2 \, \mathrm{m/s^2} \cdot 0.5 \, \mathrm{s} = 2 \,\mathrm{m/s} \\
\\
s_2 &= s_1 + v_1 \cdot \Delta t = 0 + 1 \cdot 0.5 \, \mathrm{s} = 0.5 \,\mathrm{m}
\end{align*}
$$


Altså er farten $v_2 = 2 \,\mathrm{m/s}$ og posisjonen $s_2 = 0.5 \,\mathrm{m}$ etter $t = 1 \, \mathrm{s}$ når vi bruker en steglengde $\Delta t = 0.5 \, \mathrm{s}$.

::::


:::::::::::::::



---


Med notasjonen vi brukte i Eksempel 2 ovenfor, kan vi uttrykke Eulers metode mer presist:



:::::::::::::::{summary} Eulers metode
Gitt at bevegelsen til en gjenstand starter på et tidspunkt $t_0$ med en startfart $v_0$ og en startposisjon $s_0$, så kan vi simulere bevegelsen over tid med en steglengde $\Delta t$ som følger:

$$
\begin{align*}
t_{i + 1} &= t_i + \Delta t \\
\\
v_{i + 1} &= v_i + a_i \cdot \Delta t \\
\\
s_{i + 1} &= s_i + v_i \cdot \Delta t
\end{align*}
$$

for $i = 0, 1, 2, \dots, N-1$, der $N$ er antall tidssteg vi ønsker å simulere.

:::::::::::::::


---


Eulers metode har imidlertid et problem: Når vi simulerer bevegelsen til fysiske systemer der energien til systemet alltid er lik – det vil si den er **bevart**, så vil Eulers metode gradvis føre til at energi enten øker eller synker over tid. Skal vi simulere fysikken riktig, må vi derfor ha en litt modifisert metode som passer på at energien bevares. Denne metoden kalles for **Euler-Cromers** metode. Den **store** forskjellen, er at vi bruker farten $v_{i + 1}$ i *neste* tidssteg til å beregne den nye posisjonen, fremfor å bruke farten $v_i$ fra *nåværende* tidssteg.


:::::::::::::::{summary} Euler-Cromers metode
Gitt at bevegelsen til en gjenstand starter på et tidspunkt $t_0$ med en startfart $v_0$ og en startposisjon $s_0$, så kan vi simulere bevegelsen over tid med en steglengde $\Delta t$ som følger:

$$
\begin{align*}
t_{i + 1} &= t_i + \Delta t \\
\\
v_{i + 1} &= v_i + a_i \cdot \Delta t \\
\\
s_{i + 1} &= s_i + v_{i + 1} \cdot \Delta t
\end{align*}
$$

for $i = 0, 1, 2, \dots, N-1$, der $N$ er antall tidssteg vi ønsker å simulere.

:::::::::::::::


---


:::::::::::::::{example} Eksempel 3 
En gjenstand beveger seg med konstant akselerasjon $a = 2 \,\mathrm{m/s^2}$. Gjenstanden starter i ro slik at startfarten er $v_0 = 0 \,\mathrm{m/s}$ og startposisjonen er $s_0 = 0 \,\mathrm{m}$. 

Finn farten og posisjonen over $t = 1 \, \mathrm{s}$ ved å bruke en steglengde på $\Delta t = 0.5 \, \mathrm{s}$ med Euler-Cromers metode.


::::{solution}
---
open:
---
Vi har at 

$$
t_0 = 0 \,\mathrm{s}, \quad v_0 = 0 \,\mathrm{m/s}, \quad s_0 = 0 \,\mathrm{m}, \quad a = 2 \,\mathrm{m/s^2}, \quad \Delta t = 0.5 \,\mathrm{s}
$$

Ved tidssteg $i = 1$ har vi at:

$$
\begin{align*}
t_1 &= t_0 + \Delta t = 0 \, \mathrm{s} + 0.5 \, \mathrm{s} = 0.5 \,\mathrm{s} \\
\\
v_1 &= v_0 + a \cdot \Delta t = 0 \,\mathrm{m/s} + 2 \,\mathrm{m/s^2} \cdot 0.5 \,\mathrm{s} = 1 \,\mathrm{m/s} \\
\\
s_1 &= s_0 + v_1 \cdot \Delta t = 0 \,\mathrm{m} + 1 \,\mathrm{m/s} \cdot 0.5 \,\mathrm{s} = 0.5 \,\mathrm{m}
\end{align*}
$$


Ved tidssteg $i = 2$ har vi at:

$$
\begin{align*}
t_2 &= t_1 + \Delta t = 0.5 \, \mathrm{s} + 0.5 \, \mathrm{s} = 1 \,\mathrm{s} \\
\\
v_2 &= v_1 + a \cdot \Delta t = 1 \,\mathrm{m/s} + 2 \,\mathrm{m/s^2} \cdot 0.5 \,\mathrm{s} = 2 \,\mathrm{m/s} \\
\\
s_2 &= s_1 + v_2 \cdot \Delta t = 0.5 \,\mathrm{m} + 2 \,\mathrm{m/s} \cdot 0.5 \,\mathrm{s} = 1.5 \,\mathrm{m}
\end{align*}
$$




::::


:::::::::::::::



---


## Programmering av bevegelse
I praksis er det en treg og tidkrevende prosess å beregne bevegelsen for hvert tidssteg for hånd. Programmering lar derimot gjøre dette raskt og med høy presisjon fordi vi kan velge steglengden $\Delta t$ til å være svært liten slik at det er rimelig å anta at akaselerasjonen er konstant i hvert tidssteg. 


:::::::::::::::{example} Eksempel 4
En gjenstand beveger seg med en konstant akselerasjon $a = 2.0 \, \mathrm{m/s^2}$. Gjenstanden starter i ro.

Lag et program som finner farten og posisjonen etter $t = 1 \, \mathrm{s}$.


::::{solution}
---
open:
---
Programmet vårt må først definere variabler for tid, akselerasjon, fart og posisjon. Disse skal i første omgang settes lik startverdiene:

:::{code-block} python
t = 0       # starttid i s
a = 2.0     # akselerasjon i m/s^2
v = 0       # startfart i m/s
s = 0       # startposisjon i m
:::


Deretter må vi definere en steglengde $\Delta t$. Jo mindre steglengde vi bruker, desto mer nøyaktig blir simuleringen (opp til et visst punkt!). Men jo mindre den er, jo lenger tid vil det ta å kjøre programmet. Her velger vi en steglengde som rimelig liten, men som ikke gir alt for lang kjøretid:


:::{code-block} python
dt = 1e-3   # steglegnde i s. 1e-3 = 10**(-3) = 0.001 
:::

Så kan vi bruke en `while`{l=python}-løkke til å oppdatere tid, fart og posisjon for hvert tidssteg fram til vi får ønsket sluttid. Dette kan vi gjøre slik:

:::{code-block} python
t_slutt = 1.0   # ønsket sluttid i s

while t < t_slutt:
    t = t + dt          # Oppdaterer tiden
    v = v + a * dt      # Oppdaterer farten
    s = s + v * dt      # Oppdaterer posisjonen

:::


Til slutt kan skrive ut farten og posisjon med `print`-funksjonen:

:::{code-block} python
print(f"{v = } m/s")
print(f"{s = } m")
:::


Setter vi hele programmet sammen, får vi da koden nedenfor. Kjør programmet for å se utskriften! 

:::{interactive-code}
t = 0       # starttid i s
a = 2.0     # akselerasjon i m/s^2
v = 0       # startfart i m/s
s = 0       # startposisjon i m

dt = 1e-3   # steglegnde i s. 1e-3 = 10**(-3) = 0.001 

t_slutt = 1.0   # ønsket sluttid i s

while t < t_slutt:
    t = t + dt          # Oppdaterer tiden
    v = v + a * dt      # Oppdaterer farten
    s = s + v * dt      # Oppdaterer posisjonen

print(f"{v = } m/s")
print(f"{s = } m")
:::



::::
:::::::::::::::
