def product_sum(arr: list[int | list], depth: int) -> int:
    total_sum = 0
    for ele in arr:
        res = product_sum(ele, depth + 1) if isinstance(ele, list) else ele
        print(res)
        total_sum += res
    return total_sum * depth

if __name__ == "__main__":
    arr = [-1, 2, [-3, 4]]
    depth = 2
    res = product_sum(arr, depth)
    print(res)
