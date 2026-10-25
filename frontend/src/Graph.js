// # Directed graph of pages registered in React Router
// # Each edge represents a navigation link between pages.
export const pageGraph = {
    home: ["home", "history", "favorites", "detail"],
    favorites: ["home", "history", "favorites", "detail"],
    history: ["home", "favorites", "history", "detail"],
    detail: ["home", "history", "favorites", "detail"],
};

// # Map page nodes to their React Router paths.
export const pagePaths = {
    home: "/",
    favorites: "/favorites.html",
    history: "/history.html",
    detail: "/plantDetail.html",
};

// # Nodes with a menuLabel are shown in the header when reachable from the current page.
export const pageLabels = {
    home: { title: "Home" },
    favorites: { title: "Favorites", menuLabel: "❤️ Favorites" },
    history: { title: "History", menuLabel: "🕘 Viewing history" },
    detail: { title: "Plant Detail" },
};

// # Use breadth-first search to determine whether a destination is reachable.
export function canReach(start, end, graph = pageGraph) {
    const queue = [start];
    const visited = new Set([start]);

    while (queue.length > 0) {
        const current = queue.shift();
        if (current === end) return true;

        for (const neighbor of graph[current] ?? []) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }

    return false;
}

// # Find pages unreachable from home or unable to navigate back home.
export function checkGraph() {
    const pages = Object.keys(pageGraph);
    return {
        orphans: pages.filter(page => !canReach("home", page)),
        deadEnds: pages.filter(page => !canReach(page, "home")),
    };
}
