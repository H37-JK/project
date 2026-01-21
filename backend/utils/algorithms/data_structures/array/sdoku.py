
def cross(items_a, items_b):
    return [a + b for a in items_a for b in items_b]


def grid_values(grid):
    chars = [c for c in grid if c in digits or c in "0."]
    assert len(chars) == 81
    return dict(zip(squares, chars))


digits = "123456789"
rows = "ABCDEFGHI"
cols = digits
squares = cross(rows, cols)
unitlist = (
      [cross(rows, c) for c in cols]
    + [cross(r, cols) for r in rows]
    + [cross(rs, cs) for rs in ("ABC", "DEF", "GHI") for cs in ("123", "456", "789")]
)
units = {s: [u for u in unitlist if s in u] for s in squares}
peers = {s: {x for u in units[s] for x in u} - {s} for s in squares}

if __name__ == "__main__":
    print(squares)
    values = dict.fromkeys(squares, digits)
    print(values)
