import * as React from "react";
import {Component} from "react";
import {Container, Nav, Navbar} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

export class Navigation extends Component {
    public render() {
        return (
            <Navbar style={{backgroundColor: "#0B162A", borderBottom: "solid #C83803 5px"}} 
                fixed="top" 
                data-bs-theme="dark">
                <Container fluid>
                    <Navbar.Brand style={{marginRight: "30px"}}>Ghetto League 2024</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <LinkContainer to="/draft2/players">
                            <Nav.Link eventKey={1}>Players</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/draft2/teams">
                            <Nav.Link eventKey={2}>Teams</Nav.Link>
                        </LinkContainer>
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}