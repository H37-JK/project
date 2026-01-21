def run_maze(
    maze: list[list[int]],
    row: int,
    col: int,
    destination_row: int,
    destination_column: int,
    solution: list[list[int]],
) -> bool:
    if row == destination_row and col == destination_column and maze[row][col] == 0:
        solution[row][col] = 0
        return True

    size = len(maze)
    lower_flag = (not row < 0) and (not col < 0)
    upper_flag = (row < size) and (col < size)

    if lower_flag and upper_flag:
        block_flag = (solution[row][col]) and (not maze[row][col])
        if block_flag:
            solution[row][col] = 0
            if (
                run_maze(maze, row + 1, col, destination_row, destination_column, solution)
                or run_maze(maze, row - 1, col, destination_row, destination_column, solution)
                or run_maze(maze, row, col + 1, destination_row, destination_column, solution)
                or run_maze(maze, row, col - 1, destination_row, destination_column, solution)
            ):
                return True
            solution[row][col] = 1
            return False

    return False


def solve(
    maze: list[list[int]],
    source_row: int,
    source_column: int,
    destination_row: int,
    destination_column: int,
) -> list[list[int]]:
    size = len(maze)
    if not (0 <= source_row <= size and 0 <= source_column <= size) or (
        not (0 <= destination_row <= size and 0 <= destination_column <= size - 1)
    ):
        raise ValueError("시작지점이나, 목표지점이 잘못 되었습니다.")

    solution = [[1 for _ in range(size)] for _ in range(size)]
    answer = run_maze(
        maze, source_row, source_column, destination_row, destination_column, solution
    )
    if answer:
        return solution
    else:
        raise ValueError("해답이 존재하지 않습니다.")


if __name__ == "__main__":
    m = [[0, 0, 0],
         [0, 1, 0],
         [1, 0, 0]]

    res = solve(m, 0, 0, len(m) - 1, len(m) - 1)
    print(res)
