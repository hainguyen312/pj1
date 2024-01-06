import { Queue } from "./main.js";
export function bfs(graph, start, target) {
    const visited = new Set();
    const queue = new Queue();
  
    queue.enqueue([start]);
  
    while (!queue.isEmpty()) {
      const currentPath = queue.dequeue();
      const currentNode = currentPath[currentPath.length - 1];
  
      if (!visited.has(currentNode)) {
        visited.add(currentNode);
  
        if (currentNode === target) {
          return currentPath;
        }
  
        graph.edges
          .filter(edge => edge.node1 === currentNode)
          .forEach(edge => {
            const neighbor = edge.node2;
            if (!visited.has(neighbor)) {
              const newPath = [...currentPath, neighbor];
              queue.enqueue(newPath);
            }
          });
      }
    }
  
    return null; // No path found
  }