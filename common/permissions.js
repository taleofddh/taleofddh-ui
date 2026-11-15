// Permission helpers. The UI never checks role names; it only checks the permission
// list returned by each service's GET /permissions. This is display-only: the API enforces access.

// True if the list contains the permission or its service wildcard ("gallery:*" covers "gallery:findAlbums").
// An entry with no required permission is open to any signed-in user.
export const hasPermission = (permissions, permission) => {
    if (!permission) return true;
    if (!Array.isArray(permissions)) return false;
    const wildcard = permission.split(':')[0] + ':*';
    return permissions.includes(permission) || permissions.includes(wildcard);
};

export const NO_ACCESS_MESSAGE = "You don't have access";
