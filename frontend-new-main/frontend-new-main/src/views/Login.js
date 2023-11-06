import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { host } from '../host';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';

import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form
} from "react-bootstrap";

function Authentication() {

    const [isLoginPage, setLoginPage] = useState(true)

    const handleClick = () => setLoginPage(isLoginPage ? false : true);


    const LoginPage = () => {

        const LoginForm = {
            email: "",
            password: ""
        };

        const validationSchema = Yup.object().shape({
            email: Yup.string()
                .required('Email is required')
                .email('Email is invalid'),
            password: Yup.string()
                .required('Password is required')
                .min(6, 'Password must be at least 6 characters')
                .max(40, 'Password must not exceed 40 characters'),
        });

        const { register, handleSubmit, formState: { errors } } = useForm({
            resolver: yupResolver(validationSchema)
        });


        const loginUser = async (userData) => {
            const response = await axios.post(`${host}/auth/login`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            })
            return response
        }

        const getRole = async (token) => {
            const response = await axios.get(`${host}/auth/status`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${token}`
                }
            });
            return response
        }

        const history = useHistory();
        const onSubmit = async (data) => {
            const loginData = {
                email: data.email,
                password: data.password
            }
            try {
                const response = await loginUser(loginData);
                localStorage.setItem("user-token", response.data.auth_token);
                const roleResponse = await getRole(response.data.auth_token);
                if (roleResponse.data.data.role === "ROLE_USER" || roleResponse.data.data.role === "ROLE_AGENT") {
                    // history.push('/dashboard/policies');
                    history.push('/dashboard/dashboard');
                }
                else if (roleResponse.data.data.role === "ROLE_ADMIN") {
                    history.push('/admin/dashboard');
                }
            } catch (error) {
                console.log(error);
            }
        };

        return (
            <Card.Body>
                <Card.Title>
                    <h3 className="text-center">Login</h3>
                </Card.Title>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="text" placeholder="Enter Email" {...register('email')} className={`${errors.email ? 'is-invalid' : ''}`} autoComplete="off" />
                        <Form.Control.Feedback type='invalid'>
                            {errors.email?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" {...register('password')} className={`${errors.password ? 'is-invalid' : ''}`} />
                        <Form.Control.Feedback type='invalid'>
                            {errors.password && errors.password.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button className="d-flex justify-content-center w-100" variant="primary" type="submit">
                        Login
                    </Button>
                    <div className="d-flex justify-content-center">
                        <h4 style={{ fontSize: '1rem' }}>
                            Not a Member ? <a style={{ textDecoration: 'none' }} href="#" onClick={handleClick}>Register</a>
                        </h4>
                    </div>
                </Form>
            </Card.Body>
        );
    }

    const RegisterPage = () => {

        const RegisterForm = {
            name: "",
            email: "",
            password: "",
            retypePassword: ""
        };

        const validationSchema = Yup.object().shape({
            name: Yup.string()
                .required('Name is required')
                .min(3, 'Name must be atleast 3 characters'),
            email: Yup.string()
                .required('Email is required')
                .email('Email is invalid'),
            password: Yup.string()
                .required('Password is required')
                .min(8, 'Password must be at least 8 characters')
                .max(40, 'Password must not exceed 40 characters'),
            retypePassword: Yup.string()
                .required('Re-Type Password is required')
                .min(8, 'Re-Type Password must be at least 8 characters')
                .max(40, 'Re-Type Password must not exceed 40 characters')
                .test('passwords-match', 'Passwords must match', function (value) {
                    return this.parent.password === value
                }),
        });

        const { register, handleSubmit, formState: { errors } } = useForm({
            resolver: yupResolver(validationSchema)
        });

        const registerUser = async (userData) => {
            const response = await axios.post(`${host}/auth/register`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            })
            return response
        }

        const history = useHistory()
        const onSubmit = async (data) => {
            const registerData = {
                username: data.name,
                email: data.email,
                password: data.password
            }
            try {
                const response = await registerUser(registerData);
                localStorage.setItem("user-token", response.data.auth_token);
                history.push('/dashboard/policies');
            } catch (error) {
                console.log(error);
            }
        }

        return (
            <Card.Body>
                <Card.Title>
                    <h3 className="text-center">Register</h3>
                </Card.Title>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Name" {...register('name')} className={`${errors.name ? 'is-invalid' : ''}`} />
                        <Form.Control.Feedback type='invalid'>
                            {errors.name && errors.name.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter Email" {...register('email')} className={`${errors.email ? 'is-invalid' : ''}`} autoComplete="off" />
                        <Form.Control.Feedback type='invalid'>
                            {errors.email && errors.email.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" {...register('password')} className={`${errors.password ? 'is-invalid' : ''}`} />
                        <Form.Control.Feedback type='invalid'>
                            {errors.password && errors.password.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="retype-password">
                        <Form.Label>Re-type Password</Form.Label>
                        <Form.Control type="password" placeholder="Re-type Password" {...register('retypePassword')} className={`${errors.retypePassword ? 'is-invalid' : ''}`} />
                        <Form.Control.Feedback type='invalid'>
                            {errors.retypePassword && errors.retypePassword.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button className="d-flex justify-content-center w-100" variant="primary" type="submit">
                        Register
                    </Button>
                    <div className="d-flex justify-content-center">
                        <h4 style={{ fontSize: '1rem' }}>
                            Already a Member ? <a style={{ textDecoration: 'none' }} href="#" onClick={handleClick}>Login</a>
                        </h4>
                    </div>
                </Form>
            </Card.Body>
        )
    }

    return (
        <Container fluid style={{ height: '100vh' }}>
            <Row className="h-100">
                <Col lg={12} xs={12} className="d-flex align-items-center justify-content-center">
                    <Card style={{ width: '25rem' }}>
                        {isLoginPage === true ? <LoginPage /> : <RegisterPage />}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Authentication;
