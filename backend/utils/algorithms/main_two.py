from collections import deque

def solve_water_puzzle():
    capacities = (12, 7, 5)
    initial_state = (12, 0, 0)
    target = (6, 6, 0)

    visited = set()
    visited.add(initial_state)

    queue = deque([(initial_state, [initial_state])])

    while queue:
        (current_state, path) = queue.popleft()

        if current_state == target:
            return path

        for i in range(3): # 보내는 물통
            for j in range(3): # 받는 물통
                if i == j: continue # 같은 물통끼리는 불가능

                pour_amount = min(current_state[i], capacities[j] - current_state[j])

                if pour_amount > 0:
                    new_state = list(current_state)
                    new_state[i] -= pour_amount
                    new_state[j] += pour_amount
                    new_state = tuple(new_state)

                    if new_state not in visited:
                        visited.add(new_state)
                        new_path = path + [new_state]
                        queue.append((new_state, new_path))

    return None

result_path = solve_water_puzzle()

if result_path:
    print(f"총 {len(result_path) - 1}단계만에 성공했습니다!")
    print("단계별 상태 (A, B, C):")
    for step, state in enumerate(result_path):
        print(f"Step {step}: {state}")
else:
    print("해결책을 찾을 수 없습니다.")