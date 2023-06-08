import "./App.css";
import React from "react";

export default function App() {
  let [jobids, setJobids] = React.useState([]);
  let [jobdetails, setjobdetails] = React.useState([]);
  let [hasMoreJobs, setHasMoreJobs] = React.useState(true);

  const getDate = (date) => {
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    let h = date.getHours();
    let mm = date.getMinutes();
    let ss = date.getSeconds();
    let ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;

    return `${m}/${d}/${y}, ${h}:${mm}:${ss} ${ampm}`;
  };

  const onLoad = async () => {
    const remainingJobIDs = jobids.slice(jobdetails.length);
    const next6Tasks = remainingJobIDs.slice(0, 6);
    if (next6Tasks.length === 0) {
      setHasMoreJobs(false);
    }
    const taskData = await Promise.all(
      next6Tasks.map((id) =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
          .then((response) => response.json())
          .catch((error) => console.error(error))
      )
    );
    setjobdetails((prev) => [...prev, ...taskData]);
  };

  React.useEffect(() => {
    const fetchJobs = async () => {
      let response = await fetch(
        "https://hacker-news.firebaseio.com/v0/jobstories.json"
      );
      if (response.ok) {
        let joblist = await response.json();
        setJobids(joblist);
      }
    };
    fetchJobs();
  }, []);

  React.useEffect(() => {
    const fetch6Task = async () => {
      const next6Tasks = jobids.slice(0, 6);
      const taskData = await Promise.all(
        next6Tasks.map((id) =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            .then((response) => response.json())
            .catch((error) => console.error(error))
        )
      );
      setjobdetails((prev) => [...taskData]);
    };
    fetch6Task();
  }, [jobids]);

  return (
    <main>
      <h1> Hacker News Job Board </h1>
      {jobdetails.map((job) => (
        <a href={job["url"]} className="job-card" key={job["id"]}>
          <div className="job-card__title">{job["title"]}</div>
          <h6>
            By {job["by"]} . {getDate(new Date(job["time"]))}
          </h6>
        </a>
      ))}
      {hasMoreJobs && <button onClick={onLoad}>Load More</button>}
    </main>
  );
}
