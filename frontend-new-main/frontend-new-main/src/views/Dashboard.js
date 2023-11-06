import React,{useState, useEffect} from "react";
import axios from "axios";

import { host } from '../host'
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
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

function Dashboard() {
  const [Policies, setPolicies] = useState([]);

  useEffect(() => {
    axios.get(`${host}/policy/getRecommendations`, {
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
                <Card.Title as="h4">Popular Policies</Card.Title>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
              {Policies ? 
              <Table className="table-hover table-striped">
                <thead>
                  <tr>
                    {/* <th scope="col">ID</th> */}
                    <th scope="col">Policy Type</th>
                    <th scope="col">Payment Period</th>
                    <th scope="col">Policy Amount</th>
                    {/* <th scope="col">Policy Start Date</th> */}
                    {/* <th scope="col">Policy End Date</th> */}
                    <th scope="col">Premium Amount</th>
                  </tr>
                </thead>
                <tbody>
                    {Policies && Policies.map((policy,id) => (
                      <tr key={id} className="pb-2">
                        {/* <td>{policy.id}</td> */}
                        <td>{policy[0]}</td>
                        <td>{policy[1]}</td>
                        <td>{policy[2]}</td>
                        {/* <td>{policy.policy_start_date}</td> */}
                        {/* <td>{policy.policy_end_date}</td> */}
                        <td>{policy[3]}</td>
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

export default Dashboard;
