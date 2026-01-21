
def encode(plain: str) -> list[int]:
    return [ord(num) - 96 for num in plain]

def decode(encoded: list[int]) -> str:
    return "".join(chr(num + 96) for num in encoded)

if __name__ == "__main__":
    for i in range(10):
        print(i)