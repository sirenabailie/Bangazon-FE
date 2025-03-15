import React from "react";
import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";

export default function ProductCard({ productObj }) {
  return (
    <Card style={{ width: "18rem", margin: "10px" }}>
      <Card.Img
        variant="top"
        src={productObj.image}
        alt={productObj.name}
        style={{ height: "200px", objectFit: "cover" }} 
      />
      <Card.Body>
        <Card.Title>{productObj.name}</Card.Title>
        <Card.Text>{productObj.description}</Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>Price: ${productObj.price}</ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Button variant="primary">
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
}

ProductCard.propTypes = {
  productObj: PropTypes.shape({
    id: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    categoryId: PropTypes.number.isRequired,
  }).isRequired,
};
