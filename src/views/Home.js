import React, { Component } from "react";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ListGroup, Badge, Row, Container, Col, Image, Nav} from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';

  
function withRouter(Component) {
    function ComponentWithRouterProp(props) {
      let location = useLocation();
      let navigate = useNavigate();
      let params = useParams();
      return (
        <Component
          {...props}
          router={{ location, navigate, params}}
        />
      );
    }
  
    return ComponentWithRouterProp;
}
class Home extends Component 
{
    state = 
    {
        gridshotLeaderboard: null,
        trackerLeaderboard: null,
        isLoaded: false
    };
    async componentDidMount() {
        await axios.get(`/api/getLeaderboard/Gridshot`).catch((err)=> {}).then((res) =>
        {
            this.setState({
                gridshotLeaderboard: res.data
            });
        });

        await axios.get(`/api/getLeaderboard/Tracker`).catch((err)=> {}).then((res) =>
        {
            this.setState({ 
                trackerLeaderboard: res.data,
                isLoaded: true
            });
        }); 
    }


    render()
    {

        return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <ListGroup className="list-group">
                            <ListGroup.Item variant="primary">Gridshot Leaderboard</ListGroup.Item>
                        </ListGroup>
                        <ListGroup className="list-group-numbered">
                        {
                                this.state.isLoaded && this.state.gridshotLeaderboard.map( row => 
                                {
                                        return (
                                        <ListGroup.Item  key={row.player + "_" + row.type} className="d-flex justify-content-between align-items-start">
                                                <div className="ms-2 me-auto">
                                                    <div className="fw-bold">
                                                        <LinkContainer to={`/profile/${row.player}`}>
                                                            <Nav.Link>
                                                                <Image fluid src={row.skinHead}></Image>
                                                                {row.player}
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </div>
                                                </div>
                                            <Badge bg="primary" pill>{row.points}</Badge>
                                        </ListGroup.Item>
                                        );
                                })
                        }
                        </ListGroup>
                    </Col>
                    <Col>
                        <ListGroup className="list-group">
                                <ListGroup.Item variant="danger">Tracker Leaderboard</ListGroup.Item>
                        </ListGroup>
                        <ListGroup className="list-group-numbered">
                        {
                               this.state.isLoaded && this.state.trackerLeaderboard.map( row => 
                                {
                                        return (
                                        <ListGroup.Item key={row.player + "_" + row.type} className="d-flex justify-content-between align-items-start">
                                                <div className="ms-2 me-auto">
                                                    <div className="fw-bold">
                                                    <LinkContainer to={`/profile/${row.player}`}>
                                                            <Nav.Link>
                                                                <Image fluid src={row.skinHead}></Image>
                                                                {row.player}
                                                            </Nav.Link>
                                                        </LinkContainer>
                                                    </div>
                                                </div>
                                            <Badge bg="primary" pill>{row.points}</Badge>
                                        </ListGroup.Item>
                                        );
                                })
                        }
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        </div>
        );
    }
}

export default withRouter(Home);