// esbuild includes this import and Three.js in a single classic script.
// No runtime module requests are needed, including when opening file:// URLs.
import('./app.js').catch(error => {
  document.querySelector('#error').hidden = false;
  document.querySelector('#error').textContent = '3D 화면을 시작하지 못했어요. 브라우저의 WebGL 지원과 하드웨어 가속 설정을 확인해 주세요.';
  console.error(error);
});
