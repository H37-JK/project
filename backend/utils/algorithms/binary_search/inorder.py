from typing import Optional

from node import Node


def inorder(root: Optional[Node]) -> None:

    if root is None:
        return

    inorder(root.left)

    print(root)

    inorder(root.right)

