from typing import Optional
from node import Node

def insert(root: Optional[Node], val: int) -> Node:

    if root is None:
        return Node(val)

    if val < root.data:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)

    return root