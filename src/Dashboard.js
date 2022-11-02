import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout, saveResult } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import "./Dashboard.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';

function Dashboard() {
  const [suma, setSuma] = useState(0);
  const [resta, setResta] = useState(0);
  const [multi, setMulti] = useState(0);
  const [divi, setDivi] = useState(0);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [rol, setRol] = useState("");
  const [results, setResult] = useState([]);
  const navigate = useNavigate();

  const fetchResults = async () => {
    try {
      let q = query(collection(db, "results"), where("uid", "==", user?.uid));
      if (rol === "admin") {
        q = query(collection(db, "results"));
      }
      const doc = await getDocs(q);
      const data = doc.docs;

      let newResults = [];
      data.forEach(element => newResults.push(element.data().result));

      setResult(newResults)
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();

      setName(data.name);
      setRol(data.rol);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");

    fetchUserName();
  }, [user, loading]);


  function calcular() {
    setSuma(Number(num1) + Number(num2));
    setResta(num1 - num2);
    setMulti(num1 * num2);
    setDivi(num1 / num2);
    const result = "Usuario: " + name + ", Num 1: " + num1 + ", Num2: " + num2 + ", Suma: " + (Number(num1) + Number(num2))
      + ", Resta: " + (num1 - num2) + ", Multiplicación: " + (num1 * num2) + ", División: " + (num1 / num2);
    saveResult(user, result);
  }

  return (
    <Container>
      <Row>
        <Col xs={1}></Col>
        <Col xs={10}>
          <center><Button variant="primary" className="boton" onClick={() => logout()}>Log out</Button></center>
        </Col>
        <Col xs={1}></Col>
      </Row>
      <br />
      <Row>
        <Col xs={1}></Col>
        <Col xs={10}>
          <InputGroup className="mb-3">
            <InputGroup.Text>Primer número y segundo número</InputGroup.Text>
            <Form.Control aria-label="First name" value={num1} onChange={e => setNum1(e.target.value)} />
            <Form.Control aria-label="Last name" value={num2} onChange={e => setNum2(e.target.value)} />
          </InputGroup>
        </Col>
        <Col xs={1}></Col>
      </Row>
      <Row>
        <Col xs={1}></Col>
        <Col xs={10}>
          <center><Button variant="primary" className="boton" onClick={() => calcular()}>Calcular</Button></center>
        </Col>
        <Col xs={1}></Col>
      </Row>
      <br />
      <Row>
        <Col xs={1}></Col>
        <Col xs={10}>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              Suma
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              readOnly
              value={suma}
            />
          </InputGroup>
        </Col>
        <Col xs={1}></Col>
      </Row>
      <Row>
        <Col xs={1}></Col>
        <Col xs={10}>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              Resta
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              readOnly
              value={resta}
            />
          </InputGroup>
        </Col>
        <Col xs={1}></Col>
      </Row>
      <Row>
        <Col xs={1}></Col>
        <Col xs={10}>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              Multiplicación
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              readOnly
              value={multi}
            />
          </InputGroup>
        </Col>
        <Col xs={1}></Col>
      </Row>
      <Row>
        <Col xs={1}></Col>
        <Col xs={10}>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              División
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              readOnly
              value={divi}
            />
          </InputGroup>
        </Col>
        <Col xs={1}></Col>
      </Row>
      <Row>
        <Col xs={1}></Col>
        <Col xs={10}>
          <center><Button variant="primary" className="boton" onClick={() => fetchResults()}>Mostrar registros</Button></center>
        </Col>
        <Col xs={1}></Col>
      </Row>
      <Row>
        <Col xs={1}></Col>
        <Col xs={10}>
          <ListGroup>
            {results.map(item => {
              return <ListGroup.Item>{item}</ListGroup.Item>;
            })}
          </ListGroup>
        </Col>
        <Col xs={1}></Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
