import SplitPane, {
  Divider,
  SplitPaneBottom,
  SplitPaneLeft,
  SplitPaneRight,
  SplitPaneTop,
} from "./SplitPane";
import DataContext from "./DataContext";
import { useEffect, useState } from "react";
import axios from 'axios';

import "./App.css";


function App() {
  const [currPost, setCurrPost] = useState(1);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("https://s3-ap-southeast-1.amazonaws.com/he-public-data/instaf913f18.json")
    .then(res => {
      // alert(res);
      var count = 1;
      res.data = res.data.map(ele => {
        return  {
          ...ele,
          id: count++
        }
      });
      console.log(res.data);
      // posts = res.data;
      setPosts(res.data);
    })
    .catch((err) => err);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="App">
      <DataContext.Provider value={{ posts, setPosts, currPost: currPost, setCurrPost: setCurrPost }}>
        <SplitPane className="split-pane-row">
          <SplitPaneLeft>
            <SplitPane className="split-pane-col">
              <SplitPaneTop />
              <Divider className="separator-row" />
              <SplitPaneBottom />
            </SplitPane>
          </SplitPaneLeft>
          <Divider className="separator-col" />

          <SplitPaneRight />
        </SplitPane>
      </DataContext.Provider>
    </div>
  );
}

export default App;