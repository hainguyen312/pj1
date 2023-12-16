export function bfs(graph, start, target) {
    const visited = new Set();
    const queue = [start];
    const parent = {};

    while (queue.length > 0) {
        const current = queue.shift();
        visited.add(current);
        //Nếu node đang xét là đích đến thì xây dựng đường đi 
        if (current === target) {
            const path = [];
            let node = target;
            while (node !== start) {
                path.unshift(node);
                node = parent[node];
            }
            path.unshift(start);
            return path;
        }
        // Duyệt qua các node kề của node đang xét
        const neighbors = graph.edges
            .filter(edge => edge.node1 === current )
            .map(edge => (edge.node2));
        // Nếu node con chưa được thăm thì đẩy vào hàng đợi và gán visited
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                queue.push(neighbor);
                visited.add(neighbor);
                parent[neighbor] = current;
            }
        }
    }

    // Nếu không tìm được đừng đi
    return [];
}   

