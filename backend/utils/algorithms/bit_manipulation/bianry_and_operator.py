def binary_and(a: int, b: int) -> str:
    if a < 0 or b < 0:
        raise ValueError("숫자중에 음수가 있습니다.")
    a_binary = format(a, "b")
    b_binary = format(b, "b")

    max_len = max(len(a_binary), len(b_binary))

    return "0b" + "".join (
        str(int(char_a == "1" and char_b == "1"))
        for char_a, char_b in zip(a_binary.zfill(max_len), b_binary.zfill(max_len))
    )


if __name__ == "__main__":
    st = 'abcd'
    print(st[2:])
    binary_and(10, 15)