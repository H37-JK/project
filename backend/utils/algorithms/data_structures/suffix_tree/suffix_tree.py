from __future__ import annotations

class SuffixTreeNode:
    def __init__(
        self,
        children: dict[str, SuffixTreeNode] | None = None,
        is_end_of_string: bool = False,
        start: int | None = None,
        end: int | None = None,
        suffix_link: SuffixTreeNode | None = None,
    ) -> None:
        self.children = children or {}
        self.is_end_of_string = is_end_of_string
        self.start = start
        self.end = end
        self.suffix_link = suffix_link

class SuffixTree:
    def __init__(self, text: str) -> None:
        self.text: str = text
        self.root: SuffixTreeNode = SuffixTreeNode()
        self.build_suffix_tree()

    def build_suffix_tree(self):
        text = self.text
        n = len(text)
        for i in range(n):
            suffix = text[i:]
            self._add_suffix(suffix, i)

    def _add_suffix(self, suffix: str, index: int) -> None:
        node = self.root
        for char in suffix:
            if char not in node.children:
                node.children[char] = SuffixTreeNode()
            node = node.children[char]
        node.is_end_of_string = True
        node.start = index
        node.end = index + len(suffix) - 1

    def search(self, pattern: str) -> bool:
        node = self.root
        for char in pattern:
            if char not in node.children:
                return False
            node = node.children[char]
        return True

    def print(self):
        node = self.root
        for index, value in node.children.items():
            print(index, value.start, value.end)

if __name__ == "__main__":
    text = "monkey banana"
    suffix_tree = SuffixTree(text)
    suffix_tree.print()

    patterns = ["ana", "ban", "na", "xyz", "mon"]
    for pattern in patterns:
       found = suffix_tree.search(pattern)
       print(f"Pattern '{pattern}' found: {found}")
