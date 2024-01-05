export function aStar(graph, start, target) {
    // Hàm h(n) ước lượng khoảng cách từ đỉnh hiện tại đến đỉnh kết thúc
    function heuristic(node) {
        const currentNode = graph.nodes[node];
        const targetNode = graph.nodes[target];
        const lat1 = currentNode.lat;
        const lon1 = currentNode.lon;
        const lat2 = targetNode.lat;
        const lon2 = targetNode.lon
        const R = 6371;  // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    }
        // Khởi tạo tập hợp đỉnh đã thăm
        const visited = new Set();
        // Khởi tạo mảng để thực hiện hàng đợi ưu tiên
        const priorityQueue = [{ node: start, priority: 0 }];
        // Khởi tạo đối tượng lưu trữ giá trị g(n) và đỉnh cha của mỗi đỉnh
        const gValues = {};
        const parents = {};
    
        // Hàm g(n) tính giá trị thực tế từ đỉnh xuất phát đến đỉnh hiện tại
        function calculateGValue(current, neighbor) {
            const currentNode = graph.nodes[current];
            const neighborNode = graph.nodes[neighbor];
            const edge = graph.edges.find(
                (edge) =>
                    (edge.node1 === current && edge.node2 === neighbor)
            );
            return gValues[current] + (edge ? edge.weight : 0);
        }
    
        // Đặt giá trị ban đầu cho đỉnh xuất phát
        gValues[start] = 0;
    
        while (priorityQueue.length > 0) {
            // Lấy phần tử có độ ưu tiên thấp nhất từ hàng đợi
            const currentObj = priorityQueue.shift();
            const current = currentObj.node;
    
            if (current === target) {
                // Reconstruct the path from target to start
                const path = [];
                let node = target;
                while (node !== start) {
                    path.unshift(node);
                    node = parents[node];
                }
                path.unshift(start);
                return path;
            }
    
            if (!visited.has(current)) {
                visited.add(current);
    
                const neighbors = graph.edges
                    .filter((edge) => edge.node1 === current )
                    .map((edge) => (edge.node2 ));
    
                for (const neighbor of neighbors) {
                    if (!visited.has(neighbor)) {
                        const tentativeGValue = calculateGValue(current, neighbor);
                        if (!gValues[neighbor] || tentativeGValue < gValues[neighbor]) {
                            gValues[neighbor] = tentativeGValue;
                            parents[neighbor] = current;
    
                            // Thêm phần tử vào hàng đợi ưu tiên dựa trên f(n) = g(n) + h(n)
                            const priority = tentativeGValue + heuristic(neighbor);
                            const index = priorityQueue.findIndex(
                                (item) => item.priority > priority
                            );
                            if (index !== -1) {
                                priorityQueue.splice(index, 0, { node: neighbor, priority });
                            } else {
                                priorityQueue.push({ node: neighbor, priority });
                            }
                        }
                    }
                }
            }
        }
    
        // If no path is found
        return [];
    }
    