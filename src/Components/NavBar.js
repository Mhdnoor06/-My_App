import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

function NavBar(props) {
  return (
    <>
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            CARDS
          </a>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <button
              onClick={props.handleDeleteAll}
              className="delete"
              disabled={props.selecteditem.length === 0}
            >
              Delete All
            </button>

            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                History
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {props.history.length > 0 ? (
                  props.history.map((video) => (
                    <Dropdown.Item key={video.id}>
                      {video.title} - {video.playedTime.toLocaleString()}
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item disabled>No played videos</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
