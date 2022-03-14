import React from 'react'
import "./Legend.css"

export const Legend = () => {
    const listElements = ["SVM - Support vector machines ", "CNN - Convolutional neural network", "KNN - k-nearest neighbors",
        "RF - Random Forest", "MLP - Multilayer perceptron", "GBC - Genetic Bee Colony", "ETC - Ethereum Classic"]
    return (
        <div className="card legend-container">
            <div className="card-header">
                Legend
            </div>
            <ul className="list-group list-group-flush">
                {listElements.map((element) => (
                    <li className="list-group-item" key={element}>{element}</li>
                ))}
            </ul>
        </div>
    )
}
