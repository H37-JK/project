
def binary_to_decimal(bin_string: str) -> int:
    is_negative = bin_string[0] == "-"
    decimal_number = 0
    for char in bin_string:
        decimal_number = 2 * decimal_number + int(char)
    return -decimal_number if is_negative else decimal_number