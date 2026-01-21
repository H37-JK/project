
answer = []

def get_point_key(len_board: int, len_board_column: int, row: int, column: int) -> int:
    return len_board * len_board_column * row + column

def exist_word (
    board: list[list[str]],
    word: str,
    row: int,
    column: int,
    word_index: int,
    visited_points_set: set[int]
) -> bool:

    traverse_directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
    len_board = len(board)
    len_board_column = len(board[0])

    if not (0 <= row < len_board and 0 <= column < len_board_column):
        return False


    if board[row][column] != word[word_index]:
        return False

    if word_index + 1 == len(word):
        return True

    for directions in traverse_directions:
        next_row = directions[0] + row
        next_column = directions[1] + column

        key = get_point_key(len_board, len_board_column, row, column)
        if key not in visited_points_set:
          visited_points_set.add(key)
          answer.append((next_row, next_column))
          if exist_word(board, word, next_row, next_column, word_index + 1, visited_points_set):
              return True
          answer.pop()
        visited_points_set.remove(key)

    return False


def word_list(board: list[list[str]], word: str) -> bool:

    len_board = len(board)
    len_board_column = len(board[0])

    for i in range(len_board):
        for j in range(len_board_column):
          answer.append((i, j))
          if exist_word(board, word, i, j , 0, {get_point_key(len_board, len_board_column, i, j)}):
              return True
          answer.pop()

    return False

if __name__ == "__main__":
    board = [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]]
    word = "ABCCED"



    word_list(board, word)
    print(answer)