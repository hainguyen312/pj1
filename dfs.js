export function dfs(graph, start, target) {
    const visited = new Set();
    const path = [];

    // Hàm đệ quy thực hiện DFS
    function dfsRecursive(current) {
        // Đánh dấu đỉnh hiện tại đã thăm
        visited.add(current);
        // Thêm đỉnh hiện tại vào đường đi
        path.push(current);

        // Nếu đỉnh hiện tại là đỉnh kết thúc, trả về đường đi
        if (current === target) {
            return true;
        }

        // Lấy tất cả các đỉnh láng giềng của đỉnh hiện tại
        const neighbors = graph.edges
            .filter(edge => edge.node1 === current )
            .map(edge => ( edge.node2 ));

        // Duyệt qua các đỉnh láng giềng chưa được thăm
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                // Nếu tìm thấy đường đi, kết thúc đệ quy
                if (dfsRecursive(neighbor)) {
                    return true;
                }
            }
        }

        // Nếu không tìm thấy đường đi từ đỉnh hiện tại, loại bỏ đỉnh này khỏi đường đi
        path.pop();
        return false;
    }

    // Gọi hàm đệ quy để thực hiện DFS từ đỉnh xuất phát
    dfsRecursive(start);

    // Trả về đường đi hoặc mảng rỗng nếu không tìm thấy
    return path.length > 0 ? path : [];
}
