def average_absolute_deviation(nums: list[int]) -> float:

    if not nums:
        raise ValueError("List is Empty")

    average = sum(nums) / len(nums)
    return sum(abs(x - average) for x in nums) / len(nums)


