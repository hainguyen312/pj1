import {dijkstra} from "./dijkstra.js";
import {bfs} from "./bfs.js";

const map = L.map('map').setView([21.0045017 ,105.8472066], 17);
let markers = [];
let selectedMethod, startNodeId, targetNodeId, totalDistance;

// Thêm layer OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
}).addTo(map);

// Sử dụng đối tượng Graph
class Graph {
    constructor() {
        this.nodes = [] 
        this.edges = [];
    }
    
    // Thêm node vào đối tượng Graph
    addNode(node, lat, lon) {
        this.nodes.push({ node, lat, lon });
    }
    
    addEdge(node1, node2, weight) {
        this.edges.push({ node1, node2, weight});
        this.edges.push({ node1: node2, node2: node1, weight}); // Đối xứng
    }
    }
        const startInput = document.getElementById('startPlace');
        const targetInput = document.getElementById('targetPlace');
        
        function addMarkerToMap(node) {
            const marker = L.marker([node.lat, node.lon]).addTo(map);
            markers.push(marker);
        }

        function clearMap() {
            // Xoá tất cả các marker trên bản đồ
            markers.forEach(marker => {
                map.removeLayer(marker);
            });
            markers = []; // Đặt lại mảng markers thành mảng trống

            // Xoá tất cả các đường line trên bản đồ
            map.eachLayer(layer => {
                if (layer instanceof L.Polyline) {
                    map.removeLayer(layer);
                }
            });
        }
        
        function displayPathOnMap(path) {
            clearMap();
            for (let i = 0; i < path.length - 1; i++) {
                const currentNode = graph.nodes[path[i]];
                const nextNode = graph.nodes[path[i + 1]];
                addMarkerToMap(currentNode);
                addMarkerToMap(nextNode);
                const polyline = L.polyline([[currentNode.lat, currentNode.lon], [nextNode.lat, nextNode.lon]], { color: 'blue', weight:3}).addTo(map);
            }
        }

        function calculateDistance(node1, node2) {
            const coord1 = { lat: node1.lat, lon: node1.lon };
            const coord2 = { lat: node2.lat, lon: node2.lon };
            const distance = haversine(coord1, coord2);
            return distance;
        }

        function calculateTotalDistance(path) {
            totalDistance = 0;
            for (let i = 0; i < path.length - 1; i++) {
                const currentNode = graph.nodes[path[i]];
                const nextNode = graph.nodes[path[i + 1]];
                const distance = calculateDistance(currentNode, nextNode);
                totalDistance += distance;
            }
            return totalDistance;
        }


        // function dijkstra(graph, start, end) {
        //     const distances = {};
        //     const previousNodes = {};
        //     const queue = [];
            
        //     // Khởi tạo các giá trị ban đầu
        //     graph.nodes.forEach(node => {
        //         distances[node.node] = Infinity;
        //         previousNodes[node.node] = null; 
        //         queue.push(node.node);
        //     });
            
        //     distances[start] = 0;
            
        //     while (queue.length > 0) {
        //         // Lấy node có khoảng cách ngắn nhất từ đỉnh đầu tiên trong hàng đợi
        //         const current = queue.reduce((minNode, node) =>
        //             distances[node] < distances[minNode] ? node : minNode
        //         );
            
        //         // Lấy index của node hiện tại trong hàng đợi
        //         const currentIndex = queue.indexOf(current);
        //         // Loại bỏ node hiện tại khỏi hàng đợi
        //         queue.splice(currentIndex, 1);
            
        //         // Duyệt qua các node kề của node hiện tại
        //         graph.edges
        //             .filter(edge => edge.node1 === current || edge.node2 === current)
        //             .forEach(edge => {
        //                 const neighbor = edge.node1 === current ? edge.node2 : edge.node1;
        //                 const totalDistance = distances[current] + edge.weight;
            
        //                 // Nếu khoảng cách tính được ngắn hơn khoảng cách hiện tại
        //                 if (totalDistance < distances[neighbor]) {
        //                     distances[neighbor] = totalDistance;
        //                     previousNodes[neighbor] = current;
        //                 }
        //             });
        //     }
            
        //     // Xây dựng đường đi từ endNode đến startNode
        //     const path = [end];
        //     let current = end;
        //     while (current !== start) {
        //         current = previousNodes[current];
        //         path.unshift(current);
        //     }
            
        //     return path;
        // }

        
        // function bfs(graph, start, target) {
        //     const visited = new Set();
        //     const queue = [start];
        //     const parent = {};

        //     while (queue.length > 0) {
        //         const current = queue.shift();
        //         visited.add(current);

        //         if (current === target) {
        //             // Reconstruct the path from target to start
        //             const path = [];
        //             let node = target;
        //             while (node !== start) {
        //                 path.unshift(node);
        //                 node = parent[node];
        //             }
        //             path.unshift(start);
        //             return path;
        //         }

        //         const neighbors = graph.edges
        //             .filter(edge => edge.node1 === current || edge.node2 === current)
        //             .map(edge => (edge.node1 === current ? edge.node2 : edge.node1));

        //         for (const neighbor of neighbors) {
        //             if (!visited.has(neighbor)) {
        //                 queue.push(neighbor);
        //                 visited.add(neighbor);
        //                 parent[neighbor] = current;
        //             }
        //         }
        //     }

        //     // If no path is found
        //     return [];
        // }   

        const graph=new Graph();
        const NodeUrl = 'http://localhost:3000/NodeElements';
        const EdgeUrl = 'http://localhost:3000/EdgeElements';
        Promise.all([

            fetch(NodeUrl)
            .then(response => response.json())
            .then(data => {
                data.forEach(element => {
                    if (element.type === 'node' && element.lat && element.lon) {
                        graph.addNode(element.id, element.lat, element.lon);
                    }
                    // graph.nodes.forEach(node =>{
                    //     addMarkerToMap(node)
                    // })
                });
            })
            .catch(error => {
                console.error('Error fetching node data:', error);
            }),
            fetch(EdgeUrl)
            .then(response => response.json())
            .then(data => {
                    data.forEach(element =>{
                    if(element.type ==='edge'){
                        const node1=graph.nodes[element.node1];
                        const node2=graph.nodes[element.node2];
                        const lat1=node1.lat;
                        const lat2=node2.lat;
                        const lon1=node1.lon;
                        const lon2=node2.lon;
                        const weight= Math.sqrt(Math.pow((lat1-lat2),2)+Math.pow((lon1-lon2),2));
                        graph.addEdge(element.node1,element.node2,weight);
                    }
                });
                // graph.edges.forEach(edge => {
                //     const node1 = graph.nodes[edge.node1];
                //     const node2 = graph.nodes[edge.node2];

                //     const polyline = L.polyline(
                //         [[node1.lat, node1.lon], [node2.lat, node2.lon]],
                //         { color: 'gray', weight: 3, opacity: 0.5 }
                //     ).addTo(map);
                // });
            })
            .catch(error => {
                console.error('Error fetching node data:', error);
            })
            .then(()=>{
                startInput.addEventListener('input', handleInputEvent);
                targetInput.addEventListener('input', handleInputEvent);
                function handleInputEvent(){
                    startNodeId = Number(startInput.value);
                    targetNodeId = Number(targetInput.value);
                    
                    console.log(startNodeId,targetNodeId);
                    
                    const startNode = graph.nodes[startNodeId];
                    const targetNode = graph.nodes[targetNodeId];
                    
                    clearMap();
                    
                    if (startNode) {
                        addMarkerToMap(startNode);
                    }
                    if (targetNode) {
                        addMarkerToMap(targetNode);
                    }
                    
                }     
                document.getElementById('methodSelection').addEventListener('input', function () {
                    selectedMethod = this.value; // Lưu giá trị được chọn vào biến selectedMethod
                });
                document.getElementById('startFinding').addEventListener('click', findShortestPath);
                function findShortestPath() {
                        console.log(startNodeId,targetNodeId);
                        console.log(graph);
                        console.log(selectedMethod);
                            let shortestPath;
                            if (selectedMethod === 'Dijkstra') {
                                shortestPath = dijkstra(graph, startNodeId, targetNodeId);
                                displayPathOnMap(shortestPath);
                            } else if (selectedMethod === 'BFS') {
                                shortestPath = bfs(graph, startNodeId, targetNodeId);
                                displayPathOnMap(shortestPath);
                            }
                            console.log(shortestPath);
                            alert(`Số Node đã đi qua: ${shortestPath.length}`)
                    }
                
            })
        ])
