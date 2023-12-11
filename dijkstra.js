function dijkstra(graph, start, target) {
    const distances = {};
    const previous = {};
    const queue = [...graph.getAllNodes().keys()];
    
    // Set initial distances to infinity, except for the start node
    for (const node of queue) {
        distances[node] = node === start ? 0 : Infinity;
        previous[node] = null;
    }
    
    while (queue.length > 0) {
        // Find the node with the smallest distance in the current queue
        const current = queue.reduce((minNode, node) =>
        distances[node] < distances[minNode] ? node : minNode
        );
        
        // Remove the current node from the queue
        queue.splice(queue.indexOf(current), 1);
        
        // Break if the target node has been reached
        if (current === target) break;
        
        // Update distances to neighbors
        const neighbors = graph.getAllNodes().filter(node => graph.hasWayBetweenNodes(current, node.id));
        for (const neighbor of neighbors) {
            const alt = distances[current] + calculateDistance(graph.getNodeById(current), neighbor);
            
            if (alt < distances[neighbor.id]) {
                distances[neighbor.id] = alt;
                previous[neighbor.id] = current;
            }
        }
    }
    
    // Reconstruct the path from target to start
    const path = [];
    let current = target;
    while (current !== null) {
        path.unshift(current);
        current = previous[current];
    }
    
    return path;
}

export default dijkstra;