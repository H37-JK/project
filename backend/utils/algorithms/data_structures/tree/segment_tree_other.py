from collections.abc import Sequence
from queue import Queue


class SegmentTreeNode:
    def __init__(self, start, end, val, left = None, right = None):
        self.start = start
        self.end = end
        self.val = val
        self.mid = (start + end) // 2
        self.left = left
        self.right = right

    def __repr__(self):
        return f"SegmentTreeNode(start={self.start}, end={self.end}, val={self.val})"

class SegmentTree:
    def __init__(self, collection: Sequence, function):
        self.collection = collection
        self.fn = function
        if self.collection:
            self.root = self._build_tree(0, len(collection) - 1)

    def update(self, i, val):
        self._update_tree(self.root, i , val)

    def query_range(self, i , j):
        return self._query_range(self.root, i, j)

    def _build_tree(self, start, end):
        if start == end:
            return SegmentTreeNode(start, end, self.collection[start])
        mid = (start + end) // 2
        left = self._build_tree(start, mid)
        right = self._build_tree(mid + 1, end)
        return SegmentTreeNode(start, end, self.fn(left.val, right.val), left, right)

    def _update_tree(self, node, i, val):
        if node.start == i and node.end == i:
            node.val = val
            return
        if i <= node.mid:
            self._update_tree(node.left, i, val)
        else:
            self._update_tree(node.right, i, val)
        node.val = self.fn(node.left.val, node.right.val)

