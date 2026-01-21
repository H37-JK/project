from typing import Optional


class Node:
    def __init__(self, data: int) -> None:
        self.data: int = data
        self.left: Optional[Node] = None
        self.right: Optional[Node] = None