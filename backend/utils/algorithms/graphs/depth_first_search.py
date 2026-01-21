
def dfs(graph: dict, vert: int, visited: list) -> list:
    visited[vert] = True
    connected_verts = []

    for neighbour in graph[vert]:
        if not visited[neighbour]:
            connected_verts += dfs(graph, neighbour, visited)

    return [vert, *connected_verts]

def depth_first_search(graph: dict, start: str) -> set[str]:
    explored, stack = set(start), [start]

    while stack:
        v = stack.pop()
        explored.add(v)

        for adj in reversed(graph[v]):
            if adj not in explored:
                stack.append(adj)
    return explored