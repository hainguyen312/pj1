import { Stack } from "./main.js";
export function dfs(graph, start, target) {
    const visited = new Set();
    const stack = new Stack();
    const path = [];
  
    stack.push([start]);
  
    while (!stack.isEmpty()) {
      const currentPath = stack.pop();
      const currentNode = currentPath[currentPath.length - 1];
  
      if (!visited.has(currentNode)) {
        visited.add(currentNode);
  
        if (currentNode === target) {
          return currentPath;
        }
  
        graph.edges
          .filter(edge => edge.node1 === currentNode)
          .forEach(edge => {
            const neighbor =edge.node2;
            if (!visited.has(neighbor)) {
              const newPath = [...currentPath, neighbor];
              stack.push(newPath);
            }
          });
      }
    }
  
    return null; // No path found
  }