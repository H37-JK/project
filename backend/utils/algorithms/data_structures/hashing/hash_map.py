from collections.abc import Iterator, MutableMapping
from dataclasses import dataclass
from typing import TypeVar

KEY = TypeVar("KEY")
VAL = TypeVar("VAL")

@dataclass(slots = True)
class _Item[KEY, VAL]:
    key: KEY
    val: VAL

class _DeletedItem(_Item):
    def __init__(self) -> None:
        super().__init__(None, None)
    def __bool__(self) -> bool:
        return False

_deleted = _DeletedItem()

class HashMap(MutableMapping[KEY, VAL]):
    def __init__(
        self, initial_block_size: int = 8, capacity_factor: float = 0.75
    ) -> None:
        self._initial_block_size = initial_block_size
        self._buckets: list[_Item | None] = [None] * initial_block_size
        assert 0.0 < capacity_factor < 1.0
        self._capacity_factor = capacity_factor
        self._len = 0

    def _get_bucket_index(self, key: KEY) -> int:
        return hash(key) % len(self._buckets)

    def _get_next_ind(self, ind: int) -> int:
        return (ind + 1) % len(self._buckets)

    def _try_set(self, ind: int, key: KEY, val: VAL) -> bool:
        stored = self._buckets[ind]
        if not stored:
            self._buckets[ind] = _Item(key, val)
            self._len += 1
            return True
        elif stored.key == key:
            stored.val = val
            return True
        else:
            return False

    def _is_full(self) -> bool:
        limit = len(self._buckets) * self._capacity_factor
        return len(self) >= int(limit)

    def _is_sparse(self) -> bool:
        if len(self._buckets) <= self._initial_block_size:
            return False
        limit = len(self._buckets) * self._capacity_factor / 2
        return len(self) < limit

    def _resize(self, new_size: int) -> None:
        old_buckets = self._buckets
        self._buckets = [None] * new_size
        self._len = 0
        for item in old_buckets:
            if item:
                self._add_item(item.key, item.val)

    def _size_up(self) -> None:
        self._resize(len(self._buckets) * 2)

    def _size_down(self) -> None:
        self._resize(len(self._buckets) // 2)

    def _iterate_buckets(self, key: KEY) -> Iterator[int]:
        ind = self._get_bucket_index(key)
        for _ in range(len(self._buckets)):
            yield ind
            ind = self._get_next_ind(ind)