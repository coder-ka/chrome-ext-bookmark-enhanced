import React, { useEffect, useRef, useState } from "react";
import { Bookmark, Bookmarks, LocalData, Tag } from "./schema";

function Options() {
  function bookmarkObjToArray(bookmarkObj: Bookmarks): Bookmark[] {
    const bookmarks: Bookmark[] = [];
    for (const url in bookmarkObj) {
      bookmarks.push(bookmarkObj[url]);
    }

    return bookmarks;
  }

  const [bookmarks, setBookmarks] = useState<Bookmark[]>();
  useEffect(() => {
    function fetchBookmarks() {
      chrome.storage.local.get("bookmarks", (data: LocalData) => {
        const bookmarks = bookmarkObjToArray(data.bookmarks || {});
        setBookmarks(bookmarks);
      });
    }

    fetchBookmarks();

    function onDocumentVisible() {
      if (document.visibilityState === "visible") {
        fetchBookmarks();
      }
    }

    document.addEventListener("visibilitychange", onDocumentVisible);

    return () =>
      document.removeEventListener("visibilitychange", onDocumentVisible);
  }, []);

  function deleteBookmark(bookmark: Bookmark) {
    chrome.storage.local.get("bookmarks", (data: LocalData) => {
      if (data.bookmarks !== undefined) {
        delete data.bookmarks[bookmark.url];
        chrome.storage.local.set({
          bookmarks: data.bookmarks,
        });

        setBookmarks(bookmarkObjToArray(data.bookmarks));
      }
    });
  }

  const latestBookmarks = bookmarks?.sort((a, b) => {
    const aUpdated = new Date(a.updated);
    const bUpdated = new Date(b.updated);
    return aUpdated > bUpdated ? -1 : aUpdated < bUpdated ? 1 : 0;
  });

  const groupsByTag = latestBookmarks?.reduce(
    (groups, bookmark) => {
      for (const tag of bookmark.tags) {
        const groupIndex = groups.findIndex((x) => x.tag.name === tag.name);
        if (groupIndex === -1) {
          groups.push({
            tag,
            bookmarks: [bookmark],
          });
        } else {
          groups[groupIndex].bookmarks.push(bookmark);
        }
      }

      return groups;
    },
    [] as {
      tag: Tag;
      bookmarks: Bookmark[];
    }[]
  );

  const url = useRef(new URL(location.href));

  const [searchValue, setSearchValue] = useState(
    url.current.searchParams.get("search")
  );

  useEffect(() => {
    if (searchValue === null || searchValue === "") {
      url.current.searchParams.delete("search");
    } else {
      url.current.searchParams.set("search", searchValue);
    }

    history.replaceState({ searchValue }, "", url.current.toString());
  }, [searchValue]);

  return (
    <div className="p-4 flex flex-col gap-y-2">
      <div>
        <div className="mb-2">
          <span className="mr-2">Tags</span>
          <input
            className="border border-gray-400 rounded p-1"
            type="text"
            placeholder="search"
            value={searchValue || ""}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-y-2">
          {groupsByTag?.map((group) =>
            searchValue === null || group.tag.name.includes(searchValue) ? (
              <div
                key={group.tag.name}
                className="border border-gray-400 rounded p-2"
              >
                <div className="text-pink-500 font-bold text-lg mb-1">
                  {group.tag.name}
                </div>
                <div className="flex flex-col">
                  {group.bookmarks.map((bookmark) => (
                    <div key={bookmark.url}>
                      ・
                      <a
                        className="text-blue-500"
                        href={bookmark.url}
                        target="__blank"
                      >
                        {bookmark.title}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
      <div>
        <div className="mb-2">History</div>
        <div className="flex flex-col gap-y-1">
          {latestBookmarks?.map((bookmark) => (
            <div
              key={bookmark.url}
              className="border border-gray-400 rounded p-2 flex"
            >
              <a className="text-blue-500" href={bookmark.url} target="__blank">
                {bookmark.title}
              </a>
              <button
                onClick={() => {
                  deleteBookmark(bookmark);
                }}
                className="ml-auto text-sm"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Options;
