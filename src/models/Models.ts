export type TeamRow = {
    name: string;
};

export type OrderRow = {
    street: string;
    fullAddress: string;
    lat: string;
    lon: string;
};

export type GeoPoint = {
    street: string;
    fullAddress: string;
    lat: number;
    lon: number;
};

export type TeamWithOrders = {
    name: string;
    orders: OrderRow[];
};