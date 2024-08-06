// Performs Breadth-First Search; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, allowing us to compute the path by backtracking from the finish node.
export function breadthFirstSearch(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    const unvisitedNodes = [];
    unvisitedNodes.push(startNode);

    while (unvisitedNodes.length > 0) {
        const currentNode = unvisitedNodes.shift();

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
                unvisitedNodes.push(neighbor);
            }
        }
        if (unvisitedNodes.length === 0) return visitedNodesInOrder;
    }
    return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    if (row > 0) neighbors.push(grid[row - 1][col]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

// Backtracks from the finishNode to find the path.
// Only works when called *after* the breadthFirstSearch method above.
export function bfsPath(finishNode) {
    const nodesInPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInPathOrder;
}
