import { PriorityQueue } from "./main.js";
export function dijkstra(graph, start, target) {
    const distances = {};
    const previousNodes = {};
    const queue = new PriorityQueue();
  
    graph.nodes.forEach(node => {
      distances[node.node] = Infinity;
      previousNodes[node.node] = null;
    });
  
    distances[start] = 0;
    queue.add([start, 0]);
  
    while (!queue.isEmpty()) {
      const [current, currentDistance] = queue.remove();
  
      if (current === target) {
        return reconstructPath(previousNodes, target);
      }
  
      graph.edges
        .filter(edge => edge.node1 === current)
        .forEach(edge => {
          const neighbor = edge.node2;
          const totalDistance = currentDistance + edge.weight;
  
          if (totalDistance < distances[neighbor]) {
            distances[neighbor] = totalDistance;
            previousNodes[neighbor] = current;
            queue.add([neighbor, totalDistance]);
          }
        });
    }
  
    return null; // No path found
  
    function reconstructPath(previousNodes, current) {
      const path = [current];
      while (previousNodes[current]) {
        current = previousNodes[current];
        path.unshift(current);
      }
      return path;
    }
  }