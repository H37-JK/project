from copy import deepcopy

class FenwickTree:

    def __init__(self, arr: list[int] | None = None, size: int | None = None) -> None:
        if arr is None and size is not None:
            self.size = size
            self.tree = [0] * size
        elif arr is not None:
            self.init(arr)
        else:
            raise ValueError("Either")

    def init(self, arr: list[int]) -> None:
        self.size = len(arr)
        self.tree = deepcopy(arr)
        for i in range(1, self.size):
            j = self.next_(i)
            print(j)
            if j < self.size:
                self.tree[j] += self.tree[i]
        print(self.tree)

    def get_array(self) -> list[int]:
        arr = self.tree[:]
        for i in range(self.size - 1, 0, -1):
            j = self.next_(i)
            if j < self.size:
                arr[j] -= arr[i]
        return arr

    @staticmethod
    def next_(index: int) -> int:
        return index + (index & (-index))




if __name__ == "__main__":

    arr = [1, 2, 3, 4, 5, 6,7,8,9]
    fen = FenwickTree(arr)
    print(fen.get_array())
