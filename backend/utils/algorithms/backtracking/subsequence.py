from typing import Any

def subsequence(sequence: list[Any]) -> None:
    create_sequence(sequence, [] , 0)

def create_sequence (
    sequence: list[Any], current_subsequence: list[Any], index: int
) -> None:
    if index == len(sequence):
        print(current_subsequence)
        return

    create_sequence(sequence, current_subsequence, index + 1)
    current_subsequence.append(sequence[index])
    create_sequence(sequence, current_subsequence, index + 1)
    current_subsequence.pop()

subsequence([1,2])