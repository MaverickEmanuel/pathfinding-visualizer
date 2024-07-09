// Performs Greedy Best-First Search; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, allowing us to compute the path by backtracking from the finish node.
export function greedyBFSearch(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.h = manhattanDistance(startNode, finishNode);
    const openSet = [startNode];

    while (openSet.length > 0) {
        sortNodesByH(openSet);
        const currentNode = openSet.shift();

        // If we encounter a wall, we skip it.
        if (currentNode.isWall) continue;

        // If the current node is already visited, we skip it.
        if (currentNode.isVisited) continue;

        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);

        // If we found the finish node, we return the visited nodes.
        if (currentNode === finishNode) return visitedNodesInOrder;

        const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid);
        for (const neighbor of unvisitedNeighbors) {
            if (!neighbor.isVisited && !neighbor.isWall) {
                neighbor.previousNode = currentNode;
                neighbor.h = manhattanDistance(neighbor, finishNode);
                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                }
            }
        }
    }
    return visitedNodesInOrder;
}

function sortNodesByH(openSet) {
    openSet.sort((nodeA, nodeB) => nodeA.h - nodeB.h);
}

function manhattanDistance(nodeA, nodeB) {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

// Backtracks from the finishNode to find the path.
// Only works when called *after* the greedyBestFirstSearch method above.
export function greedyBFPath(finishNode) {
    const nodesInPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInPathOrder;
}
