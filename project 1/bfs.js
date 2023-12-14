export function bfs(graph, start, target) {
    const visited = new Set();
    const queue = [start];
    const parent = {};

    while (queue.length > 0) {
        const current = queue.shift();
        visited.add(current);

        if (current === target) {
            // Reconstruct the path from target to start
            const path = [];
            let node = target;
            while (node !== start) {
                path.unshift(node);
                node = parent[node];
            }
            path.unshift(start);
            return path;
        }

        const neighbors = graph.edges
            .filter(edge => edge.node1 === current || edge.node2 === current)
            .map(edge => (edge.node1 === current ? edge.node2 : edge.node1));

        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                queue.push(neighbor);
                visited.add(neighbor);
                parent[neighbor] = current;
            }
        }
    }

    // If no path is found
    return [];
}   

export default bfs;