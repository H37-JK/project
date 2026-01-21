def combinations(n: int, k: int) -> list[list[int]]:
    if k < 0:
        raise ValueError("k 가 0보다 작습니다.")
    if n < 0:
        raise ValueError("n 이 0보다 작습니다.")
    result: list[list[int]] = []
    create_all_state(1, n, k, [], result)
    return result


def create_all_state(
        increment: int,
        total_number: int,
        level: int,
        current_list: list[int],
        total_list: list[list[int]],
) -> None:
    if level == 0:
        total_list.append(current_list[:])
        return

    for i in range(increment, total_number - level + 2):
        current_list.append(i)
        create_all_state(increment + 1, total_number, level - 1, current_list, total_list)
        current_list.pop()


if __name__ == "__main__":
    ls: list[int] = [1, 2]

    print(ls, ls[:])
