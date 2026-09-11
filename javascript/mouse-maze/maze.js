// Cell walls: north, east, south, west. Iterative randomized DFS carves a connected maze.
export const DIRECTIONS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
export function generateMaze(size, random = Math.random) {
  const cells = Array.from({ length: size * size }, (_, id) => ({ id, x: id % size, y: Math.floor(id / size), walls: [true, true, true, true] }));
  const first = Math.floor(random() * cells.length);
  const seen = new Set([first]), stack = [first];
  while (stack.length) {
    const cell = cells[stack.at(-1)];
    const choices = DIRECTIONS.map(([dx, dy], direction) => ({ x: cell.x + dx, y: cell.y + dy, direction }))
      .filter(({ x, y }) => x >= 0 && y >= 0 && x < size && y < size && !seen.has(y * size + x));
    if (!choices.length) { stack.pop(); continue; }
    const { x, y, direction } = choices[Math.floor(random() * choices.length)];
    const next = y * size + x;
    cell.walls[direction] = false;
    cells[next].walls[(direction + 2) % 4] = false;
    seen.add(next); stack.push(next);
  }
  return { size, cells };
}
export function randomEndpoints(maze, random = Math.random) {
  const count = maze.cells.length;
  const start = Math.floor(random() * count);
  let goal = Math.floor(random() * (count - 1));
  if (goal >= start) goal++;
  return { start, goal };
}
export function neighbors(maze, id) {
  const cell = maze.cells[id];
  return DIRECTIONS.flatMap(([dx, dy], d) => cell.walls[d] ? [] : [(cell.y + dy) * maze.size + cell.x + dx]);
}
// Uniform edge cost + Manhattan heuristic: A* returns a shortest path.
// Yield once per expanded cell so the UI can show the search without blocking.
export function* aStar(maze, start, goal) {
  const heuristic = id => Math.abs(maze.cells[id].x - maze.cells[goal].x) + Math.abs(maze.cells[id].y - maze.cells[goal].y);
  const open = new Set([start]), closed = new Set(), parent = new Map(), g = new Map([[start, 0]]);
  while (open.size) {
    let current = -1, bestF = Infinity, bestH = Infinity;
    for (const id of open) {
      const h = heuristic(id), f = g.get(id) + h;
      if (f < bestF || (f === bestF && h < bestH)) { current = id; bestF = f; bestH = h; }
    }
    open.delete(current); closed.add(current);
    if (current === goal) {
      const path = [goal];
      while (parent.has(path.at(-1))) path.push(parent.get(path.at(-1)));
      return { path: path.reverse(), visited: closed.size };
    }
    for (const next of neighbors(maze, current)) {
      if (closed.has(next)) continue;
      const cost = g.get(current) + 1;
      if (cost < (g.get(next) ?? Infinity)) { g.set(next, cost); parent.set(next, current); open.add(next); }
    }
    yield { current, visited: closed.size };
  }
  return { path: [], visited: closed.size };
}
