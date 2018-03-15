import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import Loading from './Loading';
import '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-free-solid';

//API request URL constants using ES6 Template String
const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

class App extends Component {
  _isMounted = false;
  //this is a Lifecycle Method in React
  //is only called when an instance of the component is created and inserted in the DOM.
  //it is called "Mounting of a Component"
  // It is called when the component gets initialized.You can set an initial
  // component state and bind class methods during that lifecycle method.
  constructor(props) {
    super(props);
    //now the list is part of the component, is internal
    //set the initial state
    this.state = {
      results: null, //empty results initially
      searchKey: '',
      searchTerm: DEFAULT_QUERY, //default search term
      error: null, //let's handle the possible error
      isLoading: false, //You don’t load anything before the App component is mounted
    };
    /* Binding: in order to make "this" accessible in your class methods,
    you have to bind the class methods to this */
    this.needToSearchTopStories = this.needToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }
  //Using ES6 arrow function it is possible to avoid the binding of this in the constructor:
  //ex: onDismiss = (id) => { do something }
  //class methods can be autobound automatically without
  //binding them explicitly by using JavaScript ES6 arrow functions
  needToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result) {
    const { hits, page } = result; //collect hits and page from result
    const { searchKey, results } = this.state;
    const oldHits = results && results[searchKey] ? results[searchKey].hits : []; //check if there are old hits
    const updatedHits = [...oldHits, ...hits]; //merge both lists
    //set the new state
    // The searchKey will be used as the key to save the updated hits and page in a results map
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      },
      isLoading: false
    });
  }
  //Here it is possible to Fetch data from API
  //Look  page = 0 is an ES6 default parameter
  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });

    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`) //use default search term to fetch data
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({ error })); //in case of error it stores the error object in local state
  }

  componentDidMount() {
    this._isMounted = true;
    const { searchTerm } = this.state;
    //client side cache!
    //searchKey is set here!!!
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    //here searchKey is set again
    this.setState({ searchKey: searchTerm });
    if (this.needToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }
  //this is a Lifecycle Method in React
  /* Each time when the state or the props of a component change, the render() method of the
  component is called. */
  render() {
    const { searchTerm, results, searchKey, error, isLoading } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="page">
        <div className="iteractions">
          <Search value={searchTerm} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
            Search
          </Search>
        </div>
        {
        // conditional rendering
         error
         ? <div className="interactions">
           <p>SOMETHING WENT WRONG!</p>
         </div>
         : <Table list={list} onDismiss={this.onDismiss} />
        }
        <div className="interactions red">
        {
          //another conditional rendering
          isLoading
          ? <Loading />
          :
          <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </Button>
        }
        </div>
      </div>
    );
  }
}

//Functional Stateless Components

//beacause they don’t need access to this.state or this.setState()
//so ...
// props as inputs ...JSX as outputs!
const Search = ({ value, onChange, onSubmit, children }) =>
    {
    let input;
    return (
    <form onSubmit={onSubmit}>
      <input type="text" value={value} onChange={onChange} ref={(node => input = node)} />
      <button type="submit">
        {children}
      </button>
    </form>
    );
}

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


const Table = ({ list, onDismiss }) =>
    <div className="table">
      {list.map(item =>
        <div key={item.objectID} className="table-row">
          <span style={largeColumn}>
            <a href={item.url} target="_blank">{item.title}</a>
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

export { Button, Search, Table };
