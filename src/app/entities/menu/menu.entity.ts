export type PermissionSpec = {
  resource: string;     // p.ej. "framecontroller-backend" (clientId)
  roles: string[];      // p.ej. ["Pricing", "Users.read"]
};

export interface MenuItem {
  id: string;
  label: string;
  route?: string;
  svg?: string;         // path a assets/icons/*.svg
  required?: PermissionSpec; // visible si tiene AL MENOS uno de estos roles
  children?: MenuItem[];
}
