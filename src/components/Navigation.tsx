import * as React from "react";
import {Component} from "react";
import {Nav, Navbar} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

export class Navigation extends Component {
    public render() {
        return (
            <Navbar bg="dark" variant="dark" fixed="top">
                <Navbar.Brand>Ghetto League</Navbar.Brand>
                <Nav>
                    <LinkContainer to="/players">
                        <Nav.Link eventKey={1}>Players</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/teams">
                        <Nav.Link eventKey={2}>Teams</Nav.Link>
                    </LinkContainer>
                </Nav>
            </Navbar>
        );
    }
}