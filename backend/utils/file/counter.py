


class Counter:
    def __init__(self, text: str):
        self.text = text
        self.counter_lower = 0
        self.counter_upper = 0
        self.count()

    def count(self) -> tuple[int, int]:
        for char in self.text:
            if char.lower():
                self.counter_lower += 1
            elif char.upper():
                self.counter_upper += 1

        return self.counter_lower, self.counter_upper

    def get_total_lower(self) -> int:
        return self.counter_lower

    def get_total_upper(self) -> int:
        return self.counter_upper

    def get_total(self) -> int:
        return self.counter_lower + self.counter_upper