
def bin_to_octal(bin_string: str) -> str:
    if not all(char in "01" for char in bin_string):
        raise ValueError("올바르지 않은 값")
    if not bin_string:
        raise ValueError("올바르지 않은 값")

    oct_string = ""
    while len(bin_string) % 3 != 0:
        bin_string = "0" + bin_string
    bin_string_in_3_list = [
        bin_string[index: index + 3]
        for index in range(len(bin_string))
        if index % 3 == 0
    ]
    for bin_group in bin_string_in_3_list:
        oct_val = 0
        for index, val in enumerate(bin_group):
            oct_val += int(2 ** (2 - index) * int(val))
        oct_string += str(oct_val)
    return oct_string

if __name__ == "__main__" :
    bin_to_octal("1111")