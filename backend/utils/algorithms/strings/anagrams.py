import collections

def signature(word: str) -> str:

    frequencies = collections.Counter(word)
    return "".join(
        f"{char}{frequency}" for char, frequency in sorted(frequencies.items())
    )


