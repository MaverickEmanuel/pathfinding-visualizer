// Performs A* Search; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, allowing us to compute the path by backtracking from the finish node.
export function aStarSearch(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.g = 0;
    startNode.h = manhattanDistance(startNode, finishNode);
    startNode.f = startNode.g + startNode.h;
    const openSet = [startNode];

    while (openSet.length > 0) {
        sortNodesByF(openSet);
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
            const tentativeG = currentNode.g + (neighbor.isWeight ? 15 : 1);
            
            neighbor.previousNode = currentNode;
            neighbor.g = tentativeG;
            neighbor.h = manhattanDistance(neighbor, finishNode);
            neighbor.f = neighbor.g + neighbor.h;

            if (!openSet.includes(neighbor)) {
                openSet.push(neighbor);
            }
        }
    }
    return visitedNodesInOrder;
}

function sortNodesByF(openSet) {
    openSet.sort((nodeA, nodeB) => nodeA.f - nodeB.f);
}

function manhattanDistance(nodeA, nodeB) {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    if (row > 0) neighbors.push(grid[row - 1][col]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

// Backtracks from the finishNode to find the path.
// Only works when called *after* the aStarSearch method above.
export function aStarPath(finishNode) {
    const nodesInPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInPathOrder;
}
