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

function ViewPayments() {
  const token = localStorage.getItem('user-token');
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    getPayments();
  }, []);

  const getPayments = () => {
    axios.get(`${host}/payment`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setPayments(response.data);
      })
      .catch(error => {
        // handle error here
      });
  }

  const pay = (id) => {
    axios.put(`${host}/payment`, {
      id
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        alert('Paid');
        getPayments();
      })
      .catch(error => {
        // handle error here
      });
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Payments</Card.Title>
                <p className="card-category">
                  Discount for no claim: 20%
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">Due On</th>
                      <th className="border-0">Amount</th>
                      <th className="border-0">Policy</th>
                      <th className="border-0">Agent</th>
                      <th className="border-0">Customer</th>
                      <th className="border-0">Policy Type</th>
                      <th className="border-0">Paid</th>
                      <th className="border-0">Claims</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments && payments.map((policy) => (
                      <tr>
                        <td>{policy.id}</td>
                        <td>{policy.payment_date}</td>
                        <td>
                          <span>₹{policy.claims_count === 0 ? (
                            policy.payment_amount - 0.2 * policy.payment_amount
                          ) : policy.payment_amount}</span>
                          {policy.claims_count === 0 && <span style={{ textDecoration: 'line-through', paddingLeft: '5px', fontSize: '15px' }}>
                            ₹{policy.payment_amount}
                          </span>}
                        </td>
                        <td>{policy.policy_id}</td>
                        <td>{policy.agent_name}</td>
                        <td>{policy.customer_name}</td>
                        <td>{policy.policy_type}</td>
                        <td>{policy.paid ? 'Paid' : 'Not Paid'}</td>
                        <td>{policy.claims_count}</td>
                        <td>
                          {!policy.paid && <Button
                            className="btn-fill pull-right"
                            type="submit"
                            variant="info"
                            onClick={() => { pay(policy.id) }}
                          >
                            Pay
                          </Button>}
                        </td>
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

export default ViewPayments;
