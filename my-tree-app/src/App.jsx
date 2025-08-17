import React, { useEffect, useState } from "react";
import {
  UncontrolledTreeEnvironment,
  StaticTreeDataProvider,
  Tree
} from "react-complex-tree";
import "react-complex-tree/lib/style-modern.css";
import { Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import "./App.css"; // Import your CSS styles

export default function App() {
  const [dbData, setDbData] = useState(null);
  const [tables, setTables] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewState, setViewState] = useState({});
  const { Dragger } = Upload;

  useEffect(() => {
    fetch("http://localhost:4000/api/tree")
      .then((res) => res.json())
      .then((data) => {
        setDbData(data);
        setTables([{ id: "tree-1", rootId: "root", data }]);
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

  const deleteTable = (id) => {
    const table = tables.find(t => t.id === id);
    if (!table) return;

    const rootItem = table.data[table.rootId];
    if (rootItem.children.length > 0) {
      alert("Không thể xóa bảng nếu còn item");
      return;
    }

    setTables(tables.filter(t => t.id !== id));
  };

  const props = {
    name: "file",
    multiple: false,
    action: "http://localhost:4000/upload",
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        await axios.post("http://localhost:4000/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        message.success(`${file.name} đã upload thành công`);
        onSuccess("ok");
      } catch (err) {
        console.error(err);
        message.error(`${file.name} upload thất bại`);
        onError(err);
      }
    },
  };

  // tìm kiếm + tự expand cha
  useEffect(() => {
    if (!dbData) return;

    const allItems = tables.reduce((acc, table) => ({ ...acc, ...table.data }), {});
    const matches = Object.keys(allItems).filter((key) =>
      allItems[key].data.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const expanded = new Set(["root"]); // luôn mở root

    matches.forEach((matchId) => {
      let parent = Object.values(allItems).find((x) =>
        x.children.includes(matchId)
      );
      while (parent) {
        expanded.add(parent.index);
        parent = Object.values(allItems).find((x) =>
          x.children.includes(parent.index)
        );
      }
    });

    setViewState({
      "tree-1": {
        expandedItems: expanded,
      },
    });
  }, [searchTerm, dbData, tables]);

  if (!dbData) return <div>Loading...</div>;

  return (
    <div>
      {/* upload + search */}
      <div style={{ display: "flex", position:"absolute", top: 0, left:0, alignItems: "center", marginBottom: "20px" }}>
        <div style={{ flex: 1 }}>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">Kéo thả file Excel vào đây</p>
          </Dragger>
        </div>
        <div style={{ marginLeft: "20px" }}>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "6px 10px",
              width: "200px",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
        </div>
      </div>
      
      <div style={{ position: "absolute", top: "100px", left: 0, right: 0, textAlign: "center", marginBottom: "20px" }}>
          <button onClick={addTable} className="addTablebutton">Thêm bảng</button>
      </div>
      

      <UncontrolledTreeEnvironment
        canDragAndDrop
        canDropOnFolder
        canReorderItems
        getItemTitle={(item) => {
          if (searchTerm && item.data.toLowerCase().includes(searchTerm.toLowerCase())) {
            return <span style={{ backgroundColor: "yellow" }}>{item.data}</span>;
          }
          return item.data;
        }}
        dataProvider={
          new StaticTreeDataProvider(
            tables.reduce((acc, table) => ({ ...acc, ...table.data }), {}),
            (item, data) => ({ ...item, data })
          )
        }
        viewState={viewState}
      >
        <div style={{ display: "flex", position:"absolute", top:"150px", gap: "20px", marginTop: "40px" }}>
          {tables.map((table, tableIndex) => (
          <div
            key={table.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "5px 5px 5px 5px",
              backgroundColor: "white",
              width: "250px",
              position: "relative",
            }}
          >
            {/* Input đổi tên table */}
            <input
              type="text"
              value={table.name || `Table ${tableIndex + 1}`} // nếu chưa có name thì dùng Table 1,2,...
              onChange={(e) => {
                const newTables = [...tables];
                newTables[tableIndex].name = e.target.value; // lưu vào state
                setTables(newTables);
              }}
              style={{
                width: "200px",
                marginBottom: "5px",
                padding: "4px 6px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontWeight: "bold"
              }}
            />

            {/* Nút xóa table */}
            <button
              onClick={() => deleteTable(table.id)}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "18px",
                height: "18px",
                background: "transparent",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "12px",
                color: "#555",
                padding: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e0e0e0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              ×
            </button>

            {/* Container Tree với scroll */}
            <div className="scroll-container">
              <Tree
                treeId={table.id}
                rootItem={table.rootId}
                treeLabel={table.name || `Tree ${tableIndex + 1}`}
              />
            </div>
          </div>
        ))}

        </div>
      </UncontrolledTreeEnvironment>
    </div>
  );
}
