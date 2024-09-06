"use client";

import { useEffect, useRef } from "react";

const Comments = ({ id : issueTerm }) => {
  const commentsSection = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("repo", "TN1905/uteranc.es");
    script.setAttribute("issue-term", issueTerm);
    script.setAttribute("theme", "icy-dark");
    commentsSection.current.appendChild(script);
  }, [issueTerm]);

  return <div ref={commentsSection} />;
};

export default Comments;
