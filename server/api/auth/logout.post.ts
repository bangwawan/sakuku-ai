export default defineEventHandler((event) => {
  deleteCookie(event, 'user_session');
  deleteCookie(event, 'user_role');
  deleteCookie(event, 'user_fullname');
  return { status: 'success', pesan: 'Logout Berhasil' };
});
