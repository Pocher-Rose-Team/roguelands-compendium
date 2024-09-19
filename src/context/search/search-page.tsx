import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Item } from "../../shared/model/item";
import { ItemService } from "../../shared/service/item-service";
import { get } from "fast-levenshtein";
import StandardTextField from "../../shared/components/standard-textfield/standard-textfield";
import "./search-page.css";

const ItemSearch: React.FC = () => {
  const MAX_RESULT_COUNT = 9;

  const itemService = new ItemService();
  const [items, setItems] = useState<Item[]>([]); // Array of Item objects
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term
  const [filteredItems, setFilteredItems] = useState<Item[]>([]); // Filtered list of items
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Fetch the JSON data from the public folder on component mount
  useEffect(() => {
    itemService.getAllItems().subscribe({
      next: (items) => setItems(items),
      error: (error) => console.error("Error loading items:", error),
    });
  }, []);

  // Filter the items based on the search term and limit the results to 5 items
  useEffect(() => {
    if (searchTerm) {
      const sanitizedSearchTerm = searchTerm.toLowerCase().replace(/\s+/g, "");
      const results = items
        .filter((item) => {
          const sanitizedItemName = item.name.toLowerCase().replace(/\s+/g, "");
          const distance = get(sanitizedItemName, sanitizedSearchTerm);
          return distance <= 2 || sanitizedItemName.includes(sanitizedSearchTerm);
        })
        .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically
        .slice(0, MAX_RESULT_COUNT); // Limit the number of results to 5
      setFilteredItems(results);
    } else {
      setFilteredItems([]); // Show no items if the search term is empty
    }
  }, [searchTerm, items]);

  // Handle the search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle clicking on an item
  const handleItemClick = (itemName: string) => {
    navigate(`/editor/${itemName}`);
  };

  return (
    <div className="search-container">
      <h2>Search Items</h2>
      <StandardTextField
        fullWidth
        label="Search by item name"
        value={searchTerm}
        onChange={handleInputChange}
      />

      {/* Only show the list when there is something in the input field */}
      {searchTerm && filteredItems.length > 0 && (
        <div className="search-result-list">
          {filteredItems.map((item) => (
            <div
              className="search-result-item"
              key={item.name}
              onClick={() => handleItemClick(item.name)} // Navigate to the editor when an item is clicked
            >
              <img src={item.path} alt={item.name} />
              <div>
                <p className="item-title">{item.representation}</p>
                <p className="item-path">{item.path}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemSearch;
