import type {TeamRow} from "../models/Models.ts";

type Props = {
    rows: TeamRow[];
    setRows: React.Dispatch<React.SetStateAction<TeamRow[]>>;
};

const TeamTable: React.FC<Props> = ({ rows, setRows }) => {
    const updateRow = (index: number, value: string) => {
        const updatedRows = [...rows];
        updatedRows[index].name = value;
        setRows(updatedRows);
    };

    const addRow = () => {
        setRows([...rows, { name: "" }]);
    };

    const deleteRow = (index: number) => {
        setRows(rows.filter((_, i) => i !== index));
    };

    return (
        <div>
            <button onClick={addRow} style={{ marginBottom: "1rem" }}>
                Add Row
            </button>
            <table border={1} cellPadding={5} style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {rows.map((row, i) => (
                    <tr key={i}>
                        <td>
                            <input
                                type="text"
                                value={row.name}
                                onChange={(e) => updateRow(i, e.target.value)}
                            />
                        </td>
                        <td>
                            <button onClick={() => deleteRow(i)} style={{ color: "red" }}>
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

export default TeamTable;
