import React, { useState } from 'react'
import { Button, Modal, Form, Alert, Toast } from 'react-bootstrap';
import { postAuth } from "../../apis"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css"

const initialFormData = {
  username: "",
  password: ""
}

export const Navigation = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(null)
  const [show, setShow] = useState(false);

  const toggleModal = () => setModalVisible(!isModalVisible);

  const isLoggedIn = localStorage.getItem('userData');
  let navigate = useNavigate();

  const onChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const onSubmit = async () => {
    const result = await postAuth(formData)
    if (result.error)
    {
      setError(result.message)
    } else
    {
      localStorage.setItem('userData', JSON.stringify(formData));
      setError(null)
      setFormData(initialFormData)
      toggleModal()
      setShow(true)
    }
  }

  const onLogout = () => {
    setShow(true)
    localStorage.removeItem('userData')
    navigate(`/`)
  };

  return (
    <nav className="navbar navbar-expand-lg px-5 navbar-dark bg-dark">
      <div className="navbar-brand nav-item">
        <Link to="/">CREDO</Link>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item px-4">
          <Link to="/gallery">GALLERY</Link>
        </li>
        <li className="nav-item px-4">
          <Link to="/about">ABOUT</Link>
        </li>
        <li className="nav-item px-4">
          <Link to="/faq">FAQ</Link>
        </li>
        {isLoggedIn && <li className="nav-item px-4">
          <Link to="/my-gallery">MY GALLERY</Link>
        </li>}
      </ul>
      {isLoggedIn && <div style={{ display: "flex", alignItems: "center" }}><div style={{
        width: "50px", height: "50px", borderRadius: "50%", background: "white", marginRight: "10px", backgroundImage: "url('https://media.istockphoto.com/vectors/male-user-icon-vector-id517998264?k=20&m=517998264&s=612x612&w=0&h=pdEwtkJlZsIoYBVeO2Bo4jJN6lxOuifgjaH8uMIaHTU=')",
        backgroundSize: "contain"
      }}></div><span style={{ color: "white" }}>Logged in as: {JSON.parse(isLoggedIn)?.username}</span></div>}
      <Button as="input" type="submit" className='mx-5' variant="info" value={isLoggedIn ? "Sign out" : "Sign in"} onClick={isLoggedIn ? onLogout : toggleModal} />
      <Modal show={isModalVisible} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Sign In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>User ID</Form.Label>
              <Form.Control placeholder="Enter user id" name="username" value={formData.username} onChange={onChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" name="password" value={formData.password} onChange={onChange} />
            </Form.Group>
          </Form>
          {error && <Alert variant='danger'>{error}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModal}>
            Close
          </Button>
          <Button variant="primary" onClick={onSubmit} disabled={!formData?.password || !formData?.username} >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      <div style={{ position: "absolute", top: 25, right: 50, zIndex: 999, color: "white" }} >
        <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide bg="success">
          <Toast.Body>{isLoggedIn ? "Successfully logged in!" : "Successfully logged out!"}</Toast.Body>
        </Toast>
      </div>
    </nav>
  )
}
