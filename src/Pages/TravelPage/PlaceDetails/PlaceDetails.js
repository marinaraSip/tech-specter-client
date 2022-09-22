import { useParams } from "react-router-dom";
import { Col, Container, Row, Toast } from "react-bootstrap";
import Rating from "react-rating";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import usePlaceDetails from "../../../hooks/usePlaceDetails/usePlaceDetails";
import { useEffect, useState } from "react";


const PlaceDetails = () => {
    const { serviceId } = useParams();
    const [place] = usePlaceDetails(serviceId);

    const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState();

  useEffect(() => {
    fetch("https://tech-specter.onrender.com/reviews")
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch((error) => Toast.error(error.message));
  }, []);

  const filteredReviews = reviews?.filter(
    (review) => review.category === "travel"
  );
//   console.log(filteredReviews);

    return (
        <Container >
      <h1 style={{textTransform:'uppercase', fontWeight:'bolder', fontSize:'60px'}}>{place.category}</h1>
      <Row className="text-start">
        <Col>
          <img
            className="img-fluid"
            alt=""
            src={place.image}
            style={{ height: "500px" }}
          />
         <Card className="my-2">
            <h6 className="fw-bold ms-1 mt-1">Reviews</h6>
            <Row>
              {filteredReviews?.map((review) => (
                <Col
                  key={review._id}
                  review={review}
                  className="my-1 mx-1 text-start"
                  sm={12}
                  md={6}
                  lg={4}
                >
                    <Card style={{ width: '135%' }} className="ps-3 py-2">
                      <h6>{review.name}</h6>
                      <h6>
                        <Rating
                          className="text-warning"
                          emptySymbol="far fa-star"
                          fullSymbol="fas fa-star"
                          initialRating={review.rating}
                          readonly
                        />{" "}
                        {review.rating}
                      </h6>
                      <small>{review.description}</small>
                    </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header style={{textTransform:'uppercase', fontWeight:'bold'}} as="h4">{place.name}</Card.Header>
            <h6 className="rating"><Rating 
            defaultValue={5}
            fullSymbol="fas fa-star"
          /><br/><small>based on 120 reviews</small></h6>
          
          <hr />
            <Card.Body>
                <Card.Title>Price: 
                {place.price} BDT
              </Card.Title>
                <Card.Title>Date: 
                {place.date}
              </Card.Title>
              <Card.Text>
                {place.description}
              </Card.Text>
              <Card.Title>
                What we provide?
              </Card.Title>
              <ul>
                  <li>24 hours customer support.</li>
                  <li>Team of 4 peoples will always ready to help.</li>
                  <li>Immediate solution to your problem.</li>
                  <li>Commitment to make your travel safe.</li>
                </ul>
              <Link to={`/placeBooking/${serviceId}`}>
              <Button variant="danger">Book Now</Button>
              </Link>
              <Link to={`/placeBooking/${serviceId}`}>
              <Button className="ms-2" variant="danger">Add Review</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    );
};

export default PlaceDetails;