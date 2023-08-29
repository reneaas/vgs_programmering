


k_values = [i for i in range(1, 11)]
for k in k_values:
    s = sum([k**i for i in range(10)])
    print(f"{k = } ; {s = }")


d_values = [i for i in range(100)]
for d in d_values:
    s = sum([1 + i * d for i in range(10)])
    print(f"{d = } ; {s = }")

d = 22
envelopes = [1 + i * d for i in range(10)]
print(f"{envelopes = }")