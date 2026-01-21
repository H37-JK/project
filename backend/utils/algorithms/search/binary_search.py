def binary_search(
    sorted_collection: list[int], item: int, left: int, right: int = -1
) -> int:
    if right < 0:
        right = len(sorted_collection) - 1
    if list(sorted_collection) != sorted(sorted_collection):
        raise ValueError("Value Error")
    if right < left:
        return -1

    mid = left + (right - left) // 2

    if sorted_collection[mid] == item:
        return sorted_collection[mid]
    elif sorted_collection[mid] > item:
        return binary_search(sorted_collection, item, left, mid - 1)
    else:
        return binary_search(sorted_collection, item, mid + 1, right)


