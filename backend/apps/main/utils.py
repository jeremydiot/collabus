import hashlib
import os
from functools import partial
from django.conf import settings


def hash_file(file, block_size=65536):
    hasher = hashlib.sha256(settings.SECRET_KEY.encode())
    for buf in iter(partial(file.read, block_size), b''):
        hasher.update(buf)

    return hasher.hexdigest()


def delete_file(file_path):
    if os.path.isfile(file_path):
        os.remove(file_path)


def upload_to_file(instance, filename):
    _, filename_ext = os.path.splitext(filename)
    return f'folder/{hash_file(instance.file)}{filename_ext}'
