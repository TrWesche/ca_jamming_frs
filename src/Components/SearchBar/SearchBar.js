import React from 'react';
import './SearchBar.css';

export class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.state={
            term: ""
        };

        this.search=this.search.bind(this);
        this.searchEnterKey=this.searchEnterKey.bind(this);
        this.handleTermChange=this.handleTermChange.bind(this);
    }

    handleTermChange(event) {
        this.setState({
            term: event.target.value
        })
    }

    search() {
        this.props.onSearch(this.state.term);
    }

    searchEnterKey(event) {
        if (event.key === "Enter") {
            this.props.onSearch(this.state.term);
        }
    }

    render() {
        return (
            <div className="SearchBar">
                <button className="SearchButton" onClick={this.search} >SEARCH</button>
                <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} onKeyPress={this.searchEnterKey}/>
            </div>
        )
    }
}