export default defineEventHandler(async (event) => {
  // 重定向到一个可靠的默认二维码图片
  return sendRedirect(event, 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://your-website.com', 302);
}); 