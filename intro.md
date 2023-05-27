# Programmering i Videregående Skole

Velkommen!

Her finner du programmeringsteori og oppgaver som er relevant for å mestre programmering i videregående skole i matte- og fysikkfagene.

```{note}
Siden er under utvikling og er i startfasen.
```

{% include trinket-open type='python' %}
import turtle

tina = turtle.Turtle()

for c in ['red', 'green', 'yellow', 'blue']:
    tina.color(c)
    tina.forward(75)
    tina.left(90)

tina.penup()
tina.backward(100)
tina.write("Hello world!")
{% include trinket-close %}
