
def is_power_of_two(number: int) -> bool:
    return number > 0 and (number & (number - 1))

if __name__ == "__main__":
    res = -1 ^ 1
    print(bin(-1), bin(1), res)