import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';

import Sheet from './Sheet';
import Home from './Home';
import { useFetchSheets } from './util/useFetchSheets';
import styles from './styles/App.module.css';
import globalStyles from './styles/Global.module.css';
import {ReactComponent as HouseSVG} from "./assets/icons/house.svg";

function App() {

  const repo = process.env.REACT_APP_SHEET_REPOSITORY ?? "";
  const branch = process.env.REACT_APP_SHEET_REPOSITORY_BRANCH ?? "";

  const [sheets] = useFetchSheets(repo, branch);

  const [searchString, setSearchString] = useState("");
  const [title, setTitle] = useState("Delyrium");
  const [artist, setArtist] = useState("");

  const [redirect, setRedirect] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (redirect !== ""){
      navigate(redirect);
      setRedirect("");
    }
  }, [redirect, navigate]);

  function clearSearchString() {
    setSearchString("");
  }

  return (
    <>
      <header>
        <div className={styles['header-wrapper']}>
          <div className={styles['header-left']}>
            <Link to="/" className={styles.home} onClick={() => setSearchString("")}>
              <HouseSVG />
            </Link>
            <label>
              <span className={globalStyles['sr-only']}>Search</span>
              <input onChange={(event) => setSearchString(event.target.value)} onKeyDown={(event) => {event.key === 'Enter' && setRedirect("/")}} value={searchString} className={styles.searchbar} />
            </label>
          </div>
          <h1>{title}{artist !== "" && <> - <span>{artist}</span></>}</h1>
        </div>
      </header>
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Home sheets={sheets} search={searchString} callbacks={{clear: clearSearchString, setTitle, setArtist}} />} />
          {Object.entries(sheets ?? {}).map(([slug, sheet], idx) => (
            <Route path={`sheet/${slug}`} element={<Sheet data={sheet} callbacks={{setTitle, setArtist}} key={`sheet-${idx}`} />} key={`route-${idx}`} />
          ))}
        </Routes>
      </main>
      {/* <footer>FOOTER</footer> */}
    </>
  );
}

export default App;
