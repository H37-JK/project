from __future__ import annotations

from random import choice

def random_pivot(lst):
    return choice(lst)

def kth_number(lst: list[int], k:int) -> int:
    pivot = random_pivot(lst)

    small = [e for e in lst if e < pivot]
    big = [e for e in lst if e > pivot]

    if len(small) == k - 1:
        return pivot
    elif len(small) < k - 1:
        return kth_number(big, k - len(small) - 1)
    else:
        return kth_number(small, k)