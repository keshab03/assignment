import axios from "axios";
import { useState, useEffect } from "react";
import "./app.css";

const App = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showNextJoke, setShowNextJoke] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalContent, setModalContent] = useState({
    category: "",
    joke: "",
  });

  useEffect(() => {
    axios
      .get("https://api.chucknorris.io/jokes/categories")
      .then((response) => {
        setCategories(response.data);
        setSelectedCategory(response.data[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []); 

  useEffect(() => {
    setModalContent({
      category: "",
      joke: "",
    });
  }, [selectedCategory]);

  const fetchRandomJoke = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(`https://api.chucknorris.io/jokes/random?category=${selectedCategory}`);
      setModalContent({
        category: selectedCategory,
        joke: response.data.value,
      });

      setIsLoading(false);
      setIsModalVisible(true);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchRandomJoke();
    setShowNextJoke(true);
  };

  const handleNextJoke = () => {
    fetchRandomJoke();
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="container">
      <h1>Chuck Norries</h1>
      <div className="category-list">
        {categories.map((category) => (
          <div key={category} className="category-item">
            <button
              onClick={() => handleCategoryClick(category)}
            >
              <span id="title">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
              <br />
              <span id="des" style={{ fontSize: "12px" }}>Unlimited Jokes On {category}</span>
            </button>
          </div>
        ))}
      </div>
      {isModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" style={{ color: 'white' }} onClick={closeModal}>&times;</span>
            <h2>{modalContent.category}</h2>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <p id="jocks">{modalContent.joke}</p>
            )}
            {showNextJoke && (
              <button id="btn" onClick={handleNextJoke}>Next Jock</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
