import type {OrderRow, TeamRow, TeamWithOrders} from "../models/Models"
import {assignOrdersToTeams, orderGeoLocationsBestStart} from "../utils/OrderPlanning.ts";
import {useEffect} from "react";

type Props = {
    orderData: OrderRow[];
    teamData: TeamRow[];
    setTeamsWithOrders: React.Dispatch<React.SetStateAction<TeamWithOrders[]>>;
};

const teamColors = ["#e74c3c", "#3498db", "#2ecc71", "#9b59b6", "#e67e22", "#16a085", "#f1c40f"];

const CombinedConsumer: React.FC<Props> = ({ orderData, teamData, setTeamsWithOrders }) => {
    const ordered = orderGeoLocationsBestStart(orderData);
    const assigned = assignOrdersToTeams(teamData, ordered)

    // 🔹 Push into parent state whenever input changes
    useEffect(() => {
        setTeamsWithOrders(assigned);
    }, [assigned, setTeamsWithOrders]);

    return (
        <div>
            <h2>Teams and Orders:</h2>
            <div>
                {assigned.map((team, i) => (
                    <div key={i} style={{ marginBottom: "1rem" }}>
                        <h3 style={{ color: teamColors[i % teamColors.length] }}>{team.name}</h3>
                        <ol>
                            {team.orders.map((order, j) => (
                                <li key={j}>
                                    {order.fullAddress} (Lat: {order.lat}, Lon: {order.lon})
                                </li>
                            ))}
                        </ol>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CombinedConsumer;