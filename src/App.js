// First I am importing React libraries, state hooks, Ant Design library to make features attractive 
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Input, Button, Modal } from "antd";
import "./App.css";
import "antd/dist/reset.css";

// Destructuring the object Input
const { Search } = Input;

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending");
  const [selectedMovie, setSelectedMovie] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(
        `https://www.omdbapi.com/?s=${searchTerm}&apikey=89fbb5e2`
      );
      if (result.data.Search) {
        setMovies(result.data.Search);
      }
    };

    fetchData();
  }, [searchTerm]);

  const handleSortOrder = () => {
    setSortOrder(sortOrder === "ascending" ? "descending" : "ascending");
  };

  const handleMovieSelection = (imdbID) => {
    axios
      .get(`https://www.omdbapi.com/?i=${imdbID}&apikey=89fbb5e2`)
      .then((result) => {
        setSelectedMovie(result.data);
        setModalVisible(true);
      });
  };

  const filteredMovies = movies
    .filter((movie) =>
      movie.Title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "ascending") {
        return a.Year - b.Year;
      } else {
        return b.Year - a.Year;
      }
    });

  return (
    <div style={{ background: "#f2g2g6", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "80%" }}>
        <div style={{ background: "#f0f2f5", padding: "20px", display: "flex", justifyContent: "space-between" }}>
          {/* Search bar for providing the input and search for the movie names. */}
          <Search
            placeholder="Search by title"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            style={{ width: "60%" }}
          />
          {/* This button will sort the movie year in ascending order or descending order, to get the arrow symbol here I used 
          ASCII characters 'u+2197' and 'u+2198' respectively */}
          <Button onClick={handleSortOrder}>
            Sort by release year ({sortOrder === "ascending" ? "⬆️" : "⬇️"})
          </Button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gridGap: "20px",
          }}
        >
          {/* This card is imported from Ant Design and it will use to display the movie information in required format. */}
          {filteredMovies.map((movie) => (
            <Card
              key={movie.imdbID}
              hoverable
              cover={<img alt={movie.Title} src={movie.Poster} />}
              onClick={() => handleMovieSelection(movie.imdbID)}
            >
              <Card.Meta
                title={movie.Title}
                description={`${movie.Year} - ${movie.imdbRating}`}
              />
            </Card>
          ))}
        </div>
        {/* I am using Modal feature becasue, When we require users to interact with the application, 
        but without jumping to a new page and interrupting the user's workflow,
        you can use Modal to create a new floating layer over the current page to get user feedback or display information. */}
        <Modal
          title={selectedMovie.Title}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <div style={{ display: "flex" }}>
            <img
              style={{ width: "30%", marginRight: "20px" }}
              alt={selectedMovie.Title}
              src={selectedMovie.Poster}
            />
            <div>
              <p>
                <b>Release Year:</b> {selectedMovie.Year}
              </p>
              <p>
                <b>IMDB Rating:</b> {selectedMovie.imdbRating}
              </p>
              <p>
                <b>Synopsis:</b> {selectedMovie.Plot}
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
export default App;
