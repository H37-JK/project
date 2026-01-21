from typing import Optional, List
from node import Node

def print_node(root: Optional[Node], path: List[int]) -> None:

    if root is None:
        return

    path.append(root.data)
    if root.left is None and root.right is None:
        print(path)

    else:
        print_node(root.left, path)
        print_node(root.right, path)
    path.pop()
