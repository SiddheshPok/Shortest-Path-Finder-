// Graph of distances between zip codes (adjacency list)
const zipDistances = {
    "123450": { "234560": 10, "345670": 15 },
    "234560": { "123450": 10, "345670": 20, "456780": 30 },
    "345670": { "123450": 15, "234560": 20, "456780": 5 },
    "456780": { "234560": 30, "345670": 5 }
};

// Dijkstra's Algorithm
function dijkstra(start, end) {
    const distances = {},
        previous = {},
        queue = {};
    Object.keys(zipDistances).forEach(zip => {
        distances[zip] = Infinity;
        previous[zip] = null;
    });
    distances[start] = 0;
    queue[start] = 0;

    //until there are no more zip codes in the queue
    while (Object.keys(queue).length) {
        const current = Object.keys(queue).reduce((a, b) => (queue[a] < queue[b] ? a : b));
        const currentDistance = queue[current];
        delete queue[current];

        if (current == end) break; // Stop if we reach the destination

        for (let neighbor in zipDistances[current]) {
            const newDistance = currentDistance + zipDistances[current][neighbor];
            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance;
                previous[neighbor] = current;
                queue[neighbor] = newDistance;
            }
        }
    }

    if (distances[end] == Infinity) return "No route found";

    // Build the route
    let route = [],
        at = end;
    while (at) {
        route.unshift(at);
        at = previous[at];
    }

    return `Shortest Distance: ${distances[end]} KM, Route: ${route.join(" -> ")}`;
}

// Handle form submission
document.getElementById('dispatchForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevents the form from being submitted

    const startZip = document.getElementById('startZip').value;
    const endZip = document.getElementById('endZip').value;
    const resultElement = document.getElementById('result');

    if (!zipDistances[startZip] || !zipDistances[endZip]) {
        resultElement.textContent = "Invalid zip codes";
        resultElement.className = "error";
    } else {
        const result = dijkstra(startZip, endZip);
        resultElement.textContent = result;
        resultElement.className = result.includes("Shortest Distance") ? "success" : "error";
    }
});