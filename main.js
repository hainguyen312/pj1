import {dijkstra} from "./dijkstra.js";
import {bfs} from "./bfs.js";
import {dfs} from "./dfs.js"
import { aStar } from "./A*.js";

const map = L.map('map').setView([21.0253060, 105.8554601], 16);
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
    }
    }
        const showDataBtn=document.getElementById('showData');
        const refreshBtn=document.getElementById('Refresh');
        const startInput = document.getElementById('startPlace');
        const targetInput = document.getElementById('targetPlace');
        
        function addMarkerToMap(node) {
            const marker = L.marker([node.lat, node.lon],).addTo(map);
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
                addMarkerToMap(graph.nodes[path[0]]);
                addMarkerToMap(graph.nodes[path[path.length-1]]);
                L.polyline([[currentNode.lat, currentNode.lon], [nextNode.lat, nextNode.lon]], { color: 'blue', weight:3}).addTo(map);
            }
        }

        function haversineDistance(lat1, lon1, lat2, lon2) {
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

        function calculateTotalDistance(path) {
            totalDistance = 0;
            for (let i = 0; i < path.length - 1; i++) {
                const currentNode = graph.nodes[path[i]];
                const nextNode = graph.nodes[path[i + 1]];
                const latitude1=currentNode.lat;
                const longitude1=currentNode.lon;
                const latitude2=nextNode.lat;
                const longitude2=nextNode.lon;
                const distance = haversineDistance(latitude1, longitude1, latitude2, longitude2);
                totalDistance += distance;
            }
            return totalDistance;
        }
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
            })
            .catch(error => {
                console.error('Error fetching node data:', error);
            })
            .then(()=>{
                showDataBtn.addEventListener('click', () => {
                    clearMap();
                
                    // Hiển thị tất cả các node trên bản đồ
                    graph.nodes.forEach(node => {
                        addMarkerToMap(node);
                    });
                
                    // Hiển thị tất cả các cạnh trên bản đồ
                    graph.edges.forEach(edge => {
                        const currentNode = graph.nodes[edge.node1];
                        const nextNode = graph.nodes[edge.node2];
                        L.polyline([[currentNode.lat, currentNode.lon], [nextNode.lat, nextNode.lon]], { color: 'red', weight: 2 }).addTo(map);
                    });
                });
                
                refreshBtn.addEventListener('click',clearMap);
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
                    }else if (selectedMethod === 'DFS') {
                        shortestPath = dfs(graph, startNodeId, targetNodeId);
                        displayPathOnMap(shortestPath);
                    }else if (selectedMethod === 'A*') {
                        shortestPath = aStar(graph, startNodeId, targetNodeId);
                        displayPathOnMap(shortestPath);
                    }
                    console.log(shortestPath);
                    alert(`Quãng đường đã di chuyển: ${calculateTotalDistance(shortestPath)} km`)
                }
                
            })
        ])
        