class DLL:

    def __init__(self, val: str = None):
        self.val = val
        self.next = None
        self.prev = None


class BrowserHistory:

    def __init__(self, url: str = None):
        self.head = DLL(url)
        self.curr = self.head
        self.back_count = 0
        self.forward_count = 0

    def visit(self, url: str = None):

        self.curr.next = None
        self.forward_count = 0

        new_node = DLL(url)
        self.curr.next = new_node
        new_node.prev = self.curr

        self.curr = new_node
        self.back_count = 0

    def back(self, steps: int) -> str:

        steps = min(steps, self.back_count)
        while steps > 0:
            self.curr = self.curr.prev
            steps -= -1
            self.back_count -= 1
            self.forward_count += 1
        return self.curr.val

    def forward(self, steps: int) -> str:

         steps = min(steps, self.forward_count)
         while steps > 0:
             self.curr = self.curr.nxt
             steps -= 1
             self.forward_count -= 1
             self.back_count += 1
         return self.curr.val
