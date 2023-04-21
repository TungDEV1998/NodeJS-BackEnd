import { Button, Form, Input, InputNumber, message, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductsCRUD = () => {
  const API_URL = "http://localhost:9000/products";
  const [refresh, setRefresh] = useState(0);
  const [createForm] = Form.useForm();
  const navigate = useNavigate();
  //Create a Data
  const handleCreate = (record: any) => {
    // console.log(record);

    axios
      .post(API_URL, record)
      .then((res) => {
        console.log(res);
        setRefresh((f) => f + 1);
        createForm.resetFields();
        message.success("Create a product successFully!!", 1.5);
        navigate("/products");
      })
      .catch((err) => {
        console.log(err.response.data.message);
        // err.response.data.errors.map((item: any, index: any) => {
        //   message.error(`${item}`, 5);
        // });
      });
  };

  //Update a data

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, [refresh]);
  useEffect(() => {
    axios
      .get("http://localhost:9000/categories")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.log(err));
  }, [refresh]);
  useEffect(() => {
    axios
      .get("http://localhost:9000/suppliers")
      .then((res) => {
        setSuppliers(res.data);
      })
      .catch((err) => console.log(err));
  }, [refresh]);

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const onChangeCategory = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onSearchCategory = (value: string) => {
    console.log("search:", value);
  };

  return (
    <>
      <Form
        className="container px-5"
        form={createForm}
        name="createForm"
        onFinish={handleCreate}
      >
        <Form.Item
          hasFeedback
          label="Category"
          name="categoryId"
          rules={[
            {
              required: true,
              message: "Please enter Category Name",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Select a person"
            optionFilterProp="children"
            onChange={onChangeCategory}
            onSearch={onSearchCategory}
            filterOption={(input: any, option: any) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={categories.map((item: any, index: any) => {
              return {
                label: `${item.name}`,
                value: item._id,
              };
            })}
          />
        </Form.Item>{" "}
        <Form.Item
          hasFeedback
          label="Suppliers"
          name="supplierId"
          rules={[
            {
              required: true,
              message: "Please enter Category Name",
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Select a person"
            optionFilterProp="children"
            onChange={onChangeCategory}
            onSearch={onSearchCategory}
            filterOption={(input: any, option: any) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={suppliers.map((item: any, index: any) => {
              return {
                label: `${item.name}`,
                value: item._id,
              };
            })}
          />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter Product Name",
            },
          ]}
        >
          <Input />
        </Form.Item>{" "}
        <Form.Item
          hasFeedback
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please enter Price" }]}
        >
          <InputNumber min={1} />
        </Form.Item>{" "}
        <Form.Item
          hasFeedback
          name="discount"
          label="Discount"
          rules={[
            {
              required: true,
              message: "Please enter Discount",
            },
          ]}
        >
          <InputNumber min={1} max={75} />
        </Form.Item>{" "}
        <Form.Item
          hasFeedback
          name="stock"
          label="Stock"
          rules={[{ required: true, message: "Please enter Stock" }]}
        >
          <InputNumber min={1} />
        </Form.Item>{" "}
        <Form.Item className="text-center">
          <Button type="primary" htmlType="submit">
            {" "}
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ProductsCRUD;
