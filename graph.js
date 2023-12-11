import dijkstra from "./dijkstra";
import bfs from "./bfs";

    const map = L.map('map').setView([21.0006, 105.8391], 15);
        let markers = [];
        let selectedMethod, startNodeId, targetNodeId;
        
        // Thêm layer OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        }).addTo(map);
        
        // Sử dụng đối tượng Graph để thêm node và way vào bản đồ
        class Graph {
            constructor() {
                this.nodes = new Map(); // Sử dụng Map để lưu trữ nodes theo id
                this.ways = new Map();
            }
            
            // Thêm node vào đối tượng Graph
            addNode(id, lat, lon) {
                this.nodes.set(id, { id, lat, lon });
            }
            
            // Thêm đường đi vào đối tượng Graph
            addWay(id, nodes, tags) {
                this.ways.set(id, { id, nodes, tags });
            }
            
            // Lấy thông tin của node theo id
            getNodeById(id) {
                return this.nodes.get(id);
            }
            
            // Lấy tất cả các nodes trong đối tượng Graph
            getAllNodes() {
                return Array.from(this.nodes.values());
            }
            
            hasWayBetweenNodes(nodeId1,nodeId2) {
                for (const [wayId, way] of this.ways) {
                    if (way.nodes.includes(nodeId1) && way.nodes.includes(nodeId2)) {
                        return true;
                    }
                }
                return false; // Không có đường đi giữa hai node
            }
            
            //Lấy thông tin đường đi theo id    
            // getWayById(id) {
                //     return this.ways.get(id);
                // }
                
                // Lấy tất cả các cạnh trong đối tượng Graph
                // getAllWays() {
                    //     return Array.from(this.ways.values());
                    // }
                }
                const startInput = document.getElementById('startPlace');
                const targetInput = document.getElementById('targetPlace');
                
                function addMarkerToMap(node) {
                    const marker = L.marker([node.lat, node.lon]).addTo(map);
                    markers.push(marker);
                }
                
                function clearMarkers() {
                    markers.forEach(marker => {
                        map.removeLayer(marker);
                    });
                    markers = [];
                }
                
                function calculateDistance(node1, node2) {
                    const lat1 = 10000*node1.lat;
                    const lon1 = 10000*node1.lon;
                    const lat2 = 10000*node2.lat;
                    const lon2 = 10000*node2.lon;
                    
                    // Use a simple formula to calculate distance (you can replace this with a more accurate formula if needed)
                    const distance = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2));
                    
                    return distance;
                }
                
                function displayPathOnMap(path) {
                    for (let i = 0; i < path.length - 1; i++) {
                        const currentNode = graph.getNodeById(path[i]);
                        const nextNode = graph.getNodeById(path[i + 1]);
                        
                        // Draw the path on the map
                        const polyline = L.polyline([[currentNode.lat, currentNode.lon], [nextNode.lat, nextNode.lon]], { color: 'blue', weight:1 }).addTo(map);
                    }
                }
                
                
        const graph=new Graph();
        const overpassNodesUrl = 'https://overpass-api.de/api/interpreter?data=%2F*%0AThis%20has%20been%20generated%20by%20the%20overpass-turbo%20wizard.%0AThe%20original%20search%20was%3A%0A%E2%80%9Ctype%3Anode%20in%20HaNoi%E2%80%9D%0A*%2F%0A%5Bout%3Ajson%5D%3B%0Anode%2821.00020%2C105.84436%2C21.00472%2C105.84956%29%3B%0Aout%3B%0A%0A%0A';
        const overpassWaysUrl =  'https://overpass-api.de/api/interpreter?data=%2F*%0AThis%20has%20been%20generated%20by%20the%20overpass-turbo%20wizard.%0AThe%20original%20search%20was%3A%0A%E2%80%9Ctype%3Anode%20in%20HaNoi%E2%80%9D%0A*%2F%0A%5Bout%3Ajson%5D%3B%0Away%2821.00020%2C105.84436%2C21.00472%2C105.84956%29%3B%0Aout%3B%0A%0A%0A';
            Promise.all([
                    fetch(overpassNodesUrl)
                    .then(response => response.json())
                    .then(data => {
                            data.elements.forEach(element => {
                                if (element.type === 'node' && element.lat && element.lon) {
                                    graph.addNode(element.id, element.lat, element.lon);
                                }
                            });
                        })
                        .catch(error => {
                            console.error('Error fetching node data:', error);
                        }),
                    fetch(overpassWaysUrl)
                    .then(response => response.json())
                    .then(data => {
                        data.elements.forEach(element => {
                            if (element.type === 'way' && element.nodes) {
                                graph.addWay(element.id, element.nodes, element.tags);
                            }
                        });
                    })    
                    .catch(error => {
                        console.error('Error fetching way data:', error);
                    })

                ])
    // console.log(graph);
    // for (const [wayId, way] of graph.ways) {
    //         const wayNodes = way.nodes.map(nodeId => graph.getNodeById(nodeId));
        
    //         // Check if node is valid before accessing lat and lon
    //         const latLngs = wayNodes
    //             .filter(node => node && node.lat !== undefined && node.lon !== undefined)
    //             .map(node => [node.lat, node.lon]);
    //         console.log(wayNodes)
    //         L.polyline(latLngs, { color: 'gray',weight:1 }).addTo(map);
    //}

                    startInput.addEventListener('input', handleInputEvent);
                    targetInput.addEventListener('input', handleInputEvent);
                    function handleInputEvent(){
                        startNodeId = Number(startInput.value);
                        targetNodeId = Number(targetInput.value);
                        
                        console.log(startNodeId,targetNodeId);

                        const startNode = graph.getNodeById(startNodeId);
                        const targetNode = graph.getNodeById(targetNodeId);
                                        
                        clearMarkers();

                        if (startNode) {
                            addMarkerToMap(startNode);
                        }
                        if (targetNode) {
                            addMarkerToMap(targetNode);
                        }
                        
                    }

console.log(graph);
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
    }
