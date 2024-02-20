'use client'
// import node module libraries
import {Row, Col, Container, Table, Button, Modal, Form, Card} from 'react-bootstrap';

// import widget as custom components
import { PageHeading } from 'widgets'
import {Fragment, useContext, useEffect, useState} from "react";

// import sub components
import axios from "axios";
import {validate} from "uuid";
const PbrList = () => {
    const [routes, setRoutes] = useState(null);
    const [route, setRoute] = useState({
        id: null,
        svcId: "",
        uri: "",
        path1: "",
        path2: "",
    });
    const [showModal, setShowModal] = useState(false);

    // 오류 메세지를 담는다
    const [errors, setErrors] = useState({
        svcId: "",
        uri: "",
        path1: "",
        path2: "",
    })
    const handleChange = e => {
        setRoute({
            ...route,
            [e.target.name]: e.target.value,
        })
    }
    const handleClose = () => {
        setShowModal(false);
        setRoute({
            id: null,
            svcId: "",
            uri: "",
            path1: "",
            path2: "",
        });
    };
    const handleShow = () => {
        setShowModal(true);
    };

    const handleUpdate = async (id) => {
        const res = await axios.get("http://localhost:50000/pbr/" + id);
        setRoute(res.data);

        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if(confirm("정말로 삭제 하시겠습니까?")) {
            const res = await axios.delete("http://localhost:50000/pbr/" + id).then(res => {
                fetchRoutes();
            });
        }
    }

    const handleSubmit = e => {
        e.preventDefault();

        axios.post("http://localhost:50000/pbr", route)
            .then((res) => {
                alert("Save Successed");
                handleClose();
            })
            .finally(() => fetchRoutes());
    }
    const syncToServers = () => {
        axios.post("http://localhost:50000/actuator/refresh")
            .then(res => {
                if(res.status === 200) {
                    alert("complete");
                }
            });
    }

    const fetchRoutes = async () => {
        const res = await axios.get("http://localhost:50000/pbr/list");
        setRoutes(res.data);
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    if (!routes) return null;

    return (
        <Container fluid className="p-15">
        {/* Page Heading */}
        <PageHeading heading="PBR  ROUTING LIST"></PageHeading>
        <Row>
            <Col md={11}>
                <p className="mb-0 fs-5 text-muted">서버 적용을 위해서는 <b>Sync Server</b>를 진행해주세요. </p>
            </Col>
            <Col>
                <Button variant="secondary" size="sm" onClick={syncToServers}>
                    Sync Server
                </Button>
            </Col>
        </Row>

        <Row className="mt-3">
            <Table className="text-nowrap">
                <thead >
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">SERVICE ID</th>
                    <th scope="col">URI</th>
                    <th scope="col">PATH</th>
                    <th scope="col"></th>
                </tr>
                </thead>
                <tbody>
                    {routes.map((route, index) => (
                        <tr key={route.id}>
                            <th scope="row">{index + 1}</th>
                            <td>{route.svcId}</td>
                            <td>{route.uri}</td>
                            <td>{route.path1} <br/>{route.path2}</td>
                            <td>
                                <i className="nav-icon fe fe-settings me-2" onClick={() => handleUpdate(route.id)}></i>
                                <i className="nav-icon fe fe-trash me-2 m-3" onClick={() => handleDelete(route.id)}></i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Row>

        <Fragment>
            <Row>
                <Col md={10} xs={2}>
                    <Button variant="success" onClick={handleShow}>
                        Create Route
                    </Button>
                </Col>
            </Row>
            <Modal show={showModal} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    { route.id
                        ? <Modal.Title>UPDATE ROUTE - {route.svcId} </Modal.Title>
                        : <Modal.Title>CREATE ROUTE</Modal.Title>
                    }
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Col >
                            <div className="mb-6">
                                <h4 className="mb-1">Please Enter the Route Information</h4>
                            </div>
                            <Row className="mb-3">

                                <Row className="mb-3">
                                    <Form.Label className="col-sm-4" htmlFor="svcId">Service Id</Form.Label>
                                    <Col md={8} xs={12}>
                                        <Form.Control type="text" placeholder="Enter Service Id" name="svcId" value={route ? route.svcId : ''} required onChange={handleChange} />
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Label className="col-sm-4" htmlFor="uri">Uri</Form.Label>
                                    <Col md={8} xs={12}>
                                        <Form.Control type="text" placeholder="Enter URI" name="uri" value={route ? route.uri : ''} required onChange={handleChange} />
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Label className="col-sm-4" htmlFor="path1">Path1</Form.Label>
                                    <Col md={8} xs={6}>
                                        <Form.Control type="text" placeholder="Enter Path1" name="path1" value={route ? route.path1 : ''} required onChange={handleChange}/>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Label className="col-sm-4" htmlFor="path2">Path2</Form.Label>
                                    <Col md={8} xs={6}>
                                        <Form.Control type="text" placeholder="Enter Path2" name="path2" value={route ? route.path2 : ''} onChange={handleChange}/>
                                    </Col>
                                </Row>
                            </Row>
                        </Col>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Fragment>
    </Container>
  );
}

export default PbrList