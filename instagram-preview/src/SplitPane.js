import React, {
    createRef,
    useContext,
    useEffect,
    useRef,
    useState,
  } from "react";
  import DataContext from "./DataContext";
  import SplitPaneContext from "./SplitPaneContext";
  
  const SplitPane = ({ children, ...props }) => {
    const [clientHeight, setClientHeight] = useState(null);
    const [clientWidth, setClientWidth] = useState(null);
    const yDividerPos = useRef(null);
    const xDividerPos = useRef(null);
  
    const onMouseHoldDown = (e) => {
      yDividerPos.current = e.clientY;
      xDividerPos.current = e.clientX;
    };
  
    const onMouseHoldUp = () => {
      yDividerPos.current = null;
      xDividerPos.current = null;
    };
  
    const onMouseHoldMove = (e) => {
      if (!yDividerPos.current && !xDividerPos.current) {
        return;
      }
  
      setClientHeight(clientHeight + e.clientY - yDividerPos.current);
      setClientWidth(clientWidth + e.clientX - xDividerPos.current);
  
      yDividerPos.current = e.clientY;
      xDividerPos.current = e.clientX;
    };
  
    useEffect(() => {
      document.addEventListener("mouseup", onMouseHoldUp);
      document.addEventListener("mousemove", onMouseHoldMove);
  
      return () => {
        document.removeEventListener("mouseup", onMouseHoldUp);
        document.removeEventListener("mousemove", onMouseHoldMove);
      };
    });
  
    return (
      <div {...props}>
        <SplitPaneContext.Provider
          value={{
            clientHeight,
            setClientHeight,
            clientWidth,
            setClientWidth,
            onMouseHoldDown,
          }}
        >
          {children}
        </SplitPaneContext.Provider>
      </div>
    );
  };
  
  export const Divider = (props) => {
    const { onMouseHoldDown } = useContext(SplitPaneContext);
  
    return <div {...props} onMouseDown={onMouseHoldDown} />;
  };
  
  export const SplitPaneTop = (props) => {
    const topRef = createRef();
    const { clientHeight, setClientHeight } = useContext(SplitPaneContext);
    const { posts, setPosts, setCurrPost } = useContext(DataContext);
  
    useEffect(() => {
      if (!clientHeight) {
        setClientHeight(topRef.current.clientHeight);
        return;
      }
  
      topRef.current.style.minHeight = clientHeight + "px";
      topRef.current.style.maxHeight = clientHeight + "px";
    }, [clientHeight]);
  
    return (
      posts ? <div {...props} className="split-pane-top" ref={topRef}>
        <h3>Instagram Posts:</h3>
        <button onClick={() => {

          const newPosts = posts.map(post => post);
          
          setPosts(newPosts.sort((a,b) => a.likes - b.likes));
        }}>
          Sort By Likes
          </button>
        <ul>
          {posts.map((el, i) => {
            return (
              <li key={i}>
                <img src={el.Image} width={80} height={80} onClick={() => {
                  setCurrPost(el.id);
                }}></img>Likes: {el.likes}
              </li>
            );
          })}
        </ul>
      </div> : null
    );
  };
  
  export const SplitPaneBottom = (props) => {
    const { currPost } = useContext(DataContext);
  
    return (
      <div {...props} className="split-pane-bottom">
        Current <b>filteredPost id</b>: {currPost}
      </div>
    );
  };
  
  export const SplitPaneLeft = (props) => {
    const topRef = createRef();
    const { clientWidth, setClientWidth } = useContext(SplitPaneContext);
  
    useEffect(() => {
      if (!clientWidth) {
        setClientWidth(topRef.current.clientWidth / 2);
        return;
      }
  
      topRef.current.style.minWidth = clientWidth + "px";
      topRef.current.style.maxWidth = clientWidth + "px";
    }, [clientWidth]);
  
    return <div {...props} className="split-pane-left" ref={topRef} />;
  };
  
  export const SplitPaneRight = (props) => {
    const { posts, currPost, setPosts } = useContext(DataContext);
    const filteredPost = posts.find((el) => el.id === currPost);
  
    return (
      <div {...props} className="split-pane-right">
        <div className="filteredPost">
          <img src={filteredPost?.Image} alt="n/A" width={500} height={500} ></img>
          <br />
          Likes: {filteredPost?.likes}
          <br />
          Time: {filteredPost?.timestamp}
          <br />
          <button onClick={() => {
            filteredPost.likes = filteredPost.likes + 1;
            setPosts(posts.map(post => {
              if(post.id == filteredPost.id) {
                return {
                 ...filteredPost
                }
              } 
              return post;
            }));
          }}>Like</button>
        </div>
      </div>
    );
  };
  
  export default SplitPane;