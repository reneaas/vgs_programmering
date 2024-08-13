```{mermaid}
flowchart TD
    A[Er varen 'mat'?] -->|Ja| B["$$\text{mva} = 15$$"]
    A -->|Nei| C[Er varen 'reise'?] -->|Ja| D["$$\text{mva} = 12$$"]
    C -->|Nei| E["$$\text{mva} = 25$$"]
    F[Skriv ut mva]

    B --> F
    D --> F
    E --> F
```