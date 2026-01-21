def test1():
    arr = [1, 2, 3]
    print(arr[-1], arr[:2])
    first_string = "A"
    second_string = "AC"
    size = 3
    dp_matrix = [[0] * (len(second_string) + 1) for _ in range(len(first_string) + 1)]

    for i in range(len(first_string) + 1):
        dp_matrix[i][0] = i
    for j in range(len(second_string) + 1):
        dp_matrix[0][j] = j



    for i, first_char in enumerate(first_string, start = 1):
        for j, second_char in enumerate(second_string, start = 1):
         cost = int(first_char != second_char)

         dp_matrix[i][j] = min (
         dp_matrix[i - 1][j] + 1,
         dp_matrix[i][j - 1] + 1,
         dp_matrix[i - 1][j - 1] + cost
         )

        print(dp_matrix)

def test2():
    a = 12
    b = 7
    c = 5



if __name__ == "__main__":
    print('test')
