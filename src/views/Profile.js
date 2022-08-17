import React, { Component } from "react";
import { Alert, ListGroup, Container, Spinner, Badge, Row } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import "./Profile.css";
const skinview3d = require('skinview3d');

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

class Profile extends Component 
{
    state = {
        currentUser: {
            username: null,
            uuid: null,
            rankedGames: null,
            skinURL: null,
            gamesPlayed: null,
            isLoaded: false
        }
    };
    constructor(props)
    {
        super(props);
        this.state.currentUser.username = this.props.router.params.username;
    }

    async componentDidMount()
    {
        await axios.get(`/api/getUserWithName/${this.props.router.params.username}`).then( async(res) =>
        {
            if(res.data)
            {
                await axios.get(`/api/getSkin/${res.data.uuid}`).then(async (skinInfo) =>
                {
                    await this.setupPage(res, skinInfo);
                });
            }
        }).catch( (err) => {});
    }

    setupPage(res, skinInfo)
    {
        return new Promise(async (resolve, reject) =>
        {
            this.loadGames().then( async(retVal) =>{
                await this.setState({ 
                    currentUser: {
                        username: this.state.currentUser.username,
                        uuid: res.data.uuid,
                        rankedGames: res.data.rankedGames,
                        skinURL: skinInfo.data,
                        gamesPlayed: retVal.gamesPlayed,
                        isLoaded: retVal.isLoaded
                    }
                }, async() =>
                {
                    await this.prepSkinViewer();
                    if(this.state.currentUser.isLoaded)
                    {
                        resolve(this.state.currentUser.isLoaded);
                    }
                });
            });
        });
    }
    loadGames()
    {
        return new Promise(async (resolve, reject) =>
        {
            if(this.state.currentUser.isLoaded)
            {
              resolve(true);  
            }
            await axios.get(`/api/getGamesPlayed/${this.state.currentUser.username}`).then( (res) =>
                {
                    let retVal =
                    {
                        isLoaded: true,
                        gamesPlayed: res.data
                    }
                    resolve(retVal);
                }
            )
        });
    }

    DisplayProfileHistory()
    {
        if(this.state.currentUser.isLoaded)
        {
            if(!this.state.currentUser.uuid)
            {
                return(
                <Alert variant="danger">
                    User {this.state.currentUser.username} does not exist! Please enter a valid username.
                </Alert>
                );
            } else  if(this.state.currentUser.gamesPlayed == "-1" || !this.state.currentUser.gamesPlayed)
            {
                return(
                    <ListGroup className="list-group">
                        <ListGroup.Item variant="danger">This user has no games played!</ListGroup.Item>
                    </ListGroup>
                )
            } else
            {
                return(
                    <ListGroup className="list-group">
                    <ListGroup.Item variant="success">Games History</ListGroup.Item>
                                        {
                                            this.state.currentUser.isLoaded && this.state.currentUser.gamesPlayed.map( (row, index) =>
                                            {
                                                    let gameType = row.type === "Tracker" ? "danger" : "primary";
                                                    return(
                                                        <ListGroup.Item className="d-flex justify-content-between align-items-start" key={row.id}>
                                                            <div className="ms-2 me-auto">
                                                                <div className="fw-bold">
                                                                <Badge bg={gameType} pill className="gameTypeBadge">{row.type}</Badge>
                                                                </div>
                                                            </div>
                                                            <Badge bg="primary" pill>{row.points}</Badge>
                                                        </ListGroup.Item>
                                                    )
                                            })
                                        }
                                
                    </ListGroup>

                )
                
            }
        } else 
        {
            return <Spinner animation="grow" />
        }

    }
    prepSkinViewer()
    {
            let skinViewer = new skinview3d.SkinViewer({
                canvas: document.getElementById("skin_container"),
                width: 200,
                height: 350,
                skin: this.state.currentUser.skinURL
            });    
            skinViewer.fov = 70;
            skinViewer.zoom = 0.5;
            skinViewer.autoRotate = true;
    }

    render()
    {
        return (
            <Container className="justify-content-center">
                <Row className="justify-content-center">
                    <canvas id="skin_container"></canvas>
                    { this.DisplayProfileHistory() }
                </Row>
            </Container>
        );
    }
}

export default withRouter(Profile);