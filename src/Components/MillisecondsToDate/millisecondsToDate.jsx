import { useEffect, useState } from "react";

const MillisecondsToDate = (props) => {

    const [milliseconds] = useState(props?.item);
    const [formattedDateTime, setFormattedDateTime] = useState("");
  
    useEffect(() => {
      convertMillisecondsToDate();
    }, []);
    const convertMillisecondsToDate = () => {
      const dateObj = new Date(props?.item);

    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata"
    };
      const formattedDateTime = dateObj.toLocaleDateString("en-IN", options);
  
      setFormattedDateTime(formattedDateTime);
    };
  
    return <span>{formattedDateTime}</span>;
  };

  export default MillisecondsToDate;