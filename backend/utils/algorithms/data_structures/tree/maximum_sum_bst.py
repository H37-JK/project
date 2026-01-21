from __future__ import annotations

import sys
from dataclasses import dataclass

INT_MIN = -sys.maxsize + 1
INT_MAX = sys.maxsize - 1

@dataclass
class TreeNode:
    val: int = 0
    left: TreeNode | None = None
    right: TreeNode | None = None

def max_sum_bst(root: TreeNode | None) -> int:
    ans: int = 0

    def solver(node: TreeNode | None) -> tuple[bool, int, int, int]:
        nonlocal ans

        if not node:
            return True, INT_MAX, INT_MIN, 0

        is_left_valid, min_left, max_left, sum_left = solver(node.left)
        is_right_valid, min_right, max_right, sum_right = solver(node.right)

        if is_left_valid and is_right_valid and max_left < node.val < min_right:
            total_sum = sum_left + sum_right + node.val
            print(total_sum)
            ans = max(ans, total_sum)
            return True, min(min_left, node.val), max(max_right, node.val), total_sum

        return False, -1, -1, -1
    solver(root)
    return ans


if __name__ == "__main__":
   t1 = TreeNode(4)
   t1.left = TreeNode(3)
   t1.left.left = TreeNode(1)
   t1.left.right = TreeNode(2)

   max_sum_bst(t1)