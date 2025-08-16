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


export default function App() {
  const [dbData, setDbData] = useState(null);
  const [tables, setTables] = useState([]);
  const { Dragger } = Upload;

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
    action: "http://localhost:4000/upload", // endpoint backend
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

  if (!dbData) return <div>Loading...</div>;

  return (
    <div>
      <div style={{position:"fixed", top: 0, left:0 , width: "400px", margin: "20px auto" }}>
        <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">Kéo thả file Excel vào đây</p>
      </Dragger> 
      </div>
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
                position: "relative",
              }}
            >
              { }
              <button
                onClick={() => deleteTable(table.id)}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  display: "flex",             // căn giữa bằng flex
                  alignItems: "center",
                  justifyContent: "center",
                  width: "18px",
                  height: "18px",
                  background: "transparent",
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: "12px",            // nhỏ hơn một chút cho giống tab
                  color: "#555",
                  padding: 0,                  // bỏ padding mặc định
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