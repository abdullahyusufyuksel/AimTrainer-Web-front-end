import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './App.css';
import Router from './Router.js';

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

class App extends Component {
  state = {
    searchBarText: "",
    profileToSearch: ""
  };

  changeQuery(e)
  {
    this.setState({ searchBarText: e.target.value, profileToSearch: "/profile/" + e.target.value });
  }
  handleClick()
  {
    this.props.router.navigate(this.state.profileToSearch, this.render());
    this.props.router.location.reload();
  }
  handleKeyPress(target) {
    if(target.charCode == 13){
      this.props.router.navigate(this.state.profileToSearch, this.render());
      this.props.router.location.reload();
    } 
  }
  render()
  {
      return (
        <div>
        <Navbar bg="light" expand="lg">
        <Container fluid>
          <Navbar.Brand href="/">AimTrainer</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Enter player name"
                className="ml-auto"
                aria-label="Search"
                onChange ={e => this.changeQuery(e)}
                onKeyPress={e => this.handleKeyPress(e)}
              />
              <LinkContainer to={this.state.profileToSearch}>
                <Button variant="outline-success" onClick={this.handleClick.bind(this)}>Search</Button>
              </LinkContainer>
              </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
        <Router />
     </div>
    );
    }
}

export default withRouter(App);
