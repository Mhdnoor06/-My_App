import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Form, Modal } from 'react-bootstrap';
import { FiEdit } from 'react-icons/fi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import NavBar from './NavBar';

function MyApp({ data }) {
  const [list, setList] = useState(data);
  const [dragging, setDragging] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newName, setNewName] = useState('');
  const [cardTitle, setCardTitle] = useState('');
  const [cardLink, setCardLink] = useState('');
  const [creatingGroupId, setCreatingGroupId] = useState(null);

  const [selectedGrp, setSelectedGrp] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

  const [selectedItems, setSelectedItems] = useState([]);
  const [sam, setSam] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [showIframeModal, setShowIframeModal] = useState(false);

  const [link, setLink] = useState('');

  const [showMenu, setShowMenu] = useState(false);

  const [history, setHistory] = useState([]);

  useEffect(() => {
    setList(data);
  }, [setList, data]);

  const dragItem = useRef();
  const dragItemNode = useRef();

  //when Draging Starts

  const handletDragStart = (e, item) => {
    console.log('Starting to drag', item);
    dragItemNode.current = e.target;
    dragItemNode.current.addEventListener('dragend', handleDragEnd);
    dragItem.current = item;

    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  //Dragged Item Entering a Different Group

  const handleDragEnter = (e, targetItem) => {
    console.log('Entering a drag target ', targetItem);
    const currentItem = dragItem.current;
    if (dragItemNode.current !== e.target) {
      console.log('Target is NOT the same as dragged item');
      setList((oldList) => {
        let newList = JSON.parse(JSON.stringify(oldList));
        newList[targetItem.grpI].items.splice(
          targetItem.itemI,
          0,
          newList[currentItem.grpI].items.splice(currentItem.itemI, 1)[0],
        );
        dragItem.current = targetItem;
        return newList;
      });
    }
  };

  // when Dragging is ended

  const handleDragEnd = (e) => {
    setDragging(false);
    dragItemNode.current.removeEventListener('dragend', handleDragEnd);
    dragItemNode.current = null;
    dragItem.current = null;
  };

  //Styling the Card while Dragging

  const getStyles = (item) => {
    if (
      dragItem.current.grpI === item.grpI &&
      dragItem.current.itemI === item.itemI
    ) {
      return 'dnd-item current';
    }
    return 'dnd-item';
  };

  //Shows the model to create new cards and setting the creating groupid

  const handleShowCreateModal = (groupId) => {
    setCreatingGroupId(groupId);
    setSam(true);
    setShowModal(true);
  };

  //New card is pushed into the group
  const videoId = cardLink.split('.be/')[1];
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;

  const handleCreate = () => {
    const newCard = {
      id: videoId,
      title: cardTitle,
      imageUrl: thumbnailUrl,
      videoUrl: `https://www.youtube.com/embed/${videoId}`,
    };
    setLink(videoId);
    setList((oldList) => {
      let newList = JSON.parse(JSON.stringify(oldList));
      newList[creatingGroupId].items.push(newCard);
      return newList;
    });
    handleCloseModal();
  };

  //Updating a perticular group card

  const handleSelectItem = (grpI, index) => {
    setSelectedGrp(grpI);
    setSelectedItemIndex(index);
    setShowEditModal(true);
    setSam(true);
    setShowMenu(false);
  };

  //Upadting the Card Details

  const handleUpdateItem = () => {
    const updatedItem = {
      id: list[selectedGrp].items[selectedItemIndex].id,
      imageUrl: list[selectedGrp].items[selectedItemIndex].imageUrl,
      title: newName,
      // description: cardLink,
    };

    setList((oldList) => {
      let newList = JSON.parse(JSON.stringify(oldList));
      newList[selectedGrp].items[selectedItemIndex] = updatedItem;
      return newList;
    });
    setSelectedGrp(null);
    setSelectedItemIndex(null);
    handleCloseModal();
  };

  //Deleting a perticular Card

  const handleDeleteCard = (grpI, itemI) => {
    setDeleting(true);
    setList((oldList) => {
      const newList = JSON.parse(JSON.stringify(oldList)); // deep clone
      newList[grpI].items.splice(itemI, 1);
      return newList;
    });
    setDeleting(false);
    setShowMenu(false);
  };

  //Selecting Multiple Cards

  const handleSelectItems = (groupId, itemId) => {
    const itemIndex = selectedItems.findIndex((item) => {
      return item.groupId === groupId && item.itemId === itemId;
    });
    if (itemIndex !== -1) {
      setSelectedItems((prevItems) =>
        prevItems.filter(
          (item) => !(item.groupId === groupId && item.itemId === itemId),
        ),
      );
    } else {
      setSelectedItems((prevItems) => [...prevItems, { groupId, itemId }]);
    }
    setShowMenu(false);
  };

  //Deleting the selected cards

  const handleDeleteItems = () => {
    const newList = [...list];
    selectedItems.forEach((selectedGrp) => {
      const { groupId, itemId } = selectedGrp;
      const groupIndex = newList.findIndex((group) => group.id === groupId);
      const group = newList[groupIndex];
      const itemIndex = group.items.findIndex((item) => item.id === itemId);
      group.items.splice(itemIndex, 1);
      if (group.items.length === 0) {
        newList.splice(groupIndex, 1);
      }
    });
    console.log(selectedItems);
    setList(newList);
    setSelectedItems([]);
    setShowMenu(false);
  };

  //Updating Group-Name

  const handleGroupNameChange = (grp) => {
    setCreatingGroupId(grp);
    setShowEditModal(true);
  };

  //Updating The Selected Group Name

  const handleEditGroup = () => {
    setList((oldList) => {
      const newList = JSON.parse(JSON.stringify(oldList));
      const groupIndex = newList.findIndex(
        (group) => creatingGroupId.id === group.id,
      );
      newList[groupIndex].title = newName;
      return newList;
    });
    setShowEditModal(false);
    handleCloseModal();
  };

  //After Closing The Model Setting The States to False

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSam(false);
    setShowModal(false);
    setCardTitle('');
    setCardLink('');
    setCreatingGroupId(null);
    setNewName('');
  };

  //iframe

  const handleClick = (item) => {
    handlePlayVideo(item.id, item.title);
    setLink(item.id);
    setShowIframeModal(true);
  };

  const handleCloseIframeModal = () => {
    setShowIframeModal(false);
  };

  //to keep track of the played videos (History)

  const handlePlayVideo = (videoId, title) => {
    const playedVideo = {
      id: videoId,
      title: title,
      playedTime: new Date(),
    };
    setHistory([...history, playedVideo]);
    console.log(history);
  };

  const customStyles = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  };

  //a dropdown to handle select,delete and edit function

  const handleToggleMenu = (e, { grpI, itemI }) => {
    e.stopPropagation();
    setSelectedGrp(grpI);
    setSelectedItemIndex(itemI);
    setShowMenu(!showMenu);
  };

  if (list) {
    return (
      <div className="drag-n-drop">
        <NavBar
          handleDeleteAll={handleDeleteItems}
          selecteditem={selectedItems}
          history={history}
        />
        {list.map((grp, grpI) => (
          <div
            key={grp.id}
            onDragEnter={
              dragging && !grp.items.length
                ? (e) => handleDragEnter(e, { grpI, itemI: 0 })
                : null
            }
            className="dnd-group"
          >
            <div className="d-flex " key={grp.id}>
              <div>{grp.title}</div>
              <Button
                onClick={() => handleGroupNameChange(grp)}
                className="edit-class "
              >
                <FiEdit />
              </Button>
            </div>

            <button
              className="bg-secondary"
              onClick={() => handleShowCreateModal(grpI)}
            >
              Create Item
            </button>

            <div className="flex-col">
              {grp.items.map((item, itemI) => (
                <div
                  draggable
                  key={`${item.id}-${itemI}`}
                  onDragStart={(e) => handletDragStart(e, { grpI, itemI })}
                  onDragEnter={
                    dragging
                      ? (e) => {
                          handleDragEnter(e, { grpI, itemI });
                        }
                      : null
                  }
                  className={`dnd-item  ${
                    dragging ? getStyles({ grpI, itemI }) : ''
                  }  ${
                    selectedItems.length > 0 &&
                    selectedItems.some(
                      (obj) => obj.groupId === grp.id && obj.itemId === item.id,
                    )
                      ? 'selected-item'
                      : ''
                  }`}
                >
                  <img src={item.imageUrl} alt={item.title} />
                  <div className="inline">
                    <h1
                      onClick={() => handleClick(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      {item.title}
                    </h1>
                    {selectedGrp == grpI &&
                      selectedItemIndex == itemI &&
                      showMenu && (
                        <div className={`menu ${showMenu ? 'show' : ''}`}>
                          <div
                            onClick={() => handleSelectItems(grp.id, item.id)}
                          >
                            {selectedItems.length > 0 &&
                            selectedItems.some(
                              (obj) =>
                                obj.groupId === grp.id &&
                                obj.itemId === item.id,
                            )
                              ? 'Unselect'
                              : 'select'}
                          </div>
                          <div onClick={() => handleSelectItem(grpI, itemI)}>
                            Edit
                          </div>
                          <div onClick={() => handleDeleteCard(grpI, itemI)}>
                            Delete
                          </div>
                        </div>
                      )}
                    <div className="f">
                      <button
                        className="three-dots-btn"
                        onClick={(e) => handleToggleMenu(e, { grpI, itemI })}
                        aria-label="More options"
                      >
                        <BsThreeDotsVertical />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create Card</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="cardTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="cardLink">
                <Form.Label>Link</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter The Youtube Link"
                  value={cardLink}
                  onChange={(e) => setCardLink(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Create Card
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showEditModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{sam ? 'Edit Card' : 'Edit Group Name'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              type="text"
              placeholder="Enter new group name"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={sam ? handleUpdateItem : handleEditGroup}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={showIframeModal} onHide={setShowIframeModal}>
          <iframe
            style={customStyles}
            width="1120"
            height="640"
            src={`https://www.youtube.com/embed/${link}?autoplay=1`}
            title="YouTube video player"
            autopla
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </Modal>
      </div>
    );
  } else {
    return null;
  }
}

export default MyApp;
