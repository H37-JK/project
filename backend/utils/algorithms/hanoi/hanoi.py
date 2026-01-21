
def hanoi(n, source, destination, auxiliary):
    if n == 1:
        print("Move disk ", n, " from source ", source, " to destination ", destination)
        return

    hanoi(n - 1, source, auxiliary, destination)
    print("Move disk ", n, " from source ", source, " to destination ", destination)
    hanoi(n - 1, auxiliary, destination, source)


hanoi(3, "A", "B", 'C')