import React from "react";

import { CFormInput, CButton } from "@coreui/react";
import axios from "axios";
import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

function AddCategory() {
  const [catName, setcatName] = useState("");
  const token = localStorage.getItem("accessToken");

  const handleChange = async () => {
    await axios.post(
      "http://18.118.42.224:3001/api/v1/categories",
      { name: catName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert("category made!");
    setcatName("");
  };

  return (
    <div>
      <CFormInput
        type="text"
        feedbackValid="Looks good!"
        id="val1"
        label="Category Name"
        required
        value={catName}
        onChange={(e) => {
          setcatName(e.target.value);
        }}
        name="schoolName"
      />
      <CButton className="btn btn-dark" onClick={handleChange}>
        submit
      </CButton>
    </div>
  );
}

export default AddCategory;
