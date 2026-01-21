import sys


def cat(files):
    try:
        file_contents = [contents for contents in [open(file).read() for file in files]]
    except OSError as err:
        exit(print(f"cat: error ({err}"))

    for contents in file_contents:
        sys.stdout.write(contents)