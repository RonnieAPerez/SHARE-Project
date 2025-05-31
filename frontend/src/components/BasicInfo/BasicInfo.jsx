import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchClients } from "../DataCenter/data";
import { useQueryClient } from "@tanstack/react-query";
import Family from "../FamilyData/Family";
import "./BasicInfo.css";

export default function BasicInfo() {
	const { id } = useParams();
	const location = useLocation();
	const initialUser = location.state?.user;
	const [user, setUser] = useState(initialUser ?? null);
	const [loading, setLoading] = useState(initialUser ? false : true);
	const [error, setError] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [formData, setFormData] = useState({});
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const rawUser = localStorage.getItem("user");
	const loggedInUser = rawUser ? JSON.parse(rawUser) : {};
	const access_token = localStorage.getItem("access_token");
	const refreshToken = localStorage.getItem("refresh_token");
	const role = loggedInUser.role;

	useEffect(() => {
		if (user) setFormData({ ...user });
	}, [user]);

	useEffect(() => {
		if (user !== null) return;
		fetchClients()
			.then((clients) => {
				const found = clients.find((c) => `${c.id}` === id);
				setUser(found || undefined);
			})
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, [id, user]);

	const schema = [
		{ label: "First Name", key: "firstName" },
		{ label: "Last Name", key: "lastName" },
		{ label: "Date of Birth", key: "DOB" },
		{ label: "Age", key: "Age" },
		{ label: "Ethnicity", key: "Ethnicity" },
		{ label: "Marital Status", key: "MaritalStatus" },
		{ label: "DL / ID #", key: "DL" },
		{ label: "Medicaid", key: "Medicaid" },
		{ label: "Medicare", key: "Medicare" },
		{ label: "Phone", key: "Phone" },
		{ label: "Address", key: "Address" },
		{ label: "Apt #", key: "APT" },
		{ label: "City", key: "City" },
		{ label: "State", key: "State" },
		{ label: "Zip", key: "Zip" },
		{ label: "Church Home", key: "Church" },
		{ label: "Registration Date", key: "RegistrationDate" },
		{ label: "last pick up", key: "last_pick_up" },
	];

	const handleChange = (key) => (e) =>
		setFormData((prev) => ({ ...prev, [key]: e.target.value }));

	const handleSave = async () => {
		const updates = {};
		for (const key in formData) {
			if (formData[key] !== user[key]) {
				updates[key] = formData[key];
			}
		}
		if (Object.keys(updates).length === 0) {
			setEditMode(false);
			return;
		}
		try {
			const res = await fetch(`http://localhost:8000/clients/${user.id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updates),
			});
			if (!res.ok) {
				throw new Error("Failed to update user");
			}
			const updatedUser = await res.json();
			setUser(updatedUser);
			setFormData(updatedUser);
			setEditMode(false);
			queryClient.setQueryData(["clients"], (oldData) => {
				if (!oldData) return oldData;
				return oldData.map((c) => (c.id === updatedUser.id ? updatedUser : c));
			});
		} catch (err) {
			setError(err.message);
		}
	};

	const handleCancel = () => {
		setFormData({ ...user });
		setEditMode(false);
	};

	const handleDelete = async () => {
		if (!window.confirm("Are you sure you want to delete this client?")) return;
		try {
			const res = await fetch(`http://localhost:8000/clients/${user.id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`,
				},
			});
			if (!res.ok) {
				const errData = await res.json();
				throw new Error(errData.detail || "Failed to delete client");
			}
			queryClient.setQueryData(["clients"], (oldData) =>
				oldData ? oldData.filter((c) => c.id !== user.id) : []
			);
			navigate("/data");
		} catch (err) {
			console.error(err);
			alert(err.message);
		}
	};

	if (loading) return <p>Loading…</p>;
	if (error)
		return (
			<div className="BasicInfo-container">
				<Link to="/data">← Back</Link>
				<p style={{ color: "red" }}>{error}</p>
			</div>
		);
	if (user === undefined)
		return (
			<div className="BasicInfo-container">
				<Link to="/data">← Back</Link>
				<p>User not found.</p>
			</div>
		);

	return (
		<div>
			<div className="BasicInfo-container">
				<div className="BasicInfo-content-container">
					{schema.map(({ label, key }) => {
						const value = editMode ? formData[key] ?? "" : user[key];
						if (!editMode && (value === undefined || value === null))
							return null;
						return (
							<div className="BasicInfo-field" key={key}>
								<span className="BasicInfo-term">{label}:</span>
								{editMode ? (
									<input value={value} onChange={handleChange(key)} />
								) : (
									<span className="BasicInfo-desc">{value}</span>
								)}
							</div>
						);
					})}
				</div>

				{editMode ? (
					<div className="BasicInfo-actions">
						<button onClick={handleSave}>Save</button>
						<button onClick={handleCancel}>Cancel</button>
					</div>
				) : (
					<div className="edit-button-div">
						<button
							onClick={() => setEditMode(true)}
							className="BasicInfo-edit-button">
							Update
						</button>
					</div>
				)}
			</div>
			<div>
				<Family />
			</div>
			{(role === "admin" || role === "super_admin") && !editMode && (
				<div className="delete-button-div">
					<button onClick={handleDelete} className="BasicInfo-delete-button">
						Delete
					</button>
				</div>
			)}
		</div>
	);
}
