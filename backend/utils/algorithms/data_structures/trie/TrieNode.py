
class TrieNode:
    def __init__(self) -> None:
        self.nodes: dict[str, TrieNode] = {}
        self.is_leaf = False

    def insert_many(self, words: list[str]) -> None:
        for word in words:
            self.insert(word)

    def insert(self, word: str) -> None:
        curr = self
        for char in word:
            if char not in curr.nodes:
                curr.nodes[char] = TrieNode()
            curr = curr.nodes[char]
        curr.is_leaf = True

    def find(self, word: str) -> bool:
        curr = self
        for char in word:
            if char not in curr.nodes:
                return False
            curr = curr.nodes[char]
        return curr.is_leaf

    def delete(self, word: str) -> None:

        def _delete(curr: TrieNode, word: str, index: int) -> bool:
            if index == len(word):
                if not curr.is_leaf:
                    return False
                curr.is_leaf = False
                return len(curr.nodes) == 0
            char = word[index]
            char_node = curr.nodes.get(char)

            if not char_node:
                return False
            delete_curr = _delete(char_node, word, index + 1)
            if delete_curr:
                del curr.nodes[char]
                return len(curr.nodes) == 0
            return delete_curr

        _delete(self, word, 0)

def print_words(node: TrieNode, word: str) -> None:

    if node.is_leaf:
        print(word, end = " ")

    for key, value in node.nodes.items():
        print_words(value, word + key)

if __name__ == "__main__":
    words = "test test1".split()
    root = TrieNode()
    root.insert_many(words)
    print_words(root, "")