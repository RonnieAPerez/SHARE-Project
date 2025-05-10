import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchData from "../components/SearchData/SearchData";
import DataCenter from "../components/DataCenter/DataCenter";
import LogoutButton from "../components/LogoutButton/LogoutButton";
import Add_Client_Button from "../components/Add_Client_Button/Add_Client_Button";

function PeoplesData() {

  const navigate = useNavigate();
	const rawUser = localStorage.getItem("user");
	const loggedInUser = rawUser ? JSON.parse(rawUser) : {};
	const role = loggedInUser.role;

	const [searchQuery, setSearchQuery] = useState("");

	return (
		<div className="Peoples-Data-page">
			<SearchData searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
			<DataCenter searchQuery={searchQuery} />
			<div className="Data-Buttons">
				<div className="Add-Client-Button">
					<Add_Client_Button />
				</div>
				{(role === "admin" || role === "super_admin") && (
					<div>
						<button onClick={() => navigate("/dashboard")}>Admin Dashboard</button>
					</div>
				)}
				<div className="Logout-Button">
					<LogoutButton />
				</div>
			</div>
		</div>
	);
}

export default PeoplesData;
