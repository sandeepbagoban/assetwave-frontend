export function accountHome(user) {
  return user?.role === 'seller' ? '/account/seller' : '/account/orders';
}

export function loginDestination(user, from) {
  if (typeof from !== 'string' || !from.startsWith('/') || from.startsWith('//')) return accountHome(user);
  if (from.startsWith('/account/seller') && user?.role !== 'seller') return accountHome(user);
  return from;
}
