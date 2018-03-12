import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);
    //now the list is part of the component, is internal
    //set the initial state
    this.state = {
      list: list,
      searchTerm: "",
    };
    /*Binding: in order to make this accessible in your class methods,
    you have to bind the class methods to this */
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }
  //Using ES6 arrow function it is possible to avoid the binding of this in the constructor:
  //ex: onDismiss = (id) => { do something }
  //class methods can be autobound automatically without
  //binding them explicitly by using JavaScript ES6 arrow functions
  onDismiss(id) {
    const updateList = this.state.list.filter(item => item.objectID !== id);
    this.setState({list : updateList});
  }
  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  render() {
    //ES6 Object Destructuring
    const { searchTerm, list } = this.state;
    return (
      <div className="App">
        <form >
          <input type="text" name="" id="" onChange={this.onSearchChange} />
        </form>
        {this.state.list.filter(isSearched(searchTerm)).map(item => {
          return (
          <div key={item.objectID}>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            <span>
              <button type="button" onClick={() => this.onDismiss(item.objectID)}>
              Dismiss
              </button>
            </span>
          </div>
          );
        })}
      </div>
    );
  }
}

export default App;
