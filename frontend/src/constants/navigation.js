// Fuente única de verdad de la navegación: cada item declara qué roles
// pueden verlo. El Sidebar simplemente filtra por el rol del usuario actual,
// consiguiendo el comportamiento "acumulativo" sin condicionales repetidos.
export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', roles: ['employee', 'manager', 'companyAdmin'] },
  { to: '/time-entries', label: 'Mis fichajes', roles: ['employee', 'manager', 'companyAdmin'] },
  { to: '/leave-requests', label: 'Mis solicitudes', roles: ['employee', 'manager', 'companyAdmin'] },
  { to: '/team', label: 'Equipo', roles: ['manager', 'companyAdmin'] },
  { to: '/team/leave-requests', label: 'Aprobar solicitudes', roles: ['manager', 'companyAdmin'] },
  { to: '/employees', label: 'Empleados', roles: ['companyAdmin'] },
  { to: '/companies', label: 'Empresas', roles: ['superAdmin'] },
];