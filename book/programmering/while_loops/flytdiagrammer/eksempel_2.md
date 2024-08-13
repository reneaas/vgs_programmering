```{mermaid}
flowchart TD
    A[1. sett sum = 0] --> B
    B[2. sett heltall = 0] --> C
    C[3. er heltall <= 100?] -->|Ja| D[4. øk sum med heltall]
    D --> E[5. øk heltall med 1]
    E --> C
    C --->|Nei| F[6. skriv ut sum]
```