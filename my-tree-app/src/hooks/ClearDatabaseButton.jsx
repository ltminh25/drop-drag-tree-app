import React from "react";
import axios from "axios";
import "./ClearDatabaseButton.css"; // Import your CSS styles

function ClearDatabaseButton() {
  const handleClear = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ database không?")) {
      try {
        const res = await axios.delete("http://localhost:4000/admin/clear-database");
        alert(res.data.message);
      } catch (err) {
        alert("Xóa thất bại: " + err.message);
      }
    }
  };

  return (
    <button 
      onClick={handleClear} 
      className="clear-btn"
    >
      Xóa toàn bộ Items
    </button>
  );
}

export default ClearDatabaseButton;
