import { useEffect } from "react";

const APP_NAME = "Smart Study Planner";

export const buildDocumentTitle = (pageTitle) => {
  if (!pageTitle) {
    return APP_NAME;
  }

  return pageTitle + " | " + APP_NAME;
};

function useDocumentTitle(pageTitle) {
  useEffect(() => {
    document.title = buildDocumentTitle(pageTitle);
  }, [pageTitle]);
}

export default useDocumentTitle;