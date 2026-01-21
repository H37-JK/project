from __future__ import annotations

from pprint import pformat
from typing import TypeVar

T = TypeVar("T")

class GraphAdjacencyList[T]:

    def __init__(self, directed: bool = True) -> None:
        self.adj_list: dict[T, list[T]] = {}
        self.directed = directed

    def add_edge (
        self, source_vertex: T, destination_vertex: T
    ) -> GraphAdjacencyList[T]:
        if not self.directed:
            if source_vertex in self.adj_list and destination_vertex in self.adj_list:
                self.adj_list[source_vertex].append(destination_vertex)
                self.adj_list[destination_vertex].append(source_vertex)

            elif source_vertex in self.adj_list:
                self.adj_list[source_vertex].append(destination_vertex)
                self.adj_list[destination_vertex] = [source_vertex]

            elif destination_vertex in self.adj_list:
                self.adj_list[destination_vertex].append(source_vertex)
                self.adj_list[source_vertex] = [destination_vertex]

            else:
                self.adj_list[source_vertex] = [destination_vertex]
                self.adj_list[destination_vertex] = [source_vertex]