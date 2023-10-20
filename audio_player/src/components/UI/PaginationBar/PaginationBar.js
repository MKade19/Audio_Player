import {Pagination} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";

const PaginationBar = props => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [content, setContent] = useState(null);

  const togglePage = pageNumber => {
   searchParams.set('page', pageNumber);
   setSearchParams(searchParams);
  }

  useEffect(() => {
    const items = [];
    for (let i = props.pageNumber - 2; i <= props.pageNumber + 2; i++) {
      if (i > 0 && i <= props.pagesCount) {
        items.push(
          <Pagination.Item
            key={i}
            active={i === props.pageNumber}
            onClick={(e) => togglePage(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    }

    const newContent =
      <Pagination>
        <Pagination.First
          disabled={props.pagesCount === 1}
          onClick={(e) => togglePage(1)}
        />
        <Pagination.Prev
          disabled={props.pagesCount === 1}
          onClick={(e) => togglePage(props.pageNumber - 1)}
        />
        {items}
        <Pagination.Next
          disabled={props.pagesCount === 1}
          onClick={(e) => togglePage(props.pageNumber + 1)}
        />
        <Pagination.Last
          disabled={props.pagesCount === 1}
          onClick={(e) => togglePage(props.pagesCount)}
        />
      </Pagination>

    setContent(newContent)
  }, [props.pagesCount, props.pageNumber]);

  return (content);
}

export default PaginationBar;