export default defineEventHandler(async (event) => {
  // 生成一个简单的 SVG 二维码占位图
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#f5f5f5"/>
      <text x="100" y="100" font-family="Arial" font-size="14" text-anchor="middle">
        二维码加载失败
      </text>
    </svg>
  `;

  event.node.res.setHeader('Content-Type', 'image/svg+xml');
  return svg;
}); 