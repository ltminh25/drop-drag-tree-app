import React, { useEffect, useState } from "react";
import {
  UncontrolledTreeEnvironment,
  StaticTreeDataProvider,
  Tree
} from "react-complex-tree";
import "react-complex-tree/lib/style-modern.css";

export default function App() {
  const [dbData, setDbData] = useState(null);
  const [tables, setTables] = useState([]);
  useEffect(() => {
    fetch("http://localhost:4000/api/tree")
      .then((res) => res.json())
      .then((data) => {
        setDbData(data);
        setTables([{ id: "tree-1", rootId: "root", data }]); // Dùng data từ API
      });
  }, []);

  const addTable = () => {
    const newId = `tree-${tables.length + 1}`;
    const emptyRoot = {
      [`${newId}-root`]: {
        index: `${newId}-root`,
        isFolder: true,
        children: [],
        data: `Table ${tables.length + 1}`,
      },
    };
    setTables([
      ...tables,
      { id: newId, rootId: `${newId}-root`, data: emptyRoot },
    ]);
  };

  if (!dbData) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={addTable}>Thêm bảng</button>
      <UncontrolledTreeEnvironment
        canDragAndDrop
        canDropOnFolder
        canReorderItems
        getItemTitle={(item) => item.data}
        dataProvider={
          new StaticTreeDataProvider(
            tables.reduce((acc, table) => ({ ...acc, ...table.data }), {}),
            (item, data) => ({ ...item, data })
          )
        }
        viewState={{}}
      >
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          {tables.map((table) => (
            <div
              key={table.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                backgroundColor: "white",
                width: "250px",
              }}
            >
              <Tree
                treeId={table.id}
                rootItem={table.rootId}
                treeLabel={`Tree ${table.id}`}
              />
            </div>
          ))}
        </div>
      </UncontrolledTreeEnvironment>
    </div>
  );
}