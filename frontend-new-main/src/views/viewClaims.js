import React, {useState, useEffect} from "react";

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Table,
  Form
} from "react-bootstrap";

import axios from 'axios';
import { host } from '../host'

function AdminClaim() {

  const [Claims, setClaims] = useState([]);

  useEffect(() => {
      axios.get(`${host}/claim/getallclaims`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('user-token')}`
      }
    })
      .then(response => {
        setClaims(response.data);
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
              <Card.Title as="h4">My Claims</Card.Title>
            </Card.Header>
            <Card.Body className="table-full-width table-responsive px-0">
             {Claims ? 
              <Table className="table-hover table-striped">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Amount Claimed</th>
                    <th scope="col">Amount Settled</th>
                    <th scope="col">Claim Date</th>
                    <th scope="col">Claim status</th>
                  </tr>
                </thead>
                <tbody>
                    {Claims && Claims.map((claim) => (
                      <tr key={claim.id} className="pb-2">
                        <td>{claim.id}</td>
                        <td>{claim.amount_claimed}</td>
                        <td>{claim.amount_settled ? claim.amount_settled: 0}</td>
                        <td>{claim.claim_date}</td>
                        <td>{claim.claim_status}</td>
                      </tr>
                      ))
                  }
                </tbody>
              </Table> :
              <h1 className='d-flex p-2 pt-5'>No claims</h1>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </>
  );
}

export default AdminClaim;
