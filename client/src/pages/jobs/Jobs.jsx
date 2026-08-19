import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import JobCard from "../../components/JobCard";
import api from "../../services/api";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/jobs", {
        params: { search, location }
      });
      setJobs(data.jobs || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadJobs(); }, []);

  return (
    <div>
      <Navbar />
      <main className="page-shell">
        <div className="page-heading">
          <div>
            <div className="eyebrow">OPPORTUNITIES</div>
            <h1>Explore your next role.</h1>
            <p>Search approved openings from our recruiter network.</p>
          </div>
        </div>

        <div className="search-bar">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search role, skill or company..." />
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location..." />
          <button className="primary-btn" onClick={loadJobs}>Search</button>
        </div>

        {loading ? <div className="empty-state">Loading opportunities...</div> :
          jobs.length ? <div className="jobs-grid">{jobs.map(job => <JobCard key={job.id} job={job} />)}</div> :
          <div className="empty-state"><h3>No matching jobs</h3><p>Try a different keyword or location.</p></div>}
      </main>
      <Footer />
    </div>
  );
}
