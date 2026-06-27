export default defineEventHandler((event) => {
  deleteCookie(event, 'user_session');
  return { status: 'success', pesan: 'Logout Berhasil' };
});
