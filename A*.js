import { PriorityQueue } from "./main.js";

export function aStar(graph, start, target) {
  const heuristic = (node) => {
    const { lat: lat1, lon: lon1 } = graph.nodes[node] || {};
    const { lat: lat2, lon: lon2 } = graph.nodes[target] || {};
    // Kiểm tra sự tồn tại của lat và lon trước khi tính toán
    if (lat1 !== undefined && lon1 !== undefined && lat2 !== undefined && lon2 !== undefined) {
      const R = 6371; // Bán kính của Trái Đất trong kilometers
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance;
    }
    return 0;
  };

  const openSet = new PriorityQueue();
  const gValues = new Map();
  const fScores = new Map();
  const cameFrom = new Map();

  if (!graph.nodes[start] || !graph.nodes[target]) {
    console.error("Invalid start or target node.");
    return [];
  }

  gValues.set(start, 0);
  fScores.set(start, heuristic(start));

  openSet.add([start, fScores.get(start)]);

  while (!openSet.isEmpty()) {
    const [current] = openSet.remove();

    if (current === target) {
      return reconstructPath(cameFrom, current);
    }

    const neighbors = graph.edges
      .filter((edge) => edge.node1 === current)
      .map((edge) => edge.node2);

    for (const neighbor of neighbors) {
      const tentativeGValue = gValues.get(current) + graph.edges.find(
        (edge) => edge.node1 === current && edge.node2 === neighbor
      ).weight;

      if (!gValues.has(neighbor) || tentativeGValue < gValues.get(neighbor)) {
        cameFrom.set(neighbor, current);
        gValues.set(neighbor, tentativeGValue);
        fScores.set(neighbor, gValues.get(neighbor) + heuristic(neighbor));

        if (!openSet.heap.some(node => node[0] === neighbor)) {
          openSet.add([neighbor, fScores.get(neighbor)]);
        }
      }
    }
  }

  return [];

  function reconstructPath(cameFrom, current) {
    const path = [current];
    while (cameFrom.has(current)) {
      current = cameFrom.get(current);
      path.unshift(current);
    }
    return path;
  }
}
