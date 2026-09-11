import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateMaze, randomEndpoints, neighbors, aStar } from './maze.js';

for (const size of [7, 11, 17, 23]) {
  test(`${size}×${size}: connected maze, valid endpoints, A* matches BFS over 50 seeds`, () => {
    for (let seed = 1; seed <= 50; seed++) {
      let state = seed;
      const random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
      const maze = generateMaze(size, random), { start, goal } = randomEndpoints(maze, random);
      assert.notEqual(start, goal);
      const queue = [start], distances = new Map([[start, 0]]);
      for (let i = 0; i < queue.length; i++) {
        for (const next of neighbors(maze, queue[i])) {
          assert.ok(next >= 0 && next < size * size);
          assert.ok(neighbors(maze, next).includes(queue[i]), 'walls must be reciprocal');
          if (!distances.has(next)) { distances.set(next, distances.get(queue[i]) + 1); queue.push(next); }
        }
      }
      assert.equal(distances.size, size * size);
      const search = aStar(maze, start, goal);
      let result;
      do { result = search.next(); } while (!result.done);
      const { path } = result.value;
      assert.equal(path[0], start); assert.equal(path.at(-1), goal);
      assert.equal(path.length - 1, distances.get(goal));
      path.slice(1).forEach((id, i) => assert.ok(neighbors(maze, path[i]).includes(id)));
    }
  });
}
