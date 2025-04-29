import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { notification, Table } from "antd";
// import maleGenericimage from "../../../../image/images/malegeneric.png";
import maleGenericimage from "../../../image/images/malegeneric.png";
const ClassRoom = () => {
  const token = localStorage.getItem("accessToken");
  const [listData, setListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [siblingID, setSiblingID] = useState("");
  const [visible, setVisible] = useState(false);
  const [isAddSiblingModalOpen, setIsAddSiblingModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    itsNo: "",
    password: "",
  });

  const [Popup1, setPopup1] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmission = async () => {
    if (!formData?.itsNo || !formData?.password) {
      notification.warning({
        message: "warning",
        description: "Plese fill both the fields",
      });
      return;
    }
    try {
      // Perform the POST request with form data in the body
      const response = await axios.post(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/users/siblings`,
        {
          itsNo: formData.itsNo, // Send form data in the body
          password: formData.password,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setFormData({ itsNo: "", password: "" });
      notification.success({
        message: "sucess",
        description: "Add sibling successfully",
      });
      getSiblings();
    } catch (error) {
      console.error("Error during form submission:", error);
      notification.error({
        message: "Error",
        description: error?.response?.data?.message,
      });
      // Optionally handle the error by showing an error message
      setVisible(false);
    }
  };

  const [passwordType, setPasswordType] = useState(false);

  const getSiblings = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/users/siblings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setListData(response.data.siblings);
      }
    } catch (error) {
      console.error("Error fetching siblings:", error);
    }
  };

  const updateSiblings = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/users/siblings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setListData(response.data.siblings);
      }
    } catch (error) {
      setListData([]);
      console.error("Error fetching siblings:", error);
    }
  };

  useEffect(() => {
    getSiblings();
  }, []);

  const columns = [
    {
      title: "Sr. No.",
      render: (_, __, index) => (currentPage - 1) * limit + index + 1,
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "firstName",
      render: (text, record) => (
        <div className="d-flex align-items-center justify-content-center">
          <img
            crossorigin="http://111.118.252.246:3002"
            src={
              record.photo
                ? `${process.env.REACT_APP_DEV_BASE_URL}/uploads/${record.photo}`
                : maleGenericimage
            }
            alt="User profile" 
            style={{ height: "50px" }}
            className=" rounded-circle image-table"
          />
          <span>{`${text} ${record.lastName}`}</span>
        </div>
      ),
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
    },
    {
      title: "ITS No.",
      dataIndex: "itsNo",
      align: "center",
    },
    {
      title: "Action",
      render: (_, record) => (
        <button
        
          onClick={() => {
            setSiblingID(record._id);
            setVisible(true);
          }}
          data-bs-toggle="modal"
          data-bs-target="#delete-modal"
        > 
          <i className="ti ti-trash-x me-2" />
          Delete
        </button>
      ),
      align: "center",
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(true);
  const removeSelected = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_DEV_BASE_URL}/api/v1/users/siblings`,
        {
          data: { siblingId: siblingID },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVisible(false);
      updateSiblings();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error removing sibling:", error);
    }
  };
  return (
    <div>
      <>
        <div className="page-wrapper">
          <div className="content">
            <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
              <div className="my-auto mb-2">
                <h3 className="page-title mb-1" style={{fontSize:"x-large"}}>Siblings</h3>
              </div>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
                <div className="mb-2">
                  <Link
                    to="#"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#add_class_room"
                  >
                    <i className="ti ti-square-rounded-plus-filled me-2" />
                    Add Sibling
                  </Link>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body p-0 py-3">
                <Table columns={columns} dataSource={listData} rowKey="_id" />
              </div>
            </div>
          </div>
        </div>
      </>
      <div>
        {/* Add Siblings */}
        <div className="modal fade" id="add_class_room">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Siblings</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>

              <form>
                <div className="modal-body">
                  <p style={{ color: "black" }}>
                    Please enter the ITS and Password of the Sibling you want to
                    add which you have received over email from the school
                  </p>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">ITS No.</label>
                        <input
                          type="text"
                          className="form-control"
                          name="itsNo"
                          value={formData.itsNo}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                          type="text"
                          className="form-control"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link to="#" className="btn btn-light me-2">
                    Cancel
                  </Link>
                  <Link
                    to="#"
                    onClick={handleFormSubmission}
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Add Siblings
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Delete Modal */}

        <div className="modal fade" id="delete-modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form>
                <div className="modal-body text-center">
                  <span className="delete-icon">
                    <i className="ti ti-trash-x" />
                  </span>
                  <h4>Confirm Deletion</h4>
                  <p>You want to delete this sibling</p>
                  <div className="d-flex justify-content-center">
                    <Link
                      to="#"
                      className="btn btn-light me-3"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <Link
                      to="#"
                      onClick={removeSelected}
                      className="btn btn-danger"
                      data-bs-dismiss="modal"
                    >
                      Yes, Delete
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Delete Modal */}
      </div>
    </div>
  );
};

export default ClassRoom;
