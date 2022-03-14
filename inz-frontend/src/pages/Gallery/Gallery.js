import React, { useState, useEffect } from 'react'
import { Button, Modal, Dropdown } from 'react-bootstrap';
import { getImages, getClassifications } from "../../apis"
import { Legend } from '../../components/Legend/Legend'

export const Gallery = () => {
    const [images, setImages] = useState([])
    const [modalContent, setModalContent] = useState(null)
    const [filter, setFilter] = useState(null)
    const [filteredImages, setFilteredImages] = useState([])
    const [isDirty, setDirty] = useState(false)

    const options = ["dot", "artefact", "track", "worm", "all"]
    const fetchListOfImages = async () => {
        const result = await getImages()
        setImages(result)
        setFilteredImages(result)
    }
    const fetchImageDetails = async (imageId) => await getClassifications(imageId)

    const openModal = async (payload) => {
        const imageDetails = await fetchImageDetails(payload.id);
        setModalContent({ ...payload, imageDetails })
    };
    const closeModal = () => setModalContent(null);

    useEffect(() => {
        fetchListOfImages()
    }, []);

    useEffect(() => {
        filter === "all" ? setFilteredImages(images) : setFilteredImages(images?.filter((image) => image.final_class_name === filter))
    }, [filter]);

    return (
        <div className='container my-5'>
            <Dropdown className="mb-4" style={{ textAlign: "end", minWidth: "160px" }}>
                <Dropdown.Toggle id="dropdown-basic" style={{ minWidth: "120px", background: "#0dcaf0", color: "#212529", boxShadow: "none" }}>
                    {filter ?? "Class Filters"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {options.map((option) => <Dropdown.Item key={option} onClick={() => {
                        setFilter(option);
                        setDirty(true);
                    }}>{option}</Dropdown.Item>)}
                </Dropdown.Menu>
            </Dropdown>
            <table className="table" style={{ textAlign: "center" }}>
                <thead>
                    <tr>
                        <th>IMAGE ID</th>
                        <th>IMAGE</th>
                        <th>IMAGE CLASS</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredImages?.map((image) => (
                        <tr key={image.id}>
                            <th scope="row">{image.id}</th>
                            <td><img className='mx-2' src={`data:image/jpeg;base64,${image.frame_content}`} width="64px" height="64px" style={{
                                cursor: "pointer"
                            }}
                                onClick={() => openModal(image)}
                            /></td>
                            <td>{image?.final_class_name ?? "undefined"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isDirty && !filteredImages.length ? <div style={{ background: "#0dcaf0", color: "#212529", padding: "10px", textAlign: "center" }}>Not Found</div> : null}
            <Legend />
            <Modal show={modalContent} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Classifications</Modal.Title>
                </Modal.Header>
                {modalContent && <Modal.Body>
                    <div className='mx-2' style={{ textAlign: "center" }} >
                        <img src={`data:image/jpeg;base64,${modalContent?.frame_content}`} width="64px" height="64px"
                        />
                    </div>
                    <div className='mt-3' style={{ display: "flex", justifyContent: "space-evenly", maxHeight: "400px", overflowY: "scroll" }}>
                        <div>
                            <p className='text-dark'><b>Classifier Name</b></p>
                            <ul>
                                {modalContent?.imageDetails?.map(({ classifier_name = "" }, i) => <li key={i}>{classifier_name}</li>)}
                            </ul>
                        </div>
                        <div>
                            <p className='text-dark'><b>Class name</b></p>
                            <ul>
                                {modalContent?.imageDetails?.map(({ class_name = "" }, i) => <li key={i}>{class_name}</li>)}
                            </ul>
                        </div>
                    </div>
                </Modal.Body>}
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
