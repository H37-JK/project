
def factorial (n: int):
    return 1 if (n == 1 or n == 0) else n * factorial(n - 1)


if __name__ == "__main__":
    res = factorial(5)
    print(res)
