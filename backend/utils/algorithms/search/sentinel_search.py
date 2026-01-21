def sentinel_search(sequence, target):

    sequence.append(target)
    index = 0
    while sequence[index] != target:
        index += 1

    sequence.pop()

    if index == len(sequence):
        return None

    return index


if __name__ == "__main__":
    arr = [1, 2, 3]
    target = 4
    res = sentinel_search(arr, target)
    print(res)