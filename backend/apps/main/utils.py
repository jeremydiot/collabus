import hashlib
import os
from functools import partial
from django.conf import settings
from drf_spectacular.utils import OpenApiParameter


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


def request_params_to_queryset(params, queryset, custom_keyword=None):
    _params = params.dict()

    order = _params.pop('order', None)
    size = int(_params.pop('size', '-1'))
    page = abs(int(_params.pop('page', '0')))

    _filter = {}
    _default_method = 'icontains'

    for key, value in _params.items():
        method = _default_method

        if value[0] == '^':
            method = 'istartswith'
        elif value[0] == '=':
            method = 'iexact'
        elif value[0] == '$':
            method = 'iregex'

        if (method != _default_method):
            value = value[1:]

        keyword = custom_keyword and custom_keyword.get(key, None)

        _filter[f'{keyword or key}__{method}'] = value

    return queryset.filter(
        **_filter
    ).order_by(
        *(order.split(',') if order else [])
    )[None if (size < 0) else page * size:None if (size < 0) else page * size + size]


def drf_params_schema(fields, schema_list=False, description=None):
    _fields = [*fields]
    if schema_list:
        _fields += ['order', 'size', 'page']
        description = {
            'order': 'Key list separated by comma, ASC: default, DESC: add \'-\' ahead of key \n\nAvailable keys: ' + ', '.join(fields),
            'size': 'Default: -1 (no limit if < 0)',
            'page': 'Default: 0 (no effect if size < 0)',
            **(description if description else {})}

    schema = []
    for field in _fields:
        _description = description and description.get(field, None)
        schema.append(
            OpenApiParameter(
                name=field,
                type=str,
                required=False,
                allow_blank=True,
                description=_description
            )
        )

    return schema
