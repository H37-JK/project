
def match_word_pattern(pattern: str, input_string: str) -> bool:

    def backtrack(pattern_index: int, str_index: int) -> bool:
        if pattern_index == len(pattern) and str_index == len(input_string):
            return True
        if pattern_index == len(pattern) or str_index == len(input_string):
            return False

        char = pattern[pattern_index]

        # 이미 나왔던 패턴 있으면 문자열 체크
        if char in pattern_map:
            mapped_str = pattern_map[char]
            if input_string.startswith(mapped_str, str_index):
                return backtrack(pattern_index + 1, str_index + len(mapped_str))
            else:
                return False
            
        for end in range(str_index, len(input_string) + 1):
            substr = input_string[str_index:end]
            if substr in str_map:
                continue
            pattern_map[char] = substr
            str_map[substr] = char
            if backtrack(pattern_index + 1, end):
                return True
            print(pattern_map, str_map)
            del pattern_map[char]
            del str_map[substr]
        return False


    pattern_map: dict[str, str] = {}
    str_map: dict[str, str] = {}

    return backtrack(0 , 0)

if __name__ == "__main__":
    res = match_word_pattern("aa", "cd")
    print(res)