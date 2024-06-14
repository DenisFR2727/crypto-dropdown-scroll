import { useCallback, useEffect, useRef, useState } from "react";
import { ICoin, fetchCoinList } from "./api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as fasStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import { FixedSizeList as List } from "react-window";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import ReactDOM from "react-dom";
import "./style.css";

interface IRows {
  index: number;
  style: React.CSSProperties;
}
function ListCoins() {
  const defaultCoins: ICoin[] = ["BTC", "ETH", "BNB"];
  const [allCoins, setAllCoins] = useState<ICoin[]>([]);
  const [query, setQuery] = useState<string>("");
  const [filteredCoins, setFilteredCoins] = useState<ICoin[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [favoriteCoins, setFavoriteCoins] = useState<ICoin[]>([]);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<string>("");

  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  //   filter coins
  const filterCoins = (coins: ICoin[], query: string): ICoin[] => {
    return coins.filter((coin: ICoin) =>
      coin.toLowerCase().includes(query.toLowerCase())
    );
  };

  const showFavoritesCoins = useCallback((): void => {
    setShowFavorites(true);
    setActiveButton("favorites");
    if (showFavorites) {
      setQuery("");
    }
  }, [showFavorites]);

  const hideFavoritesCoins = useCallback((): void => {
    setShowFavorites(false);
    setActiveButton("allCoins");
  }, []);

  const handleAddFavorite = useCallback(
    (coin: ICoin) => {
      if (favoriteCoins.includes(coin)) {
        setFavoriteCoins(favoriteCoins.filter((c: ICoin) => c !== coin));
      } else {
        setFavoriteCoins([...favoriteCoins, coin]);
      }
    },
    [favoriteCoins]
  );
  // toggle open
  const toggleOpen = useCallback((): void => {
    setIsOpen((prevOpen) => !prevOpen);
  }, []);

  //   scroll
  const Row = ({ index, style }: IRows) => {
    return (
      <div style={style} className="coin-list-all">
        <li className="hover-element-coin">
          <FontAwesomeIcon
            onClick={() => handleAddFavorite(filteredCoins[index])}
            className="star"
            icon={
              favoriteCoins.includes(filteredCoins[index]) ? fasStar : farStar
            }
          />
          {filteredCoins[index]}
        </li>
      </div>
    );
  };
  useEffect(() => {
    if (showFavorites) {
      setFilteredCoins(filterCoins(favoriteCoins, query));
    } else {
      setFilteredCoins(filterCoins(allCoins, query));
    }
  }, [query, allCoins, showFavorites, favoriteCoins]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const data = await fetchCoinList();
      setAllCoins(data);
      setFilteredCoins(data);
    };
    fetchData();
  }, []);

  const modalRoot = document.getElementById("modal-root");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        buttonRef.current !== event.target
      ) {
        setIsOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="dropdown">
      <div className="panel-search-btn">
        <div className="default-coins">
          {defaultCoins.map((c: ICoin, ind: number) => (
            <li key={ind}>{c}</li>
          ))}
        </div>
        <button ref={buttonRef} className="search-btn" onClick={toggleOpen}>
          <FontAwesomeIcon className="icon-search" icon={faMagnifyingGlass} />
          Search
        </button>
      </div>
      {isOpen &&
        modalRoot &&
        ReactDOM.createPortal(
          <div ref={modalRef} className="panel-coins">
            <div className="search">
              <FontAwesomeIcon
                className="search-icon"
                icon={faMagnifyingGlass}
              />
              <input
                onChange={handleChange}
                id="search"
                type="search"
                placeholder="Search..."
                value={query}
              />
            </div>
            <div className="functional-btn">
              <button
                className={`onstar ${
                  activeButton === "favorites" ? "active-tab" : ""
                }`}
                onMouseEnter={showFavoritesCoins}
              >
                <FontAwesomeIcon className="star-btn" icon={farStar} />
                FAVORITES
              </button>
              <button
                className={`ofstar ${
                  activeButton === "allCoins" ? "active-tab" : ""
                }`}
                onMouseEnter={hideFavoritesCoins}
              >
                ALL COINS
              </button>
            </div>
            <div className="list-coins">
              {favoriteCoins.length === 0 && filteredCoins.length === 0 ? (
                <div className="no-coin">
                  No add favorite coins. Coins empty!
                </div>
              ) : (
                <List
                  className="coin-list-all"
                  width={300}
                  height={400}
                  itemCount={filteredCoins.length}
                  itemSize={35}
                >
                  {Row}
                </List>
              )}
            </div>
          </div>,
          modalRoot
        )}
    </div>
  );
}
export default ListCoins;
