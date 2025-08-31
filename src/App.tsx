import './App.css'

import {useState} from "react";

import GeocodeTable from './components/GeoTable';
import TeamTable from './components/TeamTable';
import Assignments from './components/Assignments';
import Description from "./components/Description.tsx";
import BerlinMap from "./components/BerlinMap.tsx";
import type {OrderRow, TeamRow, TeamWithOrders} from "./models/Models.ts";


function App() {
    const [geoRows, setGeoRows] = useState<OrderRow[]>([
        {street: "", fullAddress: "", lat: "", lon: ""},
    ]);

    const [teamRows, setTeamRows] = useState<TeamRow[]>([
        {name: ""},
    ]);

    const [teamsWithOrders, setTeamsWithOrders] = useState<TeamWithOrders[]>([
        {name: "", orders: []},
    ]);

    return (
        <>
            <div>
                <Description/>
            </div>
            <div className="Orders">
                <div style={{padding: '2rem', fontFamily: 'sans-serif'}}>
                    <h1>Orders</h1>
                    <GeocodeTable rows={geoRows} setRows={setGeoRows}/>
                </div>
            </div>
            <div className="Teams">
                <div style={{padding: '2rem', fontFamily: 'sans-serif'}}>
                    <h1>Teams</h1>
                    <TeamTable rows={teamRows} setRows={setTeamRows}/>
                </div>
            </div>
            <div className="Assignments">
                <div style={{padding: '2rem', fontFamily: 'sans-serif'}}>
                    <h1>Assignments</h1>
                    <Assignments orderData={geoRows} teamData={teamRows} setTeamsWithOrders={setTeamsWithOrders}/>
                </div>
            </div>
            <div>
                <h2 style={{textAlign: 'center'}}>Orders on the map</h2>
                <BerlinMap teams={teamsWithOrders}/>
            </div>
        </>
    )
}

export default App;
