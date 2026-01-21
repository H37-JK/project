def bead_sort(sequence: list) -> list:

    if any(not isinstance(x, int) or x < 0 for x in sequence):
        raise TypeError("Type Error")
    for _ in range(len(sequence)):
        for i, (rod_upper, rod_lower) in enumerate(zip(sequence, sequence[1:])):
            if rod_upper > rod_lower:
                print(rod_upper, rod_lower)
                sequence[i] -= rod_upper - rod_lower
                sequence[i + 1] += rod_upper - rod_lower

    return sequence


if __name__ == "__main__":
    arr = [3,1,2]
    bead_sort(arr)
    print(arr)