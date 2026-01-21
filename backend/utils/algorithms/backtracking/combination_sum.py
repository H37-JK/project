def backtrack(
        candidates: list, path: list, answer: list, target: int, previous_index: int
) -> None:
    if target == 0:
        answer.append(path.copy())
    else:
        for index in range(previous_index, len(candidates)):
            if target >= candidates[index]:
                path.append(candidates[index])
                backtrack(candidates, path, answer, target - candidates[index],  index)
                path.pop(len(path) - 1)

def combination_sum(candidates: list, target: int) -> list:
    """
    :param candidates: [2,3,5]
    :param target: 8
    :return: 1
    """

    if not candidates:
        raise ValueError("candidates 값이 올바르지 않습니다.")
    if any(x < 0 for x in candidates):
        raise ValueError("음수는 존재 할 수 없습니다.")

    path: list[int] = []
    answer: list[int] = []
    backtrack(candidates, path, answer, target, 0)


    return answer


def main () -> None:
    print(combination_sum([5,3,2], 8))


if __name__ == "__main__":
    import doctest

    doctest.testmod()
    main()