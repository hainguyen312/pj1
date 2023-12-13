export function dijkstra(graph, start, end) {
    const distances = {};
    const previousNodes = {};
    const queue = [];
    
    // Khởi tạo các giá trị ban đầu
    graph.nodes.forEach(node => {
        distances[node.node] = Infinity;
        previousNodes[node.node] = null; 
        queue.push(node.node);
    });
    
    distances[start] = 0;
    
    while (queue.length > 0) {
        // Lấy node có khoảng cách ngắn nhất từ đỉnh đầu tiên trong hàng đợi
        const current = queue.reduce((minNode, node) =>
            distances[node] < distances[minNode] ? node : minNode
        );
    
        // Lấy index của node hiện tại trong hàng đợi
        const currentIndex = queue.indexOf(current);
        // Loại bỏ node hiện tại khỏi hàng đợi
        queue.splice(currentIndex, 1);
    
        // Duyệt qua các node kề của node hiện tại
        graph.edges
            .filter(edge => edge.node1 === current || edge.node2 === current)
            .forEach(edge => {
                const neighbor = edge.node1 === current ? edge.node2 : edge.node1;
                const totalDistance = distances[current] + edge.weight;
    
                // Nếu khoảng cách tính được ngắn hơn khoảng cách hiện tại
                if (totalDistance < distances[neighbor]) {
                    distances[neighbor] = totalDistance;
                    previousNodes[neighbor] = current;
                }
            });
    }
    
    // Xây dựng đường đi từ endNode đến startNode
    const path = [end];
    let current = end;
    while (current !== start) {
        current = previousNodes[current];
        path.unshift(current);
    }
    
    return path;
}