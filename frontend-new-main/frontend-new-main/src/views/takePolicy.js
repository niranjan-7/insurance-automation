import {
  Badge,
  Button,
  Card,
  Form,
  Navbar,
  Nav,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import axios from 'axios';
import { host } from '../host';
import { useEffect, useState } from 'react';

function TakePolicy() {
  const [policyData, setPolicyData] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState();
  const [role, setRole] = useState();
  const [selectedPeriod, setSelectedPeriod] = useState();
  const [selectedUser, setSelectedUser] = useState();
  const [customers, setCustomers] = useState();

  const token = localStorage.getItem('user-token');

  useEffect(() => {
    axios.get(`${host}/policy/policyTypes`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setPolicyData(response.data);
      })
      .catch(error => {
        // handle error here
      });
    axios.get(`${host}/user/getallcustomers`)
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => {
        // handle error here
      });
    axios.get(`${host}/auth/status`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setRole(response.data.data.role);
      })
      .catch(error => {
        // handle error here
      });
  }, []);

  const handleSubmit = (event) => {
    if (((role == 'ROLE_AGENT' && selectedUser) || (role != 'ROLE_AGENT')) && selectedPolicy && selectedPeriod) {
      let premium;
      switch (selectedPeriod) {
        case 'QUARTERLY':
          premium = policyData.filter(obj => obj.key === selectedPolicy)[0].quarter_premium;
          break;
        case 'MONTHLY':
          premium = policyData.filter(obj => obj.key === selectedPolicy)[0].month_premium;
          break;
        case 'ANNUAL':
          premium = policyData.filter(obj => obj.key === selectedPolicy)[0].yearly_premium;
          break;
      }
      const payload = {
        type: selectedPolicy,
        period: selectedPeriod,
        premium: premium,
        policy: policyData.filter(obj => obj.key === selectedPolicy)[0].yearly_premium,
        customer_id: selectedUser,
        claims_allowed_per_year: policyData.filter(obj => obj.key === selectedPolicy)[0].claims_allowed_per_year
      }
      axios.post(`${host}/policy`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          alert('Success');
        })
        .catch(error => {
          // handle error here
        });
    } else {
      alert('Please fill all');
    }
    event.preventDefault();
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="8">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Take Policy</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Policy Type</label>
                        <Form.Select onChange={(e) => setSelectedPolicy(e.target.value)}>
                          <option value=''>Choose</option>
                          {policyData && policyData.map((data) => (
                            <option value={data.key}>{data.value}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="6">
                      <Form.Group>
                        <label>
                          Period
                        </label>
                        <Form.Select onChange={(e) => setSelectedPeriod(e.target.value)}>
                          <option value="">Choose</option>
                          <option value="QUARTERLY">Quarterly</option>
                          <option value="MONTHLY">Monthly</option>
                          <option value="ANNUAL">Yearly</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  {role == 'ROLE_AGENT' &&
                    <Row>
                      <Col className="pr-1" md="6">
                        <Form.Group>
                          <label>Customer</label>
                          <Form.Select onChange={(e) => setSelectedUser(e.target.value)}>
                            <option value="">Choose</option>
                            {customers && customers.map((customer) => (
                              <option value={customer.id}>{customer.username}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  }
                  <Button
                    className="btn-fill pull-right"
                    type="submit"
                    variant="info"
                  >
                    Submit
                  </Button>
                  <div className="clearfix"></div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md="4">
            <Card className="card-user">
              <div className="card-image">
                <img
                  alt="..."
                  src={require("assets/img/photo-1431578500526-4d9613015464.jpeg")}
                ></img>
              </div>
              <Card.Body>
                <div className="author">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <h5 className="title">{selectedPolicy}</h5>
                  </a>
                  <p className="description">
                    Claims Allowed per year: {
                      policyData.filter(obj => obj.key === selectedPolicy)
                      && policyData.filter(obj => obj.key === selectedPolicy).length
                      && policyData.filter(obj => obj.key === selectedPolicy)[0].claims_allowed_per_year
                    }
                  </p>
                </div>
                <p className="description text-center">
                  Premium (Quarterly): ₹{
                    policyData.filter(obj => obj.key === selectedPolicy)
                    && policyData.filter(obj => obj.key === selectedPolicy).length
                    && policyData.filter(obj => obj.key === selectedPolicy)[0].quarter_premium
                  } <br></br>
                  Premium (Monthly): ₹{
                    policyData.filter(obj => obj.key === selectedPolicy)
                    && policyData.filter(obj => obj.key === selectedPolicy).length
                    && policyData.filter(obj => obj.key === selectedPolicy)[0].month_premium
                  } <br></br>
                  Premium (Yearly): ₹{
                    policyData.filter(obj => obj.key === selectedPolicy)
                    && policyData.filter(obj => obj.key === selectedPolicy).length
                    && policyData.filter(obj => obj.key === selectedPolicy)[0].yearly_premium
                  }
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default TakePolicy;
