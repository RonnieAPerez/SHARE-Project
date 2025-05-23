import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Dashboard() {
	const navigate = useNavigate();
	const [showCreate, setShowCreate] = useState(false);

	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const role = "volunteer";

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		try {
			const res = await fetch("http://localhost:8000/auth/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password, role }),
			});

			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.detail || "Login failed");
			}

			setSuccess("Volunteer successfully created!");
			setUsername("");
			setPassword("");
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<div className="Dashboard-Page">
			<div className="Title-Dashboard">
				<div className="Home-Title-Dashboard">
					<button onClick={() => navigate("/data")}>Home</button>
					<p>Admin Dashboard</p>
				</div>
				<hr />
				<div className="Buttons-Dashboard">
					<button
						className="Create-Volunteer-Button"
						onClick={() => setShowCreate((prev) => !prev)}>
						Create Volunteer
					</button>
				</div>

				{showCreate && (
					<div className="Create-Volunteer-Open">
						<h3>Create a new volunteer</h3>
						<form onSubmit={handleSubmit}>
							<input
								type="text"
								placeholder="Username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
							<input
								type="password"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<button className="Volunteer-Submit" type="submit">
								Submit
							</button>
						</form>
						{error && <p className="error-message">{error}</p>}
						{success && <p className="success-message">{success}</p>}
					</div>
				)}
			</div>
		</div>
	);
}

export default Dashboard;
