export type PermissionSpec = {
  resource: string;
  roles: string[];
};

export interface MenuItem {
  id: string;
  label: string;
  route?: string;
  svg?: string;
  required?: PermissionSpec;
  children?: MenuItem[];
  menu?: { area: string; path?: string; label?: string };
}
