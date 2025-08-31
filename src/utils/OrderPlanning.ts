import type {GeoPoint, OrderRow, TeamRow, TeamWithOrders} from "../models/Models.ts";

function computeDistance(a: GeoPoint, b: GeoPoint): number {
    const dLat = a.lat - b.lat;
    const dLon = a.lon - b.lon;
    return dLat * dLat + dLon * dLon; // Euclidean squared distance
}

function nearestNeighborRoute(startIndex: number, points: GeoPoint[]): GeoPoint[] {
    const visited: boolean[] = Array(points.length).fill(false);
    const path: GeoPoint[] = [];

    let currentIndex = startIndex;
    path.push(points[currentIndex]);
    visited[currentIndex] = true;

    for (let step = 1; step < points.length; step++) {
        let nearestIndex = -1;
        let nearestDistance = Infinity;

        for (let i = 0; i < points.length; i++) {
            if (!visited[i]) {
                const dist = computeDistance(points[currentIndex], points[i]);
                if (dist < nearestDistance) {
                    nearestDistance = dist;
                    nearestIndex = i;
                }
            }
        }

        if (nearestIndex !== -1) {
            visited[nearestIndex] = true;
            path.push(points[nearestIndex]);
            currentIndex = nearestIndex;
        }
    }

    return path;
}

function totalDistance(path: GeoPoint[]): number {
    let sum = 0;
    for (let i = 1; i < path.length; i++) {
        sum += computeDistance(path[i], path[i - 1]);
    }
    return sum;
}

export function orderGeoLocationsBestStart(rows: OrderRow[]): OrderRow[] {
    if (rows.length <= 1) return rows;

    const points: GeoPoint[] = rows
        .map((r) => ({
            ...r,
            lat: parseFloat(r.lat),
            lon: parseFloat(r.lon),
        }))
        .filter((r) => !isNaN(r.lat) && !isNaN(r.lon));

    let bestPath: GeoPoint[] = [];
    let minDistance = Infinity;

    for (let i = 0; i < points.length; i++) {
        const path = nearestNeighborRoute(i, points);
        const dist = totalDistance(path);
        if (dist < minDistance) {
            minDistance = dist;
            bestPath = path;
        }
    }

    // Convert back to OrderRow[]
    return bestPath.map((r) => ({
        ...r,
        lat: r.lat.toString(),
        lon: r.lon.toString(),
    }));
}

export function assignOrdersToTeams(teams: TeamRow[], orders: OrderRow[]): TeamWithOrders[] {
    const totalTeams = teams.length;
    const totalOrders = orders.length;
    const avgSize = Math.floor(totalOrders / totalTeams);
    const remainder = totalOrders % totalTeams;

    const result: TeamWithOrders[] = [];
    let orderIndex = 0;

    for (let i = 0; i < teams.length; i++) {
        const size = avgSize + (i < remainder ? 1 : 0); // distribute remainder
        const assigned = orders.slice(orderIndex, orderIndex + size);
        result.push({
            name: teams[i].name,
            orders: assigned,
        });
        orderIndex += size;
    }

    return result;
}
