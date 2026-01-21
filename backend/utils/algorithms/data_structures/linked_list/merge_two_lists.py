from __future__ import annotations

from collections.abc import Iterable, Iterator
from dataclasses import dataclass


@dataclass
class Node:
    data: int
    next_node: Node | None

class SortedLinkedList:
    def __init__(self, ints: Iterable[int]) -> None:
        self.head: Node
        for i in sorted(ints, reverse = True):
            self.head = Node(i, self.head)

    def __iter__(self) -> Iterator :
        node = self.head
        while node:
            yield node.data
            node = node.next_node

    def __len__(self) -> int:
        return sum(1 for _ in self)

    def __str__(self) -> str:
        return " -> ".join([str(node) for node in self])