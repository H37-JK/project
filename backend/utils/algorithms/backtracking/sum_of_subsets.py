def generate_sum_of_subsets(nums: list[int], max_sum: int) -> list[list[int]]:
    result: list[list[int]] = []
    path: list[int] = []
    num_index = 0
    remaining_nums_sum = sum(nums)
    create_state_space_tree(nums, max_sum, num_index, path, result, remaining_nums_sum)
    return result

def create_state_space_tree (
    nums: list[int],
    max_sum: int,
    num_index: int,
    path: list[int],
    result: list[list[int]],
    remaining_nums_sum: int
) -> None:

    if sum(path) > max_sum:
        return
    if max_sum == sum(path):
        result.append(path)
        return

    size = len(nums)

    for i in range(num_index, size):
        path.append(nums[i])
        create_state_space_tree(nums, max_sum, i + 1, path, result, remaining_nums_sum)
        path.pop()


if __name__ == "__main__":
    print(generate_sum_of_subsets([3, 4 ,5 ,2], 9))