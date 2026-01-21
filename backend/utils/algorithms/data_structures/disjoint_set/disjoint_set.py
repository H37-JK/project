
class Node:
    def __init__(self, data: int) -> None:
        self.data = data
        self.rank: int
        self.parent: Node

def make_set(x: Node) -> None:
    x.rank = 0
    x.parent = x

def find_set(x: Node) -> Node:
    if x != x.parent:
        x.parent = find_set(x.parent)
    return x

def union_set(x: Node, y: Node) -> None:
    x, y = find_set(x), find_set(y)

    if x == y:
        return
    elif x.rank > y.rank:
        y.parent = x
    else:
        x.parent = y
        if x.rank == y.rank:
            y.rank += 1

def find_python_set(node: Node) -> set:
    sets = ({0, 1, 2}, {3, 4, 5})
    for s in sets:
        if node.data in s:
            return s
    msg = f"{node.data} is not in {sets}"
    raise ValueError()

if __name__ == "__main__":
    vertex = [Node(i) for i in range(6)]
    for v in vertex:
        make_set(v)

    union_set(vertex[0], vertex[1])
    union_set(vertex[1], vertex[2])
    union_set(vertex[3], vertex[4])


    for v in vertex:
        print(v.data, v.parent.data, v.rank)