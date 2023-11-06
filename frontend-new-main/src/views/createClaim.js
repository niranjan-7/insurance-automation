import React, {useState, useEffect } from "react";
import { host } from "../host";
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Table,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";

import axios from "axios";

function CreateClaim() {
  const [formData, setFormData] = useState({
    policy_id: '',
    amount_claimed: ''
  });

  const token = localStorage.getItem('user-token');
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    axios.get(`${host}/policy`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setPolicies(response.data);
      })
      .catch(error => {
        // handle error here
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData)
    // new Form()
    const data = new FormData(event.target);
    axios.post(`${host}/claim/postclaims`, data, 
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(function (response) {
        if(response.status == 200) {
          alert('Success! Claim Response Submitted')
          location.reload()
        }
      })
      .catch(function (error) {
        if(error.code == "ERR_BAD_REQUEST") {
          alert('Failed ' + error?.response.data.message)
        }
      });
    
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
    <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Policies</Card.Title>
                <p className="card-category">
                  User Policies
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">Name</th>
                      <th className="border-0">Premium</th>
                      <th className="border-0">Policy</th>
                      <th className="border-0">Start Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {policies && policies.map((policy) => (
                      <tr>
                        <td>{policy.id}</td>
                        <td>{policy.policy_type}</td>
                        <td>{policy.premium_amount}</td>
                        <td>{policy.policy_amount}</td>
                        <td>{policy.policy_start_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {policies ?
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="p-5">
              <Card.Header>
                <Card.Title as="h4">Create Claims</Card.Title>
              </Card.Header>
              <Card.Body className="all-icons">
                  <Form onSubmit={handleSubmit}>
                      <Form.Group controlId="formPolicyId" className="mt-5">
                        <Form.Label>Policy ID</Form.Label>
                        <Form.Control
                          type="text"
                          name="policy_id"
                          value={formData.policy_id}
                          onChange={handleChange}
                          placeholder="Id"
                          className="border"
                        />
                      </Form.Group>

                      <Form.Group controlId="formAmountClaimed" className="mt-5">
                        <Form.Label>Amount Claimed</Form.Label>
                        <Form.Control
                          type="text"
                          name="amount_claimed"
                          value={formData.amount_claimed}
                          onChange={handleChange}
                          className="border"
                        />
                      </Form.Group>

                      <Button variant="primary" type="submit" className="mt-5">
                        Submit
                      </Button>
                    </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
       : "No policies to claim" }
    </>
  );
}

export default CreateClaim;
