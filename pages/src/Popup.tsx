import React, { useEffect, useState } from "react";
import debounce from "just-debounce";
import { Bookmark, LocalData } from "./schema";
import { MemoEditor } from "./MemoEditor";

function Popup() {
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab>();

  useEffect(() => {
    chrome.tabs
      .query({
        active: true,
        currentWindow: true,
      })
      .then(([tab]) => {
        setCurrentTab(tab);
      });
  }, []);

  const [bookmark, setBookmark] = useState<Bookmark>();
  useEffect(() => {
    chrome.storage.local.get("bookmarks", (data: LocalData) => {
      const bookmarks = data.bookmarks || {};

      if (currentTab && currentTab.url) {
        const bookmark = bookmarks[currentTab.url] || {
          url: currentTab.url,
          title: currentTab.title || "",
          tags: [],
        };

        setBookmark(bookmark);
      }
    });
  }, [currentTab]);

  const saveBookmark = debounce((bookmark: Bookmark) => {
    chrome.storage.local.get("bookmarks", (data: LocalData) => {
      const bookmarks = data.bookmarks || {};
      bookmarks[bookmark.url] = bookmark;
      chrome.storage.local.set({ bookmarks }, () => {});
    });
  }, 100);

  useEffect(() => {
    if (bookmark) saveBookmark(bookmark);
  }, [bookmark]);

  return bookmark === undefined ? (
    <div>...loading</div>
  ) : (
    <div className="w-[500px] p-5 ">
      <div>
        Title
        <div className="flex">
          <input
            className="flex-1 p-2 border border-gray-400 rounded"
            type="text"
            value={bookmark.title}
            onChange={(e) => {
              setBookmark({
                ...bookmark,
                title: e.target.value,
              });
            }}
          />
        </div>
      </div>
      <div className="mt-2">
        Memo
        <div className="flex">
          <MemoEditor
            className="flex-1 p-2 border border-gray-400 rounded"
            defaultContent={bookmark.content}
            onChange={(content, tags) => {
              setBookmark({
                ...bookmark,
                content,
                tags,
              });
            }}
          ></MemoEditor>
        </div>
      </div>
    </div>
  );
}

export default Popup;
