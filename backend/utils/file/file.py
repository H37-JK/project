import os
import time

file_name = input('파일 이름을 입력해 주세요.')


def write_to_file(file_name: str):
    if os.path.exists(file_name):
        print('파일이 존재하지 않습니다')
        return

    with open(file_name, 'a') as F:
        while True:
            text = input('파일에 추가할 텍스트를 입력해 주세요.')
            F.write(f"{text}\n")
            choice = input('더 입력 하실 건가요?').lower()
            if choice == 'n':
                break


def longlines():
    with open(file_name, encoding='utf-8') as F:
        lines = F.readline()
        lines_less_than_50 = list(filter(lambda line: len(line) < 50 , lines))

        if not lines_less_than_50:
            print('출력할 라인이 없습니다.')
        else:
            for i in lines_less_than_50:
                print(i, end = '\t')


if __name__ == '__main__':
    write_to_file(file_name)
    time.sleep(1)
    longlines()


