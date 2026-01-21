def comp_and_swap(array: list[int], index1: int, index2: int, direction: int) -> None:

    if (direction == 1 and array[index1] > array[index2]) or (
        direction == 0 and array[index1] < array[index2]
    ):
        array[index1], array[index2] = array[index2], array[index1]

def bitonic_merge(array: list[int], low: int, length: int, direction: int) -> None:

    if length > 1:
        middle = int(length / 2)
        for i in range(low, low + middle):
            comp_and_swap(array, i , i + middle, direction)
        bitonic_merge(array, low, middle, direction)
        bitonic_merge(array, low + middle, middle, direction)

def bitonic_sort(array: list[int], low: int, length: int, direction: int) -> None:

    if length > 1:
        middle = int(length / 2)
        bitonic_sort(array, low, middle, 1)
        bitonic_sort(array, low + middle, middle, 0)
        bitonic_merge(array, low, length, direction)


if __name__ == "__main__":
    arr = [3, 2, 1]
    bitonic_sort(arr, 0, 3, 1)
    print(arr)