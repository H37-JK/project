Matrix = list[list[int]]

# assigning initial values to the grid
initial_grid: Matrix = [
    [3, 0, 6, 5, 0, 8, 4, 0, 0],
    [5, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 8, 7, 0, 0, 0, 0, 3, 1],
    [0, 0, 3, 0, 1, 0, 0, 8, 0],
    [9, 0, 0, 8, 6, 3, 0, 0, 5],
    [0, 5, 0, 0, 9, 0, 6, 0, 0],
    [1, 3, 0, 0, 0, 0, 2, 5, 0],
    [0, 0, 0, 0, 0, 0, 0, 7, 4],
    [0, 0, 5, 2, 0, 6, 3, 0, 0],
]

def is_safe(grid: Matrix, row: int, col: int, n: int) -> bool:

    for i in range(9):
      if n in {grid[row][i], grid[i][col]}:
          return False

    for i in range(3):
        for j in range(3):
            if grid[(row - row % 3) + i][(col - col % 3) + j] == n:
                return False


    return False


if __name__ == "__main__":
    print('test')