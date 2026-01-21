from typing import Optional
from node import Node

def validate(root: Optional[Node], min_node:Optional[Node], max_node: Optional[Node]) -> bool:

    if root is None:
        return True


    if min_node is not None and root.data < min_node.data:
        return False
    if max_node is not None and max_node.data < root.data:
        return False


    return validate(root.left, min_node, max_node) and validate(root.right, min_node, max_node)
