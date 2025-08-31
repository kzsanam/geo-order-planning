import React, {useRef} from "react";
import type {OrderRow} from "../models/Models.ts";


type Props = {
    rows: OrderRow[];
    setRows: React.Dispatch<React.SetStateAction<OrderRow[]>>;
};

const GeocodeTable: React.FC<Props> = ({ rows, setRows }) => {
    // We keep a map of timers per row index to debounce geocoding calls
    const debounceTimers = useRef<{ [key: number]: NodeJS.Timeout }>({});

    const geocode = async (street: string) => {
        const query = encodeURIComponent(`${street} Berlin`);
        const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&countrycodes=de`;
        const res = await fetch(url, {
            headers: {
                "User-Agent": "geo-finder/1.0 (your-email@example.com)",
            },
        });
        if (!res.ok) throw new Error("Geocoding failed");
        const data = await res.json();
        if (!data || data.length === 0) return null;

        return {
            fullAddress: data[0].display_name || "",
            lat: data[0].lat,
            lon: data[0].lon,
        };
    };

    const updateRow = (index: number, field: keyof OrderRow, value: string) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);

        if (field === "street") {
            // Clear any previous timer for this row
            if (debounceTimers.current[index]) {
                clearTimeout(debounceTimers.current[index]);
            }

            // Set a new timer to trigger geocode after inactivity
            debounceTimers.current[index] = setTimeout(async () => {
                if (updatedRows[index].street) {
                    try {
                        const geo = await geocode(updatedRows[index].street);
                        if (geo) {
                            updatedRows[index] = {
                                ...updatedRows[index],
                                ...geo,
                            };
                            setRows([...updatedRows]);
                        }
                    } catch {
                        updatedRows[index] = {
                            ...updatedRows[index],
                            fullAddress: "",
                            lat: "",
                            lon: "",
                        };
                        setRows([...updatedRows]);
                    }
                }
            }, 1500); // inactivity in ms
        }
    };

    const addRow = () => {
        setRows([...rows, {street: "", fullAddress: "", lat: "", lon: ""}]);
    };

    const deleteRow = (index: number) => {
        setRows(rows.filter((_, i) => i !== index));
    };

    return (
        <div>
            <button onClick={addRow} style={{marginBottom: "1rem"}}>
                Add Row
            </button>
            <table border={1} cellPadding={5} style={{borderCollapse: "collapse", width: "100%"}}>
                <thead>
                <tr>
                    <th>Street (input)</th>
                    <th>Full Address (generated)</th>
                    <th>Latitude (generated)</th>
                    <th>Longitude (generated)</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {rows.map((row, i) => (
                    <tr key={i}>
                        <td>
                            <input
                                type="text"
                                value={row.street}
                                onChange={(e) => updateRow(i, "street", e.target.value)}
                            />
                        </td>
                        <td>{row.fullAddress}</td>
                        <td>{row.lat}</td>
                        <td>{row.lon}</td>
                        <td>
                            <button onClick={() => deleteRow(i)} style={{color: "red"}}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default GeocodeTable;
