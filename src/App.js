import React, { Component } from 'react';
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
    /*Binding: in order to make "this" accessible in your class methods,
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
    this.setState({ list: updateList });
  }
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const {searchTerm, list} = this.state;
    return (
      <div className="page">
        <div className="iteractions">
          <Search value={searchTerm} onChange={this.onSearchChange}>
            Search
          </Search>
        </div>
        <Table list={list} pattern={searchTerm} onDismiss={this.onDismiss} />
      </div>
    );
  }
}

//Functional Stateless Components

//beacause they don’t need access to this.state or this.setState()
//so ...
// props as inputs ...JSX as outputs!
const Search = ({ value, onChange, children }) =>
    <form>
      {children} <input type="text" value={value} onChange={onChange} />
    </form>

//Example to add some inline style
const largeColumn = {
  width: '40%'
};

const midColumn = {
  width: '30%'
};

const smallColumn = {
  width: '10%'
};

const Table = ({ list, pattern, onDismiss }) =>
    <div className="table">
      {list.filter(isSearched(pattern)).map(item =>
        <div key={item.objectID} className="table-row">
          <span style={largeColumn}>
            <a href={item.url}>{item.title}</a>
          </span>
        <span style={midColumn}>{item.author}</span>
        <span style={smallColumn}>{item.num_comments}</span>
        <span style={smallColumn}>{item.points}</span>
        <span style={smallColumn}>
            <Button onClick={() => onDismiss(item.objectID)} className="button-inline">
              Dismiss
                </Button>
          </span>
        </div>
      )}
    </div>

//Example of Reusable Component: a button
//Bonus: take a look at className default parameter
const Button = ({ onClick, className = '', children }) =>
    <button onClick={onClick} className={className} type="button">
      {children}
    </button>

export default App;
