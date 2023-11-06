import React, {useState, useEffect} from "react";

// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Form,
  Navbar,
  Nav,
  Container,
  Row,
  Table,
  Modal,
  Col
} from "react-bootstrap";

import axios from "axios";
import { host } from '../../host'

function User() {

  const [Users, setUsers] = useState([]);
  const [userid, setuserId] = useState();

  useEffect(() => {
    axios.get(`${host}/user/getalladminuser`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('user-token')}`
    }
  })
    .then(response => {
      setUsers(response.data);
      console.log(response.data)
    })
    .catch(error => {
      // handle error here
    });
  
  }, []); 

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Users</Card.Title>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
              {Users ? 
              <Table className="table-hover table-striped">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Email</th>
                    <th scope="col">Username</th>
                    <th scope="col">Role</th>
                  </tr>
                </thead>
                <tbody>
                    {Users && Users.map((user) => (
                      <tr key={user.id} className="pb-2">
                        <td>{user.id}</td>
                        <td>{user.email}</td>
                        <td>{user.username}</td>
                        <td>{user.role}</td>
                        <td><Button className="btn btn-danger" id={user.id} onClick={(event) => {
                          handleShow()
                          setuserId(event.currentTarget.id)
                        }}> <i className="nc-icon nc-simple-remove"></i></Button></td>
                      </tr>
                      ))
                  }
                </tbody>
              </Table> :
              <h1 className='d-flex p-2 pt-5'>No Users</h1>}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
        <Modal.Footer className="mt-2">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => {

            axios.delete(`https://insurance-backend.onrender.com/user/deleteuser/${userid}`, {
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('user-token')}`
              }
            })
              .then(response => {
                // setUsers(response.data);
                console.log(response)
                if(response.status == 200) {
                  alert('Success! User Deleted')
                  location.reload()
                }
              })
              .catch(error => {
                if(error.code == "ERR_BAD_REQUEST") {
                  alert('Failed ' + error?.response.data.message)
                }
              });
  
          }}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      </Container>
    </>
  );
}

export default User;
