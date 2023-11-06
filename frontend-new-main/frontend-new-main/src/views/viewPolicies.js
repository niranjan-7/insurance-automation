import { useEffect, useState } from 'react';
import axios from 'axios';
import { host } from '../host';
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";

function ViewPolicies() {
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
                      <th className="border-0">Period</th>
                      <th className="border-0">Agent</th>
                      <th className="border-0">Customer</th>
                      <th className="border-0">Claims</th>
                    </tr>
                  </thead>
                  <tbody>
                    {policies && policies.map((policy) => (
                      <tr>
                        <td>{policy.id}</td>
                        <td>{policy.policy_type}</td>
                        <td>₹{policy.premium_amount}</td>
                        <td>₹{policy.policy_amount}</td>
                        <td>{policy.policy_start_date}</td>
                        <td>{policy.payment_frequency_type}</td>
                        <td>{policy.agent_name}</td>
                        <td>{policy.customer_name}</td>
                        <td>{policy.claims_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ViewPolicies;
