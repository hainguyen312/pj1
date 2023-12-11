function bfs(graph, start, target) {
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
        
        const neighbors = graph.getAllNodes().filter(node => graph.hasWayBetweenNodes(current, node.id));
        
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor.id)) {
                queue.push(neighbor.id);
                parent[neighbor.id] = current;
            }
        }
    }
    
    // If no path is found
    return [];
}

export default bfs;