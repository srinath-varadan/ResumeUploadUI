import React, { useState, useEffect } from "react";
import axios from "axios";
import Suggestions from "./Suggestions/Suggestions";
import styles from "../../style";

export default function SearchBar(props) {
  let [q, setQ] = useState("");
  let [suggestions, setSuggestions] = useState([]);
  let [showSuggestions, setShowSuggestions] = useState(false);

  const onSearchHandler = () => {
    props.postSearchHandler(q);
    setShowSuggestions(false);
  };

  const suggestionClickHandler = (s) => {
    document.getElementById("search-box").value = s;
    setShowSuggestions(false);
    props.postSearchHandler(s);
  };

  const onEnterButton = (event) => {
    if (event.keyCode === 13) {
      onSearchHandler();
    }
  };

  const onChangeHandler = () => {
    var searchTerm = document.getElementById("search-box").value;
    setShowSuggestions(true);
    setQ(searchTerm);

    // use this prop if you want to make the search more reactive
    if (props.searchChangeHandler) {
      props.searchChangeHandler(searchTerm);
    }
  };

  useEffect(
    (_) => {
      const timer = setTimeout(() => {
        const body = {
          q: q,
          top: 5,
          suggester: "cosmossuggester",
        };

        if (q === "") {
          setSuggestions([]);
        } else {
          axios
            .post(`${import.meta.env.VITE_SUGGEST_URL}`, body)
            .then((response) => {
              setSuggestions(response.data.suggestions);
            })
            .catch((error) => {
              console.log(error);
              setSuggestions([]);
            });
        }
      }, 300);
      return () => clearTimeout(timer);
    },
    [q]
  );

  var suggestionDiv;
  if (showSuggestions) {
    suggestionDiv = (
      <Suggestions
        suggestions={suggestions}
        suggestionClickHandler={(s) => suggestionClickHandler(s)}
      ></Suggestions>
    );
  }

  return (
    <section
      id="search"
      className={`flex md:flex-row flex-col ${styles.paddingY} ${props.width}`}
    >
      <div className={`flex-1 flex-col xl:px-0 sm:px-16 px-6`}>
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="flex-1 font-poppins font-semibold ss:text-[40px] text-[32px] text-white ss:leading-[100.8px] leading-[75px]">
            Enter Keywords
          </h1>
        </div>

        <div className={`flex flex-row w-full`}>
          <div
            className="flex flex-row  w-[85%]"
            onKeyDown={(e) => onEnterButton(e)}
            style={{ flexWrap: "wrap" }}
          >
            <input
              autoComplete="off" // setting for browsers; not the app
              type="text"
              id="search-box"
              className="w-[100%]"
              style={{ background: "#3f3e45" }}
              placeholder="What are you looking for?"
              onChange={onChangeHandler}
              defaultValue={props.q}
              onBlur={() => setShowSuggestions(false)}
              onClick={() => setShowSuggestions(true)}
            ></input>
            {showSuggestions && suggestions?.length > 0 && suggestionDiv}
          </div>
          <div className="flex flex-row  w-[15%]">
            <button
              className="h-8 ml-auto text-[12px] uppercase tracking-wider font-bold text-white border border-purple-400 rounded-md px-3 hover:bg-purple-400 hover:text-white transition-colors"
              type="submit"
              onClick={onSearchHandler}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
