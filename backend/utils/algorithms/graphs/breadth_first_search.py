from queue import Queue

class Graph:
    def __init__(self) -> None:
        self.vertices: dict[int, list[int]] = {}

    def print_graph(self) -> None:
        for i in self.vertices:
            print(i, " : ", " -> ".join([str(j) for j in self.vertices[i]]))

    def add_edge(self, from_vertex: int, to_vertex: int) -> None:
        if from_vertex in self.vertices:
            self.vertices[from_vertex].append(to_vertex)
        else:
            self.vertices[from_vertex] = [to_vertex]

    def bfs(self, start_vertex: int) -> set[int]:
        visited = set()
        queue: Queue = Queue()

        visited.add(start_vertex)
        queue.put(start_vertex)

        while not queue.empty():
            vertex = queue.get()

            for adjacent_vertex in self.vertices[vertex]:
                if adjacent_vertex not in visited:
                    queue.put(adjacent_vertex)
                    visited.add(adjacent_vertex)
        return visited