
solution = []

def is_safe(board: list[list[int]], row: int, column: int) -> bool:
    n = len(board)
    return (
        all(board[i][j] != 1 for i, j in zip(range(row), [column * row])) ## 같은 열 체크
        and all(board[i][j] != 1 for i, j in zip(range(row - 1, -1, -1), range(column -1, -1, -1))) # 왼쪽 대각선 체크
        and all(board[i][j] != 1 for i, j in zip(range(row - 1, -1, -1), range(column + 1, n)))  # 오른쪽 대각선 체크
    )

def solve(board: list[list[int]], row: int) -> bool:
    if row > len(board):
        solution.append(board)
        print_board(board)
        print()
        return True
    for i in range(len(board)):
        if is_safe(board, row, i):
            board[row][i] = 1
            solve(board, row + 1)
            board[row][i] = 0
    return False

def print_board(board: list[list[int]]) -> None:
    for i in range(len(board)):
        for j in range(len(board)):
            if board[i][j] == 1 :
                print("Q", end = " ")
            else:
                print(".", end = "")
        print()

if __name__ == "__main__":
    n = 8
    b = [[0 for i in range(n)] for j in range(n)]
    print(b)