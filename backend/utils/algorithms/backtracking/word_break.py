
def backtrack(input_string: str, word_dict: set[str], start: int) -> bool:
    if start == len(input_string):
        return True

    for end in range(start + 1, len(input_string) + 1):
        if input_string[start:end] in word_dict and backtrack (
            input_string, word_dict, end
        ):
            return True
    return False

def word_break(input_string: str, word_dict: set[str]) -> bool:
    return backtrack(input_string, word_dict, 0)


if __name__ == "__main__":

    input_string = "catsanddog"
    word_dict = {"cats", "dog", "sand", "and", "cat"}

    word_break(input_string, word_dict)