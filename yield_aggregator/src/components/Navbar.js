import React, { Component } from 'react';

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                 
                   Darren
               
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <a
                            className="nav-link small mx-3"
                            href={`https://etherscan.io/address/${this.props.account}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {this.props.account}
                        </a>
                    </li>
                </ul>
            </nav>
        )
    }
}

export default Navbar