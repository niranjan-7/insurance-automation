import React, {useState, useEffect} from "react";

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

import axios from "axios";
import { host } from '../../host'

function AdminPolicy() {

  const [Policies, setPolicies] = useState([]);

  useEffect(() => {
    axios.get(`${host}/policy/getalladminpolicy`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('user-token')}`
    }
  })
    .then(response => {
      setPolicies(response.data);
      console.log(response.data)
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
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
              {Policies ? 
              <Table className="table-hover table-striped">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Policy Amount</th>
                    <th scope="col">Policy Start Date</th>
                    <th scope="col">Policy End Date</th>
                    <th scope="col">Policy Type</th>
                    <th scope="col">Premium Amount</th>
                  </tr>
                </thead>
                <tbody>
                    {Policies && Policies.map((policy) => (
                      <tr key={policy.id} className="pb-2">
                        <td>{policy.id}</td>
                        <td>{policy.policy_amount}</td>
                        <td>{policy.policy_start_date}</td>
                        <td>{policy.policy_end_date}</td>
                        <td>{policy.policy_type}</td>
                        <td>{policy.premium_amount}</td>
                      </tr>
                      ))
                  }
                </tbody>
              </Table> :
              <h1 className='d-flex p-2 pt-5'>No Policies</h1>}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AdminPolicy;
