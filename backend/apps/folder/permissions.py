# class HasEntityFolderAuthor(BasePermission):
#     def has_permission(self, request, view):

#         try:
#             folder = Folder.objects.get(pk=view.kwargs.get('pk', None))
#         except Folder.DoesNotExist as exc:
#             raise NotFound from exc

#         return bool(
#             HasCompanyEntity().has_permission(request, view)
#             and folder.folderentity_set.all().filter(entity=request.user.entity, is_author=True).exists()
#         )


# class HasEntityFolderAssigned(BasePermission):
#     def has_permission(self, request, view):

#         try:
#             folder = Folder.objects.get(pk=view.kwargs.get('pk', None))
#         except Folder.DoesNotExist as exc:
#             raise NotFound from exc

#         return bool(
#             IsAuthenticated().has_permission(request, view)
#             and getattr(request.user, 'entity', None)
#             and folder.folderentity_set.all().filter(entity=request.user.entity).exists()
#         )
