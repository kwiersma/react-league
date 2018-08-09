import * as React from "react";
import {Component} from "react";
import {Nav, Navbar, NavItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";

export class Navigation extends Component {
    public render() {
        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>Ghetto League</Navbar.Brand>
                </Navbar.Header>
                <Nav>
                    <LinkContainer to="/players">
                        <NavItem eventKey={1}>Players</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/teams">
                        <NavItem eventKey={2}>Teams</NavItem>
                    </LinkContainer>
                </Nav>
            </Navbar>
        );
    }
}