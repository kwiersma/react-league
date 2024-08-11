import {Component, FormEvent} from "react";
import * as React from "react";
import {Card, Col, Form, Row} from "react-bootstrap";

interface IState {
    playerFilter: PlayersFilter;
}

interface IPlayerFilterProps {
    onChange: (playerFilter: PlayersFilter) => void;
}

export class PlayersFilter {
    public lastname: string = "";
    public position: string = "";
    public isAvailable: string = "any";
}

export class PlayerFilter extends Component<IPlayerFilterProps, IState> {

    constructor(props: IPlayerFilterProps) {
        super(props);
        this.state = {
            playerFilter: new PlayersFilter()
        }
    }

    public handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const newPlayerFilter = this.state.playerFilter;
        newPlayerFilter.lastname = e.currentTarget.value;
        this.setState({
            playerFilter: newPlayerFilter
        });
        this.props.onChange(newPlayerFilter);
    };

    public handlePositionChange = (e: FormEvent<HTMLSelectElement>) => {
        const newPlayerFilter = this.state.playerFilter;
        newPlayerFilter.position = e.currentTarget.value;
        this.setState({
            playerFilter: newPlayerFilter
        });
        this.props.onChange(newPlayerFilter);
    };

    public handleIsAvailableChange = (e: FormEvent<HTMLInputElement>) => {
        const newPlayerFilter = this.state.playerFilter;
        newPlayerFilter.isAvailable = e.currentTarget.value;
        this.setState({
            playerFilter: newPlayerFilter
        });
        this.props.onChange(newPlayerFilter);
    };

    public render() {
        return (
            <Card>
                <Card.Body>
                    <Card.Text>
                        <Form>
                            <Row>
                                <Col md={3}>
                                    <Form.Label htmlFor="lastname">Last name: </Form.Label>
                                    <Form.Control type="text" id="lastname"
                                        value={this.state.playerFilter.lastname}
                                        onChange={this.handleLastNameChange}/> 
                                </Col>
                                <Col md={3}>
                                    <Form.Label htmlFor="position">Position: </Form.Label>
                                    <Form.Select 
                                        id="position"
                                        value={this.state.playerFilter.position}
                                        onChange={this.handlePositionChange}>
                                        <option value="">Any</option>
                                        <option value="QB">QB</option>
                                        <option value="RB">RB</option>
                                        <option value="WR">WR</option>
                                        <option value="TE">TE</option>
                                        <option value="K">K</option>
                                        <option value="DEF">Def</option>
                                    </Form.Select>
                                </Col>
                                <Col md={6}>
                                    <Form.Label>Status: </Form.Label>
                                    <div>
                                        <Form.Check type="radio" id="isAvailable_1"
                                            inline
                                            value="any"
                                            onChange={this.handleIsAvailableChange}
                                            checked={this.state.playerFilter.isAvailable === "any"}
                                            label="Any" />
                                        <Form.Check type="radio" id="isAvailable_2"
                                            inline
                                            value="available"
                                            onChange={this.handleIsAvailableChange}
                                            checked={this.state.playerFilter.isAvailable === "available"}
                                            label="Available" />
                                        <Form.Check type="radio" id="isAvailable_0"
                                            inline
                                            value="drafted"
                                            onChange={this.handleIsAvailableChange}
                                            checked={this.state.playerFilter.isAvailable === "drafted"}
                                            label="Drafted" />
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }
}