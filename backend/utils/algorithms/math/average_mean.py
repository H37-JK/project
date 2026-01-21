
def mean(nums: list) -> float:
    if not nums:
        raise ValueError("List is empty")
    return sum(nums) / len(nums)