import { useCallback, useEffect, useState } from "react";
import { ICoin, fetchCoinList } from "./api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as fasStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import { FixedSizeList as List } from "react-window";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  //   filter coins
  const filterCoins = (coins: ICoin[], query: string): ICoin[] => {
    return coins.filter((coin: ICoin) =>
      coin.toLowerCase().includes(query.toLowerCase())
    );
  };
  //   add favorite an remove favorite
  const showFavoritesCoins = (): void => {
    setShowFavorites(true);
  };

  const showAllCoins = (): void => {
    setShowFavorites(false);
  };
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
  //   toggle open
  const toggleOpen = useCallback((): void => {
    setIsOpen((prevOpen) => !prevOpen);
  }, []);

  //   scroll
  const Row = ({ index, style }: IRows) => (
    <div style={style} className="coin-list-all">
      <FontAwesomeIcon
        onClick={() => handleAddFavorite(filteredCoins[index])}
        className="star"
        icon={favoriteCoins.includes(filteredCoins[index]) ? fasStar : farStar}
      />
      {filteredCoins[index]}
    </div>
  );
  useEffect(() => {
    if (showFavorites) {
      setFilteredCoins(favoriteCoins);
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

  return (
    <div className="dropdown">
      <div className="panel-search-btn">
        <div className="default-coins">
          {defaultCoins.map((c: ICoin, ind: number) => (
            <li key={ind}>{c}</li>
          ))}
        </div>
        <button className="search-btn" onClick={toggleOpen}>
          <FontAwesomeIcon className="icon-search" icon={faMagnifyingGlass} />
          Search
        </button>
      </div>
      {isOpen && (
        <div className="panel-coins">
          <div className="search">
            <FontAwesomeIcon className="search-icon" icon={faMagnifyingGlass} />
            <input
              onChange={handleChange}
              id="search"
              type="search"
              placeholder="Search..."
            />
          </div>
          <div className="functional-btn">
            <button className="onstar" onClick={showFavoritesCoins}>
              <FontAwesomeIcon className="star-btn" icon={farStar} />
              FAVORITES
            </button>
            <button onClick={showAllCoins} className="ofstar">
              ALL COINS
            </button>
          </div>
          <div className="list-coins">
            <List
              className="coin-list-all"
              width={300}
              height={400}
              itemCount={filteredCoins.length}
              itemSize={35}
            >
              {Row}
            </List>
          </div>
        </div>
      )}
    </div>
  );
}
export default ListCoins;
