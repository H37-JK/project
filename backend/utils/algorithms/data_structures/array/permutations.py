def permute_recursive(nums: list[int]) -> list[list[int]]:

    result: list[list[int]] = []
    if len(nums) == 0:
        return [[]]
    for _ in range(len(nums)):
        n = nums.pop(0)
        permutations = permute_recursive(nums.copy())
        for perm in permutations:
            perm.append(n)
        result.extend(permutations)
        nums.append(n)
        print(nums)
    return result


def permute_backtrack(nums: list[int]) -> list[list[int]]:
    def backtrack(start: int) -> None:
        if start == len(nums) - 1:
            output.append(nums[:])
        else:
            for i in range(start, len(nums)):
                nums[start], nums[i] = nums[i], nums[start]
                backtrack(start + 1)
                nums[start], nums[i] = nums[i], nums[start]
    output: list[list[int]] = []
    backtrack(0)
    return output



if __name__ == "__main__":
    permute_recursive([1,2,3])