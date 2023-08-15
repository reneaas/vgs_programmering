import numpy as np
import sympy as sp

all_ranks = [
    "2", "3", "4", "5", "6", "7", "8", "9", "10",
    "J", "Q", "K", "A",
]

all_suits = [
    "hearts", "spades", "clubs", "diamonds",
]

full_deck = []
for rank in all_ranks:
    for suit in all_suits:
        full_deck.append(f"{rank} of {suit}")



deck = list(np.random.choice(full_deck, size=49, replace=False))

idx = np.random.randint(0, 49, size=1)[0]
selected_card = deck[idx]

number = np.random.randint(0, 49, size=1)

print(f"{selected_card = }")

# Perform card trick
# Positions in deck: N - 1 = i + 7j, for i = 0, 1, 2, 3, 4, 5, 6 and j = 0, 1, 2, 3, 4, 5, 6

j = (number - 1) // 7
i = (number - 1) % 7


sub_decks = [[] for _ in range(6)]
while len(deck) > 0:
    sub_decks[0].append(deck.pop())
    sub_decks[1].append(deck.pop())
    sub_decks[2].append(deck.pop())

for i, sub_deck in enumerate(sub_decks):
    if selected_card in sub_deck:
        sub_deck_index = i


# Place subdeck correctly by filling in the blanks
deck = []
sub_deck_with_card = sub_decks.pop(sub_deck_index)
for i, sub_deck in enumerate(sub_decks):
    deck.extend(sub_deck)

deck.insert(i, sub_deck_with_card)


sub_decks = [[] for _ in range(6)]
while len(deck) > 0:
    sub_decks[0].append(deck.pop())
    sub_decks[1].append(deck.pop())
    sub_decks[2].append(deck.pop())

for i, sub_deck in enumerate(sub_decks):
    if selected_card in sub_deck:
        sub_deck_index = i
    
deck = []
sub_deck_with_card = sub_decks.pop(sub_deck_index)
for i, sub_deck in enumerate(sub_decks):
    deck.extend(sub_deck)

deck.insert(i, sub_deck_with_card)

picked_card = deck[number - 1]
print(f"{picked_card = }")





