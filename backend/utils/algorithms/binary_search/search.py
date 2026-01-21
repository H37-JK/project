from typing import Optional

from markdown_it.common.normalize_url import validateLink

from node import Node


def search(root: Optional[Node], val: int) -> bool:

    if root is None:
        return False

    if root.data == val:
        return True


    if root.data > val:
        return search(root.left, val)
    else:
        return search(root.right, val)
