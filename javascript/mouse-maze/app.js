import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { generateMaze, randomEndpoints, aStar } from './maze.js';

const $ = selector => document.querySelector(selector);
const viewport = $('#viewport');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
viewport.appendChild(renderer.domElement);
renderer.domElement.setAttribute('aria-label', '쥐가 치즈를 찾아가는 입체 미로. 드래그로 회전할 수 있습니다.');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#eaf0e1');
const camera = new THREE.PerspectiveCamera(38, 1, .1, 250);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2.15;
controls.minDistance = 5;
controls.maxDistance = 75;
scene.add(new THREE.HemisphereLight('#fff9e8', '#91a781', 2.6));
const sun = new THREE.DirectionalLight('#fff6df', 3);
sun.position.set(-12, 22, 10);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, far: 80 });
sun.shadow.normalBias = .035;
scene.add(sun);
const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: '#eaf0e1', roughness: 1 }));
ground.rotation.x = -Math.PI / 2; ground.position.y = -.42; ground.receiveShadow = true; scene.add(ground);

let board, maze, start, goal, tiles, mouse, cheese, search;
let state = 'ready', paused = false, accumulator = 0, path = [], pathIndex = 0, progress = 0, serial = 0;
const colors = { floor: '#f3f0dc', explored: '#a7caca', route: '#bedc79', start: '#789c54', goal: '#f1c75e' };
function mesh(geometry, color, position, parent, scale) {
  const object = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, roughness: .8 }));
  object.position.set(...position);
  if (scale) object.scale.set(...scale);
  object.castShadow = true; object.receiveShadow = true; parent.add(object); return object;
}
function makeMouse() {
  const group = new THREE.Group();
  mesh(new THREE.SphereGeometry(.23, 20, 14), '#a29d93', [0, .25, .03], group, [.85, .8, 1.35]);
  mesh(new THREE.SphereGeometry(.16, 20, 14), '#b4aea1', [0, .27, -.23], group, [.85, .85, 1.2]);
  for (const side of [-1, 1]) {
    mesh(new THREE.SphereGeometry(.105, 16, 12), '#aaa497', [side * .135, .41, -.16], group, [1, 1, .45]);
    mesh(new THREE.SphereGeometry(.072, 16, 12), '#e8b5ac', [side * .135, .42, -.203], group, [1, 1, .2]);
    mesh(new THREE.SphereGeometry(.023, 12, 8), '#242d27', [side * .086, .305, -.351], group);
    for (const z of [-.08, .18]) mesh(new THREE.SphereGeometry(.045, 12, 8), '#d4ada0', [side * .13, .065, z], group, [1, .6, 1.4]);
  }
  mesh(new THREE.SphereGeometry(.035, 12, 8), '#de9e99', [0, .25, -.412], group);
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, .16, .26), new THREE.Vector3(.08, .10, .43), new THREE.Vector3(.23, .08, .48), new THREE.Vector3(.28, .10, .61)]);
  mesh(new THREE.TubeGeometry(curve, 18, .021, 8, false), '#d1aaa0', [0, 0, 0], group);
  return group;
}
function makeCheese() {
  const group = new THREE.Group(), shape = new THREE.Shape();
  shape.moveTo(-.24, -.2); shape.lineTo(.26, -.2); shape.lineTo(.12, .25); shape.closePath();
  const wedge = mesh(new THREE.ExtrudeGeometry(shape, { depth: .23, bevelEnabled: true, bevelSize: .025, bevelThickness: .025, bevelSegments: 2, steps: 1 }), '#f4bd39', [0, .30, 0], group);
  wedge.rotation.x = Math.PI / 2;
  for (const [x, z, radius] of [[-.08, -.10, .045], [.10, -.08, .034], [.10, .11, .029]]) {
    const hole = mesh(new THREE.CircleGeometry(radius, 20), '#cb8d23', [x, .329, z], group); hole.rotation.x = -Math.PI / 2;
  }
  return group;
}
function point(id) { const cell = maze.cells[id]; return new THREE.Vector3(cell.x - (maze.size - 1) / 2, 0, cell.y - (maze.size - 1) / 2); }
function resetCamera() {
  const n = maze.size;
  camera.position.set(n * 1.12, n * 1.65, n * 1.49);
  controls.target.set(0, 0, 0); controls.update(); fit();
}
function fit() {
  const { width, height } = viewport.getBoundingClientRect();
  renderer.setSize(width, height); camera.aspect = width / height;
  // Keep the whole board visible even in a narrow portrait viewport.
  camera.fov = camera.aspect < 1 ? Math.min(68, 38 / camera.aspect) : 38;
  camera.updateProjectionMatrix();
}
new ResizeObserver(fit).observe(viewport);
function disposeBoard() {
  if (!board) return;
  scene.remove(board);
  const geometries = new Set(), materials = new Set();
  board.traverse(object => { if (object.geometry) geometries.add(object.geometry); if (object.material) materials.add(object.material); });
  geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose());
}
function generate() {
  disposeBoard(); maze = generateMaze(Number($('#size').value));
  board = new THREE.Group(); scene.add(board); tiles = [];
  const n = maze.size;
  mesh(new THREE.BoxGeometry(n + .5, .36, n + .5), '#7d906a', [0, -.22, 0], board);
  const tileGeometry = new THREE.BoxGeometry(.97, .06, .97);
  const horizontal = new THREE.BoxGeometry(1.13, .48, .12);
  const vertical = new THREE.BoxGeometry(.12, .48, 1.13);
  const wallMaterial = new THREE.MeshStandardMaterial({ color: '#e2d7b7', roughness: .88 });
  function wall(geometry, x, z) { const object = new THREE.Mesh(geometry, wallMaterial); object.position.set(x, .24, z); object.castShadow = object.receiveShadow = true; board.add(object); }
  for (const cell of maze.cells) {
    const { x, z } = point(cell.id);
    tiles.push(mesh(tileGeometry, colors.floor, [x, -.015, z], board));
    if (cell.walls[0]) wall(horizontal, x, z - .5);
    if (cell.walls[3]) wall(vertical, x - .5, z);
    if (cell.y === n - 1) wall(horizontal, x, z + .5);
    if (cell.x === n - 1) wall(vertical, x + .5, z);
  }
  mouse = makeMouse(); cheese = makeCheese(); board.add(mouse, cheese);
  $('#maze-label').textContent = `${n} × ${n} / MAZE ${String(++serial).padStart(3, '0')}`;
  shuffleEndpoints(); resetCamera();
}
function paint(id, color) { tiles[id].material.color.set(id === start ? colors.start : id === goal ? colors.goal : color); }
function resetRun() {
  state = 'ready'; paused = false; accumulator = 0; path = []; pathIndex = 0; progress = 0;
  search = aStar(maze, start, goal);
  tiles.forEach((_, id) => paint(id, colors.floor));
  mouse.position.copy(point(start)); mouse.rotation.y = 0; cheese.position.copy(point(goal));
  $('#visited').innerHTML = '0 <small>칸</small>'; $('#distance').innerHTML = '— <small>걸음</small>';
  $('#status').textContent = '● 준비 완료 · 치즈를 찾아볼까요?';
  $('#play').disabled = false; $('#play').textContent = '▶ 탐색 시작';
}
function shuffleEndpoints() { ({ start, goal } = randomEndpoints(maze)); resetRun(); }
$('#generate').addEventListener('click', generate);
$('#size').addEventListener('change', generate);
$('#endpoints').addEventListener('click', shuffleEndpoints);
$('#camera').addEventListener('click', resetCamera);
$('#speed').addEventListener('input', () => { $('#speed-label').textContent = `${$('#speed').value}×`; });
$('#play').addEventListener('click', () => {
  if (state === 'done') resetRun();
  if (state === 'ready') { state = 'searching'; } else { paused = !paused; }
  $('#play').textContent = paused ? '▶ 계속하기' : 'Ⅱ 일시정지';
  $('#status').textContent = paused ? 'Ⅱ 잠깐 쉬는 중' : state === 'moving' ? '● 최단 경로를 따라 이동 중' : '● A* 탐색 중 · 치즈로 가는 길 찾기';
});
function update(dt) {
  if (paused) return;
  const speed = Number($('#speed').value);
  if (state === 'searching') {
    accumulator += dt * speed * 26;
    while (accumulator >= 1 && state === 'searching') {
      accumulator--;
      const step = search.next();
      $('#visited').innerHTML = `${step.value.visited} <small>칸</small>`;
      if (step.done) {
        path = step.value.path;
        if (!path.length) { state = 'done'; $('#status').textContent = '경로를 찾지 못했어요'; $('#play').textContent = '↻ 다시 탐색'; break; }
        path.forEach(id => paint(id, colors.route));
        $('#distance').innerHTML = `${path.length - 1} <small>걸음</small>`;
        state = 'moving'; $('#status').textContent = '● 최단 경로를 따라 이동 중';
      } else { paint(step.value.current, colors.explored); }
    }
  } else if (state === 'moving') {
    progress += dt * speed * 3;
    while (progress >= 1 && pathIndex < path.length - 1) { progress--; pathIndex++; }
    if (pathIndex >= path.length - 1) {
      mouse.position.copy(point(goal)); state = 'done';
      $('#status').textContent = '✓ 치즈 도착! 탐험 성공'; $('#play').textContent = '↻ 같은 미로 다시 탐색';
      return;
    }
    const from = point(path[pathIndex]), to = point(path[pathIndex + 1]);
    mouse.position.lerpVectors(from, to, progress);
    mouse.position.y = Math.sin(progress * Math.PI * 4) * .025;
    mouse.rotation.y = Math.atan2(-(to.x - from.x), -(to.z - from.z));
  }
}
generate();
let previous = performance.now();
renderer.setAnimationLoop(time => { const dt = Math.min((time - previous) / 1000, .1); previous = time; update(dt); controls.update(); renderer.render(scene, camera); });
