import React, { useEffect, useState } from "react";
import usersService from "../../services/useService";
import Pagination from "../components/Paging/Pagination";
import { toast } from "react-toastify";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { arrayMoveImmutable } from "array-move";
import { MenuOutlined } from "@ant-design/icons";
import { Table, Space, Popconfirm, Modal, Input, Spin, Form, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./style.css";
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";

const DragHandle = SortableHandle(() => (
  <MenuOutlined
    style={{
      cursor: "grab",
      color: "#999",
    }}
  />
));

const UserManager = () => {
  const [formModal] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [dataUser, setDataUser] = useState([]);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);
  const navigate = useNavigate();

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = dataUser.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (localStorage.getItem("user") === null) {
    navigate("/");
  }

  const handleLogout = () => {
    var loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      localStorage.removeItem("user");
      navigate("/");
      toast.success("Sign out successful!");
    }
  };

  useEffect(() => {
    loadDataUser();
  }, []);

  const loadDataUser = () => {
    setLoading(true);
    usersService.getListUsers().then((res) => {
      setDataUser(res);
      setLoading(false);
    });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const createUser = () => {
    formModal.resetFields();
    formModal.setFieldsValue({
      id: dataUser.length + 1,
    });
    setVisible(true);
  };

  const openModal = (id) => {
    usersService.getIdUsers(id).then((res) => {
      res.map((x) =>
        formModal.setFieldsValue({
          id: x.id,
          name: x.name,
          age: x.age,
          address: x.address,
        })
      );
    });
    setVisible(true);
  };

  const onFinish = (values) => {
    const index = dataUser.findIndex((item) => item.id === values.id);
    if (values.age > 100 || values.age < 1) {
      toast.error("Age invalid!");
      setVisible(true);
    } else {
      if (index > -1) {
        usersService.updateUsers(values.id, values).then((res) => {
          loadDataUser();
          toast.success("Edit User successful!");
        });
      } else {
        usersService.createUsers(values).then((res) => {
          loadDataUser();
          toast.success("Create User successful!");
        });
      }
      handleCancel();
    }
  };

  const handleDelete = (id) => {
    usersService.deleteUsers(id).then((res) => {
      loadDataUser();
      toast.success("Delete User successful!");
    });
  };

  const handleData = (item) => {
    localStorage.setItem("userInfo", JSON.stringify(item));
  };

  const FilterByNameInput = (
    <Input
      placeholder="Search Name"
      value={value}
      onChange={(e) => {
        const currValue = e.target.value;
        setValue(currValue);
        const filteredData = dataUser.filter((e) =>
          e.name.toLowerCase().includes(currValue)
        );
        setDataUser(filteredData);
        if (value !== "") {
          loadDataUser();
        }
      }}
    />
  );

  const columns = [
    {
      title: FilterByNameInput,
      dataIndex: "sort",
      width: 180,
      className: "drag-visible",
      render: () => <DragHandle />,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 260,
      render: (text, record) => (
        <a
          onClick={() => {
            navigate(`/home/${record.id}`);
            handleData(dataUser.filter((x) => x.id === record.id));
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Action",
      key: "action",
      width: 150,

      render: (text, record) => (
        <Space size="middle">
          <button
            className="custom-btn btn-action"
            onClick={() => {
              openModal(record.id);
            }}
          >
            Edit
          </button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.id)}
          >
            <button className="custom-btn btn-action">Delete</button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const SortableItem = SortableElement((props) => <tr {...props} />);
  const SortableBody = SortableContainer((props) => <tbody {...props} />);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(
        dataUser.slice(),
        oldIndex,
        newIndex
      ).filter((el) => !!el);
      setDataUser(newData);
    }
  };

  const DraggableContainer = (props) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const index = dataUser.findIndex((x) => x.id === restProps["data-row-key"]);
    return <SortableItem index={index} {...restProps} />;
  };

  return (
    <div className="content">
      <h1 className="page-title">User Manager</h1>

      <button className="bn632-hover bn25" onClick={handleLogout}>
        <RiLogoutBoxRFill className="icon-logout" />
      </button>

      <div className="center">
        <div className="btn">
          <button className="bn632-hover bn21" onClick={createUser}>
            Create User
          </button>
        </div>

        {loading && (
          <Col style={{ textAlign: "center" }} span={24}>
            <Spin tip="loading..." />
          </Col>
        )}

        <Table
          pagination={false}
          dataSource={currentPosts}
          columns={columns}
          rowKey="id"
          components={{
            body: {
              wrapper: DraggableContainer,
              row: DraggableBodyRow,
            },
          }}
        />
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={dataUser.length}
          paginate={paginate}
        />
      </div>

      <Modal
        title="User Manager"
        visible={visible}
        onCancel={handleCancel}
        footer={
          <button
            className="bn632-hover bn21 btn-submit"
            mlType="submit"
            form="formModal"
          >
            Save
          </button>
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          form={formModal}
          name="formModal"
          onFinish={onFinish}
        >
          <Form.Item name="id" label="Id">
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input name !" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="age"
            label="Age"
            rules={[{ required: true, message: "Please input age !" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please input address !" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default UserManager;
