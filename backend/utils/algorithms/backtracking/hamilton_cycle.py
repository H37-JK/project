
def valid_connection (
    graph: list[list[int]], next_vertex: int, current_index: int, path: list[int]
) -> bool:
    # 갈 수 있는지 여부
    if graph[path[current_index - 1]][next_vertex] == 0:
        return False

    # 해당 지점에 방문 했는지 여부
    return not any(next_vertex == vertex for vertex in path)


def util_hamilton_cycle(graph: list[list[int]], path: list[int], current_index: int) -> bool:

    # 마지막 지점에서 시작 지점으로 돌아 올 수 있으면 True
    if current_index == len(graph):
        return graph[path[current_index - 1]][path[0]] == 1

    # 다음 방문 지점 순회
    for next_vertex in range(len(graph)):
        # 갈 수 있는지, 방문 했었는지 여부 체크
        if valid_connection(graph, next_vertex, current_index, path):
            # 갈 수 있고, 방문 안 했으면 방문
            path[current_index] = next_vertex

            # 다음으로 순회, 결과가 True가 아니면 이전 지점으로 복구 
            if util_hamilton_cycle(graph, path, current_index + 1):
                return True
            # 실패 했으면 방문 여부 제거
            path[current_index] = -1

    return False

def hamilton_cycle(graph: list[list[int]], start_index: int = 0) -> list[int]:

    graph = [[0, 1, 0, 1, 0],
            [1, 0, 1, 1, 1],
            [0, 1, 0, 0, 1],
            [1, 1, 0, 0, 1],
            [0, 1, 1, 1, 0]]

    path = [-1] * (len(graph) + 1)
    path[0] = path[-1] = start_index
    # [0, -1, -1 , -1, -1, 0]

    return path if util_hamilton_cycle(graph, path, 1) else []


if __name__ == "__main__":
    hamilton_cycle([], 1)

