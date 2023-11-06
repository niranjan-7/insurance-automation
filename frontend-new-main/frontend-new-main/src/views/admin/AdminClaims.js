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
import { host } from '../../host'

function AdminClaim() {

  const [claim, setClaim] = useState({
    id: '',
    amount_settled: '',
    claim_date: '',
    claim_status: ''
  });

  const check_status = () => {
    if(claim.claim_status == 'APPROVED') {
      if(claim.amount_settled == '') {
         return false
      }
    }
    return true
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(claim)
    // new Form()
    const data = new FormData(event.target);
    axios.post(`${host}/claim/approveclaim`, data, 
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('user-token')}`
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
    setClaim({ ...claim, [name]: value });
  };

  // const token = localStorage.getItem('user-token');
  const [Claims, setClaims] = useState([]);

  useEffect(() => {
      axios.get(`${host}/claim/getalladminclaims`, {
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
              <Card.Title as="h4">All Claims</Card.Title>
            </Card.Header>
            <Card.Body className="table-full-width table-responsive px-0">
             {Claims ? 
              <Table className="table-hover table-striped">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Amount Claimed</th>
                    <th scope="col">Amount Settled</th>
                    <th scope="col">Claim status</th>
                  </tr>
                </thead>
                <tbody>
                    {Claims && Claims.map((policy) => (
                      <tr key={policy.id} className="pb-2">
                        <td>{policy.id}</td>
                        <td>{policy.amount_claimed}</td>
                        <td>{policy.amount_settled ? policy.amount_settled: 0}</td>
                        <td>{policy.claim_date}</td>
                        <td>{policy.claim_status}</td>
                      </tr>
                      ))
                  }
                </tbody>
              </Table> :
              <h1 className='d-flex p-2 pt-5'>No claims</h1>}
            </Card.Body>
          </Card>
        </Col>
        <Col md="12">
          <Card className="card-plain table-plain-bg">
            <Card.Header>
              <Card.Title as="h4">Approval Section</Card.Title>
              <p className="card-category">
                Approve or Reject claims
              </p>
            </Card.Header>
            <Card.Body className="table-full-width table-responsive px-0">
                <Form onSubmit={(event) => {
                  if(check_status()){
                    handleSubmit(event)
                  }
                  else {
                    alert('Enter the amount')
                  }
                }} className="mt-5">
                  <Form.Group controlId="id">
                    <Form.Label>ID</Form.Label>
                    <Form.Control type="text" name="id" value={claim.id} onChange={handleChange} required/>
                  </Form.Group>
                  <Form.Group controlId="amount_claimed" className='pt-5'>
                    <Form.Label>Amount Settled</Form.Label>
                    <Form.Control type="text" name="amount_settled" value={claim.amount_claimed} onChange={handleChange} />
                  </Form.Group>
                  <Form.Group controlId="claim_status" className='pt-5'>
                    <Form.Label>Claim Status</Form.Label>
                    <Form.Control as="select" name="claim_status" value={claim.claim_status} onChange={handleChange} required>
                      <option value="">Select Status</option>
                      <option value="APPROVED">Approve</option>
                      <option value="REJECTED">Reject</option>
                    </Form.Control>
                  </Form.Group>
                  <Button type="submit" className="mt-5">Submit</Button>
                </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </>
  );
}

export default AdminClaim;
