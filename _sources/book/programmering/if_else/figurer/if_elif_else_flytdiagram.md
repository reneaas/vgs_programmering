```{mermaid}
flowchart TD
    A[Er betingelse 1 sann?] -->|Ja| B[Utfør handling 1]
    A -->|Nei| C[Er betingelse 2 sann?] -->|Ja| D[Utfør handling 2]
    C -->|Nei| E[Utfør handling 3]
```