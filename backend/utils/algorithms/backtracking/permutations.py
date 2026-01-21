
def permutations(sequence: list[int | str]) -> None:
    create_state_permutations(sequence, [], 0 , [0 for i in range(len(sequence))])


def create_state_permutations (
    sequence: list[int | str],
    current_sequence: list[int | str],
    index: int,
    index_used: list[int]
) -> None:
    if index == len(sequence):
        return

    for i in range(len(sequence)):
        if not index_used[i]:
            current_sequence.append(sequence[i])
            index_used[i] = True
            print(current_sequence)
            create_state_permutations(sequence, current_sequence, index + 1, index_used)
            current_sequence.pop()
            index_used[i] = False


permutations([1,2,3])